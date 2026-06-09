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
            // Feed Hero Section
            $table->string('feed_hero_title')->nullable();
            $table->string('feed_hero_background_color')->nullable();
            $table->json('feed_hero_images')->nullable();
            
            // Feed Grid Section
            $table->json('feed_grid_items')->nullable();
            
            // Feed Contact Section
            $table->string('feed_contact_story_title')->nullable();
            $table->string('feed_contact_story_email')->nullable();
            $table->string('feed_contact_address')->nullable();
            $table->string('feed_contact_phone')->nullable();
            $table->string('feed_contact_email')->nullable();
        });

        // Initialize JSON fields with empty arrays
        DB::statement('UPDATE pages SET feed_hero_images = "[]" WHERE feed_hero_images IS NULL');
        DB::statement('UPDATE pages SET feed_grid_items = "[]" WHERE feed_grid_items IS NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn([
                'feed_hero_title',
                'feed_hero_background_color',
                'feed_hero_images',
                'feed_grid_items',
                'feed_contact_story_title',
                'feed_contact_story_email',
                'feed_contact_address',
                'feed_contact_phone',
                'feed_contact_email',
            ]);
        });
    }
};
