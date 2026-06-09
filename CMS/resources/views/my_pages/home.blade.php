@extends('layouts.app')

@section('title', 'Pak Nazar - Color Analysis')
@section('content')
    <!-- Navbar -->
    <nav class="w-full bg-white py-3 px-0 flex items-center justify-between fixed top-0 left-0 z-50 border-b border-gray-100">
        <div class="container mx-auto px-4 relative">
            <!-- Mobile Header: X & Logo -->
            <div class="flex w-full items-center justify-between md:hidden">
                <button id="navToggleHome" class="text-3xl text-gray-800 focus:outline-none transition-transform duration-300">
                    <i id="navIconHome" class="fas fa-bars transition-transform duration-300"></i>
                </button>
                <a href="{{ route('home') }}" class="mx-auto">
                    <img src="{{ asset('assets/images/logo.png') }}" alt="colour by utie" class="h-12 w-auto logo-shadow" />
                </a>
                <div class="w-8"></div>
            </div>
            <!-- Desktop Logo & Menu -->
            <div class="hidden md:flex items-center justify-between w-full ml-16">
                <a href="{{ route('home') }}" class="flex items-center select-none mx-auto md:ml-16 md:mr-8">
                    <img src="{{ asset('assets/images/logo.png') }}" alt="colour by utie" class="h-16 w-auto logo-shadow" />
                </a>
                <ul class="flex space-x-6 text-base font-medium mr-20">
                    <li><a href="{{ route('analyze') }}" class="text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4">Analyze Me</a></li>
                    <li><a href="{{ route('steps') }}" class="text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4">Step by Step</a></li>
                    <li><a href="{{ route('our-story') }}" class="text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4">Our Story</a></li>
                    <li><a href="{{ route('feed') }}" class="text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4">Feed</a></li>
                </ul>
            </div>
            <!-- Mobile Menu kiri -->
            <ul id="mobileMenuHome" class="fixed top-16 left-0 w-3/4 bg-white shadow-md flex flex-col items-start space-y-4 text-base font-medium py-6 px-8 z-50 hidden md:hidden text-left transition-all duration-500 opacity-0 -translate-x-8 pointer-events-none">
                <li><a href="{{ route('analyze') }}" class="block text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4 ">Analyze Me</a></li>
                <li><a href="{{ route('steps') }}" class="block text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4">Step by Step</a></li>
                <li><a href="{{ route('our-story') }}" class="block text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4">Our Story</a></li>
                <li><a href="{{ route('feed') }}" class="block text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4">Feed</a></li>
            </ul>
        </div>
    </nav>

    <pre>
    hero_title: [{{ var_export($page->hero_title, true) }}]
    hero_button_text: [{{ var_export($page->hero_button_text, true) }}]
    </pre>
    <!-- Hero Section -->
    @php
        $defaultHero = [
            'hero_title' => '"If you know your colours, then<br>you\'re one step closer to know<br>yourself."',
            'hero_button_text' => 'Book Now',
            'hero_button_link' => route('analyze'),
            'hero_background_color' => '#faa53d',
        ];
    @endphp
    <section class="w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center" style="background: {{ $page->hero_background_color ?? $defaultHero['hero_background_color'] }};" data-aos="fade-up">
        <div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
            <!-- Left: Text -->
            <div class="flex-1 flex flex-col justify-center items-start max-w-xl ml-16" data-aos="fade-right" data-aos-delay="100">
                <h1 class="text-white text-3xl md:text-5xl font-semibold mb-10 leading-tight text-left">
                    {!! !empty($page->hero_title) ? $page->hero_title : $defaultHero['hero_title'] !!}
                </h1>
                <a href="{{ !empty($page->hero_button_link) ? $page->hero_button_link : $defaultHero['hero_button_link'] }}" class="mt-4 px-8 py-4 bg-white text-[#faa53d] font-bold uppercase tracking-wider rounded-none shadow hover:bg-gray-100 transition-all text-base md:text-lg" data-aos="fade-right" data-aos-delay="200">
                    {{ !empty($page->hero_button_text) ? $page->hero_button_text : $defaultHero['hero_button_text'] }}
                </a>
            </div>
            <div class="flex-1 flex justify-center items-end relative w-full md:w-1/2 md:items-center md:justify-center md:pr-32" data-aos="fade-up" data-aos-delay="100">
                <div class="hidden md:flex w-full h-full items-center justify-center">
                    <div class="relative w-[600px] h-[600px] max-w-[700px] max-h-[700px] bg-[#fbb040] rounded-t-full rounded-b-none flex items-end justify-center overflow-hidden">
                        <img src="{{ asset('assets/images/hero-model.png') }}" alt="Model" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[650px] h-auto object-cover cursor-pointer hero-modal-img" style="background:transparent;" />
                    </div>
                </div>
                <div class="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:hidden bg-[#fbb040] rounded-t-full rounded-b-none flex items-end justify-center overflow-hidden">
                    <img src="{{ asset('assets/images/hero-model.png') }}" alt="Model" class="w-[220px] sm:w-[180px] h-auto object-cover cursor-pointer hero-modal-img" style="background:transparent;" />
                </div>
            </div>
        </div>
    </section>

    {{-- SLIDER SECTION --}}
    @php
        $defaultSliderImages = [
            asset('assets/images/slider1.jpg'),
            asset('assets/images/slider2.jpg'),
            asset('assets/images/slider3.jpg'),
            asset('assets/images/slider4.jpg'),
            asset('assets/images/slider5.jpg'),
        ];
        $sliderImages = collect($page->slider_images ?? [])->map(function($img) {
            if (is_string($img)) {
                if (str_starts_with($img, 'assets/')) {
                    return asset($img);
                } else {
                    return asset('storage/'.$img);
                }
            }
            return '';
        })->filter()->values()->toArray();
        if (empty($sliderImages)) {
            $sliderImages = $defaultSliderImages;
        }
        $sliderTitle = !empty($page->slider_title) ? $page->slider_title : '';
    @endphp
    @if(!empty($sliderImages))
        <section class="w-full relative overflow-hidden" data-aos="fade-up">
            <div class="relative w-full flex flex-col items-center justify-center h-[250px] md:h-[350px] lg:h-[550px]">
                <button id="sliderPrev" class="absolute left-4 z-20 bg-white/70 hover:bg-white rounded-full p-2 text-3xl text-gray-800 flex items-center justify-center focus:outline-none" data-aos="fade-up" data-aos-delay="100">
                    <span>&lt;</span>
                </button>
                <div class="w-full h-full flex items-center justify-center">
                    <img id="sliderImage" src="{{ $sliderImages[0] ?? '' }}" alt="Slider" class="object-cover w-full h-full max-w-full transition-all duration-700" />
                </div>
                <button id="sliderNext" class="absolute right-4 z-20 bg-white/70 hover:bg-white rounded-full p-2 text-3xl text-gray-800 flex items-center justify-center focus:outline-none" data-aos="fade-up" data-aos-delay="100">
                    <span>&gt;</span>
                </button>
            </div>
            <div class="flex justify-center mt-4 gap-2" data-aos="fade-up" data-aos-delay="150">
                @foreach($sliderImages as $i => $img)
                    <span class="slider-dot w-3 h-3 rounded-full {{ $i === 0 ? 'bg-gray-400' : 'bg-gray-300' }} inline-block cursor-pointer" data-index="{{ $i }}"></span>
                @endforeach
            </div>
            @if(!empty($sliderTitle))
                <h2 class="text-center text-2xl font-bold mt-4">{{ $sliderTitle }}</h2>
            @endif
        </section>
        @push('scripts')
        <script>
        const sliderImages = @json($sliderImages);
        let sliderIndex = 0;
        let sliderInterval = null;
        function showSlider(idx) {
            sliderIndex = (idx + sliderImages.length) % sliderImages.length;
            const sliderImage = document.getElementById("sliderImage");
            const sliderDots = document.querySelectorAll(".slider-dot");
            if (sliderImage) sliderImage.src = sliderImages[sliderIndex];
            sliderDots.forEach((dot, i) => {
                dot.classList.toggle('bg-gray-400', i === sliderIndex);
                dot.classList.toggle('bg-gray-300', i !== sliderIndex);
            });
        }
        function nextSlider() { showSlider(sliderIndex + 1); }
        function prevSlider() { showSlider(sliderIndex - 1); }
        function startSlider() {
            if (sliderInterval) clearInterval(sliderInterval);
            sliderInterval = setInterval(() => nextSlider(), 4000);
        }
        document.addEventListener('DOMContentLoaded', function() {
            showSlider(sliderIndex);
            startSlider();
            const sliderPrev = document.getElementById("sliderPrev");
            const sliderNext = document.getElementById("sliderNext");
            const sliderDots = document.querySelectorAll(".slider-dot");
            if (sliderPrev) sliderPrev.onclick = () => { prevSlider(); startSlider(); };
            if (sliderNext) sliderNext.onclick = () => { nextSlider(); startSlider(); };
            sliderDots.forEach((dot, i) => {
                dot.onclick = () => { showSlider(i); startSlider(); };
            });
        });
        </script>
        @endpush
    @else
        @include('partials.slider')
    @endif

    @if(!empty($page->content))
        <div class="container mx-auto px-4 py-12">
            {!! $page->content !!}
        </div>
    @else
        {{-- STEPS SECTION --}}
        @php
            $defaultStepsTitle = 'Discovering your true colours is a path to discovering your true self';
            $defaultStepsText = 'When you dress authentically to reflect the person one sees in your hair, eyes, and skin, you begin to connect with your unique energy and unlock hidden potential. What could be more empowering than that?';
            $defaultStepsImages = [
                ['image' => 'assets/images/feature1.jpg', 'title' => 'Empower You', 'desc' => 'Expressing our true selves—through our colours, attire, and belongings—empowers us.'],
                ['image' => 'assets/images/feature2.jpg', 'title' => 'Genuine Self', 'desc' => 'Showing your genuine self is the surest path to attracting the positive experiences you deserve.'],
                ['image' => 'assets/images/feature3.jpg', 'title' => 'Reshape Outlook', 'desc' => 'Being true to yourself has the power to profoundly reshape your self-perception and your outlook.'],
            ];
            $stepsTitle = !empty($page->steps_title) ? $page->steps_title : $defaultStepsTitle;
            $stepsText = !empty($page->steps_text) ? $page->steps_text : $defaultStepsText;
            $stepsImages = (!empty($page->steps_images) && is_array($page->steps_images)) ? $page->steps_images : $defaultStepsImages;
        @endphp
        <section class="w-full py-10 bg-white" data-aos="fade-up" id="steps">
            <div class="max-w-5xl mx-auto px-3 sm:px-4">
                <h2 class="text-2xl sm:text-3xl md:text-5xl font-bold text-center mb-4 sm:mb-6" data-aos="fade-up" data-aos-delay="100">{!! $stepsTitle !!}</h2>
                <p class="text-center text-base sm:text-lg text-gray-700 mb-8 sm:mb-12 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="150">{!! $stepsText !!}</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
                    @foreach($stepsImages as $step)
                        <div class="flex flex-col items-center" data-aos="fade-up" data-aos-delay="{{ 200 + $loop->index * 100 }}">
                            <img src="{{ asset(is_array($step) ? ($step['image'] ?? $step[0] ?? '') : $step) }}" alt="{{ is_array($step) ? ($step['title'] ?? '') : '' }}" class="w-full max-w-xs h-auto aspect-square object-cover rounded-none mb-4 sm:mb-6" />
                            <h3 class="text-xl sm:text-2xl font-bold mb-2 text-center">{!! is_array($step) ? ($step['title'] ?? '') : '' !!}</h3>
                            <p class="text-center text-gray-700">{!! is_array($step) ? ($step['desc'] ?? '') : '' !!}</p>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        {{-- SERVICES SECTION --}}
        @php
            $defaultServicesTitle = 'Find your genuine colours and style';
            $defaultServicesText = 'When aligned with your chosen colours, attire, and possessions, others can easily identify you, enhancing your attractiveness, and leaving you feeling more vibrant, self-assured, and focused.';
            $defaultServicesImages = [
                ['image' => 'assets/images/service1.jpg', 'title' => 'Analysis for One', 'desc' => 'Find your skin tone, eye colour, and hair colour assessment, along with warm/cool tone analysis and 12-tone seasonal analysis, using detailed and comprehensive drapes in a <span class="font-bold">90-minute session.</span>'],
                ['image' => 'assets/images/service2.jpg', 'title' => 'Analysis for Two', 'desc' => 'Find your skin tone, eye colour, and hair colour assessment, along with warm/cool tone analysis and 12-tone seasonal analysis, using detailed and comprehensive drapes in a <span class="font-bold">120-minute session.</span>'],
                ['image' => 'assets/images/service3.jpg', 'title' => 'Express for One', 'desc' => 'Find your skin tone, eye colour, and hair colour assessment, along with warm/cool tone analysis and 12-tone seasonal analysis, using detailed and comprehensive drapes in a <span class="font-bold">45-minute session.</span>'],
            ];
            $servicesTitle = !empty($page->services_title) ? $page->services_title : $defaultServicesTitle;
            $servicesText = !empty($page->services_text) ? $page->services_text : $defaultServicesText;
            $servicesImages = (!empty($page->services_images) && is_array($page->services_images)) ? $page->services_images : $defaultServicesImages;
        @endphp
        <section class="w-full py-10 bg-[#cbe9de]" data-aos="fade-up">
            <div class="max-w-6xl mx-auto px-3 sm:px-4">
                <h2 class="text-2xl sm:text-3xl md:text-5xl font-bold text-center mb-4 sm:mb-6" data-aos="fade-up" data-aos-delay="100">{!! $servicesTitle !!}</h2>
                <p class="text-center text-base sm:text-lg text-gray-700 mb-8 sm:mb-12 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="150">{!! $servicesText !!}</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
                    @foreach($servicesImages as $service)
                        <div class="flex flex-col items-center" data-aos="fade-up" data-aos-delay="{{ 200 + $loop->index * 100 }}">
                            <img src="{{ asset(is_array($service) ? ($service['image'] ?? $service[0] ?? '') : $service) }}" alt="{{ is_array($service) ? ($service['title'] ?? '') : '' }}" class="w-full h-80 object-cover rounded-none mb-6" />
                            <h3 class="text-2xl font-bold mb-2 text-center">{!! is_array($service) ? ($service['title'] ?? '') : '' !!}</h3>
                            <a href="{{ route('analyze') }}" class="mb-4 px-8 py-2 bg-black text-white font-bold uppercase tracking-wider text-base hover:bg-white hover:text-black border-2 border-black transition-colors">BOOK</a>
                            <p class="text-center text-gray-800">{!! is_array($service) ? ($service['desc'] ?? '') : '' !!}</p>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        {{-- STORY SECTION --}}
        @php
            $defaultStoryTitle = 'See How We Found Your True Colour';
            $defaultStoryText = 'Discover the ease of our studio as we take you on a simple yet transformative journey of colour discovery. In just one to one and a half hours, you\'ll find the perfect palette to effortlessly enhance your everyday style. Our expert color analyst will simplify the process of identifying your ideal hues, ensuring you look and feel your best for any occasion.';
            $defaultStoryVideo = 'https://drive.google.com/file/d/1TcHWNFjy8ln8-iBe1n8ghZ3Wv6nkxnNL/preview';
            $storyTitle = !empty($page->story_title) ? $page->story_title : $defaultStoryTitle;
            $storyText = !empty($page->story_text) ? $page->story_text : $defaultStoryText;
            $storyVideo = !empty($page->story_video) ? $page->story_video : $defaultStoryVideo;
        @endphp
        <section class="w-full py-10 bg-[#bc8b5c] md:hidden" data-aos="fade-up" id="story">
            <div class="max-w-md mx-auto px-3 sm:px-4 flex flex-col items-start">
                <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4 text-left">{!! $storyTitle !!}</h2>
                <p class="text-white text-base sm:text-lg leading-relaxed mb-6 text-left">{!! $storyText !!}</p>
                <div class="w-full aspect-square bg-gray-200 rounded-none overflow-hidden shadow-lg mb-0">
                    @if(!empty($storyVideo))
                        <iframe src="{{ $storyVideo }}" width="100%" height="100%" allow="autoplay" class="w-full h-full" allowfullscreen></iframe>
                    @endif
                </div>
            </div>
        </section>
        <section class="w-full py-24 bg-[#bc8b5c] hidden md:block" data-aos="fade-up" id="story">
            <div class="max-w-6xl mx-auto flex flex-row items-center justify-center gap-16 px-8">
                <div class="flex-1 flex justify-end">
                    <div class="w-[520px] h-[520px] max-w-[520px] max-h-[520px] bg-gray-200 rounded-none overflow-hidden shadow-lg">
                        @if(!empty($storyVideo))
                            <iframe src="{{ $storyVideo }}" width="100%" height="100%" allow="autoplay" class="w-full h-full" allowfullscreen></iframe>
                        @endif
                    </div>
                </div>
                <div class="flex-1 flex flex-col justify-center items-start pl-8">
                    <h2 class="text-5xl lg:text-6xl font-bold text-white mb-8 text-left leading-tight">{!! $storyTitle !!}</h2>
                    <p class="text-white text-xl lg:text-2xl leading-relaxed text-left max-w-xl">{!! $storyText !!}</p>
                </div>
            </div>
        </section>

        {{-- FAQ SECTION --}}
        @php
            $defaultFaqTitle = 'Frequently asked questions';
            $defaultFaqItems = [
                ['question' => 'What is personal colour analysis?', 'answer' => 'Personal colour analysis is a process that determines the colours that best suit an individual\'s natural complexion, hair, and eye colour. It helps in choosing clothing, makeup, and accessories that enhance your natural beauty.'],
                ['question' => 'How does the colour analysis process work?', 'answer' => 'The process typically involves an in-person consultation where the analyst uses a series of colour drapes to identify your seasonal colour palette (such as Spring, Summer, Autumn, or Winter) or a more detailed analysis based on the 12-season system.'],
                ['question' => 'Why is knowing my personal colours important?', 'answer' => 'Knowing your personal colours helps you make informed choices about your wardrobe and makeup, ensuring you always look your best and feel confident. It can save you time and money by avoiding purchases that don\'t suit you.'],
                ['question' => 'What should I expect during a consultation?', 'answer' => 'During a consultation, you can expect an in-depth analysis of your skin tone, eye colour, and hair colour. You will be draped with various colours to see which ones enhance your natural features. The session typically lasts between 1 to 2 hours.'],
                ['question' => 'Can men benefit from personal colour analysis?', 'answer' => 'Absolutely! Personal colour analysis is beneficial for everyone, regardless of gender. It helps men make better choices in clothing, accessories, and even professional attire.'],
            ];
            $faqTitle = !empty($page->faq_title) ? $page->faq_title : $defaultFaqTitle;
            $faqItems = (!empty($page->faq_items) && is_array($page->faq_items)) ? $page->faq_items : $defaultFaqItems;
        @endphp
        <section class="w-full py-10 bg-white md:hidden" data-aos="fade-up">
            <div class="max-w-md mx-auto px-3 sm:px-4">
                <h2 class="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 text-left">{!! $faqTitle !!}</h2>
                <div class="mb-8">
                    @foreach($faqItems as $faq)
                        <h3 class="font-bold text-lg mb-1 text-left">{!! $faq['question'] ?? '' !!}</h3>
                        <p class="text-gray-700 mb-6 text-left">{!! $faq['answer'] ?? '' !!}</p>
                    @endforeach
                    <div class="flex justify-center w-full">
                        <img src="{{ asset('assets/images/faq.jpg') }}" alt="FAQ" class="w-11/12 max-w-xs aspect-square object-cover rounded-none shadow mb-0" />
                    </div>
                </div>
            </div>
        </section>
        <section class="w-full py-24 bg-white hidden md:block" data-aos="fade-up">
            <div class="max-w-6xl mx-auto flex flex-row items-start justify-center gap-16 px-8">
                <div class="flex-1 flex flex-col justify-center items-start pr-8">
                    <h2 class="text-5xl lg:text-6xl font-bold mb-10 text-left leading-tight">{!! $faqTitle !!}</h2>
                    <div class="mb-8">
                        @foreach($faqItems as $faq)
                            <h3 class="font-bold text-2xl mb-2 text-left">{!! $faq['question'] ?? '' !!}</h3>
                            <p class="text-gray-700 mb-8 text-lg text-left">{!! $faq['answer'] ?? '' !!}</p>
                        @endforeach
                    </div>
                </div>
                <div class="flex-1 flex justify-center items-start">
                    <img src="{{ asset('assets/images/faq.jpg') }}" alt="FAQ" class="w-[480px] h-[1180px] object-cover aspect-square rounded-none shadow" />
                </div>
            </div>
        </section>
    @endif
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggleHome');
    const mobileMenu = document.getElementById('mobileMenuHome');
    const navIcon = document.getElementById('navIconHome');
    if (navToggle && mobileMenu && navIcon) {
        navToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                navIcon.classList.remove('fa-times');
                navIcon.classList.add('fa-bars');
                mobileMenu.classList.remove('opacity-100', 'translate-x-0', 'pointer-events-auto');
                mobileMenu.classList.add('opacity-0', 'translate-x-8', 'pointer-events-none');
            } else {
                navIcon.classList.remove('fa-bars');
                navIcon.classList.add('fa-times');
                mobileMenu.classList.remove('opacity-0', 'translate-x-8', 'pointer-events-none');
                mobileMenu.classList.add('opacity-100', 'translate-x-0', 'pointer-events-auto');
            }
        });
    }
});
</script>
@endpush