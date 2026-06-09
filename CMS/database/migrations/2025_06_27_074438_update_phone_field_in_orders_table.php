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
        Schema::table('orders', function (Blueprint $table) {
            // First check if the column exists
            if (Schema::hasColumn('orders', 'phone')) {
                // Make phone nullable if it exists but is not already nullable
                $table->string('phone')->nullable()->change();
            } else {
                // Add phone column as nullable if it doesn't exist
                $table->string('phone')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // No need to do anything here as we're just making a field nullable
            // But we could revert it to required if needed
        });
    }
};
