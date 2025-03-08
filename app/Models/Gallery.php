<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'caption',
        'user_id',
        'user_name',
    ];
    
    // Add relationship to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
