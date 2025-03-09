<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GuideBooking;
use Database\Factories\GuideBookingFactory;

class GuideBookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GuideBooking::factory()->count(30)->create();
    }
}