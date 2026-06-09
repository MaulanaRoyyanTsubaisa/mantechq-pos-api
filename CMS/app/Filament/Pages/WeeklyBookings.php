<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\Booking;

class WeeklyBookings extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-calendar';
    protected static ?string $title = 'Weekly Bookings';
    protected static ?string $navigationGroup = 'Bookings';
    protected static string $view = 'filament.pages.weekly-bookings';

    public function getBookings()
    {
        return Booking::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->latest()->get();
    }
}
