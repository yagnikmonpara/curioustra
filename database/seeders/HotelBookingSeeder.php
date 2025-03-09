<?php

namespace Database\Seeders;

use App\Models\HotelBooking;
use Illuminate\Database\Seeder;

class HotelBookingSeeder extends Seeder
{
    public function run()
    {
        HotelBooking::factory()->count(50)->create();
    }
}