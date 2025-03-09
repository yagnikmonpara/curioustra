<?php

namespace Database\Seeders;

use App\Models\Guide;
use Illuminate\Database\Seeder;
use Database\Factories\GuideFactory;

class GuideSeeder extends Seeder
{
    public function run()
    {
        Guide::factory()->count(20)->create();
    }
}