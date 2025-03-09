<?php

namespace Database\Seeders;

use App\Models\CabBooking;
use Illuminate\Database\Seeder;

class CabBookingSeeder extends Seeder
{
    public function run()
    {
        CabBooking::factory()->count(50)->create();
    }
}