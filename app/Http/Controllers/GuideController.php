<?php

namespace App\Http\Controllers;

use App\Models\Guide;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuideController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $guides = Guide::all();
        return Inertia::render('Admin/Guides/index', [
            'guides' => $guides,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Guides/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'specialization' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'languages' => 'nullable|array',
        ]);

        $guide = new Guide();
        $guide->fill($request->all());

        if ($request->hasFile('profile_picture')) {
            $image = $request->file('profile_picture');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/guides');
            $image->move($imagePath, $imageName);
            $guide->profile_picture = '/images/guides/' . $imageName;
        }

        $guide->save();

        return redirect()->route('guides.index')->with('success', 'Guide created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Guide $guide)
    {
        return Inertia::render('Admin/Guides/show', [
            'guide' => $guide,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Guide $guide)
    {
        return Inertia::render('Admin/Guides/edit', [
            'guide' => $guide,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Guide $guide)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'specialization' => 'nullable|string',
            'contact_number' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'languages' => 'nullable|array',
        ]);

        $guide->fill($request->all());

        if ($request->hasFile('profile_picture')) {
            if ($guide->profile_picture) {
                $oldImagePath = public_path($guide->profile_picture);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }
            $image = $request->file('profile_picture');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = public_path('images/guides');
            $image->move($imagePath, $imageName);
            $guide->profile_picture = '/images/guides/' . $imageName;
        }

        $guide->save();

        return redirect()->route('guides.index')->with('success', 'Guide updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guide $guide)
    {
        if ($guide->profile_picture) {
            $imagePath = public_path($guide->profile_picture);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $guide->delete();

        return redirect()->route('guides.index')->with('success', 'Guide deleted successfully.');
    }
}