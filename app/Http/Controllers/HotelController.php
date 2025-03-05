<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HotelController extends Controller
{
    public function index()
    {
        $hotels = Hotel::all();
        return Inertia::render('User/Hotels/index', [
            'hotels' => $hotels,
        ]);
    }

    public function list()
    {
        return Inertia::render('Admin/Hotels/index', [
            'hotels' => Hotel::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'stars' => 'required|integer|between:1,5',
            'price_per_night' => 'required|numeric|min:0',
            'amenities' => 'required|string',
            'new_images' => 'required|array|min:1',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Process images from correct field
        $imagePaths = [];
        foreach ($request->file('new_images') as $image) {
            $path = $image->store('hotels', 'public');
            $imagePaths[] = Storage::url($path);
        }

        Hotel::create([
            ...$validated,
            'images' => $imagePaths,
        ]);

        return redirect()->back()
            ->with('success', 'Hotel created successfully');
    }

    public function update(Request $request, Hotel $hotel)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'stars' => 'required|integer|between:1,5',
            'price_per_night' => 'required|numeric|min:0',
            'amenities' => 'required|string',
            'new_images' => 'nullable|array',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'removed_images' => 'nullable|array',
        ]);

        // Handle image deletions
        $currentImages = $hotel->images ?? [];
        if (!empty($validated['removed_images'])) {
            foreach ($validated['removed_images'] as $image) {
                $path = str_replace('/storage/', '', $image);
                Storage::disk('public')->delete($path);
            }
            $currentImages = array_diff($currentImages, $validated['removed_images']);
        }

        // Handle new image uploads
        $newImagePaths = [];
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $image) {
                $path = $image->store('hotels', 'public');
                $newImagePaths[] = Storage::url($path);
            }
        }

        $hotel->update([
            ...$validated,
            'images' => array_merge($currentImages, $newImagePaths),
        ]);

        return redirect()->route('admin.hotels')
            ->with('success', 'Hotel updated successfully');
    }

    public function destroy(Hotel $hotel)
    {
        foreach ($hotel->images as $image) {
            $path = str_replace('/storage/', '', $image);
            Storage::disk('public')->delete($path);
        }

        $hotel->delete();

        return redirect()->route('admin.hotels')
            ->with('success', 'Hotel deleted successfully');
    }
}