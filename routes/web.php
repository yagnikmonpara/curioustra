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

    // Admin Booking Page
    Route::resource('/admin/bookings', PackageBookingController::class)->except(['create', 'store', 'edit']);
    Route::put('/admin/bookings/{booking}/confirm', [PackageBookingController::class, 'confirmBooking'])->name('admin.bookings.confirm');
    Route::put('/admin/bookings/{booking}/cancel', [PackageBookingController::class, 'cancelBooking'])->name('admin.bookings.cancel');

    // Admin Destionations Page
    Route::get('/admin/destinations', [DestinationController::class, 'list'])->name('admin.destinations');
    Route::get('/admin/destinations/create', [DestinationController::class, 'create'])->name('admin.destinations.create');
    Route::post('/admin/destinations', [DestinationController::class, 'store'])->name('admin.destinations.store');
    Route::get('/admin/destinations/{destination}/edit', [DestinationController::class, 'edit'])->name('admin.destinations.edit');
    Route::put('/admin/destinations/{destination}', [DestinationController::class, 'update'])->name('admin.destinations.update');
    Route::delete('/admin/destinations/{destination}', [DestinationController::class, 'destroy'])->name('admin.destinations.destroy');

    // Packages Page
    Route::get('/admin/packages', [PackageController::class, 'list'])->name('admin.packages');
    Route::get('/admin/packages/create', [PackageController::class, 'create'])->name('admin.packages.create');
    Route::post('/admin/packages', [PackageController::class, 'store'])->name('admin.packages.store');
    Route::get('/admin/packages/{package}/edit', [PackageController::class, 'edit'])->name('admin.packages.edit');
    Route::put('/admin/packages/{package}', [PackageController::class, 'update'])->name('admin.packages.update');
    Route::delete('/admin/packages/{package}', [PackageController::class, 'destroy'])->name('admin.packages.destroy');

    // Admin Package Bookings
    Route::get('/admin/package-bookings', [PackageBookingController::class, 'index'])->name('admin.package-bookings');
    Route::put('/admin/package-bookings/{booking}/confirm', [PackageBookingController::class, 'confirmBooking'])->name('admin.package-bookings.confirm');
    Route::put('/admin/package-bookings/{booking}/cancel', [PackageBookingController::class, 'cancelBooking'])->name('admin.package-bookings.cancel');

    // Admin Hotel Page
    Route::get('/admin/hotels', [HotelController::class, 'list'])->name('admin.hotels');
    Route::get('/admin/hotels/create', [HotelController::class, 'create'])->name('admin.hotels.create');
    Route::post('/admin/hotels', [HotelController::class, 'store'])->name('admin.hotels.store');
    Route::get('/admin/hotels/{hotel}/edit', [HotelController::class, 'edit'])->name('admin.hotels.edit');
    Route::put('/admin/hotels/{hotel}', [HotelController::class, 'update'])->name('admin.hotels.update');
    Route::delete('/admin/hotels/{hotel}', [HotelController::class, 'destroy'])->name('admin.hotels.destroy');

    // Admin Hotel Bookings
    Route::get('/admin/hotel-bookings', [HotelBookingController::class, 'index'])->name('admin.hotel-bookings');
    Route::put('/admin/hotel-bookings/{booking}/confirm', [HotelBookingController::class, 'confirmBooking'])->name('admin.hotel-bookings.confirm');
    Route::put('/admin/hotel-bookings/{booking}/cancel', [HotelBookingController::class, 'cancelBooking'])->name('admin.hotel-bookings.cancel');

    // Admin Cabs Page
    Route::get('/admin/cabs', [CabController::class, 'list'])->name('admin.cabs');
    Route::get('/admin/cabs/create', [CabController::class, 'create'])->name('admin.cabs.create');
    Route::post('/admin/cabs', [CabController::class, 'store'])->name('admin.cabs.store');
    Route::get('/admin/cabs/{cab}/edit', [CabController::class, 'edit'])->name('admin.cabs.edit');
    Route::put('/admin/cabs/{cab}', [CabController::class, 'update'])->name('admin.cabs.update');
    Route::delete('/admin/cabs/{cab}', [CabController::class, 'destroy'])->name('admin.cabs.destroy');

    //Admin Cab Bookings
    Route::get('/admin/cab-bookings', [CabBookingController::class, 'index'])->name('admin.cab-bookings');
    Route::put('/admin/cab-bookings/{booking}/confirm', [CabBookingController::class, 'confirmBooking'])->name('admin.cab-bookings.confirm');
    Route::put('/admin/cab-bookings/{booking}/cancel', [CabBookingController::class, 'cancelBooking'])->name('admin.cab-bookings.cancel');

    // Admin Train Page
    Route::get('/admin/trains', [TrainController::class, 'list'])->name('admin.trains');
    Route::get('/admin/trains/create', [TrainController::class, 'create'])->name('admin.trains.create');
    Route::post('/admin/trains', [TrainController::class, 'store'])->name('admin.trains.store');
    Route::get('/admin/trains/{train}/edit', [TrainController::class, 'edit'])->name('admin.trains.edit');
    Route::put('/admin/trains/{train}', [TrainController::class, 'update'])->name('admin.trains.update');
    Route::delete('/admin/trains/{train}', [TrainController::class, 'destroy'])->name('admin.trains.destroy');

    // Admin Train Bookings
    Route::get('/admin/train-bookings', [TrainBookingController::class, 'index'])->name('admin.train-bookings');
    Route::put('/admin/train-bookings/{booking}/confirm', [TrainBookingController::class, 'confirmBooking'])->name('admin.train-bookings.confirm');
    Route::put('/admin/train-bookings/{booking}/cancel', [TrainBookingController::class, 'cancelBooking'])->name('admin.train-bookings.cancel');

    // Admin Flight Page
    Route::get('/admin/flights', [FlightController::class, 'list'])->name('admin.flights');
    Route::get('/admin/flights/create', [FlightController::class, 'create'])->name('admin.flights.create');
    Route::post('/admin/flights', [FlightController::class, 'store'])->name('admin.flights.store');
    Route::get('/admin/flights/{flight}/edit', [FlightController::class, 'edit'])->name('admin.flights.edit');
    Route::put('/admin/flights/{flight}', [FlightController::class, 'update'])->name('admin.flights.update');
    Route::delete('/admin/flights/{flight}', [FlightController::class, 'destroy'])->name('admin.flights.destroy');

    //Admin Flight Bookings
    Route::get('/admin/flight-bookings', [FlightBookingController::class, 'index'])->name('admin.flight-bookings');
    Route::put('/admin/flight-bookings/{booking}/confirm', [FlightBookingController::class, 'confirmBooking'])->name('admin.flight-bookings.confirm');
    Route::put('/admin/flight-bookings/{booking}/cancel', [FlightBookingController::class, 'cancelBooking'])->name('admin.flight-bookings.cancel');

    // Admin Guide Page
    Route::get('/admin/guides', [GuideController::class, 'list'])->name('admin.guides');
    Route::get('/admin/guides/create', [GuideController::class, 'create'])->name('admin.guides.create');
    Route::post('/admin/guides', [GuideController::class, 'store'])->name('admin.guides.store');
    Route::get('/admin/guides/{guide}/edit', [GuideController::class, 'edit'])->name('admin.guides.edit');
    Route::put('/admin/guides/{guide}', [GuideController::class, 'update'])->name('admin.guides.update');
    Route::delete('/admin/guides/{guide}', [GuideController::class, 'destroy'])->name('admin.guides.destroy');

    // Admin Guide Bookings
    Route::get('/admin/guide-bookings', [GuideBookingController::class, 'index'])->name('admin.guide-bookings');
    Route::put('/admin/guide-bookings/{booking}/confirm', [GuideBookingController::class, 'confirmBooking'])->name('admin.guide-bookings.confirm');
    Route::put('/admin/guide-bookings/{booking}/cancel', [GuideBookingController::class, 'cancelBooking'])->name('admin.guide-bookings.cancel');

    // Gallery Page
    Route::get('/admin/galleries', [GalleryController::class, 'list'])->name('admin.galleries');
    Route::get('/admin/galleries/create', [GalleryController::class, 'create'])->name('admin.galleries.create');
    Route::post('/admin/galleries', [GalleryController::class, 'store'])->name('admin.galleries.store');
    Route::get('/admin/galleries/{gallery}/edit', [GalleryController::class, 'edit'])->name('admin.galleries.edit');
    Route::put('/admin/galleries/{gallery}', [GalleryController::class, 'update'])->name('admin.galleries.update');
    Route::delete('/admin/galleries/{gallery}', [GalleryController::class, 'destroy'])->name('admin.galleries.destroy');

    // Reviews Page
    Route::get('/admin/reviews', [ReviewController::class, 'list'])->name('admin.reviews');
    Route::delete('/admin/reviews/{review}', [ReviewController::class, 'destroy'])->name('admin.reviews.destroy');

    // Contact Page
    Route::get('/admin/contacts', [ContactController::class, 'list'])->name('admin.contacts');
    Route::get('/admin/contacts/{contact}', [ContactController::class, 'show'])->name('admin.contacts.show');
    Route::delete('/admin/contacts/{contact}', [ContactController::class, 'destroy'])->name('admin.contacts.destroy');
});

Route::middleware(UserMiddleware::class)->group(function () {
    // Home Page
    Route::get('/home', function () {
        return Inertia::render('User/Home'); 
    })->name('home');

    // Booking Page
    Route::get('/bookings', [PackageBookingController::class, 'index'])->name('bookings');
    Route::get('/bookings/{booking}', [PackageBookingController::class, 'show'])->name('bookings.show');

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