<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

class FixStepsFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table('pages')->update([
            'steps_gallery_images' => DB::raw("CASE 
                WHEN JSON_VALID(steps_gallery_images) THEN steps_gallery_images 
                ELSE '[]' 
            END"),
            'steps_details' => DB::raw("CASE 
                WHEN JSON_VALID(steps_details) THEN steps_details 
                ELSE '[]' 
            END")
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // No rollback needed
    }
}
