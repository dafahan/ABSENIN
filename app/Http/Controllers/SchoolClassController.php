<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SchoolClassController extends Controller
{
    public function index()
    {
        return Inertia::render('Class');

    }
    public function api()
    {
        $classes = SchoolClass::all();
        return response()->json($classes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $class = SchoolClass::create([
            'name' => $request->name,
        ]);

        return response()->json($class, 201);
    }

    public function show($id)
    {
        $class = SchoolClass::findOrFail($id);
        return response()->json($class);
    }

    public function update(Request $request, $id)
    {
        $class = SchoolClass::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $class->update([
            'name' => $request->name,
        ]);

        return response()->json($class);
    }

    public function destroy($id)
    {
        $class = SchoolClass::findOrFail($id);
        $class->delete();

        return response()->json(['message' => 'Class deleted successfully']);
    }
}
