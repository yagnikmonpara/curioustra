<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecentActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'activity',
        'timestamp'
    ];

    // Relationship to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}