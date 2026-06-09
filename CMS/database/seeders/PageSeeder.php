<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run()
    {
        $defaultPages = [
            [
                'slug' => 'home',
                'title' => 'Home Page',
                'template' => 'home',
                'is_published' => true,
                'content' => '<p>Welcome to our website!</p>',
            ],
            [
                'slug' => 'analyze',
                'title' => 'Analysis',
                'template' => 'analyze',
                'is_published' => true,
                'content' => '<p>Our analysis services.</p>',
            ],
            [
                'slug' => 'steps',
                'title' => 'Steps',
                'template' => 'steps',
                'is_published' => true,
                'content' => '<p>How it works.</p>',
            ],
            [
                'slug' => 'feed',
                'title' => 'Feed',
                'template' => 'feed',
                'is_published' => true,
                'content' => '<p>Latest updates.</p>',
            ],
            [
                'slug' => 'our-story',
                'title' => 'Our Story',
                'template' => 'our-story',
                'is_published' => true,
                'content' => '<p>The story of our journey.</p>',
            ],
            [
                'slug' => 'checkout',
                'title' => 'Checkout',
                'template' => 'checkout',
                'is_published' => true,
                'content' => '<p>Complete your purchase.</p>',
            ],
        ];

        foreach ($defaultPages as $page) {
            Page::firstOrCreate(['slug' => $page['slug']], $page);
        }
    }
}
