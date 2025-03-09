<?php

namespace Database\Seeders;

use App\Models\PackageBooking;
use Illuminate\Database\Seeder;

class PackageBookingSeeder extends Seeder
{
    public function run()
    {
        PackageBooking::factory()->count(50)->create();
    }
}