<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Review::with('user', 'reviewable')->get();
        return Inertia::render('User/Reviews/index', [
            'reviews' => $reviews,
        ]);
    }

    public function list()
    {
        $reviews = Review::with('user', 'reviewable')->get();
        return Inertia::render('Admin/Reviews/index', [
            'reviews' => $reviews,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('User/Reviews/create'); // Or Admin/Reviews/create
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'reviewable_id' => 'required|integer',
            'reviewable_type' => 'required|string', // e.g., 'App\Models\Hotel', 'App\Models\Package'
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review = new Review();
        $review->user_id = Auth::id(); // Get the authenticated user's ID
        $review->reviewable_id = $request->reviewable_id;
        $review->reviewable_type = $request->reviewable_type;
        $review->rating = $request->rating;
        $review->comment = $request->comment;
        $review->save();

        return redirect()->back()->with('success', 'Review submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        $review->load('user', 'reviewable');
        return Inertia::render('User/Reviews/show', [
            'review' => $review,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        $review->load('user', 'reviewable');
        return Inertia::render('Admin/Reviews/edit', [
            'review' => $review,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $review->update($request->all());

        return redirect()->back()->with('success', 'Review updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        $review->delete();
        return redirect()->back()->with('success', 'Review deleted successfully.');
    }
}