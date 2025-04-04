<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guide extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'specialization',
        'bio',
        'languages',
        'experience',
        'location',
        'price_per_hour',
        'availability_status',
        'profile_picture',
        'rating',
        'tours_completed',
        'contact_number',
        'max_capacity',
    ];

    protected $casts = [
        'languages' => 'array',
        'rating' => 'decimal:1',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(GuideBooking::class);
    }

    public function isAvailableFor($startTime, $endTime)
    {
        if ($this->availability_status !== 'available') {
            return false;
        }

        return !$this->bookings()
            ->where(function($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                      ->orWhereBetween('end_time', [$startTime, $endTime])
                      ->orWhere(function($q) use ($startTime, $endTime) {
                          $q->where('start_time', '<', $startTime)
                            ->where('end_time', '>', $endTime);
                      });
            })
            ->whereIn('status', ['confirmed', 'in-progress'])
            ->exists();
    }
}