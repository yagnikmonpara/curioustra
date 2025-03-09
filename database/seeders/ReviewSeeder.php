<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;
use Database\Factories\ReviewFactory;

class ReviewSeeder extends Seeder
{
    public function run()
    {
        Review::factory()->count(100)->create();
    }
}