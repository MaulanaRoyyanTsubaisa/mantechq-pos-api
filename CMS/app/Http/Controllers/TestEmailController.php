<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingInfoMail;
use App\Models\Booking;
use Illuminate\Support\Facades\Log;

class TestEmailController extends Controller
{
    public function sendTestEmail()
    {
        try {
            // Create a sample booking
            $booking = new Booking();
            $booking->customer_name = 'Test Customer';
            $booking->customer_email = 'mursifajihan@gmail.com';
            $booking->customer_phone = '081234567890';
            $booking->service = 'Test Service';
            $booking->duration = 60;
            $booking->price = 150000;
            $booking->date = now()->toDateString();
            $booking->time = '14:00';
            $booking->notes = 'This is a test booking';
            $booking->status = 'pending';
            
            // Log mail configuration
            Log::info('Mail Configuration:', [
                'driver' => config('mail.default'),
                'host' => config('mail.mailers.smtp.host'),
                'port' => config('mail.mailers.smtp.port'),
                'encryption' => config('mail.mailers.smtp.encryption'),
                'username' => config('mail.mailers.smtp.username'),
                'from_address' => config('mail.from.address'),
                'from_name' => config('mail.from.name')
            ]);
            
            // Send email
            Mail::to('mursifajihan@gmail.com')->send(new BookingInfoMail($booking, false));
            
            return 'Test email sent successfully! Check your inbox and the logs.';
        } catch (\Exception $e) {
            Log::error('Test email error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return 'Error sending test email: ' . $e->getMessage();
        }
    }
}
