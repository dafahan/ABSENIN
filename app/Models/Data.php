<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Data extends Model
{
    protected $table = 'data';

    protected $fillable = [
        'key',
        'value',
        'user_id',
    ];

    public $timestamps = false; // since `data` table has no timestamps

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
