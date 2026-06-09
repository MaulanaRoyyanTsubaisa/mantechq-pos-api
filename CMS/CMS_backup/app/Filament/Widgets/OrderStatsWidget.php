<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class OrderStatsWidget extends BaseWidget
{
    protected static ?string $pollingInterval = '30s';

    protected function getStats(): array
    {
        return [
            Stat::make('Total Orders', Order::count())
                ->description('All orders')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->chart(Order::pluck('total_amount')->toArray())
                ->color('primary'),

            Stat::make('Pending Orders', Order::where('status', 'pending')->count())
                ->description('Awaiting processing')
                ->descriptionIcon('heroicon-m-clock')
                ->chart(Order::where('status', 'pending')->pluck('total_amount')->toArray())
                ->color('warning'),

            Stat::make('Total Revenue', function () {
                    $total = Order::where('payment_status', 'paid')->sum('total_amount');
                    return '$' . number_format($total, 2);
                })
                ->description('From paid orders')
                ->descriptionIcon('heroicon-m-banknotes')
                ->chart(Order::where('payment_status', 'paid')->pluck('total_amount')->toArray())
                ->color('success'),
        ];
    }
}
