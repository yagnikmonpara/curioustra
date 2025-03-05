<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cab extends Model
{
    use HasFactory;

    protected $fillable = [
        'make',
        'model',
        'registration_number',
        'driver_name',
        'driver_contact_number',
        'capacity',
        'price_per_km',
        'location',
        'status',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
    ];
}
