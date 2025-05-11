<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Attendance;



class HomeController extends Controller
{
    public function index(){
        
        return Inertia::render('Home');
       
    }

    public function dashboard(Request $request)
    {
        $date = $request->date ?? now()->toDateString();
    
        // Total Students
        $totalStudents = User::where('role', 'user')->count();
    
        // Total Teachers
        $totalTeachers = User::whereIn('role', ['admin', 'superadmin'])->count();
    
        // Today's Attendance Percentage
        $attendedToday = Attendance::where('date', $date)->where('status', 'Present')->count();
        $attendancePercentage = $totalStudents ? round(($attendedToday / $totalStudents) * 100, 2) : 0;
    
        // Recent Attendance
        $recentAttendance = Attendance::where('date', $date)->latest()->take(5)->get(); // Limit to 5 for recent
    
        return Inertia::render('Dashboard', [
            'totalStudents' => $totalStudents,
            'totalTeachers' => $totalTeachers,
            'attendancePercentage' => $attendancePercentage,
            'recentAttendance' => $recentAttendance,
        ]);
    }
    
}
