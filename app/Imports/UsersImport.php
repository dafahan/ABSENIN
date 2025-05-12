<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UsersImport implements ToModel, WithHeadingRow
{
    protected $classId;

    public function __construct($classId)
    {
        $this->classId = $classId;
    }

    public function model(array $row)
    {
        return new User([
            'name'     => $row['name'],
            'username' => $row['username'],
            'role'     => $row['role'],
            'class_id' => $this->classId,
            'password' => Hash::make($row['password'] ?? '123'),
        ]);
    }
}
