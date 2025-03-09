<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;
use Database\Factories\PackageFactory;

class PackageSeeder extends Seeder
{
    public function run()
    {
        Package::factory()->count(30)->create();
    }
}