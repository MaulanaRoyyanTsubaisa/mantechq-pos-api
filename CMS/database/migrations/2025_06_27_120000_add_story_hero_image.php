<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations for story_hero_image field only.
     */
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            // Only add the story_hero_image field
            if (!Schema::hasColumn('pages', 'story_hero_image')) {
                $table->string('story_hero_image', 255)->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            if (Schema::hasColumn('pages', 'story_hero_image')) {
                $table->dropColumn('story_hero_image');
            }
        });
    }
};
