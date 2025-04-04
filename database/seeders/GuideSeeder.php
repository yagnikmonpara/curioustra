<?php

namespace Database\Seeders;

use App\Models\Guide;
use Illuminate\Database\Seeder;

class GuideSeeder extends Seeder
{
    public function run()
    {
        $guides = [
            [
                'name' => 'Sneha Chatterjee',
                'bio' => 'An expert in Kolkata\'s rich literary and artistic heritage.',
                'specialization' => 'Literary & Art',
                'contact_number' => '9823456789',
                'email' => 'sneha.chatterjee@example.com',
                'profile_picture' => '/storage/guides/g1.jpeg',
                'languages' => 'Bengali,English,Hindi',
                'location' => 'Kolkata',
                'price_per_hour' => 1500.00,
                'rating' => 4.7,
                'tours_completed' => 62,
                'status' => 'active'
            ],
            [
                'name' => 'Rohan Saxena',
                'bio' => 'A river tour specialist with extensive knowledge of the Ganges.',
                'specialization' => 'River Tours',
                'contact_number' => '9832154789',
                'email' => 'rohan.saxena@example.com',
                'profile_picture' => '/storage/guides/b1.png',
                'languages' => 'Hindi,English',
                'location' => 'Varanasi',
                'price_per_hour' => 1700.50,
                'rating' => 4.9,
                'tours_completed' => 85,
                'status' => 'active'
            ],
            [
                'name' => 'Lavanya Krishnan',
                'bio' => 'A dedicated guide for South India\'s temple architecture.',
                'specialization' => 'Temple Architecture',
                'contact_number' => '9874123698',
                'email' => 'lavanya.krishnan@example.com',
                'profile_picture' => '/storage/guides/g2.jpeg',
                'languages' => 'Tamil,English,Hindi',
                'location' => 'Madurai',
                'price_per_hour' => 1850.00,
                'rating' => 4.8,
                'tours_completed' => 78,
                'status' => 'active'
            ],
            [
                'name' => 'Devendra Singh',
                'bio' => 'Specializes in royal palaces and forts across India.',
                'specialization' => 'Royal Heritage',
                'contact_number' => '9814752369',
                'email' => 'devendra.singh@example.com',
                'profile_picture' => '/storage/guides/b2.jpeg',
                'languages' => 'Hindi,English',
                'location' => 'Jaipur',
                'price_per_hour' => 2000.00,
                'rating' => 4.9,
                'tours_completed' => 92,
                'status' => 'active'
            ],
            [
                'name' => 'Farhan Qureshi',
                'bio' => 'A Mughal history expert with insights into India\'s Islamic heritage.',
                'specialization' => 'Mughal History',
                'contact_number' => '9856327410',
                'email' => 'farhan.qureshi@example.com',
                'profile_picture' => '/storage/guides/b3.jpg',
                'languages' => 'Urdu,English,Hindi',
                'location' => 'Delhi',
                'price_per_hour' => 1800.00,
                'rating' => 4.6,
                'tours_completed' => 67,
                'status' => 'active'
            ],
            [
                'name' => 'Rahul Sharma',
                'bio' => 'A historian with deep knowledge of India\'s past.',
                'specialization' => 'History',
                'contact_number' => '9876543210',
                'email' => 'rahul.sharma@example.com',
                'profile_picture' => '/storage/guides/b4.jpg',
                'languages' => 'Hindi,English',
                'location' => 'Delhi',
                'price_per_hour' => 1600.00,
                'rating' => 4.5,
                'tours_completed' => 55,
                'status' => 'active'
            ],
            [
                'name' => 'Priya Verma',
                'bio' => 'Loves trekking and exploring the beauty of nature.',
                'specialization' => 'Nature',
                'contact_number' => '9876512340',
                'email' => 'priya.verma@example.com',
                'profile_picture' => '/storage/guides/g3.jpeg',
                'languages' => 'Hindi,English,Bengali',
                'location' => 'Darjeeling',
                'price_per_hour' => 1450.00,
                'rating' => 4.7,
                'tours_completed' => 60,
                'status' => 'active'
            ],
            [
                'name' => 'Amit Patel',
                'bio' => 'An adventure expert providing thrilling experiences.',
                'specialization' => 'Adventure',
                'contact_number' => '9856741230',
                'email' => 'amit.patel@example.com',
                'profile_picture' => '/storage/guides/b5.jpg',
                'languages' => 'Gujarati,English,Hindi',
                'location' => 'Ahmedabad',
                'price_per_hour' => 1950.00,
                'rating' => 4.8,
                'tours_completed' => 73,
                'status' => 'active'
            ],
            [
                'name' => 'Neha Kapoor',
                'bio' => 'A cultural expert with vast knowledge of traditions.',
                'specialization' => 'Culture',
                'contact_number' => '9845123789',
                'email' => 'neha.kapoor@example.com',
                'profile_picture' => '/storage/guides/g4.jpeg',
                'languages' => 'Punjabi,Hindi,English',
                'location' => 'Amritsar',
                'price_per_hour' => 1750.00,
                'rating' => 4.6,
                'tours_completed' => 65,
                'status' => 'active'
            ],
            [
                'name' => 'Vikram Iyer',
                'bio' => 'Passionate about wildlife and photography.',
                'specialization' => 'Wildlife',
                'contact_number' => '9876123456',
                'email' => 'vikram.iyer@example.com',
                'profile_picture' => '/storage/guides/b6.jpg',
                'languages' => 'Tamil,English,Hindi',
                'location' => 'Chennai',
                'price_per_hour' => 1850.00,
                'rating' => 4.7,
                'tours_completed' => 70,
                'status' => 'active'
            ],
            [
                'name' => 'Sonia Reddy',
                'bio' => 'A nature lover specializing in eco-tourism.',
                'specialization' => 'Eco-Tourism',
                'contact_number' => '9865321478',
                'email' => 'sonia.reddy@example.com',
                'profile_picture' => '/storage/guides/g5.jpeg',
                'languages' => 'Telugu,English,Hindi',
                'location' => 'Hyderabad',
                'price_per_hour' => 1650.00,
                'rating' => 4.5,
                'tours_completed' => 58,
                'status' => 'active'
            ],
            [
                'name' => 'Arjun Mehta',
                'bio' => 'Expert in heritage walks and historical monuments.',
                'specialization' => 'Heritage',
                'contact_number' => '9845098765',
                'email' => 'arjun.mehta@example.com',
                'profile_picture' => '/storage/guides/b7.jpg',
                'languages' => 'Marathi,English,Hindi',
                'location' => 'Mumbai',
                'price_per_hour' => 1550.00,
                'rating' => 4.6,
                'tours_completed' => 63,
                'status' => 'active'
            ],
            [
                'name' => 'Riya Sen',
                'bio' => 'A wildlife expert with an interest in conservation.',
                'specialization' => 'Wildlife',
                'contact_number' => '9856473829',
                'email' => 'riya.sen@example.com',
                'profile_picture' => '/storage/guides/g6.jpg',
                'languages' => 'Bengali,English,Hindi',
                'location' => 'Sunderbans',
                'price_per_hour' => 1900.00,
                'rating' => 4.8,
                'tours_completed' => 77,
                'status' => 'active'
            ],
            [
                'name' => 'Krishna Das',
                'bio' => 'An experienced guide for spiritual and pilgrimage tours.',
                'specialization' => 'Spirituality',
                'contact_number' => '9876547890',
                'email' => 'krishna.das@example.com',
                'profile_picture' => '/storage/guides/g7.jpg',
                'languages' => 'Malayalam,English,Hindi',
                'location' => 'Varanasi',
                'price_per_hour' => 1600.00,
                'rating' => 4.7,
                'tours_completed' => 69,
                'status' => 'active'
            ],
            [
                'name' => 'Ananya Bose',
                'bio' => 'A food tour expert with extensive knowledge of Indian cuisine.',
                'specialization' => 'Food & Culinary',
                'contact_number' => '9856321789',
                'email' => 'ananya.bose@example.com',
                'profile_picture' => '/storage/guides/g8.jpg',
                'languages' => 'Bengali,English,Hindi',
                'location' => 'Kolkata',
                'price_per_hour' => 1750.00,
                'rating' => 4.9,
                'tours_completed' => 81,
                'status' => 'active'
            ],
            [
                'name' => 'Manoj Nair',
                'bio' => 'An expert in backwater tours and houseboat experiences.',
                'specialization' => 'Backwater Tours',
                'contact_number' => '9836547210',
                'email' => 'manoj.nair@example.com',
                'profile_picture' => '/storage/guides/b8.jpg',
                'languages' => 'Malayalam,English,Hindi',
                'location' => 'Alleppey',
                'price_per_hour' => 2000.00,
                'rating' => 4.8,
                'tours_completed' => 75,
                'status' => 'active'
            ],
            [
                'name' => 'Deepika Malhotra',
                'bio' => 'A shopping and fashion tour guide.',
                'specialization' => 'Shopping & Fashion',
                'contact_number' => '9812345678',
                'email' => 'deepika.malhotra@example.com',
                'profile_picture' => '/storage/guides/g9.jpg',
                'languages' => 'Punjabi,Hindi,English',
                'location' => 'Delhi',
                'price_per_hour' => 1850.00,
                'rating' => 4.6,
                'tours_completed' => 64,
                'status' => 'active'
            ],
            [
                'name' => 'Rajesh Thakur',
                'bio' => 'An expert in Himalayan treks and mountaineering.',
                'specialization' => 'Trekking',
                'contact_number' => '9874563210',
                'email' => 'rajesh.thakur@example.com',
                'profile_picture' => '/storage/guides/b9.jpeg',
                'languages' => 'Hindi,English,Nepali',
                'location' => 'Manali',
                'price_per_hour' => 2100.00,
                'rating' => 4.9,
                'tours_completed' => 88,
                'status' => 'active'
            ],
            [
                'name' => 'Meera Sinha',
                'bio' => 'A yoga and wellness retreat guide.',
                'specialization' => 'Wellness & Yoga',
                'contact_number' => '9873214560',
                'email' => 'meera.sinha@example.com',
                'profile_picture' => '/storage/guides/b10.jpeg',
                'languages' => 'Hindi,English',
                'location' => 'Rishikesh',
                'price_per_hour' => 1950.00,
                'rating' => 4.7,
                'tours_completed' => 72,
                'status' => 'active'
            ],
            [
                'name' => 'Karan Joshi',
                'bio' => 'Expert in desert safaris and Rajasthan tourism.',
                'specialization' => 'Desert Safari',
                'contact_number' => '9812567890',
                'email' => 'karan.joshi@example.com',
                'profile_picture' => '/storage/guides/b11.jpg',
                'languages' => 'Hindi,English,Marwari',
                'location' => 'Jaisalmer',
                'price_per_hour' => 2200.00,
                'rating' => 4.8,
                'tours_completed' => 93,
                'status' => 'active'
            ]
        ];

        foreach ($guides as $guide) {
            Guide::create($guide);
        }
    }
}