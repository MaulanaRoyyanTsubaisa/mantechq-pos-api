@extends('layouts.app')

@section('title', 'Analyze Me - BycolorBeauty')

@section('head-scripts')
<!-- Flatpickr CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
@endsection

@section('content')    <!-- Hero Section -->
    <section class="w-full min-h-[400px] md:min-h-[750px] flex items-center justify-center relative pt-16 pb-8 overflow-hidden" data-aos="fade-in">
        <!-- Background Image with Colorful Grid -->
        <div class="absolute inset-0 z-0">
            <div class="w-full h-full relative">
                <!-- Colorful background sections -->
                <section class="w-full min-h-[400px] md:min-h-[750px] flex items-center justify-center relative pt-32 pb-8" data-aos="fade-in">
                    <img src="{{ $page->analyze_hero_image ? asset('storage/' . $page->analyze_hero_image) : asset('assets/images/analyze-hero.jpg') }}" alt="Analyze Hero" class="absolute inset-0 w-full h-full object-cover object-center z-0" />
                    <div class="absolute inset-0 bg-black/10 z-10"></div>
                    <div class="container mx-auto px-4 relative z-20 flex flex-col items-center justify-center h-full">
                        @if($page->analyze_hero_title || $page->analyze_hero_desc)
                            <h1 class="text-4xl md:text-6xl font-bold text-white text-center mb-4">{{ $page->analyze_hero_title }}</h1>
                            <p class="text-xl text-white text-center max-w-2xl">{{ $page->analyze_hero_desc }}</p>
                        @endif
                    </div>
                </section>
                <!-- Models overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            </div>
        </div>
    </section>    <!-- EXPRESS FOR ONE SECTION -->
    <section class="w-full py-16 bg-white" data-aos="fade-up">
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <!-- Left: Image -->
            <div class="flex justify-center">
                <img src="@if(!empty($page->analyze_express_image) && file_exists(public_path('storage/' . $page->analyze_express_image))){{ asset('storage/' . $page->analyze_express_image) }}@else{{ asset('assets/images/analysis-one.jpg') }}@endif" alt="Express for One" class="w-full max-w-[490px] h-[400px] object-cover rounded-lg" />
            </div>
            <!-- Right: Content -->
            <div class="space-y-4">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-800">{{ $page->analyze_express_title ?: 'Express for One' }}</h2>
                <h3 class="text-xl text-gray-600 font-medium">{{ $page->analyze_express_subtitle ?: 'Personal Colour Analysis for One Person – Express' }}</h3>
                
                <div class="flex items-center space-x-4 text-lg">
                    <span class="text-gray-400 line-through">{{ $page->analyze_express_regular_price ?: 'Rp1155000.00' }}</span>
                    <span class="text-black font-bold">{{ $page->analyze_express_price ?: 'Rp855000.00' }}</span>
                    <span class="text-gray-600">| {{ $page->analyze_express_duration ?: '60' }} min</span>
                </div>
                
                <div class="text-gray-600 mb-4">{{ $page->analyze_express_location ?: 'Renon, Denpasar Selatan, Kabupaten Badung - Bali' }}</div>
                
                <button onclick="openBookingModal('{{ $page->analyze_express_title ?: 'Express for One' }}', '{{ $page->analyze_express_subtitle ?: 'Personal Colour Analysis for One Person – Express' }}', '{{ $page->analyze_express_duration ?: '60' }}', '{{ $page->analyze_express_sale_price ?: 'Rp855000.00' }}')" 
                        class="bg-black text-white font-bold px-8 py-3 uppercase tracking-wider hover:bg-gray-800 transition-colors">
                    BOOK NOW
                </button>
                
                <p class="text-gray-700 leading-relaxed mt-6">
                    {{ $page->analyze_express_desc ?: 'A 45-minute session including an assessment of skin tone, eye colour, and hair colour, along with warm/cool tone analysis. This session features a detailed 12-tone seasonal analysis with comprehensive draping to identify your least and best colours, including neutrals.' }}
                </p>
            </div>
        </div>
    </section>    <!-- ANALYSIS FOR ONE SECTION -->
    <section class="w-full py-16 bg-pink-100" data-aos="fade-up">
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <!-- Left: Image -->
            <div class="flex justify-center">
                <img src="@if(!empty($page->analyze_one_image) && file_exists(public_path('storage/' . $page->analyze_one_image))){{ asset('storage/' . $page->analyze_one_image) }}@else{{ asset('assets/images/analysis-two.jpg') }}@endif" alt="Analysis for One" class="w-full max-w-[490px] h-[400px] object-cover rounded-lg" />
            </div>
            <!-- Right: Content -->
            <div class="space-y-4">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-800">{{ $page->analyze_one_title ?: 'Analysis for One' }}</h2>
                <h3 class="text-xl text-gray-600 font-medium">{{ $page->analyze_one_subtitle ?: 'Personal Colour Test for One Person' }}</h3>
                
                <div class="flex items-center space-x-4 text-lg">
                    <span class="text-gray-400 line-through">{{ $page->analyze_one_regular_price ?: 'Rp2000000.00' }}</span>
                    <span class="text-black font-bold">{{ $page->analyze_one_price ?: 'Rp1555000.00' }}</span>
                    <span class="text-gray-600">| {{ $page->analyze_one_duration ?: '90' }} min</span>
                </div>
                
                <div class="text-gray-600 mb-4">{{ $page->analyze_one_location ?: 'Renon, Denpasar Selatan, Kabupaten Badung - Bali' }}</div>
                
                <button onclick="openBookingModal('{{ $page->analyze_one_title ?: 'Analysis for One' }}', '{{ $page->analyze_one_subtitle ?: 'Personal Colour Test for One Person' }}', '{{ $page->analyze_one_duration ?: '90' }}', '{{ $page->analyze_one_sale_price ?: 'Rp1555000.00' }}')" 
                        class="bg-black text-white font-bold px-8 py-3 uppercase tracking-wider hover:bg-gray-800 transition-colors">
                    BOOK NOW
                </button>
                
                <p class="text-gray-700 leading-relaxed mt-6">
                    {{ $page->analyze_one_desc ?: 'A 75-minute session including an assessment of skin tone, eye colour, and hair colour, along with warm/cool tone analysis with comprehensive draping to identify your least and best colours, including neutrals. Additionally, you will receive personalized recommendations for hair colour, jewelry, nail polish, and makeup.' }}
                </p>
            </div>
        </div>
    </section>    <!-- ANALYSIS FOR TWO SECTION -->
    <section class="w-full py-16 bg-green-100" data-aos="fade-up">
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <!-- Left: Image -->
            <div class="flex justify-center">
                <img src="@if(!empty($page->analyze_two_image) && file_exists(public_path('storage/' . $page->analyze_two_image))){{ asset('storage/' . $page->analyze_two_image) }}@else{{ asset('assets/images/analysis-three.jpg') }}@endif" alt="Analysis for Two" class="w-full max-w-[490px] h-[400px] object-cover rounded-lg" />
            </div>
            <!-- Right: Content -->
            <div class="space-y-4">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-800">{{ $page->analyze_two_title ?: 'Analysis for Two' }}</h2>
                <h3 class="text-xl text-gray-600 font-medium">{{ $page->analyze_two_subtitle ?: 'Personal Colour Test for Two Person' }}</h3>
                
                <div class="flex items-center space-x-4 text-lg">
                    <span class="text-gray-400 line-through">{{ $page->analyze_two_regular_price ?: 'Rp2555000.00' }}</span>
                    <span class="text-black font-bold">{{ $page->analyze_two_price ?: 'Rp2155000.00' }}</span>
                    <span class="text-gray-600">| {{ $page->analyze_two_duration ?: '120' }} min</span>
                </div>
                
                <div class="text-gray-600 mb-4">{{ $page->analyze_two_location ?: 'Renon, Denpasar Selatan, Kabupaten Badung - Bali' }}</div>
                
                <button onclick="openBookingModal('{{ $page->analyze_two_title ?: 'Analysis for Two' }}', '{{ $page->analyze_two_subtitle ?: 'Personal Colour Test for Two Person' }}', '{{ $page->analyze_two_duration ?: '120' }}', '{{ $page->analyze_two_sale_price ?: 'Rp2155000.00' }}')" 
                        class="bg-black text-white font-bold px-8 py-3 uppercase tracking-wider hover:bg-gray-800 transition-colors">
                    BOOK NOW
                </button>
                
                <p class="text-gray-700 leading-relaxed mt-6">
                    {{ $page->analyze_two_desc ?: 'A perfect session for couples, friends, or family members. This comprehensive 120-minute session includes a detailed skin tone, eye colour, and hair colour assessment for both individuals, along with warm/cool tone analysis and personalized style recommendations.' }}
                </p>
            </div>
        </div>
    </section>    <!-- IMPROVE SECTION -->
    <section class="w-full py-16 bg-white" data-aos="fade-up">
        <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-2">{{ $page->analyze_improve_title ?: 'Personal Colour<br>Helps You to Improve' }}</h2>
            <p class="text-center text-lg text-gray-700 mb-12 max-w-2xl mx-auto font-semibold">{{ $page->analyze_improve_desc ?: 'By unlocking your personal colour palette, you\'ll effortlessly choose the perfect hues for everything you wear and use every day.' }}</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">                @php
                    // Make sure we get valid cards from the model
                    $improveCards = $page->analyze_improve_cards;
                    
                    // Debug output to verify what data we're getting
                    // Comment this out in production
                    // dd($improveCards, gettype($improveCards));
                @endphp
                
                @foreach($improveCards as $index => $card)
                    <!-- Card {{ $index + 1 }} -->
                    <div class="flex flex-col items-center text-center">
                        <div class="w-48 h-48 bg-[#f7a08a] rounded-t-full rounded-b-none flex items-end justify-center mb-6 overflow-hidden">
                            @php
                                $imageSrc = '';
                                if (!empty($card['image'])) {
                                    // Check if this is a full path or just a filename
                                    if (str_starts_with($card['image'], 'assets/')) {
                                        $imageSrc = asset($card['image']);
                                    } else {
                                        $imageSrc = asset('storage/' . $card['image']);
                                    }
                                } else {
                                    $imageSrc = asset('assets/images/improve' . ($index + 1) . '.png');
                                }
                            @endphp
                            <img src="{{ $imageSrc }}" 
                                alt="Improve {{ $index + 1 }}" 
                                class="h-40 object-contain" />
                        </div>
                        <p class="text-gray-800">
                            {{ $card['text'] ?? ($index == 0 
                                ? 'Unlocking your personal colour palette can transform your fashion appearance. Knowing which hues complement your natural features helps you create a cohesive, polished, and vibrant look, boosting your confidence and style.' 
                                : ($index == 1 
                                    ? 'Personal colour palette is crucial for perfecting makeup. Identifying shades that complement your skin tone, eyes, and hair enhances your natural beauty. These colours create a polished, radiant look, boosting your confidence.' 
                                    : 'Understanding your personal colour palette isn\'t just for clothes and makeup—it also helps you choose accessories. By coordinating items like bags, hats, and shoes with your features, you enhance your overall appearance effortlessly.'
                                )
                            ) }}
                        </p>
                    </div>
                @endforeach
            </div>
        </div>
    </section>    <!-- VISIT OUR STUDIO SECTION -->
    <section class="w-full py-16 bg-[#cbe9de]" data-aos="fade-up">
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <!-- Left: Video -->
            <div class="flex justify-center">
                <div class="w-[420px] h-[315px] bg-gray-200 rounded shadow overflow-hidden flex items-center justify-center">
                    @if($page->analyze_studio_video)
                        <iframe
                            src="{{ $page->analyze_studio_video }}"
                            width="100%"
                            height="100%"
                            allow="autoplay"
                            class="w-full h-full"
                            allowfullscreen></iframe>
                    @elseif($page->analyze_studio_image)
                        <img src="{{ asset('storage/' . $page->analyze_studio_image) }}" alt="Studio" class="w-full h-full object-cover" />
                    @else
                        <iframe
                            src="https://drive.google.com/file/d/1TcHWNFjy8ln8-iBe1n8ghZ3Wv6nkxnNL/preview"
                            width="100%"
                            height="100%"
                            allow="autoplay"
                            class="w-full h-full"
                            allowfullscreen></iframe>
                    @endif
                </div>
            </div>
            <!-- Right: Content -->
            <div>
                <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ $page->analyze_studio_title ?: 'Visit our studio<br>in Denpasar, Bali' }}</h2>
                <p class="text-gray-800 text-base leading-relaxed">
                    {{ $page->analyze_studio_desc ?: 'Visit our vibrant colour studio in the heart of Denpasar, Bali. We\'re thrilled to be Bali\'s very first personal colour analysis studio, ready to help you unveil your true colours while you\'re on the go.' }}
                </p>
            </div>
        </div>
    </section>

    <!-- FOOTER/CONTACT SECTION -->
    <section class="w-full py-12 bg-white border-t border-gray-100" data-aos="fade-up">
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <!-- Left: Address & Contacts -->
            <div class="flex flex-col md:flex-row md:space-x-12">
                <div class="mb-6 md:mb-0">
                    <h3 class="font-bold text-lg mb-1">Address</h3>
                    <p>Renon, Denpasar Selatan<br>Kota Denpasar - Bali 80239</p>
                </div>
                <div>
                    <h3 class="font-bold text-lg mb-1">Contacts</h3>
                    <a href="tel:+62811120645" class="block hover:underline">+62 811 120 645</a>
                    <a href="mailto:hello@colourbyutie.com" class="block hover:underline">hello@colourbyutie.com</a>
                </div>
            </div>
            <!-- Right: Email Form -->
            <div class="flex flex-col items-center md:items-start">
                <h3 class="font-bold text-lg mb-4 text-center md:text-left">Submit your email to get our company profile</h3>
                <form action="#" method="POST" class="w-full max-w-md flex flex-col space-y-4">
                    <div>
                        <label class="block mb-1">Email address</label>
                        <input type="email" name="email" placeholder="Your email address" required class="w-full px-4 py-2 bg-gray-100 text-black rounded-none focus:outline-none" />
                    </div>
                    <button type="submit" class="w-32 bg-black text-white font-bold py-2 px-4 uppercase tracking-wider hover:bg-white hover:text-black border-2 border-black transition-colors">Submit</button>
                </form>
            </div>
        </div>
        <div class="max-w-6xl mx-auto px-4 mt-8 flex space-x-6">
            <a href="#" class="text-black text-2xl hover:text-gray-600"><i class="fab fa-facebook"></i></a>
            <a href="#" class="text-black text-2xl hover:text-gray-600"><i class="fab fa-instagram"></i></a>
            <a href="#" class="text-black text-2xl hover:text-gray-600"><i class="fab fa-tiktok"></i></a>
        </div>
    </section>

    <!-- Booking Modal -->
    <div id="bookingModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex">
                <!-- Left Side - Service Info -->
                <div class="w-1/3 p-6 border-r border-gray-200">
                    <div class="flex justify-between items-start mb-4">
                        <h3 id="modalServiceName" class="text-xl font-bold">Service Name</h3>
                        <button onclick="closeBookingModal()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-3 text-sm text-gray-600">
                        <div class="flex items-center">
                            <i class="far fa-calendar mr-2"></i>
                            <span id="selectedDate">Select date</span>
                        </div>
                        <div class="flex items-center">
                            <i class="far fa-clock mr-2"></i>
                            <span id="modalDuration">Duration</span>
                        </div>
                        <div class="flex items-start">
                            <i class="fas fa-map-marker-alt mr-2 mt-1"></i>
                            <span>Renon, Denpasar Selatan, Kabupaten Badung - Bali</span>
                        </div>
                    </div>
                </div>
                
                <!-- Right Side - Calendar and Time Selection -->
                <div class="w-2/3 p-6">
                    <h4 class="text-lg font-semibold mb-4">Select date & time</h4>
                    
                    <div class="flex gap-6">
                        <!-- Calendar -->
                        <div class="flex-1">
                            <div id="calendar" class="inline-block"></div>
                        </div>
                        
                        <!-- Time Slots -->
                        <div class="w-48">
                            <div id="selectedDateDisplay" class="text-sm font-medium mb-4 text-gray-600">Select a date</div>
                            <div id="timeSlots" class="space-y-2">
                                <!-- Time slots will be populated by JavaScript -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
                        <button onclick="closeBookingModal()" class="px-6 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                        <button id="bookButton" onclick="submitBooking()" disabled class="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">Book</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

@section('scripts')
<!-- Flatpickr JS -->
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script>
    let selectedDate = null;
    let selectedTime = null;
    let currentService = {};
    let flatpickrInstance = null;

    // Available time slots
    const timeSlots = [
        '09:00 AM',
        '12:00 PM',
        '02:00 PM',
        '04:00 PM'
    ];

    function openBookingModal(serviceName, serviceDescription, duration, price) {
        // Store the price exactly as it is displayed
        currentService = {
            name: serviceName,
            description: serviceDescription,
            duration: duration,
            price: price
        };
        
        document.getElementById('modalServiceName').textContent = serviceName;
        document.getElementById('modalDuration').textContent = duration + ' min';
        document.getElementById('bookingModal').classList.remove('hidden');
        
        // Initialize Flatpickr
        initializeCalendar();
        
        // Reset selections
        selectedDate = null;
        selectedTime = null;
        updateBookButton();
        document.getElementById('selectedDate').textContent = 'Select date';
        document.getElementById('selectedDateDisplay').textContent = 'Select a date';
        clearTimeSlots();
    }

    function closeBookingModal() {
        document.getElementById('bookingModal').classList.add('hidden');
        if (flatpickrInstance) {
            flatpickrInstance.destroy();
            flatpickrInstance = null;
        }
    }    async function initializeCalendar() {
        const calendarElement = document.getElementById('calendar');
        
        if (flatpickrInstance) {
            flatpickrInstance.destroy();
        }
          let availableDates = [];
        try {
            const apiUrl = '{{ url("/") }}/api/booking/available-dates';
            console.log('Fetching available dates from:', apiUrl); // Debug log
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch available dates: ${response.status} ${errorText}`);
            }
            
            availableDates = await response.json();
            console.log('Successfully fetched available dates:', availableDates);
        } catch (error) {
            console.error('Error fetching available dates:', error);
        }
          flatpickrInstance = flatpickr(calendarElement, {
            inline: true,
            minDate: "today",
            maxDate: new Date().fp_incr(90), // 90 days from today
            dateFormat: "Y-m-d",
            enable: availableDates.map(date => new Date(date)), // Only enable the available dates
            disable: [
                function(date) {
                    // Default disable all dates, we'll enable only specific ones with enable option
                    return true;
                }
            ],
            onChange: function(selectedDates, dateStr, instance) {
                if (selectedDates.length > 0) {
                    selectedDate = dateStr;
                    const date = selectedDates[0];
                    const options = { weekday: 'long', month: 'long', day: 'numeric' };
                    const formattedDate = date.toLocaleDateString('en-US', options);
                    
                    document.getElementById('selectedDate').textContent = dateStr;
                    document.getElementById('selectedDateDisplay').textContent = formattedDate;
                    
                    populateTimeSlots(date);
                    updateBookButton();
                }
            }
        });
    }

    function populateTimeSlots(selectedDateObj) {
        const timeSlotsContainer = document.getElementById('timeSlots');
        timeSlotsContainer.innerHTML = '';

        timeSlots.forEach(time => {
            const button = document.createElement('button');
            button.className = 'w-full p-3 text-left border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors font-bold';
            button.textContent = time;
            button.onclick = () => selectTime(time, button);
            timeSlotsContainer.appendChild(button);
        });
    }    function selectTime(time, buttonElement) {
        console.log('Selected time:', time);
        
        // Remove previous selection
        document.querySelectorAll('#timeSlots button').forEach(btn => {
            btn.classList.remove('border-blue-500', 'bg-blue-50', 'text-blue-600');
            btn.classList.add('border-gray-200');
        });
        
        // Add selection to clicked button
        buttonElement.classList.remove('border-gray-200');
        buttonElement.classList.add('border-blue-500', 'bg-blue-50', 'text-blue-600');
        
        selectedTime = time;
        updateBookButton();
    }

    function clearTimeSlots() {
        document.getElementById('timeSlots').innerHTML = '';
    }

    function updateBookButton() {
        const bookButton = document.getElementById('bookButton');
        if (selectedDate && selectedTime) {
            bookButton.disabled = false;
        } else {
            bookButton.disabled = true;
        }
    }    function submitBooking() {
        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time');
            return;
        }
          // Prepare booking data
        const bookingData = {
            service: currentService.name,
            description: currentService.description,
            duration: currentService.duration,
            price: currentService.price, // Keep the original format to ensure it's sent correctly
            date: selectedDate,
            time: selectedTime,
            timestamp: new Date().toISOString()
        };
        
        // Validate data before submission
        if (!bookingData.service) {
            console.error('Missing service name');
            bookingData.service = 'Express for One';
        }
        
        if (!bookingData.date) {
            console.error('Missing date');
            bookingData.date = new Date().toISOString().split('T')[0]; // Use today's date as fallback
        }
        
        if (!bookingData.time) {
            console.error('Missing time');
            bookingData.time = '10:00 AM'; // Use default time as fallback
        }
        
        // Log booking data to console for debugging
        console.log('Booking data being submitted:', bookingData);
        
        // Create a form to post the data
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '{{ route('checkout') }}';
        form.style.display = 'none';
        
        // Add CSRF token
        const csrfToken = document.createElement('input');
        csrfToken.type = 'hidden';
        csrfToken.name = '_token';
        csrfToken.value = '{{ csrf_token() }}';
        form.appendChild(csrfToken);
        
        // Add all booking data as hidden fields
        for (const [key, value] of Object.entries(bookingData)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
        }
        
        // Append form to body, submit it, and then remove it
        document.body.appendChild(form);
        form.submit();
    }
</script>
@endsection
