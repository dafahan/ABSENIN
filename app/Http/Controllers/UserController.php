<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\SchoolClass;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UsersImport;

class UserController extends Controller
{
    // Display the list of users
    public function index()
    {
        $classes = SchoolClass::all();
        return Inertia::render('User', ['classes' => $classes]);
    }

    // API endpoint to fetch all users
    public function api()
    {
        $users = User::with('schoolClass')->get(); // Fetch users along with their classes
        return response()->json($users);
    }

    // Store a new user
    public function store(Request $request)
    {
        // Validation rules for storing user
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'uid' => 'nullable|string|max:255|unique:users',
            'gender' => 'nullable|string|max:10',
            'date_of_birth' => 'nullable|date',
            'contact_info' => 'nullable|string',
            'class_id' => 'nullable|exists:classes,id',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string',
        ]);

        // Creating the user
        $user = User::create([
            'name' => $request->name,
            'role' => $request->role,
            'uid' => $request->uid,
            'gender' => $request->gender,
            'date_of_birth' => $request->dateOfBirth,
            'contact_info' => $request->contactInfo,
            'class_id' => $request->classId,
            'username' => $request->username,
            'password' => bcrypt($request->password),
        ]);

        return response()->json($user, 201);
    }

    // Show a specific user by their ID
    public function show($id)
    {
        $user = User::with('schoolClass')->findOrFail($id); // Get user with their associated class
        return response()->json($user);
    }

    // Update an existing user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validation rules for updating user
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'uid' => 'nullable|string|max:255|unique:users,uid,' . $user->id,
            'gender' => 'nullable|string|max:10',
            'date_of_birth' => 'nullable|date',
            'contact_info' => 'nullable|string',
            'class_id' => 'nullable|exists:classes,id',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'password' => 'nullable|string',
        ]);

        // Update user information
        $user->update([
            'name' => $request->name,
            'role' => $request->role,
            'uid' => $request->uid,
            'gender' => $request->gender,
            'date_of_birth' => $request->date_of_dateOfBirthbirth,
            'contact_info' => $request->contactInfo,
            'class_id' => $request->classId,
            'username' => $request->username,
            'password' => $request->password ? bcrypt($request->password) : $user->password,
        ]);

        return response()->json($user);
    }

    // Delete a user
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,xls',
            'class_id' => 'required|exists:classes,id',
        ]);
    
        Excel::import(new UsersImport($request->class_id), $request->file('file'));
    
        return response()->json(['message' => 'Import successful']);
    }

}
