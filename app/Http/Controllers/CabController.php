<?php

namespace App\Http\Controllers;

use App\Models\Cab;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CabController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cabs = Cab::all();
        return Inertia::render('User/Cabs/index', [
            'cabs' => $cabs,
        ]);
    }

    public function list()
    {
        $cabs = Cab::all();
        return Inertia::render('Admin/Cabs/index', [
            'cabs' => $cabs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Cabs/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'registration_number' => 'required|string|unique:cabs',
            'driver_name' => 'required|string|max:255',
            'driver_contact_number' => 'required|string|max:20',
            'capacity' => 'required|integer|min:1',
            'price_per_km' => 'required|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:available,booked,unavailable',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $cab = new Cab();
        $cab->fill($request->all());

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/cabs');
            $image->move($imagePath, $imageName);
            $cab->image = '/images/cabs/' . $imageName;
        }

        $cab->save();

        return redirect()->route('admin.cabs')->with('success', 'Cab created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Cab $cab)
    {
        return Inertia::render('User/Cabs/show', [
            'cab' => $cab,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cab $cab)
    {
        return Inertia::render('Admin/Cabs/edit', [
            'cab' => $cab,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cab $cab)
    {
        $request->validate([
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'registration_number' => 'required|string|unique:cabs,registration_number,' . $cab->id,
            'driver_name' => 'required|string|max:255',
            'driver_contact_number' => 'required|string|max:20',
            'capacity' => 'required|integer|min:1',
            'price_per_km' => 'required|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:available,booked,unavailable',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $cab->fill($request->all());

        if ($request->hasFile('image')) {
            if ($cab->image) {
                $oldImagePath = public_path($cab->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/cabs');
            $image->move($imagePath, $imageName);
            $cab->image = '/images/cabs/' . $imageName;
        }

        $cab->save();

        return redirect()->route('admin.cabs')->with('success', 'Cab updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cab $cab)
    {
        if ($cab->image) {
            $imagePath = public_path($cab->image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }
        $cab->delete();

        return redirect()->route('admin.cabs')->with('success', 'Cab deleted successfully.');
    }
}