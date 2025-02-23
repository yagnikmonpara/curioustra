<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CabBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cab_id',
        'pickup_location',
        'dropoff_location',
        'pickup_time',
        'distance_km',
        'total_price',
        'status',
        'additional_info',
    ];

    protected $casts = [
        'pickup_time' => 'datetime',
        'additional_info' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cab()
    {
        return $this->belongsTo(Cab::class);
    }
}
