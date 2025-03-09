<?php

namespace Database\Factories;

use App\Models\Gallery;
use Illuminate\Database\Eloquent\Factories\Factory;

class GalleryFactory extends Factory
{
    protected $model = Gallery::class;

    public function definition()
    {
        return [
            'image' => $this->faker->imageUrl(800, 600, 'nature'),
            'caption' => $this->faker->sentence(6),
            'user_id' => \App\Models\User::factory(),
            'user_name' => $this->faker->userName,
        ];
    }
}