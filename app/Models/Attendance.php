<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'student_id',
        'date',
        'status',
        'reason',
        'recorded_by',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
