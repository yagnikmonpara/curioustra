<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GuideBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'guide_id',
        'booking_date',
        'booking_time',
        'duration_hours',
        'total_price',
        'status',
        'additional_info',
    ];

    protected $casts = [
        'additional_info' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function guide()
    {
        return $this->belongsTo(Guide::class);
    }
}
