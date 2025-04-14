<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Notifications;
use App\Models\RecentActivities;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        $notifications = Notifications::whereNull('user_id')
            ->orWhere('user_id', Auth::id())
            ->with('user')
            ->orWhere('user_id', Auth::id())
            ->with('user')
            ->orderBy('timestamp', 'desc')
            ->take(3)
            ->get();

        $recentActivities = RecentActivities::where('user_id', Auth::id())
            ->with('user')
            ->orderBy('timestamp', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('User/Home', [
            'notifications' => $notifications,
            'recentActivities' => $recentActivities
        ]);
    }
}
