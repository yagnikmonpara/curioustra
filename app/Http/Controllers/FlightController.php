<?php

namespace App\Http\Controllers;

use App\Models\Flight;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlightController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $flights = Flight::all();
        return Inertia::render('User/Flights/index', [
            'flights' => $flights,
        ]);
    }

    public function list()
    {
        $flights = Flight::all();
        return Inertia::render('Admin/Flights/index', [
            'flights' => $flights,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Flights/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'flight_number' => 'required|string|unique:flights',
            'airline' => 'required|string|max:255',
            'departure_airport' => 'required|string|max:255',
            'arrival_airport' => 'required|string|max:255',
            'departure_time' => 'required|date_format:Y-m-d H:i:s',
            'arrival_time' => 'required|date_format:Y-m-d H:i:s|after:departure_time',
            'total_seats' => 'required|integer|min:1',
            'price_per_seat' => 'required|numeric|min:0',
            'class' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:scheduled,delayed,cancelled,completed',
        ]);

        $flight = new Flight();
        $flight->fill($request->all());
        $flight->save();

        return redirect()->back()->with('success', 'Flight created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Flight $flight)
    {
        return Inertia::render('User/Flights/show', [
            'flight' => $flight,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Flight $flight)
    {
        return Inertia::render('Admin/Flights/edit', [
            'flight' => $flight,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Flight $flight)
    {
        $request->validate([
            'flight_number' => 'required|string|unique:flights,flight_number,' . $flight->id,
            'airline' => 'required|string|max:255',
            'departure_airport' => 'required|string|max:255',
            'arrival_airport' => 'required|string|max:255',
            'departure_time' => 'required|date_format:Y-m-d H:i:s',
            'arrival_time' => 'required|date_format:Y-m-d H:i:s|after:departure_time',
            'total_seats' => 'required|integer|min:1',
            'price_per_seat' => 'required|numeric|min:0',
            'class' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:scheduled,delayed,cancelled,completed',
        ]);

        $flight->fill($request->all());
        $flight->save();

        return redirect()->back()->with('success', 'Flight updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Flight $flight)
    {
        $flight->delete();
        return redirect()->back()->with('success', 'Flight deleted successfully.');
    }
}