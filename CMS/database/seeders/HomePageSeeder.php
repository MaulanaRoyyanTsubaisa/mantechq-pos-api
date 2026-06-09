<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;

class HomePageSeeder extends Seeder
{    public function run()
    {
        Page::updateOrCreate(
            ['template' => 'home'],
            [
                'title' => 'Home',
                'slug' => 'home',
                'is_published' => true,
                'content' => '<h2 class="text-3xl font-bold mb-4 text-center">Welcome to ColorByUtie</h2>
                <p class="text-lg mb-6 text-center">Discover your personal colors and enhance your style with our professional color analysis services.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-xl font-semibold mb-3">Personal Color Analysis</h3>
                        <p>Discover the colors that make you shine and complement your natural features.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-xl font-semibold mb-3">Style Consultation</h3>
                        <p>Get personalized style advice tailored to your color palette and body shape.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-xl font-semibold mb-3">Wardrobe Analysis</h3>
                        <p>Transform your existing wardrobe with expert guidance on what works best for you.</p>
                    </div>
                </div>',
                'meta_description' => 'Professional color analysis service in Bali. Discover your personal colors and enhance your style with ColorByUtie.',
                'template' => 'home',
                'hero_title' => '"If you know your colours, then<br>you\'re one step closer to know<br>yourself."',
                'hero_subtitle' => 'Discover your personal color palette',
                'hero_button_text' => 'Book Now',
                'hero_button_link' => '/analyze',
                'hero_background_color' => '#faa53d',
                'seo_title' => 'ColorByUtie - Professional Color Analysis Services in Bali',
                'seo_description' => 'Enhance your style with our expert color analysis services. Book your session with ColorByUtie in Bali today.'
            ]
        );
    }
}
