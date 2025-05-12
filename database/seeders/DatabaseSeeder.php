<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Data;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $questions = [
            'Siapa nama hewan peliharaan pertama Anda?',
            'Apa nama gadis ibu kandung Anda?',
            'Apa nama sekolah dasar Anda?',
            'Di kota mana Anda dilahirkan?',
            'Apa julukan Anda saat kecil?',
            'Apa buku favorit Anda?',
            'Apa pekerjaan impian Anda?',
            'Siapa nama tengah ayah Anda?',
            'Apa makanan favorit Anda?',
            'Siapa nama guru pertama Anda?',
            'Apa nama band favorit Anda?',
        ];
        
        foreach ($questions as $question) {
            Data::create([
                'key' => 'security_question',
                'value' => $question,
                'user_id' => null,
            ]);
        }
        //
    }
}
