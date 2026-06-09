@extends('layouts.app')
@section('content')    
<!-- Hero Section -->
    <section class="w-full min-h-[400px] md:min-h-[700px] flex items-center justify-center relative pt-32 pb-8 transition-all duration-500 ease-in-out" data-aos="fade-in">
        <img src="{{ !empty($page->steps_hero_image) ? asset($page->steps_hero_image) : asset('assets/images/steps-hero.jpg') }}" alt="Steps Hero" class="absolute inset-0 w-full h-full object-cover object-center z-0 transition-all duration-500 ease-in-out" />
        <div class="absolute inset-0 bg-black/10 z-10 transition-all duration-500 ease-in-out"></div>
        <div class="container mx-auto px-4 relative z-20 flex flex-col items-center justify-center h-full transition-all duration-500 ease-in-out">
        </div>
    </section>    <!-- Section 1: Self Expression -->
    <section class="w-full min-h-[500px] bg-white flex items-center justify-center py-20 transition-all duration-500 ease-in-out" data-aos="fade-up">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 px-4 items-center md:px-8 lg:px-12">
            <!-- Left: Text -->
            <div class="flex flex-col justify-center items-end w-full px-4 md:px-0">
                <div class="w-full max-w-xl">
                    <p class="text-sm md:text-base text-gray-500 uppercase tracking-widest mb-3 md:mb-4">WHAT WE STAND FOR</p>
                    <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 lg:mb-8 leading-tight">{{ $page->steps_section1_title }}</h2>
                    <p class="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
                        {{ $page->steps_section1_text }}
                    </p>
                </div>
            </div>
            <!-- Right: Image -->
            <div class="flex justify-center items-center relative w-full">
                <div class="w-full max-w-xl flex justify-center items-center">
                    <div class="w-[320px] h-[320px] md:w-[500px] md:h-[500px] bg-transparent flex-shrink-0 relative" style="clip-path: polygon(85% 0, 100% 100%, 0 100%, 15% 0);">
                        <img src="{{ asset($page->steps_section1_image) }}" alt="{{ $page->steps_section1_title }}" class="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
    </section>    <!-- Section 2: Empowerment + Confidence -->
    <section class="w-full min-h-[500px] bg-[#f9cbc2] flex items-center justify-center py-20 transition-all duration-500 ease-in-out" data-aos="fade-up">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 px-4 items-center md:px-8 lg:px-12">
            <!-- Left: Image -->
            <div class="flex justify-center items-center relative w-full">
                <div class="w-full max-w-xl flex justify-center items-center">
                    <div class="w-[300px] h-[300px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] bg-transparent flex-shrink-0" style="clip-path: xywh(0 0 100% 100% round 0 40%);">
                        <img src="{{ asset($page->steps_section2_image) }}" alt="{{ $page->steps_section2_title }}" class="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
            <!-- Right: Text -->
            <div class="flex flex-col justify-center items-start w-full px-4 md:px-0">
                <div class="w-full max-w-xl">
                    <p class="text-xs md:text-sm lg:text-base text-gray-600 uppercase tracking-widest mb-2 md:mb-3 lg:mb-4">WHAT WE STAND FOR</p>
                    <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 lg:mb-8 leading-tight">{{ $page->steps_section2_title }}</h2>
                    <p class="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
                        {{ $page->steps_section2_text }}
                    </p>
                </div>
            </div>
        </div>
    </section>    <!-- Section 3: Creativity + Innovation -->
    <section class="w-full min-h-[500px] bg-white flex items-center justify-center py-20 transition-all duration-500 ease-in-out" data-aos="fade-up">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 px-4 items-center md:px-8 lg:px-12">
            <!-- Left: Text -->
            <div class="flex flex-col justify-center items-start w-full px-4 md:px-0">
                <div class="w-full max-w-xl">
                    <p class="text-sm md:text-base text-gray-500 uppercase tracking-widest mb-3 md:mb-4">WHAT WE STAND FOR</p>
                    <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 lg:mb-8 leading-tight">{{ $page->steps_section3_title }}</h2>
                    <p class="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
                        {{ $page->steps_section3_text }}
                    </p>
                </div>
            </div>
            <!-- Right: Image -->
            <div class="flex justify-center items-center relative w-full">
                <div class="w-full max-w-xl flex justify-center items-center">
                    <div class="w-[320px] h-[320px] md:w-[500px] md:h-[500px] bg-transparent flex-shrink-0 relative" style="clip-path: polygon(0 0, 15% 100%, 100% 100%, 85% 0);">
                        <img src="{{ asset($page->steps_section3_image) }}" alt="{{ $page->steps_section3_title }}" class="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Section: Step-by-step Colour Analysis Gallery -->
    <section class="w-full bg-[#cbe9de] py-32 md:py-20 transition-all duration-500 ease-in-out" data-aos="fade-up">
        <div class="max-w-6xl mx-auto w-full flex flex-col items-center justify-center px-4">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-2 transition-all duration-500 ease-in-out" data-aos="fade-up">Step-by-step Colour Analysis</h2>
              <!-- Mobile: Vertical layout -->            <div class="md:hidden w-full max-w-sm mx-auto space-y-8">                @php
                    // Emergency fix for array handling - always force proper array handling
                    try {
                        // Use the hardcoded default array if we're getting errors
                        $galleryImages = [
                            ['image' => 'assets/images/step1.jpg'],
                            ['image' => 'assets/images/step2.jpg'],
                            ['image' => 'assets/images/step3.jpg']
                        ];
                        
                        // Only try to use the page data if it actually exists and is valid
                        if (isset($page->steps_gallery_images)) {
                            $rawData = $page->steps_gallery_images;
                            
                            // Handle all possible data types
                            if (is_array($rawData) && count($rawData) > 0) {
                                $galleryImages = $rawData;
                            } elseif (is_string($rawData) && !empty($rawData)) {
                                $decoded = json_decode($rawData, true);
                                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded) && count($decoded) > 0) {
                                    $galleryImages = $decoded;
                                }
                            }
                        }
                        
                        // Final validation to ensure each item has an 'image' key
                        foreach ($galleryImages as $key => $item) {
                            if (!is_array($item) || !isset($item['image'])) {
                                $galleryImages[$key] = ['image' => 'assets/images/step'.($key + 1).'.jpg'];
                            }
                        }
                    } catch (\Exception $e) {
                        // Silently catch errors and use defaults
                    }
                    
                    // Uncomment for debugging
                    // dd($page->steps_gallery_images, gettype($page->steps_gallery_images), $galleryImages);
                @endphp
                
                @if(count($galleryImages) > 0)
                    @foreach($galleryImages as $index => $image)
                    <div class="w-[120px] h-[180px] md:w-[180px] md:h-[260px] bg-gray-200 overflow-hidden mx-auto transition-all duration-500 ease-in-out">
                        <img src="{{ asset(isset($image['image']) ? 'storage/'.$image['image'] : 'assets/images/step'.($index + 1).'.jpg') }}" alt="Step {{ $index + 1 }}" class="w-full h-full object-cover transition-all duration-500 ease-in-out" />
                    </div>
                    @endforeach
                @else
                    <!-- Default Images -->
                    @for($i = 1; $i <= 3; $i++)
                    <div class="w-[120px] h-[180px] md:w-[180px] md:h-[260px] bg-gray-200 overflow-hidden mx-auto transition-all duration-500 ease-in-out">
                        <img src="{{ asset('assets/images/step'.$i.'.jpg') }}" alt="Step {{ $i }}" class="w-full h-full object-cover transition-all duration-500 ease-in-out" />
                    </div>
                    @endfor
                @endif
            </div>            <!-- Desktop: Horizontal layout -->
            <div class="hidden md:flex flex-row flex-wrap justify-center items-end max-w-fit mx-auto mt-12" style="gap: 100px;">                @if(count($galleryImages) > 0)
                    @foreach($galleryImages as $index => $image)
                    <div class="w-[120px] h-[180px] md:w-[180px] md:h-[260px] bg-gray-200 overflow-hidden transition-all duration-500 ease-in-out">
                        <img src="{{ asset(isset($image['image']) ? 'storage/'.$image['image'] : 'assets/images/step'.($index + 1).'.jpg') }}" alt="Step {{ $index + 1 }}" class="w-full h-full object-cover transition-all duration-500 ease-in-out" />
                    </div>
                    @endforeach
                @else
                    <!-- Default Images -->
                    @for($i = 1; $i <= 3; $i++)
                    <div class="w-[120px] h-[180px] md:w-[180px] md:h-[260px] bg-gray-200 overflow-hidden transition-all duration-500 ease-in-out">
                        <img src="{{ asset('assets/images/step'.$i.'.jpg') }}" alt="Step {{ $i }}" class="w-full h-full object-cover transition-all duration-500 ease-in-out" />
                    </div>
                    @endfor
                @endif
            </div>
        </div>
    </section>    <!-- Section: Step-by-step Colour Analysis Details -->    <section class="w-full bg-white py-20 transition-all duration-500 ease-in-out" data-aos="fade-up">
        <div class="max-w-6xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-10">
                @php
                    // Emergency fix for array handling - always force proper array handling
                    try {
                        // Use the hardcoded default array if we're getting errors
                        $stepDetails = [
                            [
                                'title' => 'Initial Consultation',
                                'text' => 'The personal colour analysis begins by discussing the individual\'s goals and preferences, understanding their current fashion choices, and addressing any concerns they have about colour.'
                            ],
                            [
                                'title' => 'Skin Tone Analysis',
                                'text' => 'We analyze your skin undertone using specially selected fabric drapes, determining whether you have warm or cool undertones. This foundational step guides the rest of the colour analysis process.'
                            ],
                            [
                                'title' => 'Hair & Eye Colour Assessment',
                                'text' => 'We examine your natural hair and eye colours to understand how they interact with different colour families. This helps create a harmonious palette that enhances your overall appearance.'
                            ]
                        ];
                        
                        // Only try to use the page data if it actually exists and is valid
                        if (isset($page->steps_details)) {
                            $rawData = $page->steps_details;
                            
                            // Handle all possible data types
                            if (is_array($rawData) && count($rawData) > 0) {
                                $stepDetails = $rawData;
                            } elseif (is_string($rawData) && !empty($rawData)) {
                                $decoded = json_decode($rawData, true);
                                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded) && count($decoded) > 0) {
                                    $stepDetails = $decoded;
                                }
                            }
                        }
                        
                        // Final validation to ensure each item has required keys
                        foreach ($stepDetails as $key => $item) {
                            if (!is_array($item) || !isset($item['title']) || !isset($item['text'])) {
                                $stepDetails[$key] = [
                                    'title' => 'Step ' . ($key + 1),
                                    'text' => 'Description for step ' . ($key + 1)
                                ];
                            }
                        }
                    } catch (\Exception $e) {
                        // Silently catch errors and use defaults
                    }
                    
                    // Uncomment for debugging
                    // dd($page->steps_details, gettype($page->steps_details), $stepDetails);
                @endphp
                
                @if(count($stepDetails) > 0)
                    @foreach($stepDetails as $step)
                    <div>
                        <h3 class="font-bold text-lg mb-2">{{ $step['title'] ?? '' }}</h3>
                        <p class="mb-2 text-gray-700">{{ $step['text'] ?? '' }}</p>
                    </div>
                    @endforeach
                @else
                    <!-- Default steps if steps_details is not an array -->
                    <div>
                        <h3 class="font-bold text-lg mb-2">Initial Consultation</h3>
                        <p class="mb-2 text-gray-700">The personal colour analysis begins by discussing the individual's goals and preferences, understanding their current fashion choices, and addressing any concerns they have about colour.</p>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-2">Skin Tone Analysis</h3>
                        <p class="mb-2 text-gray-700">We analyze your skin undertone using specially selected fabric drapes, determining whether you have warm or cool undertones. This foundational step guides the rest of the colour analysis process.</p>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-2">Hair & Eye Colour Assessment</h3>
                        <p class="mb-2 text-gray-700">We examine your natural hair and eye colours to understand how they interact with different colour families. This helps create a harmonious palette that enhances your overall appearance.</p>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-2">Seasonal Color Analysis</h3>
                        <p class="mb-2 text-gray-700">Using the 12-season color analysis system, we determine which season best matches your natural coloring. This includes testing various color combinations to find your most flattering palette.</p>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-2">Personal Color Palette</h3>
                        <p class="mb-2 text-gray-700">We create your personalized color palette, including your best neutrals, accent colors, and metallics. This becomes your guide for making confident color choices in clothing and accessories.</p>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-2">Styling Recommendations</h3>
                        <p class="mb-2 text-gray-700">We provide practical advice on applying your color palette to your wardrobe, makeup, and accessories. You'll learn how to mix and match colors effectively for various occasions.</p>
                    </div>
                @endif
            </div>
        </div>
    </section>    <!-- Contact Section -->
    <section class="w-full bg-[#cbe9de] py-20 transition-all duration-500 ease-in-out" data-aos="fade-up">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
            <!-- Contacts -->
            <div>
                <h2 class="text-3xl md:text-4xl font-bold mb-8">{{ $page->steps_contact_title }}</h2>
                <div class="mb-6">
                    <h3 class="font-bold mb-1">Address</h3>
                    <p>{!! nl2br(e($page->steps_contact_address)) !!}</p>
                </div>
                <div class="mb-6">
                    <h3 class="font-bold mb-1">Contacts</h3>
                    <a href="tel:{{ preg_replace('/[^0-9+]/', '', $page->steps_contact_phone) }}" class="block hover:underline">{{ $page->steps_contact_phone }}</a>
                    <a href="mailto:{{ $page->steps_contact_email }}" class="block hover:underline">{{ $page->steps_contact_email }}</a>
                </div>
                <div class="flex space-x-4 mt-6 text-2xl">
                    <a href="#" class="hover:text-gray-700"><i class="fab fa-linkedin"></i></a>
                    <a href="#" class="hover:text-gray-700"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="hover:text-gray-700"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
            <!-- Map -->
            <div class="flex justify-center items-center">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.2088559068095!2d115.22341661478383!3d-8.673742393766087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd2409b0438accd%3A0xd53b5b3d8c585368!2sRenon%2C%20South%20Denpasar%2C%20Denpasar%20City%2C%20Bali!5e0!3m2!1sen!2sid!4v1623456789012!5m2!1sen!2sid" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
        </div>
    </section>
@endsection

