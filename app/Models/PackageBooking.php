<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Package;
use App\Models\PackageBookingRefund;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PackageBooking extends Model
{
    use HasFactory;

    protected $casts = [
        'contact_info' => 'array', // Cast to array
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    protected $fillable = [
        'user_id',
        'package_id',
        'booking_date',
        'start_date',
        'end_date',
        'number_of_people',
        'total_price',
        'additional_notes',
        'status',
        'payment_status',
        'payment_id',
        'refund_id'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function refund()
    {
        return $this->hasOne(PackageBookingRefund::class);
    }
}
