<?php

namespace Database\Factories;

use App\Models\Guide;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class GuideBookingFactory extends Factory
{
    public function definition()
    {
        $startTime = $this->faker->dateTimeBetween('now', '+1 month');
        $duration = $this->faker->numberBetween(1, 8);
        $guide = Guide::factory()->create();
        $paymentStatus = $this->faker->randomElement(['pending', 'paid', 'refunded']);
        
        return [
            'user_id' => User::factory(),
            'guide_id' => $guide->id,
            'start_time' => $startTime,
            'end_time' => Carbon::instance($startTime)->addHours($duration),
            'duration_hours' => $duration,
            'meeting_location' => $this->faker->city,
            'total_price' => $duration * $guide->price_per_hour,
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'completed', 'cancelled']),
            'payment_status' => $paymentStatus,
            'payment_method' => $paymentStatus === 'paid' ? $this->faker->randomElement(['razorpay', 'cash', 'card']) : null,
            'razorpay_order_id' => $paymentStatus === 'paid' ? 'order_'.uniqid() : null,
            'razorpay_payment_id' => $paymentStatus === 'paid' ? 'pay_'.uniqid() : null,
            'special_requests' => $this->faker->optional(0.4)->paragraph,
        ];
    }
}