<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Events\NewBookingEvent;
use Illuminate\Http\Request;
use App\Mail\BookingInfoMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class TestBookingController extends Controller
{
    public function createTestBooking()
    {
        try {
            // Buat sample booking
            $booking = Booking::create([
                'service' => 'Test Color Analysis',
                'description' => 'This is a test service description',
                'duration' => 60,
                'price' => 150000,
                'date' => now()->toDateString(),
                'time' => '14:00',
                'customer_name' => 'Test Customer',
                'customer_email' => 'mursifajihan@gmail.com',
                'customer_phone' => '081234567890',
                'notes' => 'This is a test booking created directly',
                'status' => 'pending'
            ]);

            // Log booking baru
            Log::info('Test booking dibuat dengan ID: ' . $booking->id);
            
            // Trigger event untuk dashboard CMS
            try {
                event(new NewBookingEvent($booking));
                Log::info('Event NewBookingEvent berhasil dipancarkan');
            } catch (\Exception $e) {
                Log::error('Gagal memancarkan event NewBookingEvent: ' . $e->getMessage());
            }

            // Kirim email ke customer
            try {
                Log::info('Mulai mengirim email ke customer: ' . $booking->customer_email);
                Mail::to($booking->customer_email)->send(new BookingInfoMail($booking, false));
                Log::info('Selesai mengirim email ke customer: ' . $booking->customer_email);
            } catch (\Exception $e) {
                Log::error('Gagal mengirim email ke customer: ' . $e->getMessage(), [
                    'booking_id' => $booking->id, 
                    'error' => $e->getMessage()
                ]);
            }

            return 'Test booking created successfully! Check logs and admin dashboard.';
            
        } catch (\Exception $e) {
            Log::error('Test booking creation failed: ' . $e->getMessage());
            return 'Error creating test booking: ' . $e->getMessage();
        }
    }
}
