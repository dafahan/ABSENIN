<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Subject;
use App\Models\User;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SubjectAttendance;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;



class AttendanceController extends Controller
{
    public function index()
    {
        $classes = SchoolClass::all();
        $users = User::where('role','admin')->get();
        return Inertia::render('Attendance',["classes"=>$classes,"teacher"=>$users]);
    }

    public function api(Request $request)
    {
        $subjectId = $request->subject;
        $date = $request->date ?? now()->toDateString();
    
        // If subject is selected, fetch the subject and its class_id
        if ($subjectId) {
            $subject = Subject::with('class')->findOrFail($subjectId);
    
            // Only get students from the same class as the subject
            $students = User::where('role', 'user')
                ->where('class_id', $subject->class_id)
                ->get();
        } else {
            // If no subject selected, get all students
            $students = User::where('role', 'user')->get();
        }
    
        $data = $students->map(function ($student) use ($subjectId, $date) {
            if ($subjectId) {
                // Subject-specific attendance
                $attendance = SubjectAttendance::where('student_id', $student->id)
                    ->where('subject_id', $subjectId)
                    ->where('date', $date)
                    ->first();
    
                return [
                    'id' => $attendance?->id,
                    'student_name' => $student->name,
                    'student_id' => $student->id,
                    'subject' => $attendance?->subject?->name,
                    'subject_id' => $subjectId,
                    'status' => $attendance->status ?? null,
                    'reason' => $attendance->reason ?? null
                ];
            } else {
                // Daily attendance
                $attendance = Attendance::where('student_id', $student->id)
                    ->where('date', $date)
                    ->first();
    
                return [
                    'id' => $attendance?->id,
                    'student_name' => $student->name,
                    'student_id' => $student->id,
                    'subject' => null,
                    'subject_id' => null,
                    'status' => $attendance->status ?? null,
                    'reason' => $attendance->reason ?? null
                ];
            }
        });
    
        return response()->json($data);
    }
    


    public function update(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'status' => 'required|string',
            'reason' => 'nullable|string',
            'subject_id' => 'nullable|exists:subjects,id',
            'recorded_by' => 'nullable|exists:users,id',
        ]);
    
        $studentId = $validated['student_id'];
        $date = $validated['date'];
        $status = $validated['status'];
        $reason = $validated['reason'] ?? null;
        $subjectId = $validated['subject_id'] ?? null;
        $recordedBy = $validated['recorded_by'] ?? auth()->id();
    
        if ($subjectId) {
            // Subject-based attendance
            $attendance = \App\Models\SubjectAttendance::firstOrNew([
                'student_id' => $studentId,
                'subject_id' => $subjectId,
                'date' => $date,
            ]);
        } else {
            // Daily attendance
            $attendance = \App\Models\Attendance::firstOrNew([
                'student_id' => $studentId,
                'date' => $date,
            ]);
            $attendance->recorded_by = $recordedBy;
        }
    
        $attendance->status = $status;
        $attendance->reason = $reason;
        $attendance->save();
    
        return response()->json([
            'message' => 'Attendance saved successfully.',
            'data' => $attendance
        ]);
    }
    

    public function generateQr(Request $request)
    {
        $subjectId = $request->input('subject_id');
        $expiresAt = now()->addSeconds(15);
        $token = Str::random(40);

        Cache::put("qr:$token", [
            'subject_id' => $subjectId,
            'expires_at' => $expiresAt,
        ], $expiresAt);

        return response()->json([
            'token' => $token,
            'expires_at' => $expiresAt,
        ]);
    }

    public function markPresent(Request $request)
    {
        $token = $request->input('token');
        $studentId = auth()->id(); // or scan-based ID
        $data = Cache::get("qr:$token");

        if (!$data || now()->gt($data['expires_at'])) {
            return response()->json(['error' => 'QR expired or invalid'], 400);
        }

        $date = now()->toDateString();

        if ($data['subject_id']) {
            // Subject-based
            $attendance = SubjectAttendance::firstOrNew([
                'student_id' => $studentId,
                'subject_id' => $data['subject_id'],
                'date' => $date,
            ]);
        } else {
            // Daily
            $attendance = Attendance::firstOrNew([
                'student_id' => $studentId,
                'date' => $date,
            ]);
            $attendance->recorded_by = auth()->id();
        }

        $attendance->status = 'Present';
        $attendance->save();

        return response()->json(['message' => 'Marked present']);
    }

    public function scan()
    {

        return Inertia::render('ScanAttendance');
    }


}
