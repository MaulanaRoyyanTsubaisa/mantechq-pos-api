<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // First, convert any existing string durations to integers
            DB::statement("
                UPDATE bookings 
                SET duration = REGEXP_REPLACE(duration, '[^0-9]', '') 
                WHERE duration REGEXP '[^0-9]'
            ");
            
            // Then change the column to integer if not already
            if (Schema::hasColumn('bookings', 'duration')) {
                // Modify the column to be integer
                $table->integer('duration')->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            //
        });
    }
};
