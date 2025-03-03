<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\UserMiddleware;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
// Controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PackageBookingController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\HotelBookingController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\CabController;
use App\Http\Controllers\CabBookingController;
use App\Http\Controllers\GuideController;
use App\Http\Controllers\GuideBookingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TrainController;
use App\Http\Controllers\TrainBookingController;
use App\Http\Controllers\FlightController;
use App\Http\Controllers\FlightBookingController;
use App\Http\Controllers\GalleryController;


// Guest Routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// General Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// Admin Routes
Route::middleware(AdminMiddleware::class)->prefix('admin')->group(function () {
    
    // Admin Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard'); 
    })->name('admin.dashboard');

    // Admin Destinations Page
    Route::get('/destinations', [DestinationController::class, 'list'])->name('admin.destinations');
    Route::get('/destinations/create', [DestinationController::class, 'create'])->name('admin.destinations.create');
    Route::post('/destinations', [DestinationController::class, 'store'])->name('admin.destinations.store');
    Route::get('/destinations/{destination}/edit', [DestinationController::class, 'edit'])->name('admin.destinations.edit');
    Route::put('/destinations/{destination}', [DestinationController::class, 'update'])->name('admin.destinations.update');
    Route::delete('/destinations/{destination}', [DestinationController::class, 'destroy'])->name('admin.destinations.destroy');

    // Packages Page
    Route::get('/packages', [PackageController::class, 'list'])->name('admin.packages');
    Route::get('/packages/create', [PackageController::class, 'create'])->name('admin.packages.create');
    Route::post('/packages', [PackageController::class, 'store'])->name('admin.packages.store');
    Route::get('/packages/{package}/edit', [PackageController::class, 'edit'])->name('admin.packages.edit');
    Route::put('/packages/{package}', [PackageController::class, 'update'])->name('admin.packages.update');
    Route::delete('/packages/{package}', [PackageController::class, 'destroy'])->name('admin.packages.destroy');

    // Admin Package Bookings
    Route::get('/package-bookings', [PackageBookingController::class, 'list'])->name('admin.package-bookings');
    Route::get('/package-bookings/{booking}', [PackageBookingController::class, 'show'])->name('admin.package-bookings.show');
    Route::put('/package-bookings/{booking}/confirm', [PackageBookingController::class, 'confirmBooking'])->name('admin.package-bookings.confirm');
    Route::put('/package-bookings/{booking}/cancel', [PackageBookingController::class, 'cancelBooking'])->name('admin.package-bookings.cancel');
    Route::delete('/package-bookings/{booking}', [PackageBookingController::class, 'destroy'])->name('admin.package-bookings.destroy');

    // Admin Hotel Page
    Route::get('/hotels', [HotelController::class, 'list'])->name('admin.hotels');
    Route::get('/hotels/create', [HotelController::class, 'create'])->name('admin.hotels.create');
    Route::post('/hotels', [HotelController::class, 'store'])->name('admin.hotels.store');
    Route::get('/hotels/{hotel}/edit', [HotelController::class, 'edit'])->name('admin.hotels.edit');
    Route::put('/hotels/{hotel}', [HotelController::class, 'update'])->name('admin.hotels.update');
    Route::delete('/hotels/{hotel}', [HotelController::class, 'destroy'])->name('admin.hotels.destroy');

    // Admin Hotel Bookings
    Route::get('/hotel-bookings', [HotelBookingController::class, 'index'])->name('admin.hotel-bookings');
    Route::get('/hotel-bookings/{booking}', [HotelBookingController::class, 'show'])->name('admin.hotel-bookings.show');
    Route::put('/hotel-bookings/{booking}/confirm', [HotelBookingController::class, 'confirmBooking'])->name('admin.hotel-bookings.confirm');
    Route::put('/hotel-bookings/{booking}/cancel', [HotelBookingController::class, 'cancelBooking'])->name('admin.hotel-bookings.cancel');
    Route::delete('/hotel-bookings/{booking}', [HotelBookingController::class, 'destroy'])->name('admin.hotel-bookings.destroy');

    // Admin Cabs Page
    Route::get('/cabs', [CabController::class, 'list'])->name('admin.cabs');
    Route::get('/cabs/create', [CabController::class, 'create'])->name('admin.cabs.create');
    Route::post('/cabs', [CabController::class, 'store'])->name('admin.cabs.store');
    Route::get('/cabs/{cab}/edit', [CabController::class, 'edit'])->name('admin.cabs.edit');
    Route::put('/cabs/{cab}', [CabController::class, 'update'])->name('admin.cabs.update');
    Route::delete('/cabs/{cab}', [CabController::class, 'destroy'])->name('admin.cabs.destroy');

    // Admin Cab Bookings
    Route::get('/cab-bookings', [CabBookingController::class, 'index'])->name('admin.cab-bookings');
    Route::get('/cab-bookings/{booking}', [CabBookingController::class, 'show'])->name('admin.cab-bookings.show');
    Route::put('/cab-bookings/{booking}/confirm', [CabBookingController::class, 'confirmBooking'])->name('admin.cab-bookings.confirm');
    Route::put('/cab-bookings/{booking}/cancel', [CabBookingController::class, 'cancelBooking'])->name('admin.cab-bookings.cancel');
    Route::delete('/cab-bookings/{booking}', [CabBookingController::class, 'destroy'])->name('admin.cab-bookings.destroy');

    // Admin Train Page
    Route::get('/trains', [TrainController::class, 'list'])->name('admin.trains');
    Route::get('/trains/create', [TrainController::class, 'create'])->name('admin.trains.create');
    Route::post('/trains', [TrainController::class, 'store'])->name('admin.trains.store');
    Route::get('/trains/{train}/edit', [TrainController::class, 'edit'])->name('admin.trains.edit');
    Route::put('/trains/{train}', [TrainController::class, 'update'])->name('admin.trains.update');
    Route::delete('/trains/{train}', [TrainController::class, 'destroy'])->name('admin.trains.destroy');

    // Admin Train Bookings
    Route::get('/train-bookings', [TrainBookingController::class, 'index'])->name('admin.train-bookings');
    Route::get('/train-bookings/{booking}', [TrainBookingController::class, 'show'])->name('admin.train-bookings.show');
    Route::put('/train-bookings/{booking}/confirm', [TrainBookingController::class, 'confirmBooking'])->name('admin.train-bookings.confirm');
    Route::put('/train-bookings/{booking}/cancel', [TrainBookingController::class, 'cancelBooking'])->name('admin.train-bookings.cancel');
    Route::delete('/train-bookings/{booking}', [TrainBookingController::class, 'destroy'])->name('admin.train-bookings.destroy');

    // Admin Flight Page
    Route::get('/flights', [FlightController::class, 'list'])->name('admin.flights');
    Route::get('/flights/create', [FlightController::class, 'create'])->name('admin.flights.create');
    Route::post('/flights', [FlightController::class, 'store'])->name('admin.flights.store');
    Route::get('/flights/{flight}/edit', [FlightController::class, 'edit'])->name('admin.flights.edit');
    Route::put('/flights/{flight}', [FlightController::class, 'update'])->name('admin.flights.update');
    Route::delete('/flights/{flight}', [FlightController::class, 'destroy'])->name('admin.flights.destroy');

    // Admin Flight Bookings
    Route::get('/flight-bookings', [FlightBookingController::class, 'index'])->name('admin.flight-bookings');
    Route::get('/flight-bookings/{booking}', [FlightBookingController::class, 'show'])->name('admin.flight-bookings.show');
    Route::put('/flight-bookings/{booking}/confirm', [FlightBookingController::class, 'confirmBooking'])->name('admin.flight-bookings.confirm');
    Route::put('/flight-bookings/{booking}/cancel', [FlightBookingController::class, 'cancelBooking'])->name('admin.flight-bookings.cancel');
    Route::delete('/flight-bookings/{booking}', [FlightBookingController::class, 'destroy'])->name('admin.flight-bookings.destroy');

    // Admin Guide Page
    Route::get('/guides', [GuideController::class, 'list'])->name('admin.guides');
    Route::get('/guides/create', [GuideController::class, 'create'])->name('admin.guides.create');
    Route::post('/guides', [GuideController::class, 'store'])->name('admin.guides.store');
    Route::get('/guides/{guide}/edit', [GuideController::class, 'edit'])->name('admin.guides.edit');
    Route::put('/guides/{guide}', [GuideController::class, 'update'])->name('admin.guides.update');
    Route::delete('/guides/{guide}', [GuideController::class, 'destroy'])->name('admin.guides.destroy');

    // Admin Guide Bookings
    Route::get('/guide-bookings', [GuideBookingController::class, 'index'])->name('admin.guide-bookings');
    Route::get('/guide-bookings/{booking}', [GuideBookingController::class, 'show'])->name('admin.guide-bookings.show');
    Route::put('/guide-bookings/{booking}/confirm', [GuideBookingController::class, 'confirmBooking'])->name('admin.guide-bookings.confirm');
    Route::put('/guide-bookings/{booking}/cancel', [GuideBookingController::class, 'cancelBooking'])->name('admin.guide-bookings.cancel');
    Route::delete('/guide-bookings/{booking}', [GuideBookingController::class, 'destroy'])->name('admin.guide-bookings.destroy');

    // Gallery Page
    Route::get('/gallery', [GalleryController::class, 'list'])->name('admin.gallery');
    Route::get('/gallery/create', [GalleryController::class, 'create'])->name('admin.gallery.create');
    Route::post('/gallery', [GalleryController::class, 'store'])->name('admin.gallery.store');
    Route::get('/gallery/{gallery}/edit', [GalleryController::class, 'edit'])->name('admin.gallery.edit');
    Route::put('/gallery/{gallery}', [GalleryController::class, 'update'])->name('admin.gallery.update');
    Route::delete('/gallery/{gallery}', [GalleryController::class, 'destroy'])->name('admin.gallery.destroy');

    // Reviews Page
    Route::get('/reviews', [ReviewController::class, 'list'])->name('admin.reviews');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('admin.reviews.destroy');

    // Contact Page
    Route::get('/contacts', [ContactController::class, 'list'])->name('admin.contacts');
    Route::get('/contacts/{contact}', [ContactController::class, 'show'])->name('admin.contacts.show');
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])->name('admin.contacts.destroy');
});


// User Routes
Route::middleware(UserMiddleware::class)->group(function () {
    // Home Page
    Route::get('/home', function () {
        return Inertia::render('User/Home'); 
    })->name('home');

    // Booking Page
    Route::get('/bookings', function () {
        return Inertia::render('User/Bookings/index');
    })->name('bookings');
    Route::get('/bookings/{booking}', function () {
        return Inertia::render('User/Bookings/show');
    })->name('bookings.show');

    // Destionations Page
    Route::get('/destinations', [DestinationController::class, 'index'])->name('destinations');
    Route::get('/destinations/{destination}', [DestinationController::class, 'show'])->name('destinations.show');

    // Packages Page
    Route::get('/packages', [PackageController::class, 'index'])->name('packages');
    Route::get('/packages/{package}', [PackageController::class, 'show'])->name('packages.show');
    Route::post('/packages/{package}/book', [PackageBookingController::class, 'store'])->name('packages.book');

    // Hotel Page
    Route::get('/hotels', [HotelController::class, 'index'])->name('hotels');
    Route::get('/hotels/{hotel}', [HotelController::class, 'show'])->name('hotels.show');
    Route::post('/hotels/{hotel}/book', [HotelBookingController::class, 'store'])->name('hotels.book');

    // Cabs Page
    Route::get('/cabs', [CabController::class, 'index'])->name('cabs');
    Route::get('/cabs/{cab}', [CabController::class, 'show'])->name('cabs.show');
    Route::post('/cabs/{cab}/book', [CabBookingController::class, 'store'])->name('cabs.book');

    // Train Page
    Route::get('/trains', [TrainController::class, 'index'])->name('trains');
    Route::get('/trains/{train}', [TrainController::class, 'show'])->name('trains.show');
    Route::post('/trains/{train}/book', [TrainBookingController::class, 'store'])->name('trains.book');

    // Flight Page
    Route::get('/flights', [FlightController::class, 'index'])->name('flights');
    Route::get('/flights/{flight}', [FlightController::class, 'show'])->name('flights.show');
    Route::post('/flights/{flight}/book', [FlightBookingController::class, 'store'])->name('flights.book');

    // Guide Page
    Route::get('/guides', [GuideController::class, 'index'])->name('guides');
    Route::get('/guides/{guide}', [GuideController::class, 'show'])->name('guides.show');
    Route::post('/guides/{guide}/book', [GuideBookingController::class, 'store'])->name('guides.book');

    // Gallery Page
    Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery');
    Route::post('/gallery', [GalleryController::class, 'store'])->name('gallery.store');
    Route::delete('/gallery/{gallery}', [GalleryController::class, 'destroy'])->name('gallery.destroy');

    // Contact Page
    Route::get('/contact', [ContactController::class, 'index'])->name('contact');
    Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

    // Reviews Page
    Route::get('/reviews', [ReviewController::class, 'index'])->name('reviews');
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::get('/reviews/{review}', [ReviewController::class, 'create'])->name('reviews.create');
    Route::post('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
});

require __DIR__.'/auth.php';