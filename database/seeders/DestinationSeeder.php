<?php

namespace Database\Seeders;

use App\Models\Destination;
use Illuminate\Database\Seeder;
use Database\Factories\DestinationFactory;

class DestinationSeeder extends Seeder
{
    public function run()
    {
        Destination::factory()->count(50)->create();
    }
}