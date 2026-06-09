<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Direct SQL approach to fix steps_gallery_images and steps_details
        // This is simpler and avoids schema changes that might be causing the issue
        
        // Initialize NULL values as empty arrays
        DB::statement("UPDATE pages SET steps_gallery_images = '[]' WHERE steps_gallery_images IS NULL");
        DB::statement("UPDATE pages SET steps_details = '[]' WHERE steps_details IS NULL");
        
        // Convert empty strings to empty arrays
        DB::statement("UPDATE pages SET steps_gallery_images = '[]' WHERE steps_gallery_images = ''");
        DB::statement("UPDATE pages SET steps_details = '[]' WHERE steps_details = ''");
        
        // Convert empty objects to empty arrays
        DB::statement("UPDATE pages SET steps_gallery_images = '[]' WHERE steps_gallery_images = '{}'");
        DB::statement("UPDATE pages SET steps_details = '[]' WHERE steps_details = '{}'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need for down migration since we're just fixing data
    }
};
