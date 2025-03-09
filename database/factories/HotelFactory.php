<?php

namespace Database\Factories;

use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;

class HotelFactory extends Factory
{
    protected $model = Hotel::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company . ' Hotel',
            'description' => $this->faker->paragraph,
            'address' => $this->faker->streetAddress,
            'city' => $this->faker->city,
            'country' => $this->faker->country,
            'stars' => $this->faker->numberBetween(1, 5),
            'price_per_night' => $this->faker->numberBetween(50, 500),
            'amenities' => ['WiFi', 'Pool', 'Restaurant', 'Spa'],
            'images' => [
                $this->faker->imageUrl(800, 600, 'hotel'),
                $this->faker->imageUrl(800, 600, 'hotel')
            ],
        ];
    }
}