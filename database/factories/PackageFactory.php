<?php

namespace Database\Factories;

use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackageFactory extends Factory
{
    protected $model = Package::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(3),
            'images' => [
                $this->faker->imageUrl(800, 600, 'travel'),
                $this->faker->imageUrl(800, 600, 'travel')
            ],
            'duration' => $this->faker->randomElement(['3D/2N', '5D/4N', '7D/6N']),
            'pax' => $this->faker->numberBetween(1, 8),
            'location' => $this->faker->city,
            'country' => $this->faker->country,
            'reviews' => $this->faker->numberBetween(0, 1000),
            'rating' => $this->faker->randomFloat(1, 0, 5),
            'price' => $this->faker->numberBetween(500, 5000),
            'amenities' => implode(', ', $this->faker->words(4)), // Comma-separated string
            'highlights' => implode(', ', [ // Comma-separated string
                $this->faker->sentence(3),
                $this->faker->sentence(4),
                $this->faker->sentence(5)
            ]),
        ];
    }
}