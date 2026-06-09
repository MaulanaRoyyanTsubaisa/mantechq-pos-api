<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixStepsPageArrays extends Command
{
    protected $signature = 'fix:steps-arrays';
    protected $description = 'Fix steps page array fields in the database';

    public function handle()
    {
        $this->info('Fixing steps page array fields...');
        
        // 1. Make sure steps_gallery_images and steps_details are initialized as empty JSON arrays if NULL
        DB::statement("UPDATE pages SET steps_gallery_images = '[]' WHERE steps_gallery_images IS NULL");
        $this->info('Initialized NULL steps_gallery_images as empty arrays');
        
        DB::statement("UPDATE pages SET steps_details = '[]' WHERE steps_details IS NULL");
        $this->info('Initialized NULL steps_details as empty arrays');
        
        // 2. Make sure existing values are valid JSON arrays
        $pages = DB::table('pages')->select('id', 'steps_gallery_images', 'steps_details')->get();
        
        foreach ($pages as $page) {
            $updates = [];
            
            // Fix steps_gallery_images
            if (isset($page->steps_gallery_images)) {
                if (!is_array($page->steps_gallery_images)) {
                    try {
                        $decoded = json_decode($page->steps_gallery_images, true);
                        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
                            $updates['steps_gallery_images'] = '[]';
                        }
                    } catch (\Exception $e) {
                        $updates['steps_gallery_images'] = '[]';
                    }
                }
            } else {
                $updates['steps_gallery_images'] = '[]';
            }
            
            // Fix steps_details
            if (isset($page->steps_details)) {
                if (!is_array($page->steps_details)) {
                    try {
                        $decoded = json_decode($page->steps_details, true);
                        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
                            $updates['steps_details'] = '[]';
                        }
                    } catch (\Exception $e) {
                        $updates['steps_details'] = '[]';
                    }
                }
            } else {
                $updates['steps_details'] = '[]';
            }
            
            // Apply updates if needed
            if (!empty($updates)) {
                DB::table('pages')->where('id', $page->id)->update($updates);
                $this->info("Fixed array fields for page ID: {$page->id}");
            }
        }
        
        $this->info('Fixed all steps array fields!');
        return 0;
    }
}
