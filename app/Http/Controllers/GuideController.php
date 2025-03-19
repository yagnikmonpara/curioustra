<?php

namespace App\Http\Controllers;

use App\Models\Guide;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GuideController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $guides = Guide::all();
        return Inertia::render('User/Guides/index', [
            'guides' => $guides,
        ]);
    }

    public function list()
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
            'languages' => 'nullable|string',
        ]);

        $guide = new Guide();
        $guide->fill($request->except('profile_picture'));

        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('guides', 'public');
            $guide->profile_picture = Storage::url($path);
        }

        $guide->save();

        return redirect()->back()->with('success', 'Guide created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Guide $guide)
    {
        return Inertia::render('User/Guides/show', [
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
            'languages' => 'nullable|string',
        ]);

        $guide->fill($request->except('profile_picture'));

        if ($request->hasFile('profile_picture')) {
            if ($guide->profile_picture) {
                $oldPath = str_replace('/storage/', '', $guide->profile_picture);
                Storage::disk('public')->delete($oldPath);
            }
            
            $path = $request->file('profile_picture')->store('guides', 'public');
            $guide->profile_picture = Storage::url($path);
        }

        $guide->save();

        return redirect()->back()->with('success', 'Guide updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guide $guide)
    {
        if ($guide->profile_picture) {
            $path = str_replace('/storage/', '', $guide->profile_picture);
            Storage::disk('public')->delete($path);
        }

        $guide->delete();

        return redirect()->back()->with('success', 'Guide deleted successfully.');
    }
}