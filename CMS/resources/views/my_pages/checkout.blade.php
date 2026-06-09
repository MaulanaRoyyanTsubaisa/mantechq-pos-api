@extends('layouts.app')

@section('title', $page->seo_title ?? 'Checkout - Colour By Utie')
@section('description', $page->seo_description ?? 'Complete your color analysis booking')

@section('head-scripts')
<script>
    // Ensure CSRF token is available for AJAX requests
    window.csrfToken = "{{ csrf_token() }}";
    
    document.addEventListener('DOMContentLoaded', function() {
        const submitButton = document.getElementById('submitButton');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        
        // Function to validate all inputs and update submit button
        function updateSubmitButton() {
            const nameValid = nameInput.value.trim() !== '';
            const emailValid = emailInput.value.trim() !== '' && emailInput.validity.valid;
            const phoneValid = phoneInput.value.trim() !== '';
            
            if (nameValid && emailValid && phoneValid) {
                submitButton.disabled = false;
                submitButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
                submitButton.classList.add('bg-[#faa53d]', 'hover:bg-[#e89632]');
            } else {
                submitButton.disabled = true;
                submitButton.classList.add('bg-gray-400', 'cursor-not-allowed');
                submitButton.classList.remove('bg-[#faa53d]', 'hover:bg-[#e89632]');
            }
        }
        
        // Add event listeners to form inputs
        nameInput.addEventListener('input', updateSubmitButton);
        emailInput.addEventListener('input', updateSubmitButton);
        phoneInput.addEventListener('input', updateSubmitButton);
        
        // Initialize button state
        updateSubmitButton();
    });
</script>
@endsection

@section('head-styles')
<style>
    }
</style>
@endsection

@section('content')
    <main class="bg-slate-50 py-12">
        <div class="container mx-auto px-4">
            <h1 class="text-3xl md:text-4xl font-bold text-center mb-12">Complete Your Booking</h1>
            
            <!-- Rest of the checkout content -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Left Side - Order Summary -->
                <div class="space-y-8">
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div class="p-6 sm:p-8">                            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Booking Summary</h2>
                              <div class="space-y-6">
                                @if(isset($booking))
                                <!-- Service Info -->
                                <div>
                                    <h3 class="text-sm font-medium text-gray-500">Service</h3>
                                    <p class="mt-1 text-lg text-gray-900">{{ $booking['service'] }}</p>
                                    <p class="text-sm text-gray-600">{{ $booking['description'] }}</p>
                                </div>

                                <!-- Selected Date and Time -->
                                <div>
                                    <h3 class="text-sm font-medium text-gray-500">Selected Date & Time</h3>
                                    <div class="mt-1 text-lg text-gray-900">
                                        <p>{{ \Carbon\Carbon::parse($booking['date'])->format('l, F j, Y') }}</p>
                                        <p class="text-sm text-gray-600">{{ $booking['time'] }} ({{ $booking['duration'] }} min)</p>
                                    </div>
                                </div>
                                
                                <!-- Customer Form Section -->
                                <div class="border-t border-gray-200 pt-4 mt-4">
                                    <h3 class="text-sm font-medium text-gray-500">Please complete your details</h3>
                                    <div class="mt-1">
                                        <p class="text-sm text-gray-600">Fill in your contact information in the form to complete your booking.</p>
                                    </div>
                                </div>

                            
                                @else
                                <div class="text-red-500">
                                    No booking information available. Please <a href="{{ route('analyze') }}" class="text-[#faa53d] underline">go back</a> and try again.
                                </div>
                                @endif
                            </div>                            <div class="border-t border-gray-200 mt-8 pt-8">
                                <div class="flex justify-between items-center">
                                    <span class="text-lg font-semibold text-gray-900">Total Amount</span>                                    <span id="totalPrice" class="text-2xl font-bold text-[#faa53d]">
                                        @if(isset($booking) && isset($booking['price']))
                                            @php
                                                // Clean price string by removing Rp, dots, commas and converting to float
                                                $priceValue = preg_replace('/[^0-9]/', '', $booking['price']);
                                                $priceValue = (int) $priceValue;

                                                if ($priceValue > 10000000) {
                                                    $priceValue = $priceValue / 100; // Default price if over 10 million
                                                }
                                            @endphp
                                            Rp{{ number_format($priceValue, 0, ',', '.') }}
                                        @else
                                            Rp855.000
                                        @endif
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Additional Information -->
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden p-6 sm:p-8">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
                        <ul class="space-y-4">
                            <li class="flex items-start">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-check-circle text-[#faa53d] text-xl"></i>
                                </div>
                                <p class="ml-3 text-sm text-gray-600">Receive instant confirmation via email</p>
                            </li>
                            <li class="flex items-start">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-calendar text-[#faa53d] text-xl"></i>
                                </div>
                                <p class="ml-3 text-sm text-gray-600">Get reminder 24 hours before your session</p>
                            </li>
                            <li class="flex items-start">
                                <div class="flex-shrink-0">
                                    <i class="fas fa-heart text-[#faa53d] text-xl"></i>
                                </div>
                                <p class="ml-3 text-sm text-gray-600">Free rescheduling up to 48 hours before</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Right Side - Customer Information -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="p-6 sm:p-8">
                        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Complete Your Details</h2>                        <form id="checkoutForm" class="space-y-6" action="{{ route('booking.process') }}" method="POST">
                            @csrf                            <!-- Always provide these fields with fallbacks -->
                            <input type="hidden" name="service" value="{{ $booking['service'] ?? 'Express for One' }}">
                            <input type="hidden" name="description" value="{{ $booking['description'] ?? $booking['service'] ?? 'Express for One' }}">
                            <input type="hidden" name="price" value="{{ $booking['price'] ?? '855000' }}">
                            <input type="hidden" name="date" value="{{ $booking['date'] ?? date('Y-m-d') }}">
                            <input type="hidden" name="time" value="{{ $booking['time'] ?? '10:00 AM' }}">
                            <input type="hidden" name="duration" value="{{ $booking['duration'] ?? '60' }}">
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input type="text" id="name" name="name" required value="{{ $booking['name'] ?? old('name') }}"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#faa53d] focus:border-transparent transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input type="email" id="email" name="email" required value="{{ $booking['email'] ?? old('email') }}"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#faa53d] focus:border-transparent transition-all">
                                <p class="mt-1 text-xs text-gray-500">Your booking confirmation will be sent to this email</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input type="tel" id="phone" name="phone" required value="{{ $booking['phone'] ?? old('phone') }}"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#faa53d] focus:border-transparent transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                                <textarea id="notes" name="notes" rows="3" 
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#faa53d] focus:border-transparent transition-all"></textarea>
                            </div>                            <div class="pt-4">
                                <button type="submit" id="submitButton" disabled
                                    class="w-full bg-gray-400 text-white py-4 px-6 rounded-lg transition-colors font-semibold text-lg shadow-lg cursor-not-allowed">
                                   COMPLETE
                                </button>
                                <p class="mt-2 text-center text-xs text-gray-500">Pastikan semua data sudah benar!</p>
                            </div>
                            
                            @if ($errors->any())
                            <div class="mt-6 p-4 rounded-md bg-red-50">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div class="ml-3">
                                        <h3 class="text-sm font-medium text-red-800">
                                            There were errors with your booking
                                        </h3>
                                        <div class="mt-2 text-sm text-red-700">
                                            <ul class="list-disc pl-5 space-y-1">
                                                @foreach ($errors->all() as $error)
                                                <li>{{ $error }}</li>
                                                @endforeach
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            @endif
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>    <!-- Scripts -->    <script>
        // Debug function to track execution
        function debugLog(message, data) {
            console.log(`[DEBUG] ${message}`, data || '');
        }
        
        // Success notification function
        function showSuccessNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-500 ease-out';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            // Add content
            notification.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="font-medium">${message}</span>
                </div>
            `;
            
            // Add to DOM
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 10);
            
            // Remove after delay
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
                setTimeout(() => notification.remove(), 500);
            }, 5000);
            
            // Also show alert for compatibility
            alert(message);
        }
        
        // Error notification function
        function showErrorNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-500 ease-out';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            // Add content
            notification.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="font-medium">${message}</span>
                </div>
            `;
            
            // Add to DOM
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 10);
            
            // Remove after delay
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
                setTimeout(() => notification.remove(), 500);
            }, 5000);
            
            // Also show alert for compatibility
            alert(message);
        }
        
        // Success notification function
        function showSuccessNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-500 ease-out';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            // Add content
            notification.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="font-medium">${message}</span>
                </div>
            `;
            
            // Add to DOM
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 10);
            
            // Remove after delay
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
                setTimeout(() => notification.remove(), 500);
            }, 5000);
            
            // Also show alert for compatibility
            alert(message);
        }
        
        // Error notification function
        function showErrorNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-500 ease-out';
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            // Add content
            notification.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="font-medium">${message}</span>
                </div>
            `;
            
            // Add to DOM
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 10);
            
            // Remove after delay
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
                setTimeout(() => notification.remove(), 500);
            }, 5000);
            
            // Also show alert for compatibility
            alert(message);
        }
        
        // Initialize page when DOM is ready        document.addEventListener('DOMContentLoaded', function() {
            debugLog('DOM loaded, initializing checkout page');
            
            // Wrap everything in try-catch to prevent any uncaught exceptions
            try {
                // Get booking data from sessionStorage with better error handling
                let bookingData;
                let storedData = sessionStorage.getItem('bookingData');
                
                debugLog('Raw booking data from sessionStorage:', storedData);
                
                if (!storedData) {
                    console.error('No booking data found in sessionStorage');
                    alert('No booking information found. Please select a service first.');
                    window.location.href = '{{ route('analyze') }}';
                    return;
                }
                
                bookingData = JSON.parse(storedData);
                debugLog('Parsed booking data:', bookingData);
                
                if (!bookingData || !bookingData.service || !bookingData.price) {
                    throw new Error('Invalid booking data structure');
                }

                // Display order summary and price with better error handling
                const orderSummary = document.getElementById('orderSummary');
                const totalPrice = document.getElementById('totalPrice');
                
                if (!orderSummary || !totalPrice) {
                    console.error('Required DOM elements not found');
                    return;
                }
            
            // Make sure price is properly converted to a number
            let priceValue = 0;
            try {
                // Handle various price formats
                if (typeof bookingData.price === 'string') {
                    priceValue = parseFloat(bookingData.price.replace(/[^\d.-]/g, ''));
                } else if (typeof bookingData.price === 'number') {
                    priceValue = bookingData.price;
                }
                
                if (isNaN(priceValue)) {
                    console.error('Invalid price value:', bookingData.price);
                    priceValue = 0;
                }
                
                debugLog('Converted price value:', priceValue);
            } catch (error) {
                console.error('Error processing price:', error);
                priceValue = 0;
            }

            // Format price with commas for Indonesian format
            const formatPrice = (price) => {
                try {
                    return price.toLocaleString('id-ID');
                } catch (e) {
                    console.error('Error formatting price:', e);
                    return price.toString();
                }
            };

            // Add booking details with improved styling and error handling
            try {
                orderSummary.innerHTML = `
                    <div class="space-y-4">
                        <div class="flex justify-between items-start pb-4">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900">${bookingData.service || 'Service'}</h3>
                                <div class="mt-2 space-y-1">
                                    <p class="text-sm text-gray-600">
                                        <i class="far fa-calendar-alt mr-2 text-[#faa53d]"></i>
                                        ${bookingData.date || 'Date not specified'}
                                    </p>
                                    <p class="text-sm text-gray-600">
                                        <i class="far fa-clock mr-2 text-[#faa53d]"></i>
                                        ${bookingData.time || 'Time not specified'}
                                    </p>
                                </div>
                            </div>
                            <span class="text-lg font-semibold text-gray-900">Rp ${formatPrice(priceValue)}</span>
                        </div>
                    </div>
                `;
                
                totalPrice.textContent = `Rp ${formatPrice(priceValue)}`;
                debugLog('Order summary populated successfully');
            } catch (error) {
                console.error('Error populating order summary:', error);
                orderSummary.textContent = 'Error displaying order summary. Please refresh the page.';
                totalPrice.textContent = 'Error';
            }
            
            // Handle form submission with API integration
            const checkoutForm = document.getElementById('checkoutForm');
            checkoutForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get submit button
                const submitButton = checkoutForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                
                // Make sure we have the price as a number
                const priceValue = typeof bookingData.price === 'string' 
                    ? parseFloat(bookingData.price.replace(/,/g, '')) 
                    : parseFloat(bookingData.price);
                
                // Format the booking data for API
                const formData = {
                    customer_name: document.getElementById('fullName').value.trim(),
                    customer_email: document.getElementById('email').value.trim(),
                    customer_phone: document.getElementById('phone').value.trim(),
                    notes: document.getElementById('notes').value.trim(),
                    service: bookingData.service,
                    description: bookingData.description,
                    duration: bookingData.duration,
                    price: priceValue,
                    date: bookingData.date,
                    time: bookingData.time
                };

                console.log('Sending booking data:', formData);

                // Basic validation
                if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
                    alert('Please fill in all required fields.');
                    return;
                }

                if (!formData.customer_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                    alert('Please enter a valid email address.');
                    return;
                }

                // Disable button and show loading state
                submitButton.disabled = true;
                submitButton.textContent = 'Processing...';
                  // Get CSRF token with multiple fallbacks
                const csrfToken = window.csrfToken || 
                                  document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                if (!csrfToken) {
                    console.warn('CSRF token not found. Request may fail.');
                }
                
                // Send booking data to API
                fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': csrfToken || ''
                    },
                    body: JSON.stringify(formData),
                    credentials: 'same-origin' // Include cookies for CSRF protection
                })                .then(response => {
                    console.log('Response status:', response.status);
                    // Add response headers to debug log
                    const responseHeaders = {};
                    response.headers.forEach((value, name) => {
                        responseHeaders[name] = value;
                    });
                    debugLog('Response headers:', responseHeaders);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                }).then(data => {
                    console.log('API Response:', data);
                    if (data.success) {
                        // Create and show success notification
                        showSuccessNotification('Booking successful! You will receive a confirmation email shortly.');
                        
                        // Clean up and redirect after a short delay
                        setTimeout(() => {
                            sessionStorage.removeItem('bookingData');
                            window.location.href = '{{ route('home') }}';
                        }, 2000);
                    } else {
                        showErrorNotification(data.message || 'Failed to create booking. Please try again.');
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                    }
                })                .catch(error => {
                    console.error('Error:', error);
                    // Provide more specific error message
                    let errorMessage = 'An error occurred when processing your booking. Please try again.';
                    if (error.name === 'TypeError' && error.message.includes('JSON')) {
                        errorMessage = 'Server response is not in the expected format. Please try again later.';
                    } else if (error.name === 'SyntaxError') {
                        errorMessage = 'There was a problem with the server response. Please try again later.';
                    }
                    showErrorNotification(errorMessage);
                    
                    // Log the error for debugging
                    console.log('Full error details:', {
                        name: error.name,
                        message: error.message,
                        stack: error.stack
                    });
                      submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                });
            });
            
            // Close the try block
            } catch (error) {
                console.error('Unhandled error in checkout page:', error);
                alert('An unexpected error occurred. Please refresh the page and try again.');
            }
        });
    </script>
@endsection