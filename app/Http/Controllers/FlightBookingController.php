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
        $user = auth()->user();
        $flightBookings = FlightBooking::with('user', 'flight')->where('user_id', $user->id)->get();
        return $flightBookings;
    }

    public function list()
    {
        $bookings = FlightBooking::with('user', 'flight')->get();
        return Inertia::render('Admin/FlightBookings/Index', [
            'bookings' => $bookings,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('User/Flights/create');  
    }

    /**
    * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
        $request->validate([
            'number_of_seats' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'seat_numbers' => 'nullable|string',
            'additional_info' => 'nullable|json',
        ]);

        $flightBooking = new FlightBooking($request->all());
        $flightBooking->user_id = auth()->id(); // Set the user_id to the authenticated user's ID
        $flightBooking->save();

        return redirect()->route('bookings')->with('success', 'Flight booking created successfully.');
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

    public function confirmBooking(FlightBooking $flightBooking)
    {
        if (!Auth::user()->isAdmin()) { // Replace isAdmin() with your actual admin check
            abort(403, 'Unauthorized action.');
        }

        if ($flightBooking->status !== 'pending') {
            return back()->with('error', 'Booking is not pending.');
        }

        $flightBooking->status = 'confirmed';
        $flightBooking->save();

        return back()->with('success', 'Booking confirmed.');
    }

    public function cancelBooking(FlightBooking $flightBooking)
    {
        if (!Auth::user()->isAdmin() && Auth::id() !== $flightBooking->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $flightBooking->status = 'cancelled';
        $flightBooking->save();

        return back()->with('success', 'Booking cancelled.');
    }
}