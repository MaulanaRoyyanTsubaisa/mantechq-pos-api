<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\Booking;

class MonthlyBookings extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';
    protected static ?string $title = 'Monthly Bookings';
    protected static ?string $navigationGroup = 'Bookings';
    protected static string $view = 'filament.pages.monthly-bookings';

    public function getBookings()
    {
        return Booking::whereMonth('created_at', now()->month)->latest()->get();
    }
}
