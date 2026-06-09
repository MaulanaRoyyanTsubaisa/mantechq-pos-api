<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            // Add story_hero_title field which is still missing
            $table->string('story_hero_title')->nullable();
            
            // Add story_about_image field which is still missing
            $table->string('story_about_image')->nullable();
            
            // Add story_contact fields which might be missing
            $table->string('story_contact_address')->nullable();
            $table->string('story_contact_phone')->nullable();
            $table->string('story_contact_email')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn([
                'story_hero_title',
                'story_about_image',
                'story_contact_address',
                'story_contact_phone',
                'story_contact_email'
            ]);
        });
    }
};
