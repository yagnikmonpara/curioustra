<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Train extends Model
{
    use HasFactory;

    protected $fillable = [
        'train_name',
        'train_number',
        'departure_station',
        'arrival_station',
        'departure_time',
        'arrival_time',
        'total_seats',
        'price_per_seat',
        'class',
        'status',
    ];

    protected $casts = [
        'departure_time' => 'datetime',
        'arrival_time' => 'datetime',
    ];
}
