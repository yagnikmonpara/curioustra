<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'message',
        'timestamp',
        'user_id'
    ];

    // Relationship to User (if notifications are user-specific)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}