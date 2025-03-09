<?php

namespace Database\Factories;

use App\Models\Package;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackageBookingFactory extends Factory
{
    public function definition()
    {
        $startDate = $this->faker->dateTimeBetween('now', '+1 month');
        $endDate = $this->faker->dateTimeBetween($startDate, '+2 months');

        return [
            'user_id' => User::factory(),
            'package_id' => Package::factory(),
            'booking_date' => now()->format('Y-m-d'),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'number_of_people' => $this->faker->numberBetween(1, 10),
            'total_price' => $this->faker->randomFloat(2, 500, 5000),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'in-progress', 'cancelled', 'completed']),
            'additional_notes' => $this->faker->optional(0.3)->sentence,
        ];
    }
}