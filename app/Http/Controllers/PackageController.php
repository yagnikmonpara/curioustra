<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    /**
     * Display user-facing packages
     */
    public function index()
    {
        return Inertia::render('User/Packages/index', [
            'packages' => Package::all()
        ]);
    }

    /**
     * Display admin package management
     */
    public function list()
    {
        return Inertia::render('Admin/Packages/index', [
            'packages' => Package::all()
        ]);
    }

    /**
     * Show package creation form
     */
    public function create()
    {
        return Inertia::render('Admin/Packages/create');
    }

    /**
     * Store new package
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration' => 'required|string',
            'pax' => 'required|integer',
            'location' => 'required|string',
            'country' => 'required|string',
            'price' => 'required|numeric',
            'new_images' => 'required|array',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'amenities' => 'nullable|string',
            'highlights' => 'nullable|string',
        ]);

        $package = new Package();
        $this->savePackageData($package, $validated, $request->file('new_images'));
        
        return redirect()->route('admin.packages')->with('success', 'Package created successfully.');
    }

    /**
     * Show package details
     */
    public function show(Package $package)
    {
        return Inertia::render('User/Packages/Show', [
            'package' => $package
        ]);
    }

    /**
     * Show package edit form
     */
    public function edit(Package $package)
    {
        return Inertia::render('Admin/Packages/Edit', [
            'package' => $package
        ]);
    }

    /**
     * Update package
     */
    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration' => 'required|string',
            'pax' => 'required|integer',
            'location' => 'required|string',
            'country' => 'required|string',
            'price' => 'required|numeric',
            'new_images' => 'nullable|array',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'existing_images' => 'nullable|array',
            'amenities' => 'nullable|string',
            'highlights' => 'nullable|string',
        ]);

        $this->savePackageData($package, $validated, $request->file('new_images'), $request->existing_images);
        
        return redirect()->route('admin.packages')->with('success', 'Package updated successfully.');
    }

    /**
     * Delete package
     */
    public function destroy(Package $package)
    {
        $this->deleteImages($package->images);
        $package->delete();
        return redirect()->back()->with('success', 'Package deleted successfully.');
    }

    /**
     * Shared package save logic
     */
    private function savePackageData(Package $package, array $validated, $newImages = null, $existingImages = [])
    {
        // Handle image updates
        $images = $existingImages ?? [];
        
        if ($newImages) {
            foreach ($newImages as $image) {
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move(public_path('images/packages'), $imageName);
                $images[] = '/images/packages/' . $imageName;
            }
        }

        // Clean up removed images
        if ($package->exists) {
            $removedImages = array_diff($package->images ?? [], $images);
            $this->deleteImages($removedImages);
        }

        // Update package attributes
        $package->fill($validated);
        $package->images = $images;
        $package->save();
    }

    /**
     * Delete images from filesystem
     */
    private function deleteImages(array $images)
    {
        foreach ($images as $image) {
            $path = public_path(parse_url($image, PHP_URL_PATH));
            if (file_exists($path)) {
                unlink($path);
            }
        }
    }
}