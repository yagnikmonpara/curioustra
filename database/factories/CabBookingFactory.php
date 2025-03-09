<?php

namespace Database\Factories;

use App\Models\Cab;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CabBookingFactory extends Factory
{
    public function definition()
    {
        $pickupTime = $this->faker->dateTimeBetween('now', '+1 month');
        $distance = $this->faker->numberBetween(5, 200);
        $cabRate = $this->faker->numberBetween(2, 5); // Per km rate

        return [
            'user_id' => User::factory(),
            'cab_id' => Cab::factory(),
            'pickup_location' => $this->faker->city,
            'dropoff_location' => $this->faker->city,
            'pickup_time' => $pickupTime,
            'distance_km' => $distance,
            'rate_per_km' => $cabRate,
            'total_price' => $distance * $cabRate,
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']),
            'additional_info' => [
                'payment_method' => $this->faker->creditCardType,
                'notes' => $this->faker->optional(0.3)->sentence,
                'luggage_count' => $this->faker->numberBetween(0, 4)
            ],
        ];
    }
}