<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\Booking;

class TodayBookings extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';
    protected static ?string $title = "Today's Bookings";
    protected static ?string $navigationGroup = 'Bookings';
    protected static string $view = 'filament.pages.today-bookings';

    public function getBookings()
    {
        return Booking::whereDate('created_at', today())->latest()->get();
    }
}
