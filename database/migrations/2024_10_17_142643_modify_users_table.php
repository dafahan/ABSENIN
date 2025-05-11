<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
public function up(): void
{
    // 1. Create classes first
    Schema::create('classes', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->timestamps();
    });

    // 2. Modify users table
    Schema::table('users', function (Blueprint $table) {
        $table->string('role')->default('user');
        $table->string('uid')->unique()->nullable();
        $table->string('gender')->nullable();
        $table->date('date_of_birth')->nullable();
        $table->text('contact_info')->nullable();
        $table->unsignedBigInteger('class_id')->nullable();
        $table->string('username')->unique();

        // Drop email and email_verified_at if they exist
        if (Schema::hasColumn('users', 'email')) {
            $table->dropColumn('email');
        }
        if (Schema::hasColumn('users', 'email_verified_at')) {
            $table->dropColumn('email_verified_at');
        }
    });

    // ✅ 3. Now add foreign key constraint after classes table exists
    Schema::table('users', function (Blueprint $table) {
        $table->foreign('class_id')->references('id')->on('classes')->nullOnDelete();
    });

    // 4. Seed admin
    DB::table('users')->insert([
        'username' => 'admin',
        'name' => 'admin',
        'password' => Hash::make('123'),
        'role' => 'admin',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // 5. Create data table
    Schema::create('data', function (Blueprint $table) {
        $table->id();
        $table->string('key');
        $table->string('value');
        $table->unsignedBigInteger('user_id')->nullable();
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });

    // 6. Create subjects table
    Schema::create('subjects', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->unsignedBigInteger('teacher_id');
        $table->unsignedBigInteger('class_id');
        $table->timestamps();

        $table->foreign('teacher_id')->references('id')->on('users')->cascadeOnDelete();
        $table->foreign('class_id')->references('id')->on('classes')->cascadeOnDelete();
    });

    // 7. Create general attendance
    Schema::create('attendances', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('student_id');
        $table->date('date');
        $table->enum('status', ['Present', 'Absent', 'Late', 'Excused']);
        $table->text('reason')->nullable();
        $table->unsignedBigInteger('recorded_by');
        $table->timestamps();

        $table->foreign('student_id')->references('id')->on('users')->cascadeOnDelete();
        $table->foreign('recorded_by')->references('id')->on('users')->cascadeOnDelete();
    });

    // 8. Subject-specific attendance
    Schema::create('subject_attendances', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('student_id');
        $table->unsignedBigInteger('subject_id');
        $table->date('date');
        $table->enum('status', ['Present', 'Absent', 'Late', 'Excused']);
        $table->text('reason')->nullable();
        $table->timestamps();

        $table->foreign('student_id')->references('id')->on('users')->cascadeOnDelete();
        $table->foreign('subject_id')->references('id')->on('subjects')->cascadeOnDelete();
    });
}


    public function down(): void
    {
        Schema::dropIfExists('subject_attendances');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('classes');

        Schema::table('data', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::dropIfExists('data');

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
            $table->dropColumn(['role', 'uid', 'gender', 'date_of_birth', 'contact_info', 'class_id', 'username']);

            $table->string('email')->unique()->nullable();
            $table->timestamp('email_verified_at')->nullable();
        });
    }
};
