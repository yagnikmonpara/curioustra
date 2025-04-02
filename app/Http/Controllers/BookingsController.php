<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PackageBooking;
use App\Models\CabBooking;
use App\Models\GuideBooking;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BookingsController extends Controller
{
    public function index()
    {   
        $auth = Auth::user();
        $packageBookings = PackageBooking::with('user', 'package')->where('user_id', $auth->id)->get();
        $cabBookings = CabBooking::with('user', 'cab')->where('user_id', $auth->id)->get();
        $guideBookings = GuideBooking::with('user', 'guide')->where('user_id', $auth->id)->get();
        return Inertia::render('User/Bookings/index', [
            'packageBookings' => $packageBookings,
            'cabBookings' => $cabBookings,
            'guideBookings' => $guideBookings,
        ]);
    }
}