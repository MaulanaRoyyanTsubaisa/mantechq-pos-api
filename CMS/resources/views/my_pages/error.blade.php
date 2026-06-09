@extends('layouts.app')

@section('title', 'Error')
@section('content')
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - Something went wrong</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-30px); }
            60% { transform: translateY(-15px); }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes wiggle {
            0%, 7%, 14%, 21%, 28% {
                transform: rotate(0deg);
            }
            3.5%, 10.5%, 17.5%, 24.5% {
                transform: rotate(-5deg);
            }
            7%, 14%, 21% {
                transform: rotate(5deg);
            }
        }
        
        .float { animation: float 3s ease-in-out infinite; }
        .bounce { animation: bounce 2s infinite; }
        .fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .pulse { animation: pulse 2s infinite; }
        .wiggle { animation: wiggle 1s ease-in-out; }
        
        .bg-gradient-error {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .glass-morphism {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .floating-shapes {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
        }
        
        .shape {
            position: absolute;
            opacity: 0.1;
        }
        
        .shape-1 { top: 10%; left: 10%; animation: float 4s ease-in-out infinite; }
        .shape-2 { top: 20%; right: 10%; animation: float 5s ease-in-out infinite reverse; }
        .shape-3 { bottom: 30%; left: 20%; animation: float 6s ease-in-out infinite; }
        .shape-4 { bottom: 20%; right: 20%; animation: float 4.5s ease-in-out infinite reverse; }
        
        .error-code {
            font-size: 8rem;
            font-weight: 900;
            background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
            background-size: 400% 400%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradient 3s ease infinite;
        }
        
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .btn-hover {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .btn-hover::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.5s;
        }
        
        .btn-hover:hover::before {
            left: 100%;
        }
        
        .glitch {
            position: relative;
        }
        
        .glitch::before,
        .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .glitch::before {
            animation: glitch-1 0.5s infinite linear alternate-reverse;
            color: #ff0040;
            z-index: -1;
        }
        
        .glitch::after {
            animation: glitch-2 0.5s infinite linear alternate-reverse;
            color: #00ffff;
            z-index: -2;
        }
        
        @keyframes glitch-1 {
            0% { clip: rect(64px, 9999px, 66px, 0); }
            5% { clip: rect(30px, 9999px, 36px, 0); }
            10% { clip: rect(80px, 9999px, 86px, 0); }
            15% { clip: rect(12px, 9999px, 18px, 0); }
            20% { clip: rect(95px, 9999px, 100px, 0); }
            25% { clip: rect(45px, 9999px, 50px, 0); }
            30% { clip: rect(75px, 9999px, 80px, 0); }
            35% { clip: rect(25px, 9999px, 30px, 0); }
            40% { clip: rect(85px, 9999px, 90px, 0); }
            45% { clip: rect(15px, 9999px, 20px, 0); }
            50% { clip: rect(70px, 9999px, 75px, 0); }
        }
        
        @keyframes glitch-2 {
            0% { clip: rect(54px, 9999px, 58px, 0); }
            5% { clip: rect(20px, 9999px, 24px, 0); }
            10% { clip: rect(88px, 9999px, 92px, 0); }
            15% { clip: rect(35px, 9999px, 40px, 0); }
            20% { clip: rect(65px, 9999px, 70px, 0); }
            25% { clip: rect(10px, 9999px, 15px, 0); }
            30% { clip: rect(82px, 9999px, 87px, 0); }
            35% { clip: rect(42px, 9999px, 47px, 0); }
            40% { clip: rect(28px, 9999px, 33px, 0); }
            45% { clip: rect(78px, 9999px, 83px, 0); }
            50% { clip: rect(18px, 9999px, 23px, 0); }
        }
    </style>
</head>
<body class="bg-gradient-error min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Floating Background Shapes -->
    <div class="floating-shapes">
        <div class="shape shape-1 w-32 h-32 bg-white rounded-full"></div>
        <div class="shape shape-2 w-24 h-24 bg-purple-300 rounded-lg transform rotate-45"></div>
        <div class="shape shape-3 w-28 h-28 bg-pink-300 rounded-full"></div>
        <div class="shape shape-4 w-20 h-20 bg-blue-300 rounded-lg"></div>
    </div>

    <div class="container mx-auto px-4 py-12 text-center relative z-10">
        <!-- Error Icon -->
        <div class="fade-in-up mb-8">
            <div class="relative inline-block">
                <div class="bounce text-8xl text-white mb-4">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="absolute -top-4 -right-4 pulse">
                    <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <i class="fas fa-times text-white text-sm"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error Code -->
        <div class="fade-in-up error-code mb-6 glitch" data-text="OOPS!" style="animation-delay: 0.2s;">
            OOPS!
        </div>

        <!-- Glass Card Container -->
        <div class="fade-in-up glass-morphism rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl" style="animation-delay: 0.4s;">
            <!-- Error Title -->
            <h1 class="text-4xl font-bold text-white mb-6">
                Something went wrong!
            </h1>

            <!-- Error Message -->
            <div class="mb-6">
                <p class="text-lg text-gray-200 mb-4" id="error-message">
                    An unexpected error occurred. Don't worry, our team has been notified!
                </p>
                
                <!-- Error Details (if any) -->
                <div id="error-details" class="hidden">
                    <div class="bg-black bg-opacity-30 rounded-lg p-4 text-left">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-semibold text-gray-300">Error Details:</span>
                            <button onclick="toggleErrorDetails()" class="text-gray-400 hover:text-white">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <pre class="text-xs text-gray-300 overflow-x-auto" id="error-code-content">
<!-- This would contain the actual error details -->
Error: Something went wrong in the application
Stack trace would appear here...
                        </pre>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
                <!-- Home Button -->
                <a href="/" class="btn-hover inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <i class="fas fa-home mr-2"></i>
                    Back to Home
                </a>

                <!-- Refresh Button -->
                <button onclick="refreshPage()" class="btn-hover inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <i class="fas fa-redo mr-2"></i>
                    Try Again
                </button>

                <!-- Report Button -->
                <button onclick="reportError()" class="btn-hover inline-block px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <i class="fas fa-bug mr-2"></i>
                    Report Issue
                </button>
            </div>

            <!-- Additional Options -->
            <div class="mt-8 pt-6 border-t border-white border-opacity-20">
                <p class="text-sm text-gray-300 mb-4">Need help? Here are some options:</p>
                <div class="flex flex-wrap justify-center gap-4">
                    <button onclick="toggleErrorDetails()" class="text-gray-300 hover:text-white transition-colors duration-300">
                        <i class="fas fa-code mr-1"></i>
                        <span class="text-sm">Show Details</span>
                    </button>
                    <a href="/contact" class="text-gray-300 hover:text-white transition-colors duration-300">
                        <i class="fas fa-envelope mr-1"></i>
                        <span class="text-sm">Contact Support</span>
                    </a>
                    <a href="/help" class="text-gray-300 hover:text-white transition-colors duration-300">
                        <i class="fas fa-question-circle mr-1"></i>
                        <span class="text-sm">Help Center</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Fun Animation Element -->
        <div class="mt-8 fade-in-up" style="animation-delay: 0.6s;">
            <div class="float inline-block">
                <div class="text-white text-opacity-60">
                    <i class="fas fa-robot text-4xl mb-2"></i>
                    <p class="text-sm">Our robots are working on it!</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Floating Particles -->
    <div id="particles" class="fixed inset-0 pointer-events-none z-0"></div>

    <script>
        // Add some interactive particles
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'absolute w-2 h-2 bg-white opacity-30 rounded-full';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '100%';
            particle.style.animation = `float ${3 + Math.random() * 4}s ease-out forwards`;
            
            document.getElementById('particles').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 7000);
        }

        // Create particles periodically
        setInterval(createParticle, 500);

        // Interactive functions
        function refreshPage() {
            const btn = event.target.closest('button');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Refreshing...';
            btn.classList.add('wiggle');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }

        function reportError() {
            const btn = event.target.closest('button');
            btn.innerHTML = '<i class="fas fa-check mr-2"></i>Reported!';
            btn.classList.add('pulse');
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-bug mr-2"></i>Report Issue';
                btn.classList.remove('pulse');
            }, 2000);
        }

        function toggleErrorDetails() {
            const details = document.getElementById('error-details');
            details.classList.toggle('hidden');
        }

        // Add some life to the page
        document.addEventListener('DOMContentLoaded', function() {
            // Add hover effects to buttons
            const buttons = document.querySelectorAll('button, a');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05) translateY(-2px)';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1) translateY(0)';
                });
            });

            // Add click effects
            document.addEventListener('click', function(e) {
                const ripple = document.createElement('div');
                ripple.className = 'absolute rounded-full bg-white opacity-30 pointer-events-none';
                ripple.style.width = ripple.style.height = '20px';
                ripple.style.left = (e.clientX - 10) + 'px';
                ripple.style.top = (e.clientY - 10) + 'px';
                ripple.style.animation = 'pulse 0.6s ease-out';
                
                document.body.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Easter egg - Konami code
        let konamiCode = [];
        const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        
        document.addEventListener('keydown', function(e) {
            konamiCode.push(e.keyCode);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.toString() === konamiSequence.toString()) {
                document.body.style.animation = 'gradient 0.5s ease infinite';
                setTimeout(() => {
                    alert('🎉 Konami code activated! You found the easter egg!');
                    document.body.style.animation = '';
                }, 1000);
            }
        });
    </script>
</body>
</html>
@endsection
