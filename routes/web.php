<?php

// routes/web.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController; 
use App\Http\Controllers\UserController; 
use App\Http\Controllers\SchoolClassController; 
use App\Http\Controllers\AttendanceController; 
use App\Http\Controllers\SubjectController; 
use App\Http\Controllers\HomeController; 
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\Authenticate;

// Route for displaying the login form
Route::post('/login', [LoginController::class, 'login_process']);
Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::get('/logout', [LoginController::class, 'destroy'])->middleware('auth');
Route::get('/', [HomeController::class, 'index']); 



Route::middleware(['auth'])->group(function () {

    Route::resource('classes', SchoolClassController::class);
    Route::resource('subject', SubjectController::class);
    Route::get('dashboard', [HomeController::class,'dashboard']);
    Route::get('scan', [AttendanceController::class,'scan']);   
    Route::prefix('api')->group(function () {
        Route::get('/classes', [SchoolClassController::class, 'api']);
        Route::get('/subject', [SubjectController::class, 'api']);
        Route::post('/attendance/scan', [AttendanceController::class, 'markPresent']);

    });

});

Route::middleware(['auth', RoleMiddleware::class.':admin,superadmin'])->group(function () {
    Route::resource('users', UserController::class);
    Route::resource('attendance', AttendanceController::class);

    Route::prefix('api')->group(function () {
        Route::get('/users', [UserController::class, 'api']);
        Route::get('/attendance', [AttendanceController::class, 'api']);
        Route::post('/attendance/qr', [AttendanceController::class, 'generateQr']);

    });
});	
