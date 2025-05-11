<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Website;




class HomeController extends Controller
{
    public function index(){
        
        return Inertia::render('Home');
       
    }

    public function dashboard(){
        
        return Inertia::render('Dashboard');
       
    }
}
