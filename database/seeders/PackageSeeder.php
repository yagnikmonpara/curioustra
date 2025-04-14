<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Package;

class PackageSeeder extends Seeder
{
    public function run()
    {
        $packages = [
            [
                'title' => "Luxury Beach Resort Experience",
                'description' => "Indulge in a luxurious beach getaway with world-class amenities, pristine beaches, and unforgettable sunsets. Perfect for couples and families.",
                'images' => ["/storage/packages/packege-1.jpg"],
                'duration' => "5D/4N",
                'pax' => 4,
                'location' => "Maldives",
                'country' => "Maldives",
                'reviews' => 128,
                'rating' => 5,
                'price' => 1299,
                'amenities' => ["Spa Access", "Water Sports", "Gourmet Dining"],
                'highlights' => ["Private Beach", "Sunset Cruise", "Diving"]
            ],
            [
                'title' => "Amazon Rainforest Adventure",
                'description' => "Embark on an exciting journey through the Amazon rainforest. Experience wildlife, indigenous cultures, and breathtaking natural wonders.",
                'images' => ["/storage/packages/packege-2.jpg"],
                'duration' => "7D/6N",
                'pax' => 8,
                'location' => "Brazil",
                'country' => "Brazil",
                'reviews' => 95,
                'rating' => 4.8,
                'price' => 1599,
                'amenities' => ["Guided Tours", "Eco Lodge", "Local Cuisine"],
                'highlights' => ["Wildlife Safari", "Tribal Visit", "River Cruise"]
            ],
            [
                'title' => "Alpine Ski Adventure Package",
                'description' => "Experience the thrill of skiing in the majestic Alps. Perfect for both beginners and experienced skiers with professional instruction available.",
                'images' => ["/storage/packages/packege-3.jpg"],
                'duration' => "6D/5N",
                'pax' => 6,
                'location' => "Switzerland",
                'country' => "Switzerland",
                'reviews' => 156,
                'rating' => 4.9,
                'price' => 1899,
                'amenities' => ["Ski Equipment", "Spa Access", "Mountain View"],
                'highlights' => ["Ski Lessons", "Cable Car", "Snow Activities"]
            ],
            [
                'title' => "Cultural Heritage Tour",
                'description' => "Explore the rich history and culture of ancient civilizations. Visit iconic landmarks such as the Acropolis, the Parthenon, and the ancient ruins of Delphi.",
                'images' => ["/storage/packages/package-4.png"],
                'duration' => "8D/7N",
                'pax' => 10,
                'location' => "Greece",
                'country' => "Greece",
                'reviews' => 75,
                'rating' => 4.7,
                'price' => 1999,
                'amenities' => ["Guided Tours", "Cultural Experiences", "Local Cuisine"],
                'highlights' => ["Acropolis Visit", "Local Festivals", "Cooking Class"]
            ],
            [
                'title' => 'Safari Adventure in Kenya',
                'description' => 'Experience the thrill of the wild in the Masai Mara.',
                'images' => ["/storage/packages/Safari Adventure in Kenya.jpg"],
                'duration' => '6D/5N',
                'pax' => 4,
                'location' => 'Masai Mara',
                'country' => 'Kenya',
                'reviews' => 320,
                'rating' => 4.9,
                'price' => 2800.00,
                'amenities' => ['WiFi', 'All Meals', 'Game Drives', 'Safari Guide'],
                'highlights' => ['Big Five', 'Safari Lodges', 'Hot Air Balloon', 'Maasai Culture'],
            ],
            [
                'title' => 'Greek Island Hopping',
                'description' => 'Sail through the beautiful islands of Greece.',
                'images' => ["/storage/packages/Greek Island Hopping.jpg"],
                'duration' => '8D/7N',
                'pax' => 2,
                'location' => 'Santorini, Mykonos, Crete',
                'country' => 'Greece',
                'reviews' => 450,
                'rating' => 4.8,
                'price' => 3200.00,
                'amenities' => ['WiFi', 'Breakfast', 'Yacht Tours', 'Beach Access'],
                'highlights' => ['Blue Domes', 'White Sand Beaches', 'Sunset Views', 'Nightlife'],
            ],
            [
                'title' => 'Amazon Rainforest Expedition',
                'description' => 'Explore the untouched beauty of the Amazon jungle.',
                'images' => ["/storage/packages/Amazon Rainforest Expedition.jpg"],
                'duration' => '5D/4N',
                'pax' => 4,
                'location' => 'Amazon Basin',
                'country' => 'Brazil',
                'reviews' => 275,
                'rating' => 4.6,
                'price' => 2500.00,
                'amenities' => ['All Meals', 'Jungle Lodging', 'Guided Tours', 'Wildlife Sightings'],
                'highlights' => ['Rainforest Hiking', 'Boat Tours', 'Indigenous Culture', 'Wildlife'],
            ],
            [
                'title' => 'Northern Lights Experience',
                'description' => 'Witness the magical Aurora Borealis in Iceland.',
                'images' => ["/storage/packages/Northern Lights Experience.jpg"],
                'duration' => '4D/3N',
                'pax' => 2,
                'location' => 'Reykjavik',
                'country' => 'Iceland',
                'reviews' => 520,
                'rating' => 4.9,
                'price' => 2200.00,
                'amenities' => ['WiFi', 'Breakfast', 'Hot Springs', 'Guided Tours'],
                'highlights' => ['Aurora Borealis', 'Ice Caves', 'Hot Springs', 'Glacier Tours'],
            ],
            [
                'title' => 'Road Trip Across the USA',
                'description' => 'Experience the best of the United States on an epic road trip.',
                'images' => ["/storage/packages/Road Trip Across the USA.jpg"],
                'duration' => '14D/13N',
                'pax' => 4,
                'location' => 'Multiple Cities',
                'country' => 'USA',
                'reviews' => 600,
                'rating' => 4.7,
                'price' => 4500.00,
                'amenities' => ['WiFi', 'Car Rental', 'Hotel Stays', 'Park Passes'],
                'highlights' => ['Route 66', 'National Parks', 'Iconic Landmarks', 'Diverse Cities'],
            ],
            [
                'title' => 'Luxury Retreat in Bali',
                'description' => 'Relax in a luxury villa surrounded by nature in Bali.',
                'images' => ["/storage/packages/Luxury Retreat in Bali.jpg"],
                'duration' => '6D/5N',
                'pax' => 2,
                'location' => 'Ubud',
                'country' => 'Indonesia',
                'reviews' => 430,
                'rating' => 4.8,
                'price' => 2900.00,
                'amenities' => ['WiFi', 'Breakfast', 'Private Pool', 'Spa Treatments'],
                'highlights' => ['Rice Terraces', 'Yoga', 'Local Markets', 'Balinese Culture'],
            ],
            [
                'title' => 'Historic Tour of Egypt',
                'description' => 'Discover the wonders of ancient Egypt.',
                'images' => ["/storage/packages/Historic Tour of Egypt.jpg"],
                'duration' => '5D/4N',
                'pax' => 5,
                'location' => 'Cairo, Giza',
                'country' => 'Egypt',
                'reviews' => 380,
                'rating' => 4.7,
                'price' => 2600.00,
                'amenities' => ['WiFi', 'Breakfast', 'Guided Tours', 'Nile Cruise'],
                'highlights' => ['Pyramids', 'Sphinx', 'Ancient Temples', 'Nile River'],
            ],
            [
                'title' => 'Patagonia Adventure',
                'description' => 'Explore the rugged beauty of Patagonia.',
                'images' => ["/storage/packages/Patagonia Adventure.jpg"],
                'duration' => '7D/6N',
                'pax' => 4,
                'location' => 'Torres del Paine',
                'country' => 'Chile',
                'reviews' => 290,
                'rating' => 4.6,
                'price' => 3100.00,
                'amenities' => ['WiFi', 'Breakfast', 'Hiking Gear', 'Camping'],
                'highlights' => ['Glaciers', 'Trekking', 'Wildlife', 'Stunning Landscapes'],
            ],
            [
                'title' => 'Venice & Rome Escape',
                'description' => 'Experience the romance of Venice and the history of Rome.',
                'images' => ["/storage/packages/Venice & Rome Escape.jpg"],
                'duration' => '6D/5N',
                'pax' => 2,
                'location' => 'Venice, Rome',
                'country' => 'Italy',
                'reviews' => 480,
                'rating' => 4.8,
                'price' => 3200.00,
                'amenities' => ['WiFi', 'Breakfast', 'Guided Tours', 'Gondola Ride'],
                'highlights' => ['Colosseum', 'Vatican', 'Canals', 'Fine Dining'],
            ],
            [
                'title' => 'Machu Picchu Trek',
                'description' => 'Hike the legendary Inca Trail to Machu Picchu.',
                'images' => ["/storage/packages/Machu Picchu Trek.jpg"],
                'duration' => '5D/4N',
                'pax' => 3,
                'location' => 'Cusco',
                'country' => 'Peru',
                'reviews' => 350,
                'rating' => 4.9,
                'price' => 2700.00,
                'amenities' => ['All Meals', 'Camping', 'Trekking Guides', 'Permits'],
                'highlights' => ['Andes Mountains', 'Inca Ruins', 'Stunning Sunrises', 'Local Culture'],
            ],
            [
                'title' => 'Australian Outback Safari',
                'description' => 'Explore the vast landscapes and unique wildlife of Australia.',
                'images' => ["/storage/packages/Australian Outback Safari.jpg","/storage/packages/Australian Outback Safari1.jpg"],
                'duration' => '6D/5N',
                'pax' => 4,
                'location' => 'Uluru, Kakadu National Park',
                'country' => 'Australia',
                'reviews' => 400,
                'rating' => 4.7,
                'price' => 3300.00,
                'amenities' => ['WiFi', 'Camping Gear', 'Guided Tours', 'Wildlife Sightings'],
                'highlights' => ['Ayers Rock', 'Aboriginal Culture', 'Stargazing', 'Wildlife'],
            ],
            [
                'title' => 'Alaskan Cruise Adventure',
                'description' => 'Sail through the glaciers and wildlife of Alaska.',
                'images' => ["/storage/packages/Alaskan Cruise Adventure.jpg"],
                'duration' => '7D/6N',
                'pax' => 2,
                'location' => 'Inside Passage',
                'country' => 'USA',
                'reviews' => 450,
                'rating' => 4.8,
                'price' => 3800.00,
                'amenities' => ['WiFi', 'All Meals', 'Shore Excursions', 'Scenic Views'],
                'highlights' => ['Glaciers', 'Whale Watching', 'Northern Lights', 'Wildlife'],
            ],
            [
                'title' => 'Dubai Luxury Experience',
                'description' => 'Stay in luxury and experience the futuristic city of Dubai.',
                'images' => ["/storage/packages/Dubai Luxury Experience.jpg"],
                'duration' => '5D/4N',
                'pax' => 2,
                'location' => 'Dubai',
                'country' => 'UAE',
                'reviews' => 500,
                'rating' => 4.9,
                'price' => 4500.00,
                'amenities' => ['WiFi', 'Luxury Hotels', 'Private Tours', 'Desert Safari'],
                'highlights' => ['Burj Khalifa', 'Desert Safari', 'Luxury Shopping', 'Yacht Cruise'],
            ],
            [
                'title' => 'The Grand Canyon Expedition',
                'description' => 'Explore the breathtaking landscapes of the Grand Canyon.',
                'images' => ["/storage/packages/The Grand Canyon Expedition.jpg"],
                'duration' => '4D/3N',
                'pax' => 4,
                'location' => 'Arizona',
                'country' => 'USA',
                'reviews' => 320,
                'rating' => 4.7,
                'price' => 2200.00,
                'amenities' => ['WiFi', 'Camping', 'Hiking Gear', 'Guided Tours'],
                'highlights' => ['Hiking', 'Rafting', 'Scenic Views', 'Sunsets'],
            ],
            [
                'title' => 'Trans-Siberian Railway Journey',
                'description' => 'Embark on an epic journey across Russia.',
                'images' => ["/storage/packages/Trans-Siberian Railway Journey.jpg"],
                'duration' => '12D/11N',
                'pax' => 2,
                'location' => 'Moscow to Vladivostok',
                'country' => 'Russia',
                'reviews' => 280,
                'rating' => 4.6,
                'price' => 5000.00,
                'amenities' => ['WiFi', 'Train Cabin', 'Onboard Dining', 'Guided Excursions'],
                'highlights' => ['Scenic Train Rides', 'Cultural Experiences', 'Vast Landscapes'],
            ],
            [
                'title' => 'South African Wine & Safari Tour',
                'description' => 'Experience world-class wines and thrilling safaris.',
                'images' => ["/storage/packages/South African Wine & Safari Tour.jpg"],
                'duration' => '7D/6N',
                'pax' => 2,
                'location' => 'Cape Town, Kruger Park',
                'country' => 'South Africa',
                'reviews' => 420,
                'rating' => 4.8,
                'price' => 3400.00,
                'amenities' => ['WiFi', 'Wine Tastings', 'Safari Lodge', 'All Meals'],
                'highlights' => ['Big Five Safari', 'Vineyards', 'Scenic Views', 'Cultural Tours'],
            ],
            [
                'title' => 'Scandinavian Winter Wonderland',
                'description' => 'Experience the magic of winter in Scandinavia.',
                'images' => ["/storage/packages/Scandinavian Winter Wonderland.jpg"],
                'duration' => '6D/5N',
                'pax' => 2,
                'location' => 'Norway, Sweden, Finland',
                'country' => 'Multiple',
                'reviews' => 390,
                'rating' => 4.8,
                'price' => 3100.00,
                'amenities' => ['WiFi', 'Breakfast', 'Ice Hotels', 'Husky Sledding'],
                'highlights' => ['Northern Lights', 'Ice Hotels', 'Snow Adventures', 'Cozy Cabins'],
            ],
            [
                'title' => 'French Countryside Retreat',
                'description' => 'Relax in the charming villages of rural France.',
                'images' => ["/storage/packages/French Countryside Retreat.jpg"],
                'duration' => '5D/4N',
                'pax' => 2,
                'location' => 'Provence',
                'country' => 'France',
                'reviews' => 330,
                'rating' => 4.7,
                'price' => 2600.00,
                'amenities' => ['WiFi', 'Breakfast', 'Wine Tastings', 'Cycling'],
                'highlights' => ['Lavender Fields', 'Châteaux', 'Local Cuisine', 'Scenic Drives'],
            ],
            [
                'title' => 'Himalayan Trekking Expedition',
                'description' => 'Take on the adventure of trekking in the Himalayas.',
                'images' => ["/storage/packages/Himalayan Trekking Expedition.jpg"],
                'duration' => '10D/9N',
                'pax' => 6,
                'location' => 'Everest Base Camp',
                'country' => 'Nepal',
                'reviews' => 450,
                'rating' => 4.9,
                'price' => 2800.00,
                'amenities' => ['All Meals', 'Trekking Permits', 'Guide', 'Camping'],
                'highlights' => ['High Altitude Trekking', 'Snow Peaks', 'Local Culture', 'Adventure'],
            ],
            [
                'title' => 'The Great Wall of China Experience',
                'description' => 'Walk the legendary Great Wall of China.',
                'images' => ["/storage/packages/The Great Wall of China Experience.jpg"],
                'duration' => '3D/2N',
                'pax' => 4,
                'location' => 'Beijing',
                'country' => 'China',
                'reviews' => 350,
                'rating' => 4.7,
                'price' => 2000.00,
                'amenities' => ['WiFi', 'Breakfast', 'Guided Tours', 'Local Cuisine'],
                'highlights' => ['Great Wall Hiking', 'History', 'Scenic Views', 'Cultural Experience'],
            ],
            [
                'title' => 'Caribbean Cruise Adventure',
                'description' => 'Sail through the beautiful islands of the Caribbean.',
                'images' => ["/storage/packages/Caribbean Cruise Adventure.jpg"],
                'duration' => '8D/7N',
                'pax' => 2,
                'location' => 'Multiple Islands',
                'country' => 'Caribbean',
                'reviews' => 480,
                'rating' => 4.8,
                'price' => 3800.00,
                'amenities' => ['WiFi', 'All Meals', 'Shore Excursions', 'Beachfront Access'],
                'highlights' => ['Beaches', 'Snorkeling', 'Island Hopping', 'Luxury Cruise'],
            ],
            [
                'title' => 'Antarctic Expedition',
                'description' => 'Explore the untouched wilderness of Antarctica.',
                'images' => ["/storage/packages/Antarctic Expedition.jpg"],
                'duration' => '12D/11N',
                'pax' => 6,
                'location' => 'Antarctic Peninsula',
                'country' => 'Antarctica',
                'reviews' => 250,
                'rating' => 5.0,
                'price' => 7500.00,
                'amenities' => ['All Meals', 'Polar Gear', 'Icebreaker Ship', 'Guided Tours'],
                'highlights' => ['Penguins', 'Icebergs', 'Research Stations', 'Remote Adventure'],
            ],
            [
                'title' => 'Vietnamese Food & Culture Tour',
                'description' => 'Savor the flavors of Vietnam while exploring its rich culture.',
                'images' => ["/storage/packages/Vietnamese Food & Culture Tour.jpg"],
                'duration' => '5D/4N',
                'pax' => 2,
                'location' => 'Hanoi, Ho Chi Minh City',
                'country' => 'Vietnam',
                'reviews' => 410,
                'rating' => 4.8,
                'price' => 2400.00,
                'amenities' => ['WiFi', 'Breakfast', 'Cooking Classes', 'Street Food Tours'],
                'highlights' => ['Pho & Banh Mi', 'Cultural Sites', 'Local Markets', 'Motorbike Tours'],
            ],
            [
                'title' => 'New Zealand Adventure Trip',
                'description' => 'Experience breathtaking landscapes and thrilling adventures.',
                'images' => ["/storage/packages/New Zealand Adventure Trip.jpg","/storage/packages/New Zealand Adventure Trip1.jpg"],
                'duration' => '10D/9N',
                'pax' => 4,
                'location' => 'South Island',
                'country' => 'New Zealand',
                'reviews' => 450,
                'rating' => 4.9,
                'price' => 3800.00,
                'amenities' => ['WiFi', 'Breakfast', 'Hiking Gear', 'Adventure Tours'],
                'highlights' => ['Glaciers', 'Fjords', 'Bungee Jumping', 'Scenic Drives'],
            ]
        ];

        foreach ($packages as $package) {
            Package::create($package);
        }
    }
}