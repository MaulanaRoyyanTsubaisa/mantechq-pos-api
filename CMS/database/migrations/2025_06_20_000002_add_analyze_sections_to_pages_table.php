<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            // Hero Section
            $table->string('analyze_hero_title')->nullable();
            $table->string('analyze_hero_image')->nullable();
            // Express for One
            $table->string('analyze_express_title')->nullable();
            $table->string('analyze_express_subtitle')->nullable();
            $table->string('analyze_express_price_strike')->nullable();
            $table->string('analyze_express_price')->nullable();
            $table->string('analyze_express_duration')->nullable();
            $table->string('analyze_express_location')->nullable();
            $table->text('analyze_express_desc')->nullable();
            $table->string('analyze_express_image')->nullable();
            // Analysis for One
            $table->string('analyze_one_title')->nullable();
            $table->string('analyze_one_subtitle')->nullable();
            $table->string('analyze_one_price_strike')->nullable();
            $table->string('analyze_one_price')->nullable();
            $table->string('analyze_one_duration')->nullable();
            $table->string('analyze_one_location')->nullable();
            $table->text('analyze_one_desc')->nullable();
            $table->string('analyze_one_image')->nullable();
            // Analysis for Two
            $table->string('analyze_two_title')->nullable();
            $table->string('analyze_two_subtitle')->nullable();
            $table->string('analyze_two_price_strike')->nullable();
            $table->string('analyze_two_price')->nullable();
            $table->string('analyze_two_duration')->nullable();
            $table->string('analyze_two_location')->nullable();
            $table->text('analyze_two_desc')->nullable();
            $table->string('analyze_two_image')->nullable();
            // Improve Section
            $table->string('analyze_improve_title')->nullable();
            $table->text('analyze_improve_desc')->nullable();
            $table->json('analyze_improve_cards')->nullable(); // array: image, text
            // Studio Section
            $table->string('analyze_studio_title')->nullable();
            $table->text('analyze_studio_desc')->nullable();
            $table->string('analyze_studio_video')->nullable();
            $table->string('analyze_studio_image')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn([
                'analyze_hero_title','analyze_hero_image',
                'analyze_express_title','analyze_express_subtitle','analyze_express_price_strike','analyze_express_price','analyze_express_duration','analyze_express_location','analyze_express_desc','analyze_express_image',
                'analyze_one_title','analyze_one_subtitle','analyze_one_price_strike','analyze_one_price','analyze_one_duration','analyze_one_location','analyze_one_desc','analyze_one_image',
                'analyze_two_title','analyze_two_subtitle','analyze_two_price_strike','analyze_two_price','analyze_two_duration','analyze_two_location','analyze_two_desc','analyze_two_image',
                'analyze_improve_title','analyze_improve_desc','analyze_improve_cards',
                'analyze_studio_title','analyze_studio_desc','analyze_studio_video','analyze_studio_image',
            ]);
        });
    }
};
