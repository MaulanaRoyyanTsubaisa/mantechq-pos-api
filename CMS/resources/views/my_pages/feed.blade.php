@extends('layouts.app')

@section('title', 'Feed - Personal Color Analysis Stories')

@section('content')
    <!-- Hero Section -->
    <!-- Mobile View -->
    <section class="w-full bg-[{{ $page->feed_hero_background_color }}] flex md:hidden flex-col items-center justify-center min-h-[90vh] pt-32 pb-16 px-8">
      <div class="flex flex-col items-center justify-center gap-4">
        @php
            $feedHeroImages = is_array($page->feed_hero_images) ? $page->feed_hero_images : [];
            if (empty($feedHeroImages)) {
                $feedHeroImages = ['assets/images/feed1.jpg', 'assets/images/feed2.jpg', 'assets/images/feed3.jpg'];
            }
        @endphp
        
        @foreach(array_slice($feedHeroImages, 0, 3) as $key => $image)
            <!-- Arch {{ $key + 1 }} -->
            <div class="w-64 h-96 overflow-hidden mb-4" style="clip-path: path('M0 300 L0 100 A100 100 0 0 1 200 100 L200 300 Z'); transform: scale(1.2); transform-origin: center;">
              <img src="{{ $image }}" alt="Feed {{ $key + 1 }}" class="w-full h-full object-cover" />
            </div>
        @endforeach
      </div>
      <h2 class="text-3xl md:text-5xl font-bold text-[#d45a2a] text-center mt-4">{{ $page->feed_hero_title }}</h2>
    </section>

    <!-- Desktop View -->
    <section class="w-full bg-[{{ $page->feed_hero_background_color }}] hidden md:flex flex-col items-center justify-center min-h-[60vh] py-16 md:py-24">
      <div class="flex flex-col md:flex-row items-end justify-center gap-13 pt-32">
        @php
            $feedHeroImages = is_array($page->feed_hero_images) ? $page->feed_hero_images : [];
            if (empty($feedHeroImages)) {
                $feedHeroImages = ['assets/images/feed1.jpg', 'assets/images/feed2.jpg', 'assets/images/feed3.jpg'];
            }
        @endphp
        
        @foreach(array_slice($feedHeroImages, 0, 3) as $key => $image)
            <!-- Arch {{ $key + 1 }} -->
            <div class="w-64 h-96 overflow-hidden" style="clip-path: path('M0 300 L0 100 A100 100 0 0 1 200 100 L200 300 Z'); transform: scale(1.2); transform-origin: center;">
              <img src="{{ $image }}" alt="Feed {{ $key + 1 }}" class="w-full h-full object-cover" />
            </div>
        @endforeach
      </div>
      <h2 class="text-3xl md:text-5xl font-bold text-[#d45a2a] text-center -mt-8">{{ $page->feed_hero_title }}</h2>
    </section>    <!-- Feed Grid Section -->
    <section class="w-full bg-white py-12">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          @php
              $gridItems = is_array($page->feed_grid_items) ? $page->feed_grid_items : [];
              if (empty($gridItems)) {
                  $gridItems = $page->getFeedGridItemsAttribute(null);
              }
          @endphp
          
          @foreach($gridItems as $item)
              <div>
                <img src="{{ isset($item['image']) ? $item['image'] : asset('assets/images/feed1.jpg') }}" 
                     alt="{{ $item['title'] ?? 'Feed Item' }}" 
                     class="w-full h-48 object-cover mb-2" />
                <div class="font-bold text-base md:text-lg mb-1">{{ $item['title'] ?? 'Feed Title' }}</div>
                <div class="text-xs text-gray-500 mb-1">{{ $item['category'] ?? 'Category' }}</div>
                <div class="text-xs text-gray-700">{{ $item['author'] ?? 'Author' }}</div>
                <div class="text-xs text-gray-400">{{ $item['date'] ?? '' }} · {{ $item['read_time'] ?? '' }}</div>
              </div>
          @endforeach
        </div>
      </div>
    </section>    <!-- Share Story / Contact Section -->
    <section class="w-full bg-[#fa6a48] py-16">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-white text-center md:text-left">
          <!-- Share Story -->
          <div class="flex flex-col items-center md:items-start justify-center">
            <div class="text-2xl font-bold mb-2">{{ $page->feed_contact_story_title }}</div>
            <a href="mailto:{{ $page->feed_contact_story_email }}" class="font-bold text-lg md:text-xl underline">{{ $page->feed_contact_story_email }}</a>
          </div>
          <!-- Address -->
          <div class="flex flex-col items-center md:items-start justify-center">
            <div class="font-bold mb-1">Address</div>
            <p>{!! $page->feed_contact_address !!}</p>
          </div>
          <!-- Contacts -->
          <div class="flex flex-col items-center md:items-start justify-center">
            <div class="font-bold mb-1">Contacts</div>
            <a href="tel:{{ preg_replace('/[^0-9+]/', '', $page->feed_contact_phone) }}" class="block hover:underline">{{ $page->feed_contact_phone }}</a>
            <a href="mailto:{{ $page->feed_contact_email }}" class="block hover:underline">{{ $page->feed_contact_email }}</a>
          </div>
        </div>
      </div>
    </section>
@endsection
