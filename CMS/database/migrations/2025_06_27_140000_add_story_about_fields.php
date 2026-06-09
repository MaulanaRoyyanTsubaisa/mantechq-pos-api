<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations for story About fields.
     */
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            if (!Schema::hasColumn('pages', 'story_about_text')) {
                $table->text('story_about_text')->nullable();
            }
            if (!Schema::hasColumn('pages', 'story_about_text_2')) {
                $table->text('story_about_text_2')->nullable();
            }
            if (!Schema::hasColumn('pages', 'story_about_image')) {
                $table->string('story_about_image', 255)->nullable();
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
