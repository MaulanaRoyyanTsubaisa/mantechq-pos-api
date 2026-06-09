<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function home()
    {
        $page = Page::where('slug', 'home')->first();
        
        if (!$page) {
            // Create default home page if it doesn't exist
            $page = Page::create([
                'slug' => 'home',
                'title' => 'Welcome to ColourbyUtie',
                'subtitle' => 'Discover Your True Colors',
                'content' => '<p>Welcome to our color analysis service.</p>',
                'seo_title' => 'Colour by Utie - Personal Color Analysis',
                'seo_description' => 'Discover your true colors with professional color analysis in Bali.'
            ]);
        }
        
        return view('pages.home', compact('page'));
    }
    
    public function analyze()
    {
        $page = Page::where('slug', 'analyze')->first();
        
        if (!$page) {
            // Create default analyze page if it doesn't exist
            $page = Page::create([
                'slug' => 'analyze',
                'title' => 'analyze me',
                'subtitle' => 'Book Your Color Analysis Session',
                'content' => '<p>Book your personal color analysis session.</p>',
                'seo_title' => 'Analyze Me - Color Analysis Booking',
                'seo_description' => 'Book your personal color analysis session in Bali.'
            ]);
        }
        
        return view('pages.analyze', compact('page'));
    }
    
    public function about()
    {
        $page = Page::where('slug', 'about')->first();
        
        if (!$page) {
            // Create default about page if it doesn't exist
            $page = Page::create([
                'slug' => 'about',
                'title' => 'Our Story',
                'subtitle' => 'The Story of Colour by Utie',
                'content' => '<p>Learn about our journey and mission.</p>',
                'seo_title' => 'Our Story - Colour by Utie',
                'seo_description' => 'Learn about the story behind Colour by Utie and our mission.'
            ]);
        }
        
        return view('pages.about', compact('page'));
    }
    
    public function checkout()
    {
        $page = Page::where('slug', 'checkout')->first();
        if (!$page) {
            $page = Page::create([
                'slug' => 'checkout',
                'title' => 'Checkout',
                'subtitle' => 'Complete Your Booking',
                'content' => '<p>Review and complete your booking.</p>',
                'seo_title' => 'Checkout - Colour by Utie',
                'seo_description' => 'Complete your color analysis booking with Colour by Utie.'
            ]);
        }
        return view('pages.checkout', compact('page'));
    }
    
    public function steps()
    {
        $page = Page::where('slug', 'steps')->first();
        
        if (!$page) {
            $page = Page::create([
                'slug' => 'steps',
                'title' => 'Step by Step Process',
                'subtitle' => 'Learn how we analyze your colors',
                'content' => '<p>Discover our comprehensive color analysis process.</p>',
                'seo_title' => 'Step by Step Process - Colour by Utie',
                'seo_description' => 'Learn about our detailed color analysis process and how we help you discover your perfect colors.'
            ]);
        }
        
        return view('pages.steps', compact('page'));
    }

    public function feed()
    {
        $page = Page::where('slug', 'feed')->first();
        
        if (!$page) {
            $page = Page::create([
                'slug' => 'feed',
                'title' => 'Our Latest Transformations',
                'subtitle' => 'See our recent color analysis sessions',
                'content' => '<p>Check out our latest transformations and client stories.</p>',
                'seo_title' => 'Feed - Colour by Utie',
                'seo_description' => 'View our latest color analysis transformations and client success stories.'
            ]);
        }
        
        return view('pages.feed', compact('page'));
    }

    public function show($slug)
    {
        $page = Page::where('slug', $slug)->firstOrFail();
        return view('pages.show', compact('page'));
    }
}
