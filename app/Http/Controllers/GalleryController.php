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
        $gallery = Gallery::All();
        return Inertia::render('User/Gallery/index', [
            'gallery' => $gallery,
        ]);
    }

    public function list()
    {
        $gallery = Gallery::All();
        return Inertia::render('Admin/Gallery/index', [
            'gallery' => $gallery,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('User/Gallery/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'caption' => 'nullable|string',
        ]);
    
        $user = auth()->user();
        
        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/Gallery');
            $image->move($imagePath, $imageName);
            $imagePath = '/images/Gallery/' . $imageName;
        }
    
        Gallery::create([
            'image' => $imagePath,
            'caption' => $request->caption,
            'user_id' => $user->id,
            'user_name' => $user->name,
        ]);
    
        return redirect()->back()->with('success', 'Image added successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Gallery $gallery)
    {
        return Inertia::render('Admin/Gallery/show', [
            'gallery' => $gallery,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gallery $gallery)
    {
        return Inertia::render('Admin/Gallery/edit', [
            'gallery' => $gallery,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Gallery $gallery)
    {
        $data = $request->validate([
            'caption' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $gallery->caption = $data['caption'];

        if ($request->hasFile('image')) {
            if ($gallery->image_path) {
                $oldImagePath = public_path($gallery->image_path);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/Gallery');
            $image->move($imagePath, $imageName);
            $gallery->image_path = '/images/Gallery/' . $imageName;
        }

        $gallery->update($data);

        return redirect()->back()->with('success', 'Gallery image updated successfully.');
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

        return redirect()->back()->with('success', 'Gallery image deleted successfully.');
    }
}