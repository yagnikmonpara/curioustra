<?php

namespace Database\Factories;

use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackageFactory extends Factory
{
    protected $model = Package::class;

    public function definition()
    {
        $destinations = [
            [
                'location' => 'Maldives',
                'country' => 'Maldives',
                'keywords' => ['beach', 'luxury', 'overwater-villa'],
                'activities' => ['Snorkeling', 'Sunset Cruise', 'Spa Treatments'],
                'climate' => 'tropical'
            ],
            [
                'location' => 'Swiss Alps',
                'country' => 'Switzerland',
                'keywords' => ['mountain', 'ski', 'chalet'],
                'activities' => ['Skiing', 'Snowboarding', 'Mountain Trekking'],
                'climate' => 'alpine'
            ],
            [
                'location' => 'Kyoto',
                'country' => 'Japan',
                'keywords' => ['temple', 'culture', 'sakura'],
                'activities' => ['Tea Ceremony', 'Temple Tours', 'Kaiseki Dining'],
                'climate' => 'temperate'
            ],
            [
                'location' => 'Santorini',
                'country' => 'Greece',
                'keywords' => ['island', 'sunset', 'architecture'],
                'activities' => ['Wine Tasting', 'Caldera Cruise', 'Archaeological Tours'],
                'climate' => 'mediterranean'
            ],
            [
                'location' => 'Queenstown',
                'country' => 'New Zealand',
                'keywords' => ['adventure', 'fiord', 'bungee'],
                'activities' => ['Bungee Jumping', 'Milford Sound Cruise', 'Hiking'],
                'climate' => 'oceanic'
            ]
        ];

        $destination = $this->faker->randomElement($destinations);
        $duration = $this->faker->randomElement(['4D/3N', '5D/4N', '7D/6N', '10D/9N']);
        $groupSize = $this->faker->randomElement([2, 4, 6, 8]);
        $price = $this->faker->numberBetween(1200, 5000);

        return [
            'title' => $this->generatePackageTitle($destination),
            'description' => $this->generateDescription($destination),
            'images' => $this->generateImages($destination['keywords']),
            'duration' => $duration,
            'pax' => $groupSize,
            'location' => $destination['location'],
            'country' => $destination['country'],
            'reviews' => $this->faker->numberBetween(50, 500),
            'rating' => $this->faker->randomFloat(1, 3.5, 5.0),
            'price' => round($price / 50) * 50, // Round to nearest 50
            'amenities' => $this->generateAmenities(),
            'highlights' => $destination['activities'],
        ];
    }

    private function generatePackageTitle($destination)
    {
        $adjectives = [
            'Luxury', 'Premium', 'Cultural', 'Adventure', 'Scenic',
            'Authentic', 'Exclusive', 'Discover', 'Explore', 'Ultimate'
        ];

        $types = [
            'Getaway', 'Experience', 'Escape', 'Retreat', 'Journey',
            'Expedition', 'Tour', 'Package', 'Adventure', 'Discovery'
        ];

        return sprintf("%s %s %s",
            $this->faker->randomElement($adjectives),
            $destination['location'],
            $this->faker->randomElement($types)
        );
    }

    private function generateDescription($destination)
    {
        return sprintf("Immerse yourself in the %s beauty of %s with our carefully curated package. Experience %s while enjoying %s accommodations. Package includes %s.",
            $destination['climate'],
            $destination['location'],
            implode(', ', array_slice($destination['activities'], 0, 2)),
            $this->faker->randomElement(['luxury', 'boutique', '4-star', '5-star']),
            implode(', ', $this->faker->randomElements([
                'daily breakfast', 'airport transfers', 'guided tours',
                'local transportation', 'travel insurance'
            ], 3))
        );
    }

    private function generateImages($keywords)
    {
        return [
            'https://source.unsplash.com/random/800x600/?' . implode(',', $keywords) . ',vacation',
            'https://source.unsplash.com/random/800x600/?' . implode(',', $keywords) . ',travel',
            'https://source.unsplash.com/random/800x600/?' . implode(',', $keywords) . ',hotel'
        ];
    }

    private function generateAmenities()
    {
        return $this->faker->randomElements([
            'Free WiFi',
            'Swimming Pool',
            'Airport Transfers',
            'Daily Housekeeping',
            '24/7 Concierge',
            'Spa Access',
            'Fitness Center',
            'Buffet Breakfast',
            'Tour Guide',
            'Travel Insurance'
        ], 5);
    }
}