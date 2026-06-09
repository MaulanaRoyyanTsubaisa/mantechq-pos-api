<?php

namespace App\Listeners;

use App\Events\NewBookingEvent;
use App\Filament\Notifications\NewBookingNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class ProcessNewBookingNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(NewBookingEvent $event): void
    {
        // Log booking untuk memastikan event bekerja
        Log::info('Booking masuk ke dashboard: ' . $event->booking->id, [
            'customer_name' => $event->booking->customer_name,
            'service' => $event->booking->service,
            'date' => $event->booking->date,
            'time' => $event->booking->time
        ]);

        // Kirim notifikasi ke dashboard admin
        try {
            NewBookingNotification::sendToAdmin($event->booking);
            Log::info('Notifikasi Filament berhasil dikirim untuk booking: ' . $event->booking->id);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi Filament: ' . $e->getMessage());
        }
    }
}
