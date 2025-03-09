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
        $validated = $request->validate([
            'cab_id' => 'required|exists:cabs,id',
            'pickup_location' => 'required|string|max:255',
            'dropoff_location' => 'required|string|max:255',
            'pickup_time' => 'required|date_format:Y-m-d H:i:s',
            'distance_km' => 'required|integer|min:1',
            'additional_info' => 'nullable|array', // Changed from json to array
        ]);
    
        $cab = Cab::findOrFail($validated['cab_id']);
        
        $cabBooking = new CabBooking();
        $cabBooking->user_id = auth()->id();
        $cabBooking->cab_id = $validated['cab_id'];
        $cabBooking->pickup_location = $validated['pickup_location'];
        $cabBooking->dropoff_location = $validated['dropoff_location'];
        $cabBooking->pickup_time = $validated['pickup_time'];
        $cabBooking->distance_km = $validated['distance_km'];
        $cabBooking->total_price = $validated['distance_km'] * $cab->rate_per_km; // Calculate price
        $cabBooking->additional_info = $validated['additional_info'];
        $cabBooking->save();
    
        return redirect()->route('user.cab-bookings')->with('success', 'Cab booking created successfully.');
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
    if (!Auth::user()->isAdmin() && Auth::id() !== $cabBooking->user_id) {
        abort(403, 'Unauthorized action.');
    }

    $validated = $request->validate([
        'cab_id' => 'sometimes|required|exists:cabs,id',
        'pickup_location' => 'required|string|max:255',
        'dropoff_location' => 'required|string|max:255',
        'pickup_time' => 'required|date_format:Y-m-d H:i:s',
        'distance_km' => 'required|integer|min:1',
        'status' => 'required|string|in:pending,confirmed,completed,cancelled',
        'additional_info' => 'nullable|array', // Changed from json to array
    ]);

    $cab = Cab::findOrFail($request->cab_id ?? $cabBooking->cab_id);
    $distance = $request->distance_km ?? $cabBooking->distance_km;
    
    $cabBooking->update([
        'cab_id' => $validated['cab_id'] ?? $cabBooking->cab_id,
        'pickup_location' => $validated['pickup_location'],
        'dropoff_location' => $validated['dropoff_location'],
        'pickup_time' => $validated['pickup_time'],
        'distance_km' => $distance,
        'total_price' => $distance * $cab->rate_per_km, // Recalculate price
        'status' => $validated['status'],
        'additional_info' => $validated['additional_info'],
    ]);

    return redirect()->route('admin.cab-bookings')->with('success', 'Cab booking updated successfully.');
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

    public function confirmBooking(CabBooking $booking)
    {
        // if (!Auth::user()->isAdmin()) { // Replace isAdmin() with your actual admin check
        //     abort(403, 'Unauthorized action.');
        // }

        if ($booking->status !== 'pending') {
            return back()->with('error', 'Booking is not pending.');
        }

        $booking->status = 'confirmed';
        $booking->save();

        return back()->with('success', 'Booking confirmed.');
    }

    public function cancelBooking(CabBooking $booking)
    {
        // if (!Auth::user()->isAdmin() && Auth::id() !== $booking->user_id) {
        //     abort(403, 'Unauthorized action.');
        // }

        $booking->status = 'cancelled';
        $booking->save();

        return back()->with('success', 'Booking cancelled.');
    }

    public function completeBooking(CabBooking $booking)
    {
        // Authorization check (uncomment if needed)
        // if (!Auth::user()->isAdmin()) {
        //     abort(403, 'Unauthorized action.');
        // }
    
        if ($booking->status !== 'in-progress') {
            return response()->json(['error' => 'Booking is not confirmed.'], 400);
        }
    
        $booking->status = 'completed';
        $booking->save();
    
        return back()->with('success', 'Booking completed.');
    }

    public function inProgressBooking(CabBooking $booking)
    {
        // Authorization check (uncomment if needed)
        // if (!Auth::user()->isAdmin()) {
        //     abort(403, 'Unauthorized action.');
        // }
    
        if ($booking->status !== 'confirmed') {
            return response()->json(['error' => 'Booking is not confirmed.'], 400);
        }
    
        $booking->status = 'in-progress';
        $booking->save();
    
        return back()->with('success', 'Booking in progress.');
    }
}