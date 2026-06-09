<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Events\NewBookingEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Mail\BookingInfoMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;




class BookingController extends Controller
{    public function store(Request $request): JsonResponse
    {
        // Log data yang masuk untuk debugging
        Log::debug('Booking request data:', $request->all());
        
        try {            $validated = $request->validate([
                'service' => 'required|string',
                'description' => 'nullable|string',
                'duration' => 'required|integer',
                'price' => 'required|numeric',
                'date' => 'required|date',
                'time' => 'required|string',
                'customer_name' => 'required|string',
                'customer_email' => 'required|email',
                'customer_phone' => 'required|string',
                'notes' => 'nullable|string'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Booking validation error: ', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Unexpected error in booking validation: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
        
        $validated['status'] = 'pending';        try {
            $booking = Booking::create($validated);
            
            // Log booking baru
            Log::info('Booking baru dibuat dengan ID: ' . $booking->id, [
                'booking_data' => $validated,
                'booking_id' => $booking->id
            ]);

            // Trigger event untuk dashboard CMS
            event(new NewBookingEvent($booking));
            Log::info('Event NewBookingEvent berhasil dipanggil untuk booking: ' . $booking->id);
        } catch (\Exception $e) {
            Log::error('Gagal membuat booking: ' . $e->getMessage(), [
                'validated_data' => $validated,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
        
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
            
            // Debug konfigurasi email
            Log::debug('Mail Configuration: ', [
                'driver' => config('mail.default'),
                'host' => config('mail.mailers.smtp.host'),
                'port' => config('mail.mailers.smtp.port'),
                'from_address' => config('mail.from.address'),
                'from_name' => config('mail.from.name'),
            ]);
            
            Mail::to($booking->customer_email)->send(new BookingInfoMail($booking, false));
            Log::info('Selesai mengirim email ke customer: ' . $booking->customer_email);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim email ke customer: ' . $e->getMessage(), [
                'booking_id' => $booking->id,
                'customer_email' => $booking->customer_email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        // Kirim email ke admin secara terpisah
        try {
            $adminEmail = config('mail.admin_email', 'mursifajihan@gmail.com');
            Log::info('Mulai mengirim email ke admin: ' . $adminEmail);
            Mail::to($adminEmail)->send(new BookingInfoMail($booking, true));
            Log::info('Selesai mengirim email ke admin: ' . $adminEmail);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim email ke admin: ' . $e->getMessage(), [
                'booking_id' => $booking->id,
                'admin_email' => config('mail.admin_email', 'mursifajihan@gmail.com'),
                'error' => $e->getMessage()
            ]);
        }        try {
            // Create response data
            $responseData = [
                'success' => true,
                'message' => 'Booking created successfully dan email terkirim',
                'data' => $booking
            ];
            
            Log::info('Booking berhasil dibuat dan email dikirim', [
                'booking_id' => $booking->id,
                'customer_name' => $booking->customer_name,
                'customer_email' => $booking->customer_email,
                'response_data' => $responseData
            ]);
            
            // Add debug header
            $response = response()->json($responseData, 201);
            $response->header('X-Debug-Info', 'Booking created with ID: ' . $booking->id);
            
            return $response;
        } catch (\Exception $e) {
            // If we get to this point, the booking was created but there was an error returning the response
            Log::error('Error returning API response: ' . $e->getMessage());
            return response()->json([
                'success' => true, // Still true since the booking was created
                'message' => 'Booking created but there was an error processing the response',
                'data' => ['id' => $booking->id]
            ], 201);
        }
    }
    
    public function index(): JsonResponse
    {
        $bookings = Booking::latest()->get();
        
        return response()->json($bookings)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET')
            ->header('Access-Control-Allow-Headers', 'Content-Type');
    }
}
