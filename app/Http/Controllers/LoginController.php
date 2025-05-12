<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\Data;


class LoginController extends Controller
{    
    /**
     * index
     *
     * @return void
     */
    public function index()
    {   
        request()->session()->regenerate();
        // Regenerate the CSRF token
        if (auth()->user()) {
            return redirect('/dashboard');
        }


        //dd(Hash::make('123'));
        return inertia('Auth/Login', [
            'csrf_token' => csrf_token(), // Pass the CSRF token to the Inertia view
        ]);
    }

    public function forgotPassword(){
        request()->session()->regenerate();
        return inertia('Auth/ForgotPassword', [
            'csrf_token' => csrf_token(),
        ]);
    }

    public function securityQuestion()
    {
        // Check if already answered
        $existingAnswer = Data::where('key', 'security_answer')
            ->where('user_id', Auth::id())
            ->first();
    
        if ($existingAnswer) {
            return redirect('/dashboard');
        }
    
        // Fetch questions (with user_id = null)
        $questions = Data::where('key', 'security_question')
            ->whereNull('user_id')
            ->pluck('value');
    
        return inertia('Auth/SecurityQuestion', [
            'questions' => $questions,
        ]);
    }


    public function storeSecurityAnswer(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
        ]);

        Data::create([
            'key' => 'security_answer',
            'value' => json_encode([
                'question' => $request->question,
                'answer' => $request->answer,
            ]),
            'user_id' => Auth::id(),
        ]);

        return redirect('/dashboard');
    }
    
    /**
     * store
     *
     * @param  mixed $request
     * @return void
     */
    public function login_process(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);
    
        $credentials = $request->only('username', 'password');
        $remember = $request->boolean('remember');
    
        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();
    
            $user = Auth::user();

            $clientIp = $request->ip();
        
            if (!empty($user->ip) && $user->ip !== $clientIp) {
                Auth::logout();
                return response()->json([
                    'errors' => [
                        'username' => 'forbidden',
                    ]
                ], 422);
            }
            $hasAnswer = Data::where('key', 'security_answer')
                ->where('user_id', auth()->id())
                ->exists();

            if (!$hasAnswer) {
                return redirect('/securityQuestion');
            }
    
            return redirect('/dashboard');
        }
    
        return response()->json([
            'errors' => [
                'username' => 'The provided credentials do not match our records.',
                'password' => 'The provided credentials do not match our records.',
            ]
        ], 422);
    }
    
    
    
    
    

    /**
     * destroy
     *
     * @return void
     */
    public function destroy()
    {
        auth()->logout();
        request()->session()->invalidate();
        
        return redirect()->route('login');
    }
    
}
