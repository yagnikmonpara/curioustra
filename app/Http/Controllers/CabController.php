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
            'new_images' => 'nullable|array',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $cab = new Cab();
        $cab->fill($request->except('new_images'));

        $images = [];

        if ($request->has('existing_images')) {
            $images = $request->existing_images;
        }

        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $file) {
                $imageName = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images/cabs'), $imageName);
                $images[] = '/images/cabs/' . $imageName;
            }
        }

        $cab->images = $images;
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
            // Keep existing validation rules
            'existing_images' => 'nullable|array',
            'new_images' => 'nullable|array',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        $cab->fill($request->except(['new_images', 'existing_images']));
    
        $images = $request->existing_images ?? [];
    
        // Handle new images
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $file) {
                $imageName = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('images/cabs'), $imageName);
                $images[] = '/images/cabs/' . $imageName;
            }
        }
    
        // Delete removed images
        $oldImages = $cab->images ?? [];
        $imagesToDelete = array_diff($oldImages, $images);
        foreach ($imagesToDelete as $image) {
            $imagePath = public_path($image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }
    
        $cab->images = $images;
        $cab->save();
    
        return redirect()->route('admin.cabs')->with('success', 'Cab updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cab $cab)
    {
        if ($cab->images) {
            foreach ($cab->images as $image) {
                $imagePath = public_path($image);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
        }
        $cab->delete();

        return redirect()->route('admin.cabs')->with('success', 'Cab deleted successfully.');
    }
}