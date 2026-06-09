@extends('layouts.app')

@section('title', 'Our Story - Colour by Utie')

@section('content')
    <!-- Hero Section -->
    <section class="w-full min-h-[400px] md:min-h-[700px] flex items-center justify-center relative pt-32 pb-8 transition-all duration-500 ease-in-out" data-aos="fade-in">
        <img src="{{ !empty($page->story_hero_image) ? asset($page->story_hero_image) : asset('assets/images/story-hero.jpg') }}" alt="Our Story Hero" class="absolute inset-0 w-full h-full object-cover object-center z-0 transition-all duration-500 ease-in-out" />
        <div class="absolute inset-0 bg-black/10 z-10 transition-all duration-500 ease-in-out"></div>
        <div class="container mx-auto px-4 relative z-20 flex flex-col items-center justify-center h-full transition-all duration-500 ease-in-out">
        </div>
    </section>

    <!-- Story Section -->
    <section class="w-full bg-[#f5bc42] py-10 md:py-14 transition-all duration-500 ease-in-out" data-aos="fade-up">
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
            <!-- Profile Photo -->
            <div class="flex justify-center mb-8 md:mb-0">
                <img src="{{ !empty($page->story_profile_image) ? asset($page->story_profile_image) : asset('assets/images/profile.jpg') }}" alt="Putri Pratiwi" class="w-85 h-85 object-cover rounded-none shadow-lg" />
            </div>
            <!-- Text -->
            <div class="flex flex-col justify-center items-center md:items-start text-center md:text-left">
                <h2 class="text-2xl md:text-4xl font-bold mb-4">{{ $page->story_about_title }}</h2>
                <p class="text-gray-800 text-base md:text-lg leading-relaxed mb-6">
                    {{ $page->story_about_text1 }}
                </p>
                <p class="text-gray-800 text-base md:text-lg leading-relaxed">
                    {{ $page->story_about_text2 }}
                </p>
            </div>
        </div>
    </section>

    <!-- Korean-Japan Section -->
    <section class="w-full bg-white py-16 md:py-24 border-t border-[#f5bc42] transition-all duration-500 ease-in-out" data-aos="fade-up">
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
            <!-- Left: Title + Image -->
            <div class="flex flex-col items-center md:items-start text-center md:text-left">
                <h2 class="text-xl md:text-5xl font-bold text-black leading-tight mb-8 md:mb-10 text-left">
                    {!! $page->story_practice_title !!}
                </h2>
                <div class="w-full max-w-xl aspect-[16/12] overflow-hidden mx-auto mb-4">
                    <img src="{{ asset($page->story_practice_image) }}" alt="Korean Japan Practice" class="w-full h-full object-cover object-top scale-60 transition-transform" />
                </div>
            </div>
            <!-- Right: Text -->
            <div>
                <p class="text-gray-800 text-base md:text-lg leading-relaxed mb-6">
                    {{ $page->story_practice_text1 }}
                </p>
                <p class="text-gray-800 text-base md:text-lg leading-relaxed">
                    {{ $page->story_practice_text2 }}
                </p>
            </div>
        </div>
    </section>

    <!-- Our Approach Section -->
    <section class="w-full bg-[#f5bc42] py-16 md:py-24 transition-all duration-500 ease-in-out" data-aos="fade-up">
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
            <!-- Left: Text -->
            <div class="order-2 md:order-1">
                <h2 class="text-2xl md:text-4xl font-bold mb-6">{{ $page->story_approach_title }}</h2>
                <p class="text-gray-800 text-base md:text-lg leading-relaxed">
                    {{ $page->story_approach_text }}
                </p>
            </div>
            <!-- Right: Image -->
            <div class="order-1 md:order-2">
                <img src="{{ asset($page->story_approach_image) }}" alt="Our Approach" class="w-full h-auto rounded-lg shadow-lg" />
            </div>
        </div>
    </section>

    <!-- Values Section -->
    <section class="w-full bg-white py-16 md:py-24 transition-all duration-500 ease-in-out" data-aos="fade-up">
        <div class="max-w-5xl mx-auto px-4">
            <h2 class="text-2xl md:text-4xl font-bold mb-10 text-center">{{ $page->story_values_title }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                @foreach($page->story_values as $value)
                <div class="p-6 bg-gray-50 rounded-lg">
                    <h3 class="text-xl font-bold mb-3">{{ $value['title'] }}</h3>
                    <p class="text-gray-700">{{ $value['text'] }}</p>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- Certifications Section -->
    <section class="w-full bg-[#f5bc42] py-16 md:py-24 transition-all duration-500 ease-in-out" data-aos="fade-up">
        <div class="max-w-5xl mx-auto px-4">
            <h2 class="text-2xl md:text-4xl font-bold mb-10 text-center">{{ $page->story_certifications_title }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                @foreach($page->story_certifications as $cert)
                <div class="p-6 bg-white rounded-lg text-center">
                    <h3 class="text-lg font-bold mb-2">{{ $cert['title'] }}</h3>
                    <p class="text-gray-600">{{ $cert['institution'] }}</p>
                </div>
                @endforeach
            </div>
        </div>
    </section>
@endsection
