<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $packages = Package::all(); // Fetch all packages
        return Inertia::render('User/Packages/index', [
            'packages' => $packages, // Pass packages to the Inertia component
        ]);
    }

    /**
     * Show the form for creating a new resource.
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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'duration' => 'required|string',
            'pax' => 'required|integer',
            'location' => 'required|string',
            'price' => 'required|numeric',
            'amenities' => 'nullable|json',
            'highlights' => 'nullable|json',
        ]);

        $package = new Package;
        $package->title = $request->title;
        $package->description = $request->description;
        $package->duration = $request->duration;
        $package->pax = $request->pax;
        $package->location = $request->location;
        $package->price = $request->price;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/packages'); // Store images in 'packages' folder
            $image->move($imagePath, $imageName);
            $package->image = '/images/packages/' . $imageName;
        }

        $package->amenities = $request->amenities ? json_encode($request->amenities) : null;
        $package->highlights = $request->highlights ? json_encode($request->highlights) : null;

        $package->save();

        return redirect()->route('packages.index')->with('success', 'Package created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Package $package)
    {
        return Inertia::render('User/Packages/show', [
            'package' => $package, // Pass the package to the view
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Package $package)
    {
        return Inertia::render('User/Packages/edit', [
            'package' => $package, // Pass the package to the view
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Package $package)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'duration' => 'required|string',
            'pax' => 'required|integer',
            'location' => 'required|string',
            'price' => 'required|numeric',
            'amenities' => 'nullable|json',
            'highlights' => 'nullable|json',
        ]);

        $package->title = $request->title;
        $package->description = $request->description;
        $package->duration = $request->duration;
        $package->pax = $request->pax;
        $package->location = $request->location;
        $package->price = $request->price;

        if ($request->hasFile('image')) {
            if ($package->image) {
                $oldImagePath = public_path($package->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/packages'); // Store images in 'packages' folder
            $image->move($imagePath, $imageName);
            $package->image = '/images/packages/' . $imageName;
        }

        $package->amenities = $request->amenities ? json_encode($request->amenities) : null;
        $package->highlights = $request->highlights ? json_encode($request->highlights) : null;

        $package->save();

        return redirect()->route('packages.index')->with('success', 'Package updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Package $package)
    {
        if ($package->image) {
            $imagePath = public_path($package->image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }
        $package->delete();

        return redirect()->route('packages.index')->with('success', 'Package deleted successfully.');
    }
}