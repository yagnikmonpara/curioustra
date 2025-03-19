<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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
            'location' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'rating' => 'required|integer|min:0|max:5',
            'new_images' => 'nullable|array',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $images = [];

        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $image) {
                $path = $image->store('destinations', 'public');
                $images[] = Storage::url($path);
            }
        }

        $destination = new Destination();
        $destination->fill($request->except('new_images'));
        $destination->images = $images;
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
        return Inertia::render('Admin/Destinations/edit', [
            'destination' => $destination,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Destination $destination)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'rating' => 'required|integer|min:0|max:5',
            'new_images' => 'nullable|array',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'existing_images' => 'nullable|array',
        ]);

        $images = $request->existing_images ?? [];

        // Handle new image uploads
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $image) {
                $path = $image->store('destinations', 'public');
                $images[] = Storage::url($path);
            }
        }

        // Delete old images that are no longer needed
        $oldImages = $destination->images ?? [];
        $imagesToDelete = array_diff($oldImages, $images);
        foreach ($imagesToDelete as $image) {
            $path = str_replace('/storage/', '', $image);
            Storage::disk('public')->delete($path);
        }

        // Update destination
        $destination->fill($request->except(['new_images', 'existing_images']));
        $destination->images = $images;
        $destination->save();

        return redirect()->route('admin.destinations')->with('success', 'Destination updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Destination $destination)
    {
        // Delete associated images
        $images = $destination->images ?? [];
        foreach ($images as $image) {
            $path = str_replace('/storage/', '', $image);
            Storage::disk('public')->delete($path);
        }

        $destination->delete();

        return redirect()->route('admin.destinations')->with('success', 'Destination deleted successfully.');
    }
}