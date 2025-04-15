<?php

namespace App\Http\Controllers;

use App\Mail\CabBookingStatusMail;
use Illuminate\Support\Facades\Mail;
use Razorpay\Api\Api;
use App\Models\Cab;
use App\Models\CabBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class CabBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $cabBookings = CabBooking::with('user', 'cab')->where('user_id', $user->id)->get();
        return $cabBookings;
    }

    public function list()
    {
        $bookings = CabBooking::with('user', 'cab')->get();
        return Inertia::render('Admin/CabBookings/index', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // return Inertia::render('User/Cabs/create');
    }

    public function checkAvailability(Request $request)
{
    try {
        $validated = $request->validate([
            'cab_id' => 'required|exists:cabs,id',
            'pickup_time' => 'required|date_format:Y-m-d H:i:s',
            'duration_hours' => 'required|numeric|min:1'
        ]);

        $cab = Cab::findOrFail($validated['cab_id']);
        
        // If cab status is unavailable, it's not available for any time
        if ($cab->status === 'unavailable') {
            return response()->json([
                'available' => false,
                'message' => 'Cab is currently unavailable for booking',
                'status' => 'unavailable'
            ]);
        }

        $pickupTime = Carbon::parse($validated['pickup_time']);
        $dropoffTime = $pickupTime->copy()->addHours($validated['duration_hours']);

        // Check for overlapping bookings (only consider active bookings)
        $isBooked = $cab->bookings()
            ->where(function($query) use ($pickupTime, $dropoffTime) {
                $query->whereBetween('pickup_time', [$pickupTime, $dropoffTime])
                      ->orWhereBetween('dropoff_time', [$pickupTime, $dropoffTime])
                      ->orWhere(function($q) use ($pickupTime, $dropoffTime) {
                          $q->where('pickup_time', '<', $pickupTime)
                            ->where('dropoff_time', '>', $dropoffTime);
                      });
            })
            ->whereIn('status', ['confirmed', 'in-progress', 'pending'])
            ->exists();

        return response()->json([
            'available' => !$isBooked,
            'message' => $isBooked ? 'Cab already booked for this time' : 'Cab is available',
            'status' => $cab->status
        ]);

    } catch (\Exception $e) {
        \Log::error('Availability check failed: ' . $e->getMessage());
        return response()->json([
            'error' => 'Server error checking availability',
            'details' => env('APP_DEBUG') ? $e->getMessage() : null
        ], 500);
    }
}

public function getAvailabilityCalendar(Request $request)
{
    $request->validate([
        'cab_id' => 'required|exists:cabs,id',
        'month' => 'required|integer|between:1,12',
        'year' => 'required|integer|min:' . date('Y')
    ]);

    $cab = Cab::findOrFail($request->cab_id);

    // If cab status is unavailable, all dates are unavailable
    if ($cab->status === 'unavailable') {
        $startDate = Carbon::create($request->year, $request->month, 1);
        $endDate = $startDate->copy()->endOfMonth();
        
        $calendar = [];
        $currentDay = $startDate->copy();
        
        while ($currentDay <= $endDate) {
            $calendar[] = [
                'date' => $currentDay->format('Y-m-d'),
                'available' => false, // All dates unavailable
                'day' => $currentDay->day
            ];
            
            $currentDay->addDay();
        }
    } else {
        // For available/booked/in-progress cabs, check actual availability per date
        $startDate = Carbon::create($request->year, $request->month, 1);
        $endDate = $startDate->copy()->endOfMonth();

        // Get all bookings for this cab in the requested month
        $bookings = $cab->bookings()
            ->whereIn('status', ['confirmed', 'in-progress'])
            ->where(function($query) use ($startDate, $endDate) {
                $query->whereBetween('pickup_time', [$startDate, $endDate])
                        ->orWhereBetween('dropoff_time', [$startDate, $endDate])
                        ->orWhere(function($q) use ($startDate, $endDate) {
                            $q->where('pickup_time', '<', $startDate)
                            ->where('dropoff_time', '>', $endDate);
                        });
            })
            ->get(['pickup_time', 'dropoff_time']);

        $calendar = [];
        $currentDay = $startDate->copy();
        
        while ($currentDay <= $endDate) {
            $isBooked = false;

            foreach ($bookings as $booking) {
                $bookingStart = Carbon::parse($booking->pickup_time);
                $bookingEnd = Carbon::parse($booking->dropoff_time);
                
                // Create full day range for current calendar day
                $dayStart = $currentDay->copy()->startOfDay();
                $dayEnd = $currentDay->copy()->endOfDay();
                
                // Check if booking overlaps with calendar day
                if ($bookingStart->lte($dayEnd) && $bookingEnd->gte($dayStart)) {
                    $isBooked = true;
                    break;
                }
            }

            $calendar[] = [
                'date' => $currentDay->format('Y-m-d'),
                'available' => !$isBooked,
                'day' => $currentDay->day
            ];

            $currentDay->addDay();
        }
    }

    return response()->json([
        'calendar' => $calendar
    ]);
}

    /**
     * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'cab_id' => 'required|exists:cabs,id',
                'pickup_location' => 'required|string|max:255',
                'dropoff_location' => 'required|string|max:255',
                'pickup_time' => 'required|date_format:Y-m-d H:i:s',
                'dropoff_time' => 'required|date_format:Y-m-d H:i:s',
                'distance_km' => 'required|numeric|min:1',
                'additional_info' => 'nullable|array',
            ]);
    
            $pickupTime = Carbon::parse($validated['pickup_time']);
            $dropoffTime = Carbon::parse($validated['dropoff_time']);
            $user = auth()->user();
            $cab = Cab::findOrFail($validated['cab_id']);
    
            // Improved availability check
            if ($cab->status === 'unavailable') {
                return response()->json(['error' => 'Cab is currently unavailable for booking'], 400);
            }
    
            // Check for overlapping bookings
            $isBooked = $cab->bookings()
                ->where(function($query) use ($pickupTime, $dropoffTime) {
                    $query->whereBetween('pickup_time', [$pickupTime, $dropoffTime])
                          ->orWhereBetween('dropoff_time', [$pickupTime, $dropoffTime])
                          ->orWhere(function($q) use ($pickupTime, $dropoffTime) {
                              $q->where('pickup_time', '<', $pickupTime)
                                ->where('dropoff_time', '>', $dropoffTime);
                          });
                })
                ->whereIn('status', ['confirmed', 'in-progress', 'pending', 'booked'])
                ->exists();
    
            if ($isBooked) {
                return response()->json(['error' => 'Cab already booked for this time'], 400);
            }
            // Calculate pricing
            $totalPrice = $validated['distance_km'] * $cab->price_per_km;

            // Create Razorpay order
            $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

            $order = $razorpay->order->create([
                'amount' => $totalPrice * 100,
                'currency' => 'INR',
                'receipt' => 'cab_'.uniqid(),
                'notes' => [
                    'user_id' => $user->id,
                    'cab_id' => $cab->id,
                    'rate_per_km' => $cab->price_per_km,
                    'pickup_location' => $validated['pickup_location'],
                    'dropoff_location' => $validated['dropoff_location'],
                    'pickup_time' => $validated['pickup_time'],
                    'dropoff_time' => $dropoffTime,
                    'duration_hours' => $request->duration_hours ?? 1,
                    'distance_km' => $validated['distance_km'],
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
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(CabBooking $cabBooking)
    {
        // 
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CabBooking $cabBooking)
    {
        // 
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CabBooking $cabBooking)
    {
        // Authorization check
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CabBooking $cabBooking)
    {
        if (!Auth::user()->isAdmin() && Auth::id() !== $cabBooking->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $cabBooking->delete();
        return redirect()->route('admin.cab-bookings')->with('success', 'Cab booking deleted successfully.');
    }

    public function verifyPayment(Request $request)
{
    $request->validate([
        'payment_id' => 'required|string'
    ]);

    try {
        $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
        $payment = $razorpay->payment->fetch($request->payment_id);

        if ($payment->status !== 'captured') {
            return response()->json(['error' => 'Payment not captured'], 400);
        }

        $order = $razorpay->order->fetch($payment->order_id);

        $cab = Cab::find($order->notes['cab_id']);
        if (!$cab) {
            throw new \Exception('Cab not found');
        }

        $pickupTime = Carbon::parse($order->notes['pickup_time'])->format('Y-m-d H:i:s');
        $dropoffTime = Carbon::parse($order->notes['dropoff_time'])->format('Y-m-d H:i:s');

        // Rest of your verification logic...
        $booking = CabBooking::create([
            'user_id' => $order->notes['user_id'],
            'cab_id' => $cab->id,
            'rate_per_km' => $cab->price_per_km,
            'pickup_location' => $order->notes['pickup_location'],
            'dropoff_location' => $order->notes['dropoff_location'],
            'pickup_time' => $pickupTime,
            'dropoff_time' => $dropoffTime,
            'duration_hours' => $order->notes['duration_hours'],
            'distance_km' => $order->notes['distance_km'],
            'total_price' => $order->notes['total_price'],
            'status' => 'confirmed'
        ]);
        $this->sendStatusEmail($booking, 'confirmed');
        return response()->json([
            'success' => true,
            'redirect' => route('bookings'),
            'booking' => $booking
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 400);
    }
}

private function sendStatusEmail(CabBooking $booking, string $status)
{
    $config = [
        'confirmed' => [
            'subject' => 'Cab Booking Confirmed!',
            'color' => '#0ea5e9 0%, #22d3ee 100%',
            'icon' => '🚖',
            'heading' => 'Your Cab is Booked!',
            'subHeading' => 'Ready for your journey!',
            'content' => "Hi {$booking->user->name},<br><br>Your {$booking->cab->make} {$booking->cab->model} booking is confirmed!<br>Driver will arrive at {$booking->pickup_time->format('h:i A')} on {$booking->pickup_time->format('d M Y')}."
        ],
        'cancelled' => [
            'subject' => 'Cab Booking Cancelled',
            'color' => '#ef4444 0%, #f87171 100%',
            'icon' => '❌',
            'heading' => 'Booking Cancelled',
            'subHeading' => 'We hope to see you again soon!',
            'content' => "Hi {$booking->user->name},<br><br>Your cab booking has been cancelled.<br>Refund of ₹{$booking->total_price} will be processed within 5-7 days."
        ],
        'completed' => [
            'subject' => 'Ride Completed!',
            'color' => '#10b981 0%, #34d399 100%',
            'icon' => '✅',
            'heading' => 'Ride Completed Successfully!',
            'subHeading' => 'Hope you enjoyed your ride!',
            'content' => "Hi {$booking->user->name},<br><br>Your ride in {$booking->cab->make} {$booking->cab->model} has been completed.<br>Thank you for choosing us!"
        ],
        // Add this new configuration
        'in-progress' => [
            'subject' => 'Ride Started!',
            'color' => '#f59e0b 0%, #fbbf24 100%',
            'icon' => '🚕',
            'heading' => 'Your Ride Has Begun!',
            'subHeading' => 'Enjoy your journey!',
            'content' => "Hi {$booking->user->name},<br><br>Your ride in {$booking->cab->make} {$booking->cab->model} has started!<br>Driver is on the way to your pickup location."
        ]
    ];

    Mail::to($booking->user->email)
        ->send(new CabBookingStatusMail(
            $booking,
            $config[$status]['subject'],
            $config[$status]['color'],
            $config[$status]['icon'],
            $config[$status]['heading'],
            $config[$status]['subHeading'],
            $config[$status]['content']
        ));
}

    public function downloadReceipt(CabBooking $booking)
{
    try {
        // Load relationships
        $booking->load(['cab', 'user']);
        if (is_string($booking->pickup_time)) {
            $booking->pickup_time = Carbon::parse($booking->pickup_time);
        }
        if (is_string($booking->dropoff_time)) {
            $booking->dropoff_time = Carbon::parse($booking->dropoff_time);
        }
        // Verify the logo file exists
        $logoPath = public_path('/images/logo.png');

        $data = [
            'booking' => $booking,
            'company' => [
                'name' => 'CuriousTra',
                'address' => 'Surat, Gujarat, India - 395006',
                'email' => 'info.curioustra@gmail.com',
                'phone' => '+91 800####4591',
                'logo' => file_exists($logoPath) ? $logoPath : null
            ]
        ];

        // Generate PDF
        $pdf = Pdf::loadView('pdfs.cabReceipt', $data)
            ->setPaper('a4', 'portrait')
            ->setOption('isRemoteEnabled', true);

        return $pdf->download("CabReceipt-{$booking->id}.pdf");

    } catch (\Exception $e) {
        \Log::error("Receipt generation failed: {$e->getMessage()}");
        abort(500, 'Failed to generate receipt');
    }
}

    public function refund(Request $request)
{
    try {
        $validated = $request->validate([
            'payment_id' => 'required|string',
            'amount' => 'required|numeric'
        ]);

        $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
        
        $refund = $razorpay->payment
            ->fetch($validated['payment_id'])
            ->refund([
                'amount' => $validated['amount'],
                'speed' => 'normal'
            ]);

        return response()->json([
            'success' => true,
            'refund_id' => $refund->id
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Refund failed: ' . $e->getMessage()
        ], 500);
    }
}

    public function confirmBooking(CabBooking $booking)
    {

        if ($booking->status !== 'pending') {
            return back()->with('error', 'Booking is not pending.');
        }

        $booking->status = 'confirmed';
        $booking->save();
        $this->sendStatusEmail($booking, 'confirmed');

        return back()->with('success', 'Booking confirmed.');
    }

    public function cancelBooking(CabBooking $booking)
{
    try {

        if ($booking->status === 'cancelled') {
            return response()->json(['error' => 'Booking already cancelled'], 400);
        }

        $refundData = null;

        // Process refund only if payment exists and status allows cancellation
        if ($booking->payment_id && in_array($booking->status, ['confirmed', 'pending'])) {
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

            $refundData = [
                'id' => $refund->id,
                'amount' => $refund->amount / 100,
                'status' => $refund->status,
                'created_at' => Carbon::createFromTimestamp($refund->created_at)->toDateTimeString()
            ];
        }

        $booking->update(['status' => 'cancelled']);
        Cab::where('id', $booking->cab_id)->update(['status' => 'available']);

        $this->sendStatusEmail($booking, 'cancelled');

        return back()->with('success', 'Booking cancelled successfully');

    } catch (\Exception $e) {
        \Log::error("Cancel booking failed: ".$e->getMessage());
        return response()->json([
            'error' => 'Cancellation failed: '.$e->getMessage()
        ], 500);
    }
}

    public function completeBooking(CabBooking $booking)
    {
    
        $booking->status = 'completed';
        $booking->save();
        $this->sendStatusEmail($booking, 'completed');
    
        return back()->with('success', 'Booking completed.');
    }

    public function inProgressBooking(CabBooking $booking)
    {
    
        $booking->status = 'in-progress';
        $booking->save();
        $this->sendStatusEmail($booking, 'in-progress');
    
        return back()->with('success', 'Booking in progress.');
    }
}