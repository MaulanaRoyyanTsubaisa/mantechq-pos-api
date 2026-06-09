<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlockedDatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Use direct DB approach to avoid any model issues
        \Illuminate\Support\Facades\DB::table('blocked_dates')->insert([
            [
                'date' => '2025-06-24', // A Tuesday
                'reason' => 'Staff Holiday',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'date' => '2025-06-25', // A Wednesday
                'reason' => 'Maintenance Day',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'date' => '2025-07-03', // A Thursday
                'reason' => 'Special Event',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
