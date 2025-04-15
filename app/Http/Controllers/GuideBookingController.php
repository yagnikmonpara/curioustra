<?php

namespace App\Http\Controllers;

use App\Mail\GuideBookingStatusMail;
use App\Models\Guide;
use App\Models\GuideBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Config;
use Inertia\Inertia;

class GuideBookingController extends Controller
{
    public function index()
    {
        return Auth::user()->guideBookings()
            ->with('guide')
            ->orderBy('booking_date', 'desc')
            ->get();
    }

    public function list()
    {
        return Inertia::render('Admin/GuideBookings/index', [
            'bookings' => GuideBooking::with(['user', 'guide'])
                ->latest()
                ->get()
                ->map(function ($booking) {
                    return [
                        ...$booking->toArray(),
                        'start_time' => $booking->start_time->toISOString(),
                        'end_time' => $booking->end_time->toISOString()
                    ];
                })
        ]);
    }

    public function checkAvailability(Request $request)
    {
        try {
            $validated = $request->validate([
                'guide_id' => 'required|exists:guides,id',
                'start_time' => 'required|date_format:Y-m-d H:i:s',
                'duration_hours' => 'required|numeric|min:1'
            ]);

            $guide = Guide::findOrFail($validated['guide_id']);
            
            if ($guide->status !== 'active') {
                return response()->json([
                    'available' => false,
                    'message' => 'Guide is not available for bookings'
                ], 400);
            }

            $startTime = Carbon::parse($validated['start_time']);
            $endTime = $startTime->copy()->addHours($validated['duration_hours']);

            $isAvailable = $guide->getAvailabilityForDate($startTime->toDateString());

            return response()->json([
                'available' => $isAvailable,
                'message' => $isAvailable ? 'Guide is available' : 'Guide is not available'
            ]);

        } catch (\Exception $e) {
            Log::error('Availability check failed: '.$e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
    
    public function availabilityCalendar(Request $request)
    {
        $request->validate([
            'guide_id' => 'required|exists:guides,id',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer'
        ]);

        $guide = Guide::findOrFail($request->guide_id);
        $start = Carbon::create($request->year, $request->month, 1);
        $end = $start->copy()->endOfMonth();

        $calendar = [];
        $currentDay = $start->copy();

        while ($currentDay <= $end) {
            $dateStr = $currentDay->format('Y-m-d');
            $isAvailable = $guide->status === 'active' 
                && $guide->getAvailabilityForDate($dateStr)
                && !$currentDay->isPast();

            $calendar[] = [
                'date' => $dateStr,
                'available' => $isAvailable,
                'day' => $currentDay->day
            ];

            $currentDay->addDay();
        }

        return response()->json(['calendar' => $calendar]);
    }

    public function store(Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'error' => 'Authentication required',
                    'message' => 'Please login to book a guide'
                ], 401);
            }

            $validated = $request->validate([
                'guide_id' => 'required|exists:guides,id',
                'booking_date' => 'required|date_format:Y-m-d',
                'booking_time' => 'required|date_format:H:i',
                'duration_hours' => 'required|integer|min:1|max:8',
                'meeting_location' => 'required|string|max:255'
            ], [
                'booking_date.date_format' => 'Invalid date format (YYYY-MM-DD required)',
                'booking_time.date_format' => 'Invalid time format (HH:MM required)'
            ]);

            $guide = Guide::findOrFail($validated['guide_id']);
            $user = Auth::user();

            if ($guide->status !== 'active') {
                return response()->json(['error' => 'Guide is currently unavailable'], 400);
            }

            $startTime = Carbon::parse($validated['booking_date'].' '.$validated['booking_time']);
            $endTime = $startTime->copy()->addHours($validated['duration_hours']);

            $isBooked = GuideBooking::where('guide_id', $guide->id)
                ->where(function($query) use ($startTime, $endTime) {
                    $query->whereBetween('start_time', [$startTime, $endTime])
                        ->orWhereBetween('end_time', [$startTime, $endTime])
                        ->orWhere(function($q) use ($startTime, $endTime) {
                            $q->where('start_time', '<', $startTime)
                                ->where('end_time', '>', $endTime);
                        });
                })
                ->whereIn('status', ['confirmed', 'pending'])
                ->exists();

            if ($isBooked) {
                return response()->json(['error' => 'Time slot unavailable'], 400);
            }

            $totalPrice = $validated['duration_hours'] * $guide->price_per_hour;

            $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

            $order = $razorpay->order->create([
                'amount' => round($totalPrice * 100),
                'currency' => 'INR',
                'receipt' => 'guide_'.uniqid(),
                'notes' => [
                    'user_id' => $user->id,
                    'guide_id' => $guide->id,
                    'booking_date' => $validated['booking_date'],
                    'booking_time' => $validated['booking_time'],
                    'duration_hours' => $validated['duration_hours'],
                    'meeting_location' => $validated['meeting_location'],
                    'rate_per_hour' => $guide->price_per_hour,
                    'total_price' => $totalPrice,
                ],
                'payment_capture' => 1
            ]);

            return response()->json([
                'razorpay_key' => env('RAZORPAY_KEY_ID'),
                'order_id' => $order->id,
                'amount' => $order->amount,
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'contact' => $user->phone ?? ''
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Booking error: '.$e->getMessage());
            Log::error('Request data: ', $request->all());
            Log::error('User: ', Auth::user() ? Auth::user()->toArray() : []);
            return response()->json([
                'error' => 'Booking failed',
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ], 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        try {
            $request->validate([
                'payment_id' => 'required|string'
            ]);

            $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
            $payment = $razorpay->payment->fetch($request->payment_id);

            if ($payment->status !== 'captured') {
                throw new \Exception('Payment not captured');
            }

            $order = $razorpay->order->fetch($payment->order_id);
            $notes = $order->notes;

            $booking = GuideBooking::create([
                'user_id' => $notes['user_id'],
                'guide_id' => $notes['guide_id'],
                'rate_per_hour' => $notes['rate_per_hour'],
                'start_time' => Carbon::parse($notes['booking_date'].' '.$notes['booking_time']),
                'end_time' => Carbon::parse($notes['booking_date'].' '.$notes['booking_time'])
                    ->addHours($notes['duration_hours']),
                'duration_hours' => $notes['duration_hours'],
                'meeting_location' => $notes['meeting_location'],
                'total_price' => $notes['total_price'],
                'payment_id' => $payment->id,
                'status' => 'confirmed'
            ]);

            $this->sendStatusEmail($booking, 'confirmed');

            return response()->json([
                'success' => true,
                'redirect' => route('bookings'),
                'booking' => $booking
            ]);

        } catch (\Exception $e) {
            Log::error('Payment verification failed: '.$e->getMessage());
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    private function sendStatusEmail(GuideBooking $booking, string $status)
{
    $config = [
        'confirmed' => [
            'subject' => 'Guide Booking Confirmed!',
            'color' => '#10b981 0%, #34d399 100%', // Green gradient
            'icon' => '✅',
            'heading' => 'Your Guide is Confirmed!',
            'subHeading' => 'Ready for your adventure!',
            'content' => "Hi {$booking->user->name},<br><br>Your booking with guide {$booking->guide->name} is confirmed!<br>Meeting at {$booking->meeting_location} on {$booking->start_time->format('d M Y h:i A')}."
        ],
        'cancelled' => [
            'subject' => 'Guide Booking Cancelled',
            'color' => '#ef4444 0%, #f87171 100%', // Red gradient
            'icon' => '❌',
            'heading' => 'Booking Cancelled',
            'subHeading' => 'We hope to see you again soon!',
            'content' => "Hi {$booking->user->name},<br><br>Your booking with guide {$booking->guide->name} has been cancelled.<br>Refund of ₹{$booking->total_price} will be processed within 5-7 days."
        ],
        'completed' => [
            'subject' => 'Tour Completed Successfully!',
            'color' => '#3b82f6 0%, #60a5fa 100%', // Blue gradient
            'icon' => '🏁',
            'heading' => 'Tour Completed!',
            'subHeading' => 'Thank you for choosing us!',
            'content' => "Hi {$booking->user->name},<br><br>Your tour with {$booking->guide->name} has been successfully completed.<br>We hope you enjoyed your experience!"
        ],
        'in-progress' => [
            'subject' => 'Tour Has Started!',
            'color' => '#f59e0b 0%, #fbbf24 100%', // Amber gradient
            'icon' => '🚶',
            'heading' => 'Tour In Progress!',
            'subHeading' => 'Enjoy your experience!',
            'content' => "Hi {$booking->user->name},<br><br>Your tour with {$booking->guide->name} has started!<br>For any urgent assistance, contact our support team."
        ]
    ];

    if (!array_key_exists($status, $config)) {
        Log::error("Invalid booking status for email: {$status}");
        return;
    }

    Mail::to($booking->user->email)
        ->send(new GuideBookingStatusMail(
            $booking,
            $config[$status]['subject'],
            $config[$status]['color'],
            $config[$status]['icon'],
            $config[$status]['heading'],
            $config[$status]['subHeading'],
            $config[$status]['content']
        ));
}

    public function downloadReceipt(GuideBooking $booking)
    {
        try {
            $booking->load(['guide', 'user']);

            if (is_string($booking->start_time)) {
                $booking->start_time = Carbon::parse($booking->start_time);
            }
            if (is_string($booking->end_time)) {
                $booking->end_time = Carbon::parse($booking->end_time);
            }

            $data = [
                'booking' => $booking,
                'company' => [
                    'name' => 'CuriousTra',
                    'address' => 'Surat, Gujarat, India - 395006',
                    'email' => 'info.curioustra@gmail.com',
                    'phone' => '+91 800####4591',
                    'logo' => public_path('images/logo.png')
                ]
            ];

            $pdf = Pdf::loadView('pdfs.guideReceipt', $data)
                ->setPaper('a4', 'portrait');

            return $pdf->download("GuideReceipt-{$booking->id}.pdf");

        } catch (\Exception $e) {
            \Log::error("Receipt generation failed: {$e->getMessage()}");
            abort(500, 'Failed to generate receipt');
        }
    }

    public function confirmBooking(GuideBooking $booking)
    {
        if (!$booking->canBeConfirmed()) {
            return back()->with('error', 'Booking cannot be confirmed in current state');
        }

        $booking->update(['status' => 'confirmed']);
        $this->sendStatusEmail($booking, 'confirmed');

        return back()->with('success', 'Booking confirmed');
    }

    public function cancelBooking(GuideBooking $booking)
    {
        try {
            if ($booking->isCancelled()) {
                return back()->with('error', 'Already cancelled');
            }

            if ($booking->payment_id) {
                $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
                $refund = $razorpay->payment
                    ->fetch($booking->payment_id)
                    ->refund([
                        'amount' => $booking->total_price * 100,
                        'speed' => 'normal'
                    ]);

                $booking->update([
                    'refund_id' => $refund->id,
                    'payment_status' => 'refunded'
                ]);
            }

            $booking->update(['status' => 'cancelled']);
            $this->sendStatusEmail($booking, 'cancelled');

            return back()->with('success', 'Booking cancelled');

        } catch (\Exception $e) {
            Log::error('Cancellation failed: '.$e->getMessage());
            return back()->with('error', 'Cancellation failed: '.$e->getMessage());
        }
    }

    public function completeBooking(GuideBooking $booking)
    {
        if (!$booking->canBeCompleted()) {
            return back()->with('error', 'Invalid status transition');
        }

        $booking->update(['status' => 'completed']);
        $this->sendStatusEmail($booking, 'completed');

        return back()->with('success', 'Tour marked completed');
    }

    public function inProgressBooking(GuideBooking $booking)
    {
        if (!$booking->canStart()) {
            return back()->with('error', 'Invalid status transition');
        }

        $booking->update(['status' => 'in-progress']);
        $this->sendStatusEmail($booking, 'in-progress');

        return back()->with('success', 'Tour started');
    }
}