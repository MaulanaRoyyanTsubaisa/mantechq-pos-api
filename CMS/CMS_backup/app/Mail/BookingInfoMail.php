<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class BookingInfoMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $booking;
    public $isAdmin;

    /**
     * Create a new message instance.
     *
     * @param  Booking  $booking
     * @param  bool  $isAdmin
     * @return void
     */
    public function __construct(Booking $booking, bool $isAdmin = false)
    {
        $this->booking = $booking;
        $this->isAdmin = $isAdmin;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = $this->isAdmin 
            ? 'Booking Baru di Website' 
            : 'Konfirmasi Booking Anda';
            
        return $this->subject($subject)
                    ->view('email.booking-info')
                    ->with([
                        'booking' => $this->booking,
                        'isAdmin' => $this->isAdmin
                    ]);
    }
}
