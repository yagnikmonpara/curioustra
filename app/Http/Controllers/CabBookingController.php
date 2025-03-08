<?php

namespace App\Http\Controllers;

use App\Models\CabBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
        return Inertia::render('User/Cabs/create');
    }

    /**
     * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
    $request->validate([
        'pickup_location' => 'required|string|max:255',
        'dropoff_location' => 'required|string|max:255',
        'pickup_time' => 'required|date_format:Y-m-d H:i:s',
        'distance_km' => 'nullable|integer|min:0',
        'total_price' => 'nullable|numeric|min:0',
        'additional_info' => 'nullable|json',
    ]);

    $cabBooking = new CabBooking($request->all());
    $cabBooking->user_id = auth()->id(); // Set the user_id to the authenticated user's ID
    $cabBooking->save();

    return redirect()->route('admin.cab-bookings')->with('success', 'Cab booking created successfully.');
}

    /**
     * Display the specified resource.
     */
    public function show(CabBooking $cabBooking)
    {
        $cabBooking->load('user', 'cab');
        return Inertia::render('Admin/CabBookings/show', [
            'booking' => $cabBooking,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CabBooking $cabBooking)
    {
        $cabBooking->load('user', 'cab');
        return Inertia::render('Admin/CabBookings/edit', [
            'booking' => $cabBooking,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CabBooking $cabBooking)
    {
        $request->validate([
            'pickup_location' => 'required|string|max:255',
            'dropoff_location' => 'required|string|max:255',
            'pickup_time' => 'required|date_format:Y-m-d H:i:s',
            'distance_km' => 'nullable|integer|min:0',
            'total_price' => 'nullable|numeric|min:0',
            'status' => 'required|string|in:pending,confirmed,completed,cancelled',
            'additional_info' => 'nullable|json',
        ]);

        $cabBooking->update($request->all());

        return redirect()->route('admin.cab-bookings')->with('success', 'Cab booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CabBooking $cabBooking)
    {
        $cabBooking->delete();
        return redirect()->route('admin.cab-bookings')->with('success', 'Cab booking deleted successfully.');
    }

    public function confirmBooking(CabBooking $booking)
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

    public function cancelBooking(CabBooking $booking)
    {
        if (!Auth::user()->isAdmin() && Auth::id() !== $booking->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $booking->status = 'cancelled';
        $booking->save();

        return back()->with('success', 'Booking cancelled.');
    }
}