<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    use HasFactory;
    protected $table = 'classes';

    // Define fillable attributes
    protected $fillable = [
        'name',
    ];

    // Relationship: One SchoolClass can have many Users (students)
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
