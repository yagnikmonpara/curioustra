<?php

namespace Database\Factories;

use App\Models\Destination;
use Illuminate\Database\Eloquent\Factories\Factory;

class DestinationFactory extends Factory
{
    protected $model = Destination::class;

    public function definition()
    {
        return [
            'name' => $this->faker->city,
            'description' => $this->faker->paragraph(3),
            'location' => $this->faker->city,
            'country' => $this->faker->country,
            'rating' => $this->faker->numberBetween(1, 5),
            'images' => [
                $this->faker->imageUrl(800, 600, 'city'),
                $this->faker->imageUrl(800, 600, 'nature')
            ],
        ];
    }
}