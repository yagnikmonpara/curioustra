<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cab;

class CabSeeder extends Seeder
{
    public function run()
    {
        $cabs = [
            [
                'make' => 'Ford',
                'model' => 'Figo',
                'registration_number' => 'GJ15JK2345',
                'driver_name' => 'Nitin Malhotra',
                'driver_contact_number' => '8899223344',
                'capacity' => 4,
                'price_per_km' => 10.00,
                'location' => 'Surat',
                'status' => 'available',
                'images' => ['/storage/cabs/Figo1.jpeg', '/storage/cabs/Figo2.jpeg', '/storage/cabs/Figo3.jpeg'],
            ],
            [
                'make' => 'Kia',
                'model' => 'Sonet',
                'registration_number' => 'MH13CD5678',
                'driver_name' => 'Neha Sharma',
                'driver_contact_number' => '7766553322',
                'capacity' => 5,
                'price_per_km' => 13.00,
                'location' => 'Pune',
                'status' => 'available',
                'images' => ['/storage/cabs/sonet1.jpeg', '/storage/cabs/sonet2.jpeg', '/storage/cabs/sonet3.jpeg'],
            ],
            [
                'make' => 'Honda',
                'model' => 'City',
                'registration_number' => 'GJ12EF8901',
                'driver_name' => 'Siddharth Jain',
                'driver_contact_number' => '8822991144',
                'capacity' => 5,
                'price_per_km' => 14.00,
                'location' => 'Ahmedabad',
                'status' => 'available',
                'images' => ['/storage/cabs/Honda City 1.jpeg', '/storage/cabs/Honda City 2.jpeg', '/storage/cabs/Honda City 3.jpeg'],
            ],
            [
                'make' => 'Renault',
                'model' => 'Triber',
                'registration_number' => 'MH14GH3456',
                'driver_name' => 'Vikram Reddy',
                'driver_contact_number' => '7744112233',
                'capacity' => 7,
                'price_per_km' => 12.00,
                'location' => 'Nashik',
                'status' => 'available',
                'images' => ['/storage/cabs/Triber1.jpeg', '/storage/cabs/Triber2.jpeg', '/storage/cabs/Triber3.jpeg'],
            ],
            [
                'make' => 'Maruti',
                'model' => 'Swift Dzire',
                'registration_number' => 'GJ01AB1234',
                'driver_name' => 'Raj Patel',
                'driver_contact_number' => '9988776655',
                'capacity' => 4,
                'price_per_km' => 10.00,
                'location' => 'Ahmedabad',
                'status' => 'available',
                'images' => ['/storage/cabs/dzire1.jpeg', '/storage/cabs/dzire2.jpeg', '/storage/cabs/dzire3.jpeg'],
            ],
            [
                'make' => 'Ford',
                'model' => 'EcoSport',
                'registration_number' => 'MH04CD5678',
                'driver_name' => 'Sunil Sharma',
                'driver_contact_number' => '7766554433',
                'capacity' => 5,
                'price_per_km' => 12.00,
                'location' => 'Pune',
                'status' => 'available',
                'images' => ['/storage/cabs/ecosport1.jpeg', '/storage/cabs/ecosport2.jpeg', '/storage/cabs/ecosport3.jpeg'],
            ],
            [
                'make' => 'Volkswagen',
                'model' => 'Polo',
                'registration_number' => 'GJ02EF8901',
                'driver_name' => 'Ankit Mehta',
                'driver_contact_number' => '9988223355',
                'capacity' => 4,
                'price_per_km' => 13.00,
                'location' => 'Rajkot',
                'status' => 'available',
                'images' => ['/storage/cabs/polo1.jpeg', '/storage/cabs/polo2.jpeg', '/storage/cabs/polo3.jpeg'],
            ],
            [
                'make' => 'Mahindra',
                'model' => 'XUV500',
                'registration_number' => 'MH05GH2345',
                'driver_name' => 'Priya Gupta',
                'driver_contact_number' => '8855221144',
                'capacity' => 6,
                'price_per_km' => 16.00,
                'location' => 'Nagpur',
                'status' => 'available',
                'images' => ['/storage/cabs/xuv5001.jpeg', '/storage/cabs/xuv5002.jpeg', '/storage/cabs/xuv5003.jpeg'],
            ],
            [
                'make' => 'Chevrolet',
                'model' => 'Beat',
                'registration_number' => 'GJ03HI6789',
                'driver_name' => 'Vikas Kumar',
                'driver_contact_number' => '9900112233',
                'capacity' => 4,
                'price_per_km' => 9.00,
                'location' => 'Surendranagar',
                'status' => 'available',
                'images' => ['/storage/cabs/beat1.jpeg', '/storage/cabs/beat2.jpeg', '/storage/cabs/beat3.jpeg'],
            ],
            [
                'make' => 'Nissan',
                'model' => 'Micra',
                'registration_number' => 'MH06JK0123',
                'driver_name' => 'Arun Nair',
                'driver_contact_number' => '7711223344',
                'capacity' => 4,
                'price_per_km' => 11.00,
                'location' => 'Thane',
                'status' => 'available',
                'images' => ['/storage/cabs/micra1.jpeg', '/storage/cabs/micra2.jpeg', '/storage/cabs/micra3.jpeg'],
            ],
            [
                'make' => 'Renault',
                'model' => 'Duster',
                'registration_number' => 'GJ04LM4567',
                'driver_name' => 'Kavita Reddy',
                'driver_contact_number' => '8822113344',
                'capacity' => 5,
                'price_per_km' => 14.00,
                'location' => 'Bhavnagar',
                'status' => 'available',
                'images' => ['/storage/cabs/Duster1.jpeg', '/storage/cabs/Duster2.jpeg', '/storage/cabs/Duster3.jpeg'],
            ],
            [
                'make' => 'Hyundai',
                'model' => 'Aura',
                'registration_number' => 'GJ16AB3456',
                'driver_name' => 'Manoj Desai',
                'driver_contact_number' => '9988223377',
                'capacity' => 4,
                'price_per_km' => 10.00,
                'location' => 'Rajkot',
                'status' => 'available',
                'images' => ['/storage/cabs/Aura1.jpeg', '/storage/cabs/Aura2.jpeg', '/storage/cabs/Aura3.jpeg'],
            ],
            [
                'make' => 'Toyota',
                'model' => 'Etios',
                'registration_number' => 'MH18CD5678',
                'driver_name' => 'Swapnil Kulkarni',
                'driver_contact_number' => '8877445599',
                'capacity' => 5,
                'price_per_km' => 12.00,
                'location' => 'Mumbai',
                'status' => 'available',
                'images' => ['/storage/cabs/etios1.jpeg', '/storage/cabs/etios2.jpeg', '/storage/cabs/etios3.jpeg'],
            ],
            [
                'make' => 'Tata',
                'model' => 'Tiago',
                'registration_number' => 'GJ20EF8901',
                'driver_name' => 'Ravi Chawla',
                'driver_contact_number' => '7711224455',
                'capacity' => 5,
                'price_per_km' => 9.00,
                'location' => 'Ahmedabad',
                'status' => 'available',
                'images' => ['/storage/cabs/tiago1.jpeg', '/storage/cabs/tiago2.jpeg', '/storage/cabs/tiago3.jpeg'],
            ],
            [
                'make' => 'Honda',
                'model' => 'Jazz',
                'registration_number' => 'MH21GH1234',
                'driver_name' => 'Kiran Rathod',
                'driver_contact_number' => '7766443322',
                'capacity' => 4,
                'price_per_km' => 11.00,
                'location' => 'Pune',
                'status' => 'available',
                'images' => ['/storage/cabs/jass1.jpeg', '/storage/cabs/jass2.jpeg', '/storage/cabs/jass3.jpeg'],
            ],
            [
                'make' => 'Mahindra',
                'model' => 'Bolero',
                'registration_number' => 'GJ23JK4567',
                'driver_name' => 'Abhishek Tiwari',
                'driver_contact_number' => '8899776655',
                'capacity' => 7,
                'price_per_km' => 15.00,
                'location' => 'Surat',
                'status' => 'available',
                'images' => ['/storage/cabs/bolero1.jpeg', '/storage/cabs/bolero2.jpeg', '/storage/cabs/bolero3.jpeg'],
            ],
            [
                'make' => 'Volkswagen',
                'model' => 'Vento',
                'registration_number' => 'MH24LM7890',
                'driver_name' => 'Sameer Goyal',
                'driver_contact_number' => '9900223344',
                'capacity' => 5,
                'price_per_km' => 14.00,
                'location' => 'Nashik',
                'status' => 'available',
                'images' => ['/storage/cabs/Vento1.jpeg', '/storage/cabs/Vento2.jpeg', '/storage/cabs/Vento3.jpeg'],
            ],
            [
                'make' => 'Chevrolet',
                'model' => 'Tavera',
                'registration_number' => 'GJ25XY5678',
                'driver_name' => 'Piyush Gupta',
                'driver_contact_number' => '8822993377',
                'capacity' => 6,
                'price_per_km' => 13.00,
                'location' => 'Vadodara',
                'status' => 'available',
                'images' => ['/storage/cabs/tavera1.jpeg', '/storage/cabs/tavera2.jpeg', '/storage/cabs/tavera3.jpeg'],
            ],
            [
                'make' => 'Maruti',
                'model' => 'Ertiga',
                'registration_number' => 'GJ27AB3456',
                'driver_name' => 'Rohit Desai',
                'driver_contact_number' => '9988992244',
                'capacity' => 7,
                'price_per_km' => 15.00,
                'location' => 'Surat',
                'status' => 'available',
                'images' => ['/storage/cabs/ertiga1.jpeg', '/storage/cabs/ertiga2.jpeg', '/storage/cabs/ertiga3.jpeg'],
            ],
            [
                'make' => 'Toyota',
                'model' => 'Yaris',
                'registration_number' => 'MH28CD5678',
                'driver_name' => 'Varun Singh',
                'driver_contact_number' => '7766885599',
                'capacity' => 5,
                'price_per_km' => 12.00,
                'location' => 'Mumbai',
                'status' => 'available',
                'images' => ['/storage/cabs/yaris1.jpeg', '/storage/cabs/yaris2.jpeg', '/storage/cabs/yaris3.jpeg'],
            ],
            [
                'make' => 'Tata',
                'model' => 'Hexa',
                'registration_number' => 'GJ30EF7890',
                'driver_name' => 'Ajay Kapoor',
                'driver_contact_number' => '7711445566',
                'capacity' => 6,
                'price_per_km' => 16.00,
                'location' => 'Vadodara',
                'status' => 'available',
                'images' => ['/storage/cabs/hexa1.jpeg', '/storage/cabs/hexa2.jpeg', '/storage/cabs/hexa3.jpeg'],
            ],
            [
                'make' => 'Honda',
                'model' => 'WR-V',
                'registration_number' => 'MH32GH1234',
                'driver_name' => 'Nilesh Joshi',
                'driver_contact_number' => '7766332299',
                'capacity' => 5,
                'price_per_km' => 13.00,
                'location' => 'Nashik',
                'status' => 'available',
                'images' => ['/storage/cabs/wr-v1.jpeg', '/storage/cabs/wr-v2.jpeg', '/storage/cabs/wr-v3.jpeg'],
            ],
            [
                'make' => 'Mahindra',
                'model' => 'Scorpio',
                'registration_number' => 'GJ33JK4567',
                'driver_name' => 'Rajendra Tiwari',
                'driver_contact_number' => '8899771122',
                'capacity' => 7,
                'price_per_km' => 17.00,
                'location' => 'Rajkot',
                'status' => 'available',
                'images' => ['/storage/cabs/scorpio1.jpeg', '/storage/cabs/scorpio2.jpeg', '/storage/cabs/scorpio3.jpeg'],
            ],
        ];

        foreach ($cabs as $cab) {
            Cab::create($cab);
        }
    }
}