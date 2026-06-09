<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\Booking;

class AllBookings extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';
    protected static ?string $title = 'All Bookings';
    protected static ?string $navigationGroup = 'Bookings';
    protected static string $view = 'filament.pages.all-bookings';

    public function getBookings()
    {
        return Booking::latest()->get();
    }
}
