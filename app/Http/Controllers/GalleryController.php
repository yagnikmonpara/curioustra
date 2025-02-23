<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $galleries = Gallery::with('imageable')->get();
        return Inertia::render('Admin/Galleries/index', [
            'galleries' => $galleries,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Galleries/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'imageable_id' => 'required|integer',
            'imageable_type' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'caption' => 'nullable|string',
        ]);

        $gallery = new Gallery();
        $gallery->imageable_id = $request->imageable_id;
        $gallery->imageable_type = $request->imageable_type;
        $gallery->caption = $request->caption;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/galleries');
            $image->move($imagePath, $imageName);
            $gallery->image_path = '/images/galleries/' . $imageName;
        }

        $gallery->save();

        return redirect()->route('galleries.index')->with('success', 'Image added to gallery successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Gallery $gallery)
    {
        $gallery->load('imageable');
        return Inertia::render('Admin/Galleries/show', [
            'gallery' => $gallery,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gallery $gallery)
    {
        $gallery->load('imageable');
        return Inertia::render('Admin/Galleries/edit', [
            'gallery' => $gallery,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Gallery $gallery)
    {
        $request->validate([
            'caption' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $gallery->caption = $request->caption;

        if ($request->hasFile('image')) {
            if ($gallery->image_path) {
                $oldImagePath = public_path($gallery->image_path);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/galleries');
            $image->move($imagePath, $imageName);
            $gallery->image_path = '/images/galleries/' . $imageName;
        }

        $gallery->save();

        return redirect()->route('galleries.index')->with('success', 'Gallery image updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gallery $gallery)
    {
        if ($gallery->image_path) {
            $imagePath = public_path($gallery->image_path);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $gallery->delete();

        return redirect()->route('galleries.index')->with('success', 'Gallery image deleted successfully.');
    }
}