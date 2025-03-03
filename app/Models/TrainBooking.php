<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TrainBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'train_id',
        'number_of_seats',
        'total_price',
        'seat_numbers',
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

    public function train()
    {
        return $this->belongsTo(Train::class);
    }
}
