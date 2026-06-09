<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Colour by Utie - Color Analysis')</title>
    <meta name="description" content="@yield('description', 'Professional color analysis service in Bali')">
    <!-- TailwindCSS and standard libraries -->
    
    <script>
        // Catch all errors
        window.addEventListener('error', function(event) {
            console.log('Global error caught:', event.error);
            console.log('Error occurred in file:', event.filename, 'line:', event.lineno, 'col:', event.colno);
            console.log('Error message:', event.message);
        });
    </script>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
    
    @livewireStyles
    
    @yield('head-scripts')    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#2c3e50',
                        secondary: '#e74c3c',
                        hero: '#faa53d',
                        logo: '#e74c3c',
                    },
                    fontFamily: {
                        logo: ['Pacifico', 'cursive'],
                    }
                }
            }
        }
    </script>
    
    <style>
        .logo-shadow {
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.04));
        }
    </style>

    <!-- Check for third-party scripts -->
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Block any external script that might be causing the error
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.tagName === 'SCRIPT' && node.innerHTML.includes('grabJobDescription')) {
                            console.warn('Blocked potentially harmful script:', node);
                            node.remove();
                        }
                    });
                }
            });
        });
        
        observer.observe(document.documentElement, { 
            childList: true, 
            subtree: true 
        });
    });
    </script>
</head>

<body>
{{-- DEBUG: app.blade.php loaded --}}
    <!-- Navbar -->
    <nav class="w-full bg-white py-3 px-0 flex items-center justify-between fixed top-0 left-0 z-50 border-b border-gray-100">
        <div class="container mx-auto px-4 relative">
            <!-- Mobile Header: X & Logo -->
            <div class="flex w-full items-center justify-between md:hidden">
                <button id="navToggle" class="text-3xl text-gray-800 focus:outline-none transition-transform duration-300">
                    <i id="navIcon" class="fas fa-bars transition-transform duration-300"></i>
                </button>
                <a href="{{ route('page.show', 'home') }}" class="mx-auto">
                    <img src="{{ asset('assets/images/logo.png') }}" alt="Logo" class="h-16 logo-shadow" />
                </a>
            </div>

            <!-- Desktop Header -->
            <div class="hidden md:flex items-center justify-between">
                <a href="{{ route('page.show', 'home') }}" class="flex items-center select-none mx-auto md:ml-16 md:mr-8">
                    <img src="{{ asset('assets/images/logo.png') }}" alt="Logo" class="h-16 logo-shadow" />
                </a>
                <ul class="hidden md:flex space-x-8">
                    <li><a href="{{ route('page.show', 'analyze') }}" class="text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4 {{ request()->is('analyze') ? 'underline' : '' }}">Analyze Me</a></li>
                    <li><a href="{{ route('page.show', 'steps') }}" class="text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4 {{ request()->is('steps') ? 'underline' : '' }}">Step by Step</a></li>
                    <li><a href="{{ route('page.show', 'Our-Story') }}" class="text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4 {{ request()->is('Our-story') ? 'underline' : '' }}">Our Story</a></li>
                    <li><a href="{{ route('page.show', 'feed') }}" class="text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4 {{ request()->is('feed') ? 'underline' : '' }}">Feed</a></li>
                </ul>
            </div>

            <!-- Mobile Menu -->
            <ul id="mobileMenu" class="hidden absolute top-full left-0 w-full bg-white py-4 px-6 space-y-4 border-b border-gray-100 md:hidden">
                <li><a href="{{ route('page.show', 'analyze') }}" class="block text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4 {{ request()->is('analyze') ? 'underline' : '' }}">Analyze Me</a></li>
                <li><a href="{{ route('page.show', 'steps') }}" class="block text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4 {{ request()->is('steps') ? 'underline' : '' }}">Step by Step</a></li>
                <li><a href="{{ route('page.show', 'Our-Story') }}" class="block text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4 {{ request()->is('Our-Story') ? 'underline' : '' }}">Our Story</a></li>
                <li><a href="{{ route('page.show', 'feed') }}" class="block text-gray-800 hover:text-logo transition-colors hover:underline underline-offset-4 {{ request()->is('feed') ? 'underline' : '' }}">Feed</a></li>
            </ul>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="min-h-screen">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-primary text-white py-8">
        <div class="container mx-auto px-4 text-center">
            <div class="mb-4">
                <a href="#" target="_blank" class="text-white hover:text-secondary transition-colors">
                    <i class="fab fa-instagram"></i> @colour_byutie
                </a>
            </div>
            <p>&copy; {{ date('Y') }} Colour by Utie. All rights reserved.</p>
        </div>
    </footer>

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            duration: 800,
            easing: "ease-in-out",
            once: true
        });

        // Mobile navigation toggle
        document.addEventListener('DOMContentLoaded', function() {
            const navToggle = document.getElementById('navToggle');
            const mobileMenu = document.getElementById('mobileMenu');
            const navIcon = document.getElementById('navIcon');

            if (navToggle) {
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
    </script>    @yield('scripts')
    @stack('scripts')
    @livewireScripts
</body>
</html>
