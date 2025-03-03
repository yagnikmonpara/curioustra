<?php

namespace App\Http\Controllers;

use App\Models\Train;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrainController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $trains = Train::all();
        return Inertia::render('User/Trains/index', [
            'trains' => $trains,
        ]);
    }

    public function list()
    {
        $trains = Train::all();
        return Inertia::render('Admin/Trains/index', [
            'trains' => $trains,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Trains/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'train_name' => 'required|string|max:255',
            'train_number' => 'required|string|unique:trains',
            'departure_station' => 'required|string|max:255',
            'arrival_station' => 'required|string|max:255',
            'departure_time' => 'required|date_format:Y-m-d H:i:s',
            'arrival_time' => 'required|date_format:Y-m-d H:i:s|after:departure_time',
            'total_seats' => 'required|integer|min:1',
            'price_per_seat' => 'required|numeric|min:0',
            'class' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:scheduled,delayed,cancelled,completed',
        ]);

        $train = new Train();
        $train->fill($request->all());
        $train->save();

        return redirect()->route('trains.index')->with('success', 'Train created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Train $train)
    {
        return Inertia::render('Admin/Trains/show', [
            'train' => $train,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Train $train)
    {
        return Inertia::render('Admin/Trains/edit', [
            'train' => $train,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Train $train)
    {
        $request->validate([
            'train_name' => 'required|string|max:255',
            'train_number' => 'required|string|unique:trains,train_number,' . $train->id,
            'departure_station' => 'required|string|max:255',
            'arrival_station' => 'required|string|max:255',
            'departure_time' => 'required|date_format:Y-m-d H:i:s',
            'arrival_time' => 'required|date_format:Y-m-d H:i:s|after:departure_time',
            'total_seats' => 'required|integer|min:1',
            'price_per_seat' => 'required|numeric|min:0',
            'class' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:scheduled,delayed,cancelled,completed',
        ]);

        $train->fill($request->all());
        $train->save();

        return redirect()->route('trains.index')->with('success', 'Train updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Train $train)
    {
        $train->delete();
        return redirect()->route('trains.index')->with('success', 'Train deleted successfully.');
    }
}