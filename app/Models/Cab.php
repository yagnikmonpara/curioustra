<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function bookings(): HasMany
    {
        return $this->hasMany(CabBooking::class);
    }

    public function isAvailableFor($pickupTime, $dropoffTime)
    {
        if ($this->status !== 'available') {
            return false;
        }

        return !$this->bookings()
            ->where(function($query) use ($pickupTime, $dropoffTime) {
                $query->whereBetween('pickup_time', [$pickupTime, $dropoffTime])
                        ->orWhereBetween('dropoff_time', [$pickupTime, $dropoffTime])
                        ->orWhere(function($q) use ($pickupTime, $dropoffTime) {
                            $q->where('pickup_time', '<', $pickupTime)
                                ->where('dropoff_time', '>', $dropoffTime);
                        });
            })
            ->whereIn('status', ['confirmed', 'in-progress'])
            ->exists();
    }
}
