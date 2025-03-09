<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Seeder;
use Database\Factories\ContactFactory;

class ContactSeeder extends Seeder
{
    public function run()
    {
        Contact::factory()->count(50)->create();
    }
}