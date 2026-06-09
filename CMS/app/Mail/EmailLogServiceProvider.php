<?php

namespace App\Mail;

use Illuminate\Mail\Events\MessageSending;
use Illuminate\Mail\Events\MessageSent;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class EmailLogServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        Event::listen(MessageSending::class, function (MessageSending $event) {
            Log::debug('Email sedang dikirim', [
                'to' => $event->message->getTo(),
                'subject' => $event->message->getSubject()
            ]);
        });

        Event::listen(MessageSent::class, function (MessageSent $event) {
            Log::debug('Email berhasil dikirim', [
                'to' => $event->message->getTo(),
                'subject' => $event->message->getSubject(),
                'time' => now()->toDateTimeString()
            ]);
        });
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
