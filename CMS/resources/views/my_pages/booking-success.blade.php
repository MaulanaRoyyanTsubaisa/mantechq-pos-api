@extends('layouts.app')

@section('title', 'Booking Confirmed - Color Analysis')
@section('description', 'Your color analysis booking has been confirmed')

@section('content')
<div class="min-h-screen bg-gray-50 pt-16">
    <div class="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div class="bg-white shadow-lg rounded-xl p-8 text-center">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg class="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>

            <h2 class="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
            <p class="text-lg text-gray-600 mb-8">
                Thank you for booking your color analysis session. We've sent a confirmation email with all the details.
            </p>

            <div class="border-t border-gray-200 pt-8 mt-8">
                <p class="text-sm text-gray-500 mb-4">What happens next?</p>
                <div class="space-y-4 text-left max-w-lg mx-auto">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg class="h-6 w-6 text-[#faa53d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                            </svg>
                        </div>
                        <p class="ml-3 text-gray-600">Check your email for booking confirmation and preparation instructions</p>
                    </div>
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg class="h-6 w-6 text-[#faa53d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p class="ml-3 text-gray-600">Arrive 5-10 minutes before your scheduled appointment time</p>
                    </div>
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <svg class="h-6 w-6 text-[#faa53d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p class="ml-3 text-gray-600">Come with a clean face, without makeup, for the most accurate analysis</p>
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <a href="{{ route('home') }}"
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#faa53d] hover:bg-[#e89632] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#faa53d]">
                    Return to Homepage
                </a>
            </div>
        </div>
    </div>
</div>
@endsection
