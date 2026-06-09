<?php

namespace App\Providers;

use App\Models\Page;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class PageServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        // Only run if the pages table exists
        if (Schema::hasTable('pages')) {
            $defaultPages = [
                [
                    'slug' => 'home',
                    'title' => 'Home Page',
                    'template' => 'home',
                    'is_published' => true,
                ],
                [
                    'slug' => 'analyze',
                    'title' => 'Analysis',
                    'template' => 'analyze',
                    'is_published' => true,
                ],
                [
                    'slug' => 'steps',
                    'title' => 'Steps',
                    'template' => 'steps',
                    'is_published' => true,
                ],
                [
                    'slug' => 'feed',
                    'title' => 'Feed',
                    'template' => 'feed',
                    'is_published' => true,
                ],
                [
                    'slug' => 'our-story',
                    'title' => 'Our Story',
                    'template' => 'our-story',
                    'is_published' => true,
                ],
                [
                    'slug' => 'checkout',
                    'title' => 'Checkout',
                    'template' => 'checkout',
                    'is_published' => true,
                ],
            ];

            foreach ($defaultPages as $page) {
                Page::firstOrCreate(['slug' => $page['slug']], $page);
            }
        }
    }
}
