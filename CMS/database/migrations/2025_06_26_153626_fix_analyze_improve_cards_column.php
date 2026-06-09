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
        // Make sure the column exists and is JSON type
        Schema::table('pages', function (Blueprint $table) {
            // Drop the column if it exists and recreate it as JSON
            if (Schema::hasColumn('pages', 'analyze_improve_cards')) {
                $table->dropColumn('analyze_improve_cards');
            }
            
            // Create the column as JSON
            $table->json('analyze_improve_cards')->nullable()->after('analyze_improve_desc');
        });
        
        // Initialize the field with default values for all analyze pages
        \Illuminate\Support\Facades\DB::table('pages')->where('template', 'analyze')->update([
            'analyze_improve_cards' => json_encode([
                [
                    'image' => 'assets/images/improve1.png',
                    'text' => 'Unlocking your personal colour palette can transform your fashion appearance. Knowing which hues complement your natural features helps you create a cohesive, polished, and vibrant look, boosting your confidence and style.'
                ],
                [
                    'image' => 'assets/images/improve2.png',
                    'text' => 'Personal colour palette is crucial for perfecting makeup. Identifying shades that complement your skin tone, eyes, and hair enhances your natural beauty. These colours create a polished, radiant look, boosting your confidence.'
                ],
                [
                    'image' => 'assets/images/improve3.png',
                    'text' => "Understanding your personal colour palette isn't just for clothes and makeup—it also helps you choose accessories. By coordinating items like bags, hats, and shoes with your features, you enhance your overall appearance effortlessly."
                ]
            ])
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            if (Schema::hasColumn('pages', 'analyze_improve_cards')) {
                $table->dropColumn('analyze_improve_cards');
            }
        });
    }
};
