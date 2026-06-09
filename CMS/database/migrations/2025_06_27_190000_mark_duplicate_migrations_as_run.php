<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Mark duplicate migrations as migrated to avoid issues.
     */
    public function up(): void
    {
        // List of duplicate migrations to mark as completed
        $duplicateMigrations = [
            '2025_06_23_000002_add_story_fields_to_pages_table',
            '2025_06_23_000003_add_story_fields_to_pages_table',
            '2025_06_23_000004_add_missing_story_fields_to_pages_table',
            '2025_06_23_000005_add_missing_story_fields_to_pages_table',
            '2025_06_23_000006_rename_and_add_story_fields_to_pages_table',
            '2025_06_27_110000_fix_all_story_fields'
        ];

        // Get the current maximum batch number
        $maxBatch = DB::table('migrations')->max('batch');
        $newBatch = $maxBatch + 1;

        // Mark all duplicate migrations as completed
        foreach ($duplicateMigrations as $migration) {
            // Check if the migration doesn't already exist in the migrations table
            if (!DB::table('migrations')->where('migration', $migration)->exists()) {
                DB::table('migrations')->insert([
                    'migration' => $migration,
                    'batch' => $newBatch
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // List of duplicate migrations to unmark
        $duplicateMigrations = [
            '2025_06_23_000002_add_story_fields_to_pages_table',
            '2025_06_23_000003_add_story_fields_to_pages_table',
            '2025_06_23_000004_add_missing_story_fields_to_pages_table',
            '2025_06_23_000005_add_missing_story_fields_to_pages_table',
            '2025_06_23_000006_rename_and_add_story_fields_to_pages_table',
            '2025_06_27_110000_fix_all_story_fields'
        ];

        // Remove these migrations from the migrations table
        DB::table('migrations')->whereIn('migration', $duplicateMigrations)->delete();
    }
};
