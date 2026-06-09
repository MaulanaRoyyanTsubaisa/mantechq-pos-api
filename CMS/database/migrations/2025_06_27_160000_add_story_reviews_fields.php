<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for story Reviews fields.
     */
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            if (!Schema::hasColumn('pages', 'story_reviews_title')) {
                $table->string('story_reviews_title', 255)->nullable();
            }
            if (!Schema::hasColumn('pages', 'story_reviews_quote')) {
                $table->text('story_reviews_quote')->nullable();
            }
            if (!Schema::hasColumn('pages', 'story_reviews_name')) {
                $table->string('story_reviews_name', 255)->nullable();
            }
            if (!Schema::hasColumn('pages', 'story_reviews_image')) {
                $table->string('story_reviews_image', 255)->nullable();
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
