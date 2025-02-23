<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guide extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'bio',
        'specialization',
        'contact_number',
        'email',
        'profile_picture',
        'languages',
    ];

    protected $casts = [
        'languages' => 'array',
    ];
}
