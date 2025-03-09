<?php

namespace Database\Factories;

use App\Models\Hotel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class HotelBookingFactory extends Factory
{
    public function definition()
    {

        return [
            'user_id' => User::factory(),
            'hotel_id' => Hotel::factory(),
            'booking_date' => $this->faker->date(),
            'check_in_date' => $this->faker->date('Y-m-d', '+1 month'),
            'check_out_date' => $this->faker->date('Y-m-d', '+2 weeks'),
            'number_of_guests' => $this->faker->numberBetween(1, 4),
            'total_price' => $this->faker->randomFloat(2, 100, 5000),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'cancelled']),
            'additional_info' => [
                'guest_names' => $this->faker->words(3, false),
                'special_requests' => $this->faker->optional(0.4)->sentence,
                'payment_method' => $this->faker->creditCardType
            ],
        ];
    }
}