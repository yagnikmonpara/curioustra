<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuideBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'guide_id',
        'start_time',
        'end_time',
        'duration_hours',
        'number_of_people',
        'total_price',
        'status',
        'additional_info',
        'meeting_location'
    ];

    protected $dates = [
        'start_time',
        'end_time',
        'created_at',
        'updated_at'
    ];
    
    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'additional_info' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function guide(): BelongsTo
    {
        return $this->belongsTo(Guide::class);
    }

    // Add status transition methods
    public function canBeConfirmed(): bool
    {
        return $this->status === 'pending';
    }

    public function canStart(): bool
    {
        return $this->status === 'confirmed';
    }

    public function canBeCompleted(): bool
    {
        return $this->status === 'in-progress';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }
}