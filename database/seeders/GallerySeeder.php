<?php

namespace Database\Seeders;

use App\Models\Gallery;
use Illuminate\Database\Seeder;
use Database\Factories\GalleryFactory;

class GallerySeeder extends Seeder
{
    public function run()
    {
        Gallery::factory()->count(40)->create();
    }
}