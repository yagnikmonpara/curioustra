<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hotels = Hotel::all();
        return Inertia::render('User/Hotels/index', [
            'hotels' => $hotels,
        ]);
    }

    public function list()
    {
        $hotels = Hotel::all();
        return Inertia::render('User/Hotels/index', [
            'hotels' => $hotels,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Hotels/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'stars' => 'nullable|integer',
            'price_per_night' => 'nullable|numeric',
            'amenities' => 'nullable|array',
            'images' => 'nullable|array',
        ]);

        $hotel = new Hotel();
        $hotel->fill($request->all());

        $hotel->save();

        return redirect()->back()->with('success', 'Hotel created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Hotel $hotel)
    {
        return Inertia::render('User/Hotels/show', [
            'hotel' => $hotel,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hotel $hotel)
    {
        return Inertia::render('Admin/Hotels/edit', [
            'hotel' => $hotel,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Hotel $hotel)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'stars' => 'nullable|integer',
            'price_per_night' => 'nullable|numeric',
            'amenities' => 'nullable|array',
            'images' => 'nullable|array',
        ]);

        $hotel->update($request->all());

        return redirect()->back()->with('success', 'Hotel updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hotel $hotel)
    {
        $hotel->delete();
        return redirect()->back()->with('success', 'Hotel deleted successfully.');
    }
}