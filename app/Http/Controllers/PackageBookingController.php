<?php

namespace App\Http\Controllers;

use App\Notifications\{
    BookingConfirmed, 
    BookingCanceled,
    BookingInProgress,
    BookingCompleted
};
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Notification;
use App\Models\Package;
use App\Models\PackageBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class PackageBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $packageBookings = PackageBooking::with('user', 'package')->where('user_id', $user->id)->get(); // Eager load relationships
        return  $packageBookings;
    }

    public function list()
    {
        $bookings = PackageBooking::with('user', 'package')->get(); // Eager load relationships
        return Inertia::render('Admin/PackageBookings/index', [
            'bookings' => PackageBooking::with(['user', 'package'])->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * (Not typically needed for bookings, as they are created during the booking process)
     */
    public function create()
    {
        // return Inertia::render('User/Packages/create');
    }

    /**
    * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
        try {
            // Check authentication first
            if (!auth()->check()) {
                return response()->json([
                    'message' => 'Booking creation failed',
                    'error' => 'Authentication required'
                ], 401);
            }

            $validated = $request->validate([
                'package_id' => 'required|exists:packages,id',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'number_of_people' => 'required|integer|min:1',
                'additional_notes' => 'nullable|string',
            ]);

            // Find the package first
            $package = Package::findOrFail($request->package_id);
            
            // Calculate total price
            $totalPrice = $package->price * $request->number_of_people;

            // Create booking
            $booking = PackageBooking::create([
                'user_id' => auth()->id(),
                'package_id' => $request->package_id,
                'booking_date' => now(),
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'number_of_people' => $request->number_of_people,
                'total_price' => $totalPrice,
                'additional_notes' => $request->additional_notes,
                'status' => 'pending',
                'payment_status' => 'pending'
            ]);

            // Initialize Razorpay
            $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

            // Create Razorpay order
            $order = $razorpay->order->create([
                'amount' => $totalPrice * 100,
                'currency' => 'INR',
                'receipt' => 'booking_'.$booking->id,
                'payment_capture' => 1
            ]);

            // Update booking with payment ID
            $booking->update(['payment_id' => $order->id]);

            return response()->json([
                'booking' => $booking,
                'razorpay_key' => env('RAZORPAY_KEY_ID'),
                'order_id' => $order->id
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed', 
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Booking creation failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Booking creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PackageBooking $packageBooking)
    {
        // $packageBooking->load('user', 'package'); // Eager load relationships
        // return Inertia::render('Admin/Bookings/show', [
        //     'booking' => $packageBooking,
        // ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PackageBooking $packageBooking)
    {
        // $packageBooking->load('user', 'package');
        // return Inertia::render('Admin/Bookings/edit', [
        //     'booking' => $packageBooking,
        // ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PackageBooking $packageBooking)
    {
        $request->validate([
            'booking_date' => 'required|date',
            'number_of_people' => 'required|integer',
            'total_price' => 'required|numeric',
            'status' => 'required|string',
            'additional_info' => 'nullable|json',
        ]);

        $packageBooking->update($request->all());

        return redirect()->back()->with('success', 'Booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PackageBooking $packageBooking)
    {
        $packageBooking->delete();
        return redirect()->route('bookings')->with('success', 'Booking deleted successfully.');
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:package_bookings,id',
            'payment_id' => 'required|string'
        ]);
    
        $booking = PackageBooking::findOrFail($request->booking_id);
        
        try {
            $razorpay = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));
            $payment = $razorpay->payment->fetch($request->payment_id);
    
            if ($payment->status === 'captured') {
                $booking->update([
                    'payment_status' => 'paid',
                    'status' => 'confirmed',
                    'payment_id' => $request->payment_id
                ]);
                
                $booking->user->notify(new BookingConfirmed($booking));
                
                return response()->json([
                    'success' => true,
                    'message' => 'Payment verified and booking confirmed!'
                ]);
            }
    
            return response()->json(['error' => 'Payment not captured'], 400);
    
        } catch (\Exception $e) {
            $booking->update(['payment_status' => 'failed']);
            return response()->json(['error' => 'Payment verification failed'], 400);
        }
    }
    
    // Additional methods for booking management (e.g., confirm booking)

    public function confirmBooking(PackageBooking $booking)
    {
        if (!Auth::user()->isAdmin()) { // Replace isAdmin() with your actual admin check
            abort(403, 'Unauthorized action.');
        }

        if ($booking->status !== 'pending') {
            return back()->with('error', 'Booking is not pending.');
        }

        $booking->status = 'confirmed';
        $booking->user->notify(new BookingConfirmed($booking));
        $booking->save();

        return back()->with('success', 'Booking confirmed.');
    }

    public function cancelBooking(PackageBooking $booking)
    {
        // Check if the current user is authorized to cancel the booking (either admin or the user who made the booking)
        if (!Auth::user()->isAdmin() && Auth::id() !== $booking->user_id) {
            abort(403, 'Unauthorized action.');
        }

        try {
            // Process refund if payment was successful
            if ($booking->payment_status === 'paid') {
                $razorpay = new Api(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));
                
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
            
            // Send notification
            $booking->user->notify(new BookingCanceled($booking));
            
            return back()->with('success', 'Booking cancelled and refund processed.');
    
        } catch (\Exception $e) {
            return back()->with('error', 'Refund failed: ' . $e->getMessage());
        }
    }

    public function inProgressBooking(PackageBooking $booking)
    {
        // if (!Auth::user()->isAdmin()) { // Replace isAdmin() with your actual admin check
        //     abort(403, 'Unauthorized action.');
        // }

        if ($booking->status !== 'confirmed') {
            return back()->with('error', 'Booking is not confirmed.');
        }

        $booking->status = 'in-progress';
        $booking->user->notify(new BookingInProgress($booking));
        $booking->save();

        return back()->with('success', 'Booking marked as in-progress.');
    }

    public function completeBooking(PackageBooking $booking)
    {
        // if (!Auth::user()->isAdmin()) { // Replace isAdmin() with your actual admin check
        //     abort(403, 'Unauthorized action.');
        // }

        if ($booking->status !== 'in-progress') {
            return back()->with('error', 'Booking is not in-progress.');
        }

        $booking->status = 'completed';
        $booking->user->notify(new BookingCompleted($booking));
        $booking->save();

        return back()->with('success', 'Booking marked as completed.');
    }

    
}