<?php

namespace Database\Factories;

use App\Models\Guide;
use Illuminate\Database\Eloquent\Factories\Factory;

class GuideFactory extends Factory
{
    protected $model = Guide::class;

    public function definition()
    {
        $languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'];
        
        return [
            'name' => $this->faker->name,
            'bio' => $this->faker->paragraph(3),
            'specialization' => $this->faker->randomElement([
                'Historical Tours',
                'Adventure Tours',
                'Cultural Experiences',
                'Food Tours',
                'Nature Walks',
                'Architecture Tours'
            ]),
            'contact_number' => $this->faker->numerify('##########'),
            'email' => $this->faker->unique()->safeEmail,
            'profile_picture' => $this->faker->imageUrl(400, 400, 'people'),
            'languages' => json_encode($this->faker->randomElements($languages, $this->faker->numberBetween(1, 3))), // Store as JSON
            'price_per_hour' => $this->faker->numberBetween(500, 2000),
            'status' => $this->faker->randomElement(['active', 'inactive']), // Matches your default 'active'
        ];
    }
}