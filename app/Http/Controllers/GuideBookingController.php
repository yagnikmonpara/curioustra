<?php

namespace App\Http\Controllers;

use App\Mail\GuideBookingStatusMail;
use App\Models\Guide;
use App\Models\GuideBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

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
        Gate::authorize('admin-access');
        
        return Inertia::render('Admin/GuideBookings/index', [
            'bookings' => GuideBooking::with(['user', 'guide'])
                ->latest()
                ->get()
        ]);
    }

    public function checkAvailability(Request $request)
    {
        try {
            $validated = $request->validate([
                'guide_id' => 'required|exists:guides,id',
                'booking_date' => 'required|date_format:Y-m-d',
                'booking_time' => 'required|date_format:H:i',
                'duration_hours' => 'required|numeric|min:1'
            ]);

            $guide = Guide::findOrFail($validated['guide_id']);
            
            if ($guide->status !== 'available') {
                return response()->json([
                    'available' => false,
                    'message' => 'Guide is currently unavailable',
                ], 400);
            }

            $startTime = Carbon::parse($validated['booking_date'].' '.$validated['booking_time']);
            $endTime = $startTime->copy()->addHours($validated['duration_hours']);

            $isAvailable = !$guide->bookings()
                ->where(function($query) use ($startTime, $endTime) {
                    $query->whereBetween('booking_date', [$startTime, $endTime])
                          ->orWhereBetween('end_time', [$startTime, $endTime])
                          ->orWhere(function($q) use ($startTime, $endTime) {
                              $q->where('booking_date', '<', $startTime)
                                ->where('end_time', '>', $endTime);
                          });
                })
                ->whereIn('status', ['confirmed', 'in-progress', 'pending'])
                ->exists();

            return response()->json([
                'available' => $isAvailable,
                'message' => $isAvailable ? 'Guide available' : 'Already booked',
            ]);

        } catch (\Exception $e) {
            Log::error('Availability check failed: '.$e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }

    public function availabilityCalendar(Request $request)
    {
        try {
            $validated = $request->validate([
                'guide_id' => 'required|exists:guides,id',
                'month' => 'required|integer|between:1,12',
                'year' => 'required|integer|min:2020'
            ]);

            $guide = Guide::findOrFail($validated['guide_id']);
            $month = $validated['month'];
            $year = $validated['year'];

            $start = Carbon::create($year, $month, 1);
            $end = $start->copy()->endOfMonth();

            $bookings = $guide->bookings()
                ->whereBetween('booking_date', [$start, $end])
                ->whereIn('status', ['confirmed', 'in-progress'])
                ->get(['booking_date', 'end_time']);

            $calendar = [];
            foreach ($start->daysUntil($end) as $day) {
                $isAvailable = !$bookings->contains(function ($booking) use ($day) {
                    return $day->between(
                        $booking->booking_date->startOfDay(),
                        $booking->end_time->endOfDay()
                    );
                });

                $calendar[] = [
                    'date' => $day->format('Y-m-d'),
                    'available' => $isAvailable && $guide->status === 'available'
                ];
            }

            return response()->json([
                'calendar' => $calendar,
                'guide' => $guide->only('id', 'name', 'status')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch availability calendar',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'guide_id' => 'required|exists:guides,id',
                'booking_date' => 'required|date_format:Y-m-d',
                'booking_time' => 'required|date_format:H:i',
                'duration_hours' => 'required|numeric|min:1',
                'meeting_location' => 'required|string|max:255',
                'additional_info' => 'nullable|string',
            ]);
    
            $guide = Guide::findOrFail($validated['guide_id']);
            $user = Auth::user();
            
            if ($guide->status !== 'available') {
                throw new \Exception('Guide unavailable');
            }

            $startTime = Carbon::parse($validated['booking_date'].' '.$validated['booking_time']);
            $endTime = $startTime->copy()->addHours($validated['duration_hours']);

            $isBooked = $guide->bookings()
                ->where(function($query) use ($startTime, $endTime) {
                    $query->whereBetween('booking_date', [$startTime, $endTime])
                          ->orWhereBetween('end_time', [$startTime, $endTime])
                          ->orWhere(function($q) use ($startTime, $endTime) {
                              $q->where('booking_date', '<', $startTime)
                                ->where('end_time', '>', $endTime);
                          });
                })
                ->whereIn('status', ['confirmed', 'in-progress'])
                ->exists();

            if ($isBooked) {
                throw new \Exception('Time slot unavailable');
            }

            $totalPrice = $validated['duration_hours'] * $guide->price_per_hour;

            $razorpay = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));

            $order = $razorpay->order->create([
                'amount' => round($totalPrice * 100),
                'currency' => 'INR',
                'receipt' => 'guide_'.uniqid(),
                'notes' => [
                    'user_id' => $user->id,
                    'guide_id' => $guide->id,
                    'booking_details' => json_encode($validated),
                    'total_price' => $totalPrice,
                ],
                'payment_capture' => 1
            ]);

            DB::commit();

            return response()->json([
                'order_id' => $order->id,
                'amount' => $order->amount,
                'user' => $user->only('name', 'email', 'phone')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Booking error: '.$e->getMessage());
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function verifyPayment(Request $request)
    {
        DB::beginTransaction();
        try {
            $request->validate([
                'payment_id' => 'required|string'
            ]);

            $razorpay = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
            $payment = $razorpay->payment->fetch($request->payment_id);

            if ($payment->status !== 'captured') {
                throw new \Exception('Payment not captured');
            }

            $order = $razorpay->order->fetch($payment->order_id);
            $notes = $order->notes;
            $bookingDetails = json_decode($notes['booking_details'], true);

            $booking = GuideBooking::create([
                'user_id' => $notes['user_id'],
                'guide_id' => $notes['guide_id'],
                'rate_per_hour' => Guide::find($notes['guide_id'])->price_per_hour,
                'booking_date' => Carbon::parse($bookingDetails['booking_date'].' '.$bookingDetails['booking_time']),
                'end_time' => Carbon::parse($bookingDetails['booking_date'].' '.$bookingDetails['booking_time'])
                    ->addHours($bookingDetails['duration_hours']),
                'duration_hours' => $bookingDetails['duration_hours'],
                'meeting_location' => $bookingDetails['meeting_location'],
                'total_price' => $notes['total_price'],
                'payment_id' => $payment->id,
                'status' => 'confirmed'
            ]);

            $this->sendStatusEmail($booking, 'confirmed');
            DB::commit();

            return response()->json([
                'success' => true,
                'redirect' => route('bookings'),
                'booking' => $booking
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment verification failed: '.$e->getMessage());
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    private function sendStatusEmail(GuideBooking $booking, string $status)
    {
        $config = [
            'confirmed' => [
                'subject' => 'Booking Confirmed',
                'template' => 'emails.guide-booking-confirmed',
            ],
            'cancelled' => [
                'subject' => 'Booking Cancelled',
                'template' => 'emails.guide-booking-cancelled',
            ],
            'completed' => [
                'subject' => 'Tour Completed',
                'template' => 'emails.guide-booking-completed',
            ],
            'in-progress' => [
                'subject' => 'Tour Started',
                'template' => 'emails.guide-booking-in-progress',
            ]
        ];

        if (!array_key_exists($status, $config)) {
            Log::error("Invalid booking status for email: {$status}");
            return;
        }

        Mail::to($booking->user->email)->queue(
            new GuideBookingStatusMail(
                $booking,
                $config[$status]['subject'],
                $config[$status]['template']
            )
        );
    }

    public function downloadReceipt(GuideBooking $booking)
    {
        $booking->load(['guide', 'user']);

        $data = [
            'booking' => $booking,
            'company' => Config::get('company.info')
        ];

        $pdf = Pdf::loadView('pdfs.guideReceipt', $data)
            ->setPaper('a4', 'portrait');

        return $pdf->download("GuideReceipt-{$booking->id}.pdf");
    }

    public function confirmBooking(GuideBooking $booking)
    {
        Gate::authorize('admin-access');
        
        if (!$booking->canBeConfirmed()) {
            return back()->with('error', 'Booking cannot be confirmed in current state');
        }

        $booking->update(['status' => 'confirmed']);
        $this->sendStatusEmail($booking, 'confirmed');

        return back()->with('success', 'Booking confirmed');
    }

    public function cancelBooking(GuideBooking $booking)
    {
        DB::beginTransaction();
        try {
            Gate::authorize('cancel', $booking);

            if ($booking->isCancelled()) {
                return back()->with('error', 'Already cancelled');
            }

            if ($booking->payment_id) {
                $razorpay = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
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
            DB::commit();

            return back()->with('success', 'Booking cancelled');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Cancellation failed: '.$e->getMessage());
            return back()->with('error', 'Cancellation failed: '.$e->getMessage());
        }
    }

    public function completeBooking(GuideBooking $booking)
    {
        Gate::authorize('admin-access');
        
        if (!$booking->canBeCompleted()) {
            return back()->with('error', 'Invalid status transition');
        }

        $booking->update(['status' => 'completed']);
        $this->sendStatusEmail($booking, 'completed');

        return back()->with('success', 'Tour marked completed');
    }

    public function inProgressBooking(GuideBooking $booking)
    {
        Gate::authorize('admin-access');
        
        if (!$booking->canStart()) {
            return back()->with('error', 'Invalid status transition');
        }

        $booking->update(['status' => 'in-progress']);
        $this->sendStatusEmail($booking, 'in-progress');

        return back()->with('success', 'Tour started');
    }
}