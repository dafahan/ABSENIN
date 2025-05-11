<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle($request, Closure $next, ...$roles)
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login')->withErrors(['access' => 'You must login first.']);
        }

        // Still check role first (for superadmin/admin guarding) 
        if (in_array($user->role, $roles)) {
            return $next($request);
        }

    }
}
