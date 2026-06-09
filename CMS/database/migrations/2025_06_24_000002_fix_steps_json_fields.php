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
        // First, ensure we have the correct columns by modifying them if they exist
        // or creating them if they don't
        if (Schema::hasColumn('pages', 'steps_details')) {
            DB::statement('ALTER TABLE pages MODIFY steps_details JSON NULL');
        } else {
            Schema::table('pages', function (Blueprint $table) {
                $table->json('steps_details')->nullable();
            });
        }

        if (Schema::hasColumn('pages', 'steps_gallery_images')) {
            DB::statement('ALTER TABLE pages MODIFY steps_gallery_images JSON NULL');
        } else {
            Schema::table('pages', function (Blueprint $table) {
                $table->json('steps_gallery_images')->nullable();
            });
        }
        
        if (Schema::hasColumn('pages', 'analyze_improve_cards')) {
            DB::statement('ALTER TABLE pages MODIFY analyze_improve_cards JSON NULL');
        } else {
            Schema::table('pages', function (Blueprint $table) {
                $table->json('analyze_improve_cards')->nullable();
            });
        }

        // Now reset any existing values to JSON arrays
        DB::statement('UPDATE pages SET steps_details = "[]" WHERE steps_details IS NULL OR steps_details = ""');
        DB::statement('UPDATE pages SET steps_gallery_images = "[]" WHERE steps_gallery_images IS NULL OR steps_gallery_images = ""');
        DB::statement('UPDATE pages SET analyze_improve_cards = "[]" WHERE analyze_improve_cards IS NULL OR analyze_improve_cards = ""');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse these changes as they're fixing the column types
    }
};
