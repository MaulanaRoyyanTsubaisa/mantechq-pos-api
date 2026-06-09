@extends('layouts.app')

@section('title', $page->seo_title ?? $page->title)

@section('meta')
    <meta name="description" content="{{ $page->seo_description ?? $page->meta_description }}">
@endsection

@section('content')
    <div class="bg-white">
        @if($page->banner_image_url)
            <div class="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
                <img src="{{ Storage::url($page->banner_image_url) }}" 
                     alt="{{ $page->title }}" 
                     class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div class="text-center text-white">
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{{ $page->title }}</h1>
                        @if($page->subtitle)
                            <p class="text-xl md:text-2xl">{{ $page->subtitle }}</p>
                        @endif
                    </div>
                </div>
            </div>
        @else
            <div class="container mx-auto px-4 py-12">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{{ $page->title }}</h1>
                @if($page->subtitle)
                    <p class="text-xl md:text-2xl text-gray-600">{{ $page->subtitle }}</p>
                @endif
            </div>
        @endif
        <div class="container mx-auto px-4 py-12">
            <div class="prose prose-lg max-w-none">
                {!! $page->content !!}
            </div>
            @if($page->images && count($page->images))
                <div class="mt-12">
                    <h2 class="text-2xl font-bold mb-6">Gallery</h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        @foreach($page->images as $image)
                            <div class="relative aspect-square">
                                <img src="{{ Storage::url($image) }}" 
                                     alt="{{ $page->title }} gallery image" 
                                     class="w-full h-full object-cover rounded-lg">
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>
    </div>
    @if(!$page->is_published)
        <div class="fixed bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-200 p-4">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between">
                    <p class="text-yellow-800">
                        This page is not published.
                    </p>
                </div>
            </div>
        </div>
    @endif
@endsection
