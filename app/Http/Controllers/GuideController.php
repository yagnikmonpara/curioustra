<?php

namespace App\Http\Controllers;

use App\Models\Guide;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;

class GuideController extends Controller
{
    public function index()
    {
        $guides = Guide::withCount(['bookings as tours_completed' => function($query) {
            $query->where('status', 'completed');
        }])->get();

        return Inertia::render('User/Guides/index', [
            'guides' => $guides->map(function($guide) {
                return [
                    'id' => $guide->id,
                    'name' => $guide->name,
                    'bio' => $guide->bio,
                    'specialization' => $guide->specialization,
                    'location' => $guide->location,
                    'price_per_hour' => $guide->price_per_hour,
                    'rating' => $guide->rating,
                    'profile_picture' => $guide->profile_picture,
                    'languages' => $guide->languages ? explode(',', $guide->languages) : [],
                    'tours_completed' => $guide->tours_completed,
                    'contact_number' => $guide->contact_number
                ];
            })
        ]);
    }

    public function list()
    {
        Gate::authorize('admin-access');
        
        return Inertia::render('Admin/Guides/index', [
            'guides' => Guide::all(),
        ]);
    }

    public function create()
    {
        Gate::authorize('admin-access');
        
        return Inertia::render('Admin/Guides/create');
    }

    public function store(Request $request)
    {
        Gate::authorize('admin-access');
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'specialization' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|max:255|unique:guides',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'languages' => 'required|string',
            'price_per_hour' => 'required|numeric|min:0',
            'status' => 'required|string|in:available,unavailable',
        ]);

        $guide = Guide::create($validated);

        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('guides', 'public');
            $guide->update(['profile_picture' => Storage::url($path)]);
        }

        return redirect()->route('admin.guides')->with('success', 'Guide created successfully.');
    }

    public function show(Guide $guide)
    {
        return Inertia::render('User/Guides/show', [
            'guide' => $guide->load('bookings'),
        ]);
    }

    public function edit(Guide $guide)
    {
        Gate::authorize('admin-access');
        
        return Inertia::render('Admin/Guides/edit', compact('guide'));
    }

    public function update(Request $request, Guide $guide)
    {
        Gate::authorize('admin-access');
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'specialization' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|max:255|unique:guides,email,'.$guide->id,
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'languages' => 'required|string',
            'price_per_hour' => 'required|numeric|min:0',
            'status' => 'required|string|in:available,unavailable',
        ]);

        $guide->update($validated);

        if ($request->hasFile('profile_picture')) {
            if ($guide->profile_picture) {
                Storage::disk('public')->delete(
                    str_replace('/storage/', '', $guide->profile_picture)
                );
            }
            
            $path = $request->file('profile_picture')->store('guides', 'public');
            $guide->update(['profile_picture' => Storage::url($path)]);
        }

        return redirect()->route('admin.guides')->with('success', 'Guide updated successfully.');
    }

    public function destroy(Guide $guide)
    {
        Gate::authorize('admin-access');
        
        if ($guide->profile_picture) {
            Storage::disk('public')->delete(
                str_replace('/storage/', '', $guide->profile_picture)
            );
        }

        $guide->delete();

        return redirect()->route('admin.guides')->with('success', 'Guide deleted successfully.');
    }
}