<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlightBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'flight_id',
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

    public function flight()
    {
        return $this->belongsTo(Flight::class);
    }
}
