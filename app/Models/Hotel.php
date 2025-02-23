<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'address',
        'city',
        'country',
        'stars',
        'price_per_night',
        'amenities',
        'images',
    ];

    protected $casts = [
        'amenities' => 'array',
        'images' => 'array',
    ];
}
