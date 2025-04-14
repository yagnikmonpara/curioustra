<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

class Guide extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'bio',
        'specialization',
        'contact_number',
        'profile_picture',
        'languages',
        'location',
        'price_per_hour',
        'rating',
        'tours_completed',
        'status' // active/inactive
    ];

    protected $casts = [
        'languages' => 'array',
        'rating' => 'decimal:1',
    ];

    public function bookings(): HasMany
    {
        return $this->hasMany(GuideBooking::class);
    }

    // Add accessor for availability
    protected function isAvailable(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status === 'active'
        );
    }

    public function getAvailabilityForDate($date)
    {
        if ($this->status !== 'active') {
            return false;
        }

        $start = Carbon::parse($date)->startOfDay();
        $end = Carbon::parse($date)->endOfDay();

        return !$this->bookings()
            ->where(function ($query) use ($start, $end) {
                $query->whereBetween('start_time', [$start, $end])
                    ->orWhereBetween('end_time', [$start, $end])
                    ->orWhere(function ($q) use ($start, $end) {
                        $q->where('start_time', '<', $start)
                            ->where('end_time', '>', $end);
                    });
            })
            ->whereIn('status', ['confirmed', 'in-progress'])
            ->exists();
    }
}