<?php

namespace Database\Seeders;

use App\Models\Hotel;
use Illuminate\Database\Seeder;
use Database\Factories\HotelFactory;

class HotelSeeder extends Seeder
{
    public function run()
    {
        Hotel::factory()->count(25)->create();
    }
}