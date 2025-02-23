<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $casts = [ // Cast JSON columns to arrays
        'amenities' => 'array',
        'highlights' => 'array',
    ];
}
