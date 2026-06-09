<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static ?string $navigationIcon = 'heroicon-o-home';

    protected static string $view = 'filament.pages.dashboard-widgets';

    protected static ?string $title = 'Dashboard';    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\Widgets\BookingStatsWidget::class,
            \App\Filament\Widgets\TodayBookingsWidget::class,
            \App\Filament\Widgets\StatsOverviewWidget::class,
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            \App\Filament\Widgets\WeeklyBookingsChartWidget::class,
            \App\Filament\Widgets\LatestBlogPostsWidget::class,
            \App\Filament\Widgets\OrderStatsWidget::class,
            \App\Filament\Widgets\SubscribersWidget::class,
        ];
    }
}
