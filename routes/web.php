<?php

use App\Http\Controllers\ProfileController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\UserMiddleware;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(AdminMiddleware::class)->group(function () {
    
    // Admin Dashboard
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard'); 
    })->name('admin.dashboard');

    // Admin Destionations Page
    Route::get('/admin/destinations', [DestinationController::class, 'index'])->name('admin.destinations');
    Route::get('/admin/destinations/{id}', [DestinationController::class, 'show'])->name('admin.destinations.show');
    Route::post('/admin/destinations/create', [DestinationController::class, 'store']);
    Route::put('/admin/destinations/{id}/update', [DestinationController::class, 'update']);
    Route::delete('/admin/destinations/{id}/delete', [DestinationController::class, 'destroy']);

    // Packages Page
    Route::get('/admin/packages', [PackageController::class, 'index'])->name('admin.packages');
    Route::get('/admin/packages/{id}', [PackageController::class, 'show'])->name('admin.packages.show');
    Route::post('/admin/packages/create', [PackageController::class, 'store']);
    Route::put('/admin/packages/{id}/update', [PackageController::class, 'update']);
    Route::delete('/admin/packages/{id}/delete', [PackageController::class, 'destroy']);

    // Admin Booking Page
    Route::get('/admin/bookings', [PackageBookingController::class, 'index'])->name('admin.bookings');
    Route::get('/admin/bookings/{id}', [PackageBookingController::class, 'show'])->name('admin.bookings.show');
    Route::put('/admin/bookings/{id}/update', [PackageBookingController::class, 'update']);
    Route::delete('/admin/bookings/{id}/delete', [PackageBookingController::class, 'destroy']);

    // Admin Hotel Page
    Route::get('/admin/hotels', [HotelController::class, 'index'])->name('admin.hotels');
    Route::get('/admin/hotels/{id}', [HotelController::class, 'show'])->name('admin.hotels.show');
    Route::post('/admin/hotels/create', [HotelController::class, 'store']);
    Route::put('/admin/hotels/{id}/update', [HotelController::class, 'update']);
    Route::delete('/admin/hotels/{id}/delete', [HotelController::class, 'destroy']);

    // Admin Cabs Page
    Route::get('/admin/cabs', [CabController::class, 'index'])->name('admin.cabs');
    Route::get('/admin/cabs/{id}', [CabController::class, 'show'])->name('admin.cabs.show');
    Route::post('/admin/cabs/create', [CabController::class, 'store']);
    Route::put('/admin/cabs/{id}/update', [CabController::class, 'update']);
    Route::delete('/admin/cabs/{id}/delete', [CabController::class, 'destroy']);

    // Admin Train Page
    Route::get('/admin/trains', [TrainController::class, 'index'])->name('admin.trains');
    Route::get('/admin/trains/{id}', [TrainController::class, 'show'])->name('admin.trains.show');
    Route::post('/admin/trains/create', [TrainController::class, 'store']);
    Route::put('/admin/trains/{id}/update', [TrainController::class, 'update']);
    Route::delete('/admin/trains/{id}/delete', [TrainController::class, 'destroy']);

    // Admin Flight Page
    Route::get('/admin/flights', [FlightController::class, 'index'])->name('admin.flights');
    Route::get('/admin/flights/{id}', [FlightController::class, 'show'])->name('admin.flights.show');
    Route::post('/admin/flights/create', [FlightController::class, 'store']);
    Route::put('/admin/flights/{id}/update', [FlightController::class, 'update']);
    Route::delete('/admin/flights/{id}/delete', [FlightController::class, 'destroy']);

    // Admin Guide Page
    Route::get('/admin/guides', [GuideController::class, 'index'])->name('admin.guides');
    Route::get('/admin/guides/{id}', [GuideController::class, 'show'])->name('admin.guides.show');
    Route::post('/admin/guides/create', [GuideController::class, 'store']);
    Route::put('/admin/guides/{id}/update', [GuideController::class, 'update']);
    Route::delete('/admin/guides/{id}/delete', [GuideController::class, 'destroy']);

    // Gallery Page
    Route::get('/admin/gallery', [GalleryController::class, 'index'])->name('admin.gallery');
    Route::put('/admin/gallery/create', [GalleryController::class, 'store']);
    Route::put('/admin/gallery/{id}/update', [GalleryController::class, 'update']);
    Route::put('/admin/gallery/{id}/delete', [GalleryController::class, 'destroy']);
});

Route::middleware(UserMiddleware::class)->group(function () {
    // Home Page
    Route::get('/home', function () {
        return Inertia::render('User/Home'); 
    })->name('home');

    // Destionations Page
    Route::get('/destinations', [DestinationController::class, 'index'])->name('destinations');
    Route::get('/destinations/{id}', [DestinationController::class, 'show'])->name('destinations.show');

    // Packages Page
    Route::get('/packages', [PackageController::class, 'index'])->name('packages');
    Route::get('/packages/{id}', [PackageController::class, 'show'])->name('packages.show');
    Route::post('/packages/{id}/book', [PackageBookingController::class, 'store']);

    // Booking Page
    Route::get('/booking', [PackageBookingController::class, 'index'])->name('booking');
    Route::get('/booking/{id}', [PackageBookingController::class, 'show'])->name('booking.show');
    // Route::put('/booking/{id}/pay', [PackageBookingController::class, 'update']);

    // Hotel Page
    Route::get('/hotels', [HotelController::class, 'index'])->name('hotels');
    Route::get('/hotels/{id}', [HotelController::class, 'show'])->name('hotels.show');
    Route::post('/hotels/{id}/book', [HotelBookingController::class, 'store']);

    // Cabs Page
    Route::get('/cabs', [CabController::class, 'index'])->name('cabs');
    Route::get('/cabs/{id}', [CabController::class, 'show'])->name('cabs.show');
    Route::post('/cabs/{id}/book', [CabBookingController::class, 'store']);

    // Train Page
    Route::get('/trains', [TrainController::class, 'index'])->name('trains');
    Route::get('/trains/{id}', [TrainController::class, 'show'])->name('trains.show');
    Route::post('/trains/{id}/book', [TrainBookingController::class, 'store']);

    // Flight Page
    Route::get('/flights', [FlightController::class, 'index'])->name('flights');
    Route::get('/flights/{id}', [FlightController::class, 'show'])->name('flights.show');
    Route::post('/flights/{id}/book', [FlightBookingController::class, 'store']);

    // Guide Page
    Route::get('/guides', [GuideController::class, 'index'])->name('guides');
    Route::get('/guides/{id}', [GuideController::class, 'show'])->name('guides.show');
    Route::post('/guides/{id}/book', [GuideBookingController::class, 'store']);

    // Gallery Page
    Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery');
});

require __DIR__.'/auth.php';