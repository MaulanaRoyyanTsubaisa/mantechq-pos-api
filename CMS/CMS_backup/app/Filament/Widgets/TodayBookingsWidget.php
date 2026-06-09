<?php

namespace App\Filament\Widgets;

use App\Models\Shop\Order;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TodayBookingsWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        
        $todayBookings = Order::whereDate('created_at', $today)->count();
        $yesterdayBookings = Order::whereDate('created_at', $yesterday)->count();
        
        $difference = $todayBookings - $yesterdayBookings;
        $percentageChange = $yesterdayBookings > 0 ? round(($difference / $yesterdayBookings) * 100, 1) : 0;
        
        $description = $difference >= 0 
            ? "{$percentageChange}% increase from yesterday"
            : "{$percentageChange}% decrease from yesterday";
            
        $icon = $difference >= 0 
            ? 'heroicon-m-arrow-trending-up'
            : 'heroicon-m-arrow-trending-down';
            
        $color = $difference >= 0 ? 'success' : 'danger';

        return [
            Stat::make('Booking Hari Ini', $todayBookings)
                ->description($description)
                ->descriptionIcon($icon)
                ->color($color)
                ->chart($this->getWeeklyChart()),
        ];
    }

    private function getWeeklyChart(): array
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $data[] = Order::whereDate('created_at', $date)->count();
        }
        return $data;
    }
}
