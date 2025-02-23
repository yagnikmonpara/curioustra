<?php

namespace App\Http\Controllers;

use App\Models\GuideBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class GuideBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = GuideBooking::with('user', 'guide')->get();
        return Inertia::render('Admin/GuideBookings/index', [
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
        // Bookings are created during the booking process in the GuideController or related booking logic
    }

    /**
     * Display the specified resource.
     */
    public function show(GuideBooking $guideBooking)
    {
        $guideBooking->load('user', 'guide');
        return Inertia::render('Admin/GuideBookings/show', [
            'booking' => $guideBooking,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GuideBooking $guideBooking)
    {
        $guideBooking->load('user', 'guide');
        return Inertia::render('Admin/GuideBookings/edit', [
            'booking' => $guideBooking,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GuideBooking $guideBooking)
    {
        $request->validate([
            'booking_date' => 'required|date',
            'booking_time' => 'nullable|date_format:H:i',
            'duration_hours' => 'nullable|integer',
            'total_price' => 'nullable|numeric',
            'status' => 'required|string',
            'additional_info' => 'nullable|json',
        ]);

        $guideBooking->update($request->all());

        return redirect()->route('guide-bookings.index')->with('success', 'Guide booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GuideBooking $guideBooking)
    {
        $guideBooking->delete();
        return redirect()->route('guide-bookings.index')->with('success', 'Guide booking deleted successfully.');
    }

    public function confirmBooking(GuideBooking $booking)
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

    public function cancelBooking(GuideBooking $booking)
    {
        if (!Auth::user()->isAdmin() && Auth::id() !== $booking->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $booking->status = 'cancelled';
        $booking->save();

        return back()->with('success', 'Booking cancelled.');
    }
}