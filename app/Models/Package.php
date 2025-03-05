<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'images',
        'duration',
        'pax',
        'location',
        'country',
        'reviews',
        'rating',
        'price',
        'amenities',
        'highlights',
    ];
    protected $casts = [ // Cast JSON columns to arrays
        'images' => 'array',
    ];
}
