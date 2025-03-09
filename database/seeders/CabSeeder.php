<?php

namespace Database\Seeders;

use App\Models\Cab;
use Illuminate\Database\Seeder;
use Database\Factories\CabFactory;

class CabSeeder extends Seeder
{
    public function run()
    {
        Cab::factory()->count(15)->create();
    }
}