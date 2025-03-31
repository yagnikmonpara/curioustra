<?php

namespace App\Http\Controllers;

use App\Mail\HotelBookingStatusMail;
use App\Models\Hotel;
use App\Models\HotelBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Razorpay\Api\Api;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class HotelBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $hotelBookings = HotelBooking::with('user', 'hotel')->where('user_id', $user->id)->get();
        return $hotelBookings;
    }

    public function list()
    {
        $bookings = HotelBooking::with('user', 'hotel')->get();
        return Inertia::render('Admin/HotelBookings/index', [
            'bookings' => $bookings
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('User/Hotels/create');
    }

    /**
    * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
        $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'number_of_guests' => 'required|integer|min:1',
            'additional_info' => 'nullable|string',
        ]);

        try {
            $hotel = Hotel::findOrFail($request->hotel_id);
            $totalNights = Carbon::parse($request->check_in_date)
                ->diffInDays($request->check_out_date);
            $totalPrice = $hotel->price_per_night * $totalNights * $request->number_of_guests;

            $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

            $order = $razorpay->order->create([
                'amount' => $totalPrice * 100,
                'currency' => 'INR',
                'receipt' => 'hotel_'.uniqid(),
                'notes' => [
                    'user_id' => Auth::id(),
                    'hotel_id' => $hotel->id,
                    'check_in_date' => $request->check_in_date,
                    'check_out_date' => $request->check_out_date,
                    'number_of_guests' => $request->number_of_guests,
                    'total_price' => $totalPrice,
                    'additional_info' => $request->additional_info,
                ],
                'payment_capture' => 1
            ]);

            return response()->json([
                'razorpay_key' => env('RAZORPAY_KEY_ID'),
                'order_id' => $order->id,
                'amount' => $order->amount,
                'user' => [
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                    'contact' => Auth::user()->phone ?? ''
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(HotelBooking $hotelBooking)
    {
        $hotelBooking->load('user', 'hotel');
        return Inertia::render('Admin/HotelBookings/show', [
            'booking' => $hotelBooking,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(HotelBooking $hotelBooking)
    {
        $hotelBooking->load('user', 'hotel');
        return Inertia::render('Admin/HotelBookings/edit', [
            'booking' => $hotelBooking,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, HotelBooking $hotelBooking)
    {
        $request->validate([
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date',
            'number_of_guests' => 'required|integer',
            'total_price' => 'required|numeric',
            'status' => 'required|string',
            'additional_info' => 'nullable|json',
        ]);

        $hotelBooking->update($request->all());

        return redirect()->back()->with('success', 'Hotel booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HotelBooking $hotelBooking)
    {
        $hotelBooking->delete();
        return redirect()->back()->with('success', 'Hotel booking deleted successfully.');
    }

    public function verifyPayment(Request $request)
    {
        $request->validate(['payment_id' => 'required|string']);

        try {
            $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
            $payment = $razorpay->payment->fetch($request->payment_id);
            $order = $razorpay->order->fetch($payment->order_id);

            $booking = HotelBooking::create([
                'user_id' => $order->notes['user_id'],
                'hotel_id' => $order->notes['hotel_id'],
                'booking_date' => now(),
                'check_in_date' => $order->notes['check_in_date'],
                'check_out_date' => $order->notes['check_out_date'],
                'number_of_guests' => $order->notes['number_of_guests'],
                'total_price' => $order->notes['total_price'],
                'status' => 'pending',
                'payment_status' => 'paid',
                'payment_id' => $payment->id,
                'additional_info' => $order->notes['additional_info']
            ]);

            $this->sendStatusEmail($booking, 'confirmed');

            return response()->json([
                'success' => true,
                'redirect' => route('bookings')
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    private function sendStatusEmail(HotelBooking $booking, string $status)
    {
        $config = [
            'confirmed' => [
                'subject' => 'Hotel Booking Confirmed!',
                'color' => '#10b981',
                'icon' => '✅',
                'heading' => 'Your Booking is Confirmed!',
                'subHeading' => 'Ready for your stay! 🏨',
                'content' => "Your booking at {$booking->hotel->name} has been confirmed.",
                'logoUrl' => asset('/images/logo.png')
            ],
            'cancelled' => [
                'subject' => 'Hotel Booking Cancelled',
                'color' => '#ef4444',
                'icon' => '❌',
                'heading' => 'Booking Cancelled',
                'subHeading' => 'We\'re sorry to see you go 😢',
                'content' => "Your booking at {$booking->hotel->name} has been cancelled.",
                'logoUrl' => asset('/images/logo.png')
            ]
        ];

        Mail::to($booking->user->email)->send(
            new HotelBookingStatusMail(
                $booking,
                $config[$status]
            )
        );
    }

    public function downloadReceipt(HotelBooking $booking)
    {
        $booking->load(['hotel', 'user']);
        
        $data = [
            'booking' => $booking,
            'hotel' => $booking->hotel,
            'company' => [
                'name' => 'Your Company',
                'address' => '123 Street, City, Country',
                'logo' => public_path('images/logo.png')
            ]
        ];

        $pdf = Pdf::loadView('pdfs.hotelReceipt', $data);
        return $pdf->download("hotel-receipt-{$booking->id}.pdf");
    }

    public function confirmBooking(HotelBooking $booking)
    {
        if (!Auth::user()->isAdmin()) { // Replace isAdmin() with your actual admin check
            abort(403, 'Unauthorized action.');
        }

        if ($booking->status !== 'pending') {
            return back()->with('error', 'Booking is not pending.');
        }

        $booking->status = 'confirmed';
        $booking->save();

        $this->sendStatusEmail($booking, 'confirmed');

        return back()->with('success', 'Booking confirmed.');
    }

    public function cancelBooking(HotelBooking $booking)
    {
        if (!Auth::user()->isAdmin() && Auth::id() !== $booking->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $booking->status = 'cancelled';
        $booking->save();

        $this->sendStatusEmail($booking, 'cancelled');

        return back()->with('success', 'Booking cancelled.');
    }

}