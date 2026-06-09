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
        Schema::table('pages', function (Blueprint $table) {
            // Make sure steps_gallery_images is JSON
            if (Schema::hasColumn('pages', 'steps_gallery_images')) {
                $table->json('steps_gallery_images')->nullable()->change();
            } else {
                $table->json('steps_gallery_images')->nullable();
            }

            // Make sure steps_details is JSON
            if (Schema::hasColumn('pages', 'steps_details')) {
                $table->json('steps_details')->nullable()->change();
            } else {
                $table->json('steps_details')->nullable();
            }
        });
        
        // Initialize the steps_gallery_images and steps_details as empty arrays if they're NULL
        DB::table('pages')->whereNull('steps_gallery_images')->update([
            'steps_gallery_images' => '[]'
        ]);
        
        DB::table('pages')->whereNull('steps_details')->update([
            'steps_details' => '[]'
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse these changes
    }
};
