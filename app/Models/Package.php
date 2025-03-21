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
        'highlights'
    ];
    protected $casts = [ // Cast JSON columns to arrays
        'images' => 'array',
        'amenities' => 'array',
        'highlights' => 'array'
    ];

    public static function boot()
    {
        parent::boot();
    
        static::saving(function ($package) {
            if (!preg_match('/^\d+D\/\d+N$/', $package->duration)) {
                throw new \Exception('Invalid duration format. Use format like "5D/4N"');
            }
        });
    }
}
