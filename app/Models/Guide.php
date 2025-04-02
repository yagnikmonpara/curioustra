<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guide extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'bio',
        'specialization',
        'contact_number',
        'email',
        'profile_picture',
        'languages',
        'price_per_hour',
        'status'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'languages' => 'array',
        'price_per_hour' => 'decimal:2'
    ];

    /**
     * Default attribute values.
     *
     * @var array
     */
    protected $attributes = [
        'status' => 'active',
        'price_per_hour' => 0
    ];

    /**
     * Get the bookings for the guide.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(GuideBooking::class);
    }

    /**
     * Check if guide is available on a specific date.
     *
     * @param string $date
     * @return bool
     */
    public function isAvailableOn($date): bool
    {
        return !$this->bookings()
            ->whereDate('start_time', $date)
            ->whereIn('status', ['confirmed', 'in-progress'])
            ->exists();
    }

    /**
     * Scope a query to only include available guides.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'active');
    }

    public function isAvailableBetween($start, $end)
{
    if ($this->status !== 'available') return false;

    return !$this->bookings()
        ->where(function($query) use ($start, $end) {
            $query->whereBetween('start_time', [$start, $end])
                  ->orWhereBetween('end_time', [$start, $end])
                  ->orWhere(function($q) use ($start, $end) {
                      $q->where('start_time', '<', $start)
                        ->where('end_time', '>', $end);
                  });
        })
        ->whereIn('status', ['confirmed', 'pending'])
        ->exists();
}
}