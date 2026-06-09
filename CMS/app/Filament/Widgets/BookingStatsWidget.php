<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class BookingStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $todayCount = Booking::whereDate('created_at', today())->count();
        $yesterdayCount = Booking::whereDate('created_at', today()->subDay())->count();
        $todayDiff = $todayCount - $yesterdayCount;

        $weeklyCount = Booking::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count();
        $lastWeekCount = Booking::whereBetween('created_at', [
            now()->subWeek()->startOfWeek(), 
            now()->subWeek()->endOfWeek()
        ])->count();
        $weeklyDiff = $weeklyCount - $lastWeekCount;

        $monthlyCount = Booking::whereMonth('created_at', now()->month)->count();
        $lastMonthCount = Booking::whereMonth('created_at', now()->subMonth()->month)->count();
        $monthlyDiff = $monthlyCount - $lastMonthCount;

        return [
            Stat::make("Today's Bookings", $todayCount)
                ->description($todayDiff >= 0 ? $todayDiff . ' more than yesterday' : abs($todayDiff) . ' less than yesterday')
                ->descriptionIcon($todayDiff >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($todayDiff >= 0 ? 'success' : 'danger')
                ->chart([0, 0, 0, 0, 0, $yesterdayCount, $todayCount]),

            Stat::make('Weekly Bookings', $weeklyCount)
                ->description($weeklyDiff >= 0 ? $weeklyDiff . ' more than last week' : abs($weeklyDiff) . ' less than last week')
                ->descriptionIcon($weeklyDiff >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($weeklyDiff >= 0 ? 'success' : 'danger')
                ->chart([0, 0, 0, 0, 0, $lastWeekCount, $weeklyCount]),

            Stat::make('Monthly Bookings', $monthlyCount)
                ->description($monthlyDiff >= 0 ? $monthlyDiff . ' more than last month' : abs($monthlyDiff) . ' less than last month')
                ->descriptionIcon($monthlyDiff >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($monthlyDiff >= 0 ? 'success' : 'danger')
                ->chart([0, 0, 0, 0, 0, $lastMonthCount, $monthlyCount]),
        ];
    }
}
