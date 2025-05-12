<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class ForgotPasswordController extends Controller
{
    public function getQuestion($username)
    {
        $user = \App\Models\User::where('username', $username)->first();
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $data = \App\Models\Data::where('user_id', $user->id)
            ->where('key', 'security_answer')
            ->first();

        if (!$data) {
            return response()->json(['message' => 'Pertanyaan keamanan belum diatur'], 404);
        }

        return response()->json(['question' => json_decode($data->value)->question]);
    }

    public function verifyAnswer(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'answer' => 'required|string',
        ]);

        $user = \App\Models\User::where('username', $request->username)->first();
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $data = \App\Models\Data::where('user_id', $user->id)
            ->where('key', 'security_answer')
            ->first();

        if (!$data) {
            return response()->json(['message' => 'Pertanyaan keamanan tidak ditemukan'], 404);
        }

        $stored = json_decode($data->value);
        request()->session()->regenerate();


        if (strtolower($stored->answer) !== strtolower($request->answer)) {
            return response()->json(['message' => 'Jawaban salah'], 401);
        }
        request()->session()->regenerate();


        return response()->json(['success' => true,'csrf' => csrf_token()]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);
    
        $user = \App\Models\User::where('username', $request->username)->first();
    
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }
    
        $user->password = Hash::make($request->password);
        $user->save();
    
        return response()->json(['message' => 'Password berhasil direset'], 200);
    }

}
