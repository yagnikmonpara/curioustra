<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    public function index()
    {
        $userPhotos = auth()->check() ? Gallery::where('user_id', auth()->id())->get() : [];
        $allPhotos = Gallery::latest()->get();
        
        return Inertia::render('User/Gallery/index', [
            'userPhotos' => $userPhotos,
            'allPhotos' => $allPhotos
        ]);
    }

    public function list()
    {
        $gallery = Gallery::all();
        return Inertia::render('Admin/Gallery/index', [
            'gallery' => $gallery,
        ]);
    }

    public function create()
    {
        return Inertia::render('User/Gallery/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'caption' => 'nullable|string',
        ]);
    
        $user = auth()->user();
        
        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('gallery', 'public');
            $imagePath = Storage::url($path);
        }
    
        Gallery::create([
            'image' => $imagePath,
            'caption' => $request->caption,
            'user_id' => $user->id,
            'user_name' => $user->name,
        ]);
    
        return redirect()->back()->with('success', 'Image added successfully');
    }

    public function show(Gallery $gallery)
    {
        return Inertia::render('Admin/Gallery/show', [
            'gallery' => $gallery,
        ]);
    }

    public function edit(Gallery $gallery)
    {
        return Inertia::render('Admin/Gallery/edit', [
            'gallery' => $gallery,
        ]);
    }

    public function update(Request $request, Gallery $gallery)
    {
        $data = $request->validate([
            'caption' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $gallery->caption = $data['caption'];

        if ($request->hasFile('image')) {
            // Delete old image
            if ($gallery->image) {
                $oldPath = str_replace('/storage/', '', $gallery->image);
                Storage::disk('public')->delete($oldPath);
            }
            // Store new image
            $path = $request->file('image')->store('gallery', 'public');
            $gallery->image = Storage::url($path);
        }

        $gallery->save();

        return redirect()->back()->with('success', 'Gallery image updated successfully.');
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action');
        }

        if ($gallery->image) {
            $path = str_replace('/storage/', '', $gallery->image);
            Storage::disk('public')->delete($path);
        }

        $gallery->delete();

        return redirect()->back()->with('success', 'Gallery image deleted successfully.');
    }
}