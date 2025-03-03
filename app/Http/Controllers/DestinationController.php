<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DestinationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $destinations = Destination::all();
        return Inertia::render('User/Destinations/index', [
            'destinations' => $destinations,
        ]);
    }

    public function list()
    {
        $destinations = Destination::all();
        return Inertia::render('Admin/Destinations/index', [
            'destinations' => $destinations,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Destinations/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $destination = new Destination();
        $destination->name = $request->name;
        $destination->description = $request->description;
        $destination->price = $request->price;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/destinations');
            $image->move($imagePath, $imageName);
            $destination->image = '/images/destinations/' . $imageName;
        }

        $destination->save();

        return redirect()->back()->with('success', 'Destination created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Destination $destination)
    {
        return Inertia::render('User/Destinations/show', [
            'destination' => $destination,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Destination $destination)
    {   
        $dest = Destination::findOrFail($destination->id);
        return Inertia::render('Admin/Destinations/edit', [
            'destination' => $dest,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Destination $destination)
    {   
        $dest = Destination::findOrFail($destination->id);
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $destination->name = $request->name;
        $destination->description = $request->description;
        $destination->price = $request->price;

        if ($request->hasFile('image')) {
            if ($destination->image) {
                $oldImagePath = public_path($destination->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/destinations');
            $image->move($imagePath, $imageName);
            $destination->image = '/images/destinations/' . $imageName;
        }

        $destination->save();

        return redirect()->route('admin.destinations')->with('success', 'Destination updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Destination $destination)
    {
        $dest = Destination::findOrFail($destination->id);
        if ($dest->image) {
            $imagePath = public_path($dest->image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $dest->delete();

        return redirect()->route('admin.destinations')->with('success', 'Destination deleted successfully.');
    }
}