<?php

namespace Database\Seeders;

use App\Models\Guide;
use Illuminate\Database\Seeder;

class GuideSeeder extends Seeder
{
    public function run()
    {
        // Create 10 active guides
        Guide::factory()
            ->count(10)
            ->state(['status' => 'active'])
            ->create();

        // Create 5 inactive guides
        Guide::factory()
            ->count(5)
            ->state(['status' => 'inactive'])
            ->create();

        // Create 3 guides on leave
        Guide::factory()
            ->count(3)
            ->state(['status' => 'on_leave'])
            ->create();
    }

}