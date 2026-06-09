<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->string('slider_title')->nullable();
            $table->string('slider_images')->nullable();
            $table->string('steps_title')->nullable();
            $table->text('steps_text')->nullable();
            $table->json('steps_images')->nullable();
            $table->string('services_title')->nullable();
            $table->text('services_text')->nullable();
            $table->json('services_images')->nullable();
            $table->string('story_title')->nullable();
            $table->text('story_text')->nullable();
            $table->string('story_video')->nullable();
            $table->string('faq_title')->nullable();
            $table->json('faq_items')->nullable();
            $table->string('feed_title')->nullable();
            $table->json('feed_images')->nullable();
            $table->string('feed_instagram')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn([
                'slider_title', 'slider_images',
                'steps_title', 'steps_text', 'steps_images',
                'services_title', 'services_text', 'services_images',
                'story_title', 'story_text', 'story_video',
                'faq_title', 'faq_items',
                'feed_title', 'feed_images', 'feed_instagram',
            ]);
        });
    }
};
