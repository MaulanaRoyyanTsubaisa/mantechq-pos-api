<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PageController extends Controller
{
    public function show($slug = 'home')
    {
        try {
            // Find the page in database
            $page = Page::where('slug', $slug)
                        ->where('is_published', true)
                        ->first();

            // If page not found, create a default home page
            if (!$page && $slug === 'home') {
                $page = new Page([
                    'title' => 'Home',
                    'slug' => 'home',
                    'template' => 'home',
                    'is_published' => true,
                    'content' => '<p>Welcome to ColorByUtie</p>',
                ]);

                // Save default page to database
                $page->save();
            } elseif (!$page) {
                abort(404);            }            // If a specific template view exists, use it, otherwise fall back to default
            $view = view()->exists("my_pages.{$page->template}") 
                ? "my_pages.{$page->template}" 
                : 'my_pages.default';
            Log::info('Rendering page: ' . $slug . ' with template: ' . $page->template);
            // Set correct content-type explicitly
            return response()->view($view, compact('page'))->header('Content-Type', 'text/html; charset=UTF-8');
        } catch (\Exception $e) {
            Log::error('Error rendering page: ' . $e->getMessage());
            return response()
                ->view('my_pages.error', [
                    'message' => 'Sorry, there was an error loading this page.',
                    'error' => $e->getMessage()
                ])
                ->header('Content-Type', 'text/html; charset=UTF-8');
        }
    }
}
