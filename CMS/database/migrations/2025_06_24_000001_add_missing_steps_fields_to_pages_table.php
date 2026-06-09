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
            // Check if columns don't exist before adding to prevent errors
            if (!Schema::hasColumn('pages', 'steps_gallery_images')) {
                $table->json('steps_gallery_images')->nullable();
            }
            
            if (!Schema::hasColumn('pages', 'steps_details')) {
                $table->json('steps_details')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn([
                'steps_gallery_images',
                'steps_details'
            ]);
        });
    }
};
