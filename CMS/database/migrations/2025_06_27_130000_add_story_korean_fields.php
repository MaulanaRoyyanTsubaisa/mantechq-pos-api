<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for story Korean fields.
     */
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            // Korean-Japan Section - most needed fields
            if (!Schema::hasColumn('pages', 'story_korean_title')) {
                $table->string('story_korean_title', 255)->nullable();
            }
            if (!Schema::hasColumn('pages', 'story_korean_text')) {
                $table->text('story_korean_text')->nullable();
            }
            if (!Schema::hasColumn('pages', 'story_korean_text_2')) {
                $table->text('story_korean_text_2')->nullable();
            }
            if (!Schema::hasColumn('pages', 'story_korean_image')) {
                $table->string('story_korean_image', 255)->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We'll leave this empty for the fix migration
    }
};
