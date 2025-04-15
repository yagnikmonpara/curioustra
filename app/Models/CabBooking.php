<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CabBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cab_id',
        'pickup_location',
        'dropoff_location',
        'pickup_time',
        'dropoff_time',
        'distance_km',
        'rate_per_km',
        'total_price',
        'status',
        'additional_info',
    ];

    protected $dates = [
        'pickup_time',
        'dropoff_time',
        'created_at',
        'updated_at'
    ];
    protected $casts = [
        'pickup_time' => 'datetime',
        'dropoff_time' => 'datetime',
        'additional_info' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cab(): BelongsTo
    {
        return $this->belongsTo(Cab::class);
    }

    public function bookings()
    {
        return $this->hasMany(CabBooking::class);
    }
}
