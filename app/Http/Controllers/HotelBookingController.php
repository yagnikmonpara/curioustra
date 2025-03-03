<?php

namespace App\Http\Controllers;

use App\Models\HotelBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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
            'bookings' => $bookings,
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
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date',
            'number_of_guests' => 'required|integer',
            'total_price' => 'required|numeric',
            'additional_info' => 'nullable|json',
        ]);

        $hotelBooking = new HotelBooking($request->all());
        $hotelBooking->user_id = auth()->id(); // Set the user_id to the authenticated user's ID
        $hotelBooking->save();

        return redirect()->route('bookings')->with('success', 'Hotel booking created successfully.');
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

        return back()->with('success', 'Booking confirmed.');
    }

    public function cancelBooking(HotelBooking $booking)
    {
        if (!Auth::user()->isAdmin() && Auth::id() !== $booking->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $booking->status = 'cancelled';
        $booking->save();

        return back()->with('success', 'Booking cancelled.');
    }
}