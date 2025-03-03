<?php

namespace App\Http\Controllers;

use App\Models\PackageBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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
            'bookings' => $bookings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * (Not typically needed for bookings, as they are created during the booking process)
     */
    public function create()
    {
        return Inertia::render('User/Packages/create');
    }

    /**
    * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
        $request->validate([
            'booking_date' => 'required|date',
            'number_of_people' => 'required|integer',
            'total_price' => 'required|numeric',
            'additional_info' => 'nullable|json',
        ]);

        $packageBooking = new PackageBooking($request->all());
        $packageBooking->user_id = auth()->id(); // Set the user_id to the authenticated user's ID
        $packageBooking->save();

        return redirect()->route('bookings')->with('success', 'Package booking created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PackageBooking $packageBooking)
    {
        $packageBooking->load('user', 'package'); // Eager load relationships
        return Inertia::render('Admin/Bookings/show', [
            'booking' => $packageBooking,
        ]);
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
        // $request->validate([
        //     'booking_date' => 'required|date',
        //     'number_of_people' => 'required|integer',
        //     'total_price' => 'required|numeric',
        //     'status' => 'required|string',
        //     'additional_info' => 'nullable|json',
        // ]);

        // $packageBooking->update($request->all());

        // return redirect()->back()->with('success', 'Booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PackageBooking $packageBooking)
    {
        $packageBooking->delete();
        return redirect()->route('bookings.index')->with('success', 'Booking deleted successfully.');
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
        $booking->save();

        return back()->with('success', 'Booking confirmed.');
    }

    public function cancelBooking(PackageBooking $booking)
    {
        // Check if the current user is authorized to cancel the booking (either admin or the user who made the booking)
        if (!Auth::user()->isAdmin() && Auth::id() !== $booking->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $booking->status = 'cancelled';
        $booking->save();

        return back()->with('success', 'Booking cancelled.');
    }
}