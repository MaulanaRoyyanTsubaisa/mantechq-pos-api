<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Page;
use Illuminate\Support\Facades\Schema;

class FixPageArrayFields extends Command
{
    protected $signature = 'app:fix-page-array-fields';
    protected $description = 'Fix array fields in the Page model';

    public function handle()
    {
        $this->info('Starting fix for Page model array fields...');
        
        // Check columns
        $this->info('Checking columns in pages table...');
        $columns = Schema::getColumnListing('pages');
        $this->info('Columns: ' . implode(', ', $columns));
        
        // Get all pages
        $pages = Page::all();
        $this->info('Found ' . $pages->count() . ' pages');
        
        foreach ($pages as $page) {
            $this->info('Processing page: ' . $page->id . ' - ' . $page->title);
            
            // Fix steps_details field
            if (!is_array($page->steps_details)) {
                $this->info('Fixing steps_details for page ' . $page->id);
                $page->steps_details = [];
                $page->save();
            }
            
            // Fix steps_gallery_images field
            if (!is_array($page->steps_gallery_images)) {
                $this->info('Fixing steps_gallery_images for page ' . $page->id);
                $page->steps_gallery_images = [];
                $page->save();
            }
            
            // Fix analyze_improve_cards field
            if (!is_array($page->analyze_improve_cards)) {
                $this->info('Fixing analyze_improve_cards for page ' . $page->id);
                $page->analyze_improve_cards = [];
                $page->save();
            }
        }
        
        $this->info('All array fields fixed successfully!');
    }
}
