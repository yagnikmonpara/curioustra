<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Package extends Model
{
    use HasFactory;

    protected $casts = [ // Cast JSON columns to arrays
        'amenities' => 'array',
        'highlights' => 'array',
    ];
}
