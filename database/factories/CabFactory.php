<?php

namespace Database\Factories;

use App\Models\Cab;
use Illuminate\Database\Eloquent\Factories\Factory;

class CabFactory extends Factory
{
    protected $model = Cab::class;

    public function definition()
    {
        return [
            'make' => $this->faker->randomElement(['Toyota', 'Honda', 'Hyundai']),
            'model' => $this->faker->word,
            'registration_number' => $this->faker->unique()->bothify('??##??##'),
            'driver_name' => $this->faker->name,
            'driver_contact_number' => $this->faker->numerify('##########'),
            'capacity' => $this->faker->numberBetween(4, 7),
            'price_per_km' => $this->faker->numberBetween(2, 5),
            'location' => $this->faker->city,
            'status' => $this->faker->randomElement(['available', 'booked', 'unavailable']),
            'images' => [$this->faker->imageUrl(800, 600, 'transport')],
        ];
    }
}