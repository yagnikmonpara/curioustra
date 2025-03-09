<?php

namespace Database\Factories;

use App\Models\Guide;
use Illuminate\Database\Eloquent\Factories\Factory;

class GuideFactory extends Factory
{
    protected $model = Guide::class;

    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'bio' => $this->faker->paragraph,
            'specialization' => $this->faker->randomElement(['History', 'Nature', 'Adventure', 'Cultural']),
            'contact_number' => $this->faker->numerify('##########'),
            'email' => $this->faker->safeEmail,
            'profile_picture' => $this->faker->imageUrl(200, 200, 'people'),
            'languages' => implode(',', ['English', $this->faker->randomElement(['Spanish', 'French', 'German'])]),
        ];
    }
}