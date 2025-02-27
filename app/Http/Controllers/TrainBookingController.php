<?php

namespace App\Http\Controllers;

use App\Models\TrainBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TrainBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = TrainBooking::with('user', 'train')->get();
        return Inertia::render('Admin/TrainBookings/index', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Not typically needed, bookings are created during the booking process
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Bookings are created during the booking process in the TrainController or related booking logic
    }

    /**
     * Display the specified resource.
     */
    public function show(TrainBooking $trainBooking)
    {
        $trainBooking->load('user', 'train');
        return Inertia::render('Admin/TrainBookings/show', [
            'booking' => $trainBooking,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TrainBooking $trainBooking)
    {
        $trainBooking->load('user', 'train');
        return Inertia::render('Admin/TrainBookings/edit', [
            'booking' => $trainBooking,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TrainBooking $trainBooking)
    {
        $request->validate([
            'number_of_seats' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'seat_numbers' => 'nullable|string',
            'status' => 'required|string|in:pending,confirmed,cancelled,completed',
            'additional_info' => 'nullable|json',
        ]);

        $trainBooking->update($request->all());

        return redirect()->route('train-bookings.index')->with('success', 'Train booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TrainBooking $trainBooking)
    {
        $trainBooking->delete();
        return redirect()->route('train-bookings.index')->with('success', 'Train booking deleted successfully.');
    }

    public function confirmBooking(TrainBooking $booking)
    {
        if (!Auth::user()->isAdmin()) { // Replace isAdmin() with your actual admin check
            abort(403, 'Unauthorized action.');
        }

        if ($booking->status !== 'pending') {
            return back()->with('error', 'Booking is not pending.');
        }

        $booking->status = 'confirmed';
        $booking->save();

        return back()->with('success', 'Booking confirmed.');
    }

    public function cancelBooking(TrainBooking $booking)
    {
        if (!Auth::user()->isAdmin() && Auth::id() !== $booking->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $booking->status = 'cancelled';
        $booking->save();

        return back()->with('success', 'Booking cancelled.');
    }
}