<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notifications extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'message',
        'timestamp',
        'user_id'
    ];

    protected $dates = ['timestamp'];
    protected $appends = ['time_ago'];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTimeAgoAttribute()
    {
        return $this->timestamp->diffForHumans();
    }
}