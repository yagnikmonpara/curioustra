<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\GuideSeeder;
use Database\Seeders\CabSeeder;
use Database\Seeders\HotelSeeder;
use Database\Seeders\DestinationSeeder;
use Database\Seeders\PackageSeeder;
use Database\Seeders\ContactSeeder;
use Database\Seeders\GallerySeeder;
use Database\Seeders\ReviewSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {   
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'phone' => '1234567890',
            'password' => Hash::make('admin@123'),
            'role' => 'admin', // Ensure this line is present
        ]);
        User::factory(20)->create();
        $this->call([
            GuideSeeder::class,
            CabSeeder::class,
            HotelSeeder::class,
            DestinationSeeder::class,
            PackageSeeder::class,
            ContactSeeder::class,
            GallerySeeder::class,
            ReviewSeeder::class,
        ]);
    }
}
