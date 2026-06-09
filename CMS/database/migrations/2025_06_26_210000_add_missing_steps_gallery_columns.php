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
        // First check if the columns exist, if not add them
        Schema::table('pages', function (Blueprint $table) {
            if (!Schema::hasColumn('pages', 'steps_gallery_images')) {
                $table->json('steps_gallery_images')->nullable();
            }
            
            if (!Schema::hasColumn('pages', 'steps_details')) {
                $table->json('steps_details')->nullable();
            }
        });
        
        try {
            // Use more comprehensive approach to update the data - make sure we have valid JSON arrays
            
            // First, set NULL or empty values to empty arrays
            DB::statement("UPDATE pages SET steps_gallery_images = '[]' WHERE steps_gallery_images IS NULL OR steps_gallery_images = ''");
            DB::statement("UPDATE pages SET steps_details = '[]' WHERE steps_details IS NULL OR steps_details = ''");
            
            // Fix any potential JSON formatting issues for steps_gallery_images
            DB::statement("UPDATE pages SET steps_gallery_images = '[]' WHERE NOT JSON_VALID(steps_gallery_images)");
            
            // Fix any potential JSON formatting issues for steps_details
            DB::statement("UPDATE pages SET steps_details = '[]' WHERE NOT JSON_VALID(steps_details)");
            
            // Convert any {} to [] for steps_gallery_images
            DB::statement("UPDATE pages SET steps_gallery_images = '[]' WHERE steps_gallery_images = '{}'");
            
            // Convert any {} to [] for steps_details
            DB::statement("UPDATE pages SET steps_details = '[]' WHERE steps_details = '{}'");
            
            // Use direct SQL to update - safer for JSON operations
            $galleryImagesJson = DB::connection()->getPdo()->quote(json_encode([
                ['image' => 'assets/images/step1.jpg'],
                ['image' => 'assets/images/step2.jpg'],
                ['image' => 'assets/images/step3.jpg']
            ]));
            
            $stepsDetailsJson = DB::connection()->getPdo()->quote(json_encode([
                [
                    'title' => 'Initial Consultation',
                    'text' => 'The personal colour analysis begins by discussing the individual\'s goals and preferences, understanding their current fashion choices, and addressing any concerns they have about colour.'
                ],
                [
                    'title' => 'Skin Tone Analysis',
                    'text' => 'We analyze your skin undertone using specially selected fabric drapes, determining whether you have warm or cool undertones. This foundational step guides the rest of the colour analysis process.'
                ],
                [
                    'title' => 'Hair & Eye Colour Assessment',
                    'text' => 'We examine your natural hair and eye colours to understand how they interact with different colour families. This helps create a harmonious palette that enhances your overall appearance.'
                ],
                [
                    'title' => 'Seasonal Color Analysis',
                    'text' => 'Using the 12-season color analysis system, we determine which season best matches your natural coloring. This includes testing various color combinations to find your most flattering palette.'
                ],
                [
                    'title' => 'Personal Color Palette',
                    'text' => 'We create your personalized color palette, including your best neutrals, accent colors, and metallics. This becomes your guide for making confident color choices in clothing and accessories.'
                ],
                [
                    'title' => 'Styling Recommendations',
                    'text' => 'We provide practical advice on applying your color palette to your wardrobe, makeup, and accessories. You\'ll learn how to mix and match colors effectively for various occasions.'
                ]
            ]));
            
            // Use direct SQL to update all pages
            DB::statement("UPDATE pages SET steps_gallery_images = {$galleryImagesJson}, steps_details = {$stepsDetailsJson}");
            
        } catch (\Exception $e) {
            // Log the error but don't crash the migration
            \Illuminate\Support\Facades\Log::error('Error updating steps JSON fields: ' . $e->getMessage());
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to remove columns in down migration
    }
};
