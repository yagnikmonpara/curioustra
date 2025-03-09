<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GuideBooking>
 */
class GuideBookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::inRandomOrder()->first()->id,
            'guide_id' => \App\Models\Guide::inRandomOrder()->first()->id,
            'booking_date' => $this->faker->dateTimeBetween('now', '+1 year')->format('Y-m-d'),
            'booking_time' => $this->faker->time(),
            'duration_hours' => $this->faker->numberBetween(1, 8),
            'total_price' => $this->faker->randomFloat(2, 20, 500),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'in-progress', 'cancelled', 'completed']),
            'additional_info' => [
                'meeting_point' => $this->faker->address,
                'special_requests' => $this->faker->sentence,
                'group_size' => $this->faker->numberBetween(1, 10)
            ],
        ];
    }
}