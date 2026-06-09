<?php

namespace App\Filament\Notifications;

use App\Models\Booking;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewBookingNotification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected Booking $booking)
    {
        //
    }
    
    public static function sendToAdmin(Booking $booking): void
    {
        FilamentNotification::make()
            ->title('Booking Baru')
            ->body('Booking baru dari ' . $booking->customer_name . ' untuk ' . $booking->service)
            ->actions([
                \Filament\Notifications\Actions\Action::make('view')
                    ->button()
                    ->url(route('filament.admin.resources.bookings.edit', $booking->id)),
            ])
            ->icon('heroicon-o-calendar')
            ->iconColor('success')
            ->send();
    }
}
