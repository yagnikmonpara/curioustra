<?php

namespace App\Http\Controllers;

use App\Models\FlightBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FlightBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = FlightBooking::with('user', 'flight')->get();
        return Inertia::render('Admin/FlightBookings/index', [
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
        // Bookings are created during the booking process in the FlightController or related booking logic
    }

    /**
     * Display the specified resource.
     */
    public function show(FlightBooking $flightBooking)
    {
        $flightBooking->load('user', 'flight');
        return Inertia::render('Admin/FlightBookings/show', [
            'booking' => $flightBooking,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FlightBooking $flightBooking)
    {
        $flightBooking->load('user', 'flight');
        return Inertia::render('Admin/FlightBookings/edit', [
            'booking' => $flightBooking,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FlightBooking $flightBooking)
    {
        $request->validate([
            'number_of_seats' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'seat_numbers' => 'nullable|string',
            'status' => 'required|string|in:pending,confirmed,cancelled,completed',
            'additional_info' => 'nullable|json',
        ]);

        $flightBooking->update($request->all());

        return redirect()->route('flight-bookings.index')->with('success', 'Flight booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FlightBooking $flightBooking)
    {
        $flightBooking->delete();
        return redirect()->route('flight-bookings.index')->with('success', 'Flight booking deleted successfully.');
    }

    public function confirmBooking(FlightBooking $booking)
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

    public function cancelBooking(FlightBooking $booking)
    {
        if (!Auth::user()->isAdmin() && Auth::id() !== $booking->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $booking->status = 'cancelled';
        $booking->save();

        return back()->with('success', 'Booking cancelled.');
    }
}