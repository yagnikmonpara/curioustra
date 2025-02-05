<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Ensure Auth is imported
use Symfony\Component\HttpFoundation\Response;
use App\Http\Middleware\UserMiddleware;

class UserMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && Auth::user()->role === 'user') {
            return $next($request);
        }
        return redirect('/');
    }
}
