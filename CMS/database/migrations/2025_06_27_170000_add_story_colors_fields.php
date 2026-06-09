<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations for story Colors fields.
     */
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            if (!Schema::hasColumn('pages', 'story_colors_title')) {
                $table->string('story_colors_title', 255)->nullable();
            }
            if (!Schema::hasColumn('pages', 'story_colors_desc')) {
                $table->text('story_colors_desc')->nullable();
            }
            if (!Schema::hasColumn('pages', 'story_colors_images')) {
                $table->json('story_colors_images')->nullable();
            }
        });
        
        // Initialize JSON field with empty array
        DB::statement('UPDATE pages SET story_colors_images = "[]" WHERE story_colors_images IS NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We'll leave this empty for the fix migration
    }
};
