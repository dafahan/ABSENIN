<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index()
    {
        $classes = SchoolClass::all();
        $users = User::where('role','admin')->get();
        return Inertia::render('Subject',["classes"=>$classes,"teacher"=>$users]);
    }


    public function api()
    {
        $subjects = Subject::with(['teacher', 'class'])->get();
        return response()->json($subjects);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'teacher_id' => 'required|exists:users,id',
            'class_id' => 'required|exists:classes,id',
        ]);

        $subject = Subject::create([
            'name' => $request->name,
            'class_id' => $request->class_id,
            'teacher_id' => $request->teacher_id,
            'schedule' => $request->schedule,
        ]);

        return response()->json($subject, 201);
    }

    public function show($id)
    {
        $subject = Subject::with(['teacher', 'class'])->findOrFail($id);
        return response()->json($subject);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'teacher_id' => 'required|exists:users,id',
            'class_id' => 'required|exists:classes,id',
        ]);

        $subject->update([
            'name' => $request->name,
            'class_id' => $request->class_id,
            'teacher_id' => $request->teacher_id,
            'schedule' => $request->schedule,
        ]);
        

        return response()->json($subject);
    }

    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return response()->json(['message' => 'Subject deleted successfully']);
    }
}
