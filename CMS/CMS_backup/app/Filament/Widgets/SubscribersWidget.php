<?php

namespace App\Filament\Widgets;

use App\Models\Shop\Customer;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SubscribersWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected function getStats(): array
    {
        $totalSubscribers = Customer::count();
        $lastMonthSubscribers = Customer::where('created_at', '>=', Carbon::now()->subMonth())->count();
        
        $previousMonthSubscribers = Customer::where('created_at', '>=', Carbon::now()->subMonths(2))
            ->where('created_at', '<', Carbon::now()->subMonth())
            ->count();
            
        $difference = $lastMonthSubscribers - $previousMonthSubscribers;
        $percentageChange = $previousMonthSubscribers > 0 
            ? round(($difference / $previousMonthSubscribers) * 100, 1) 
            : 0;
        
        $description = $difference >= 0 
            ? "{$percentageChange}% increase last month"
            : "{$percentageChange}% decrease last month";
            
        $icon = $difference >= 0 
            ? 'heroicon-m-arrow-trending-up'
            : 'heroicon-m-arrow-trending-down';
            
        $color = $difference >= 0 ? 'success' : 'danger';

        return [
            Stat::make('Total Subscriber', $totalSubscribers)
                ->description($description)
                ->descriptionIcon($icon)
                ->color($color)
                ->chart($this->getMonthlyChart()),
        ];
    }

    private function getMonthlyChart(): array
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $startDate = Carbon::now()->subMonths($i)->startOfMonth();
            $endDate = Carbon::now()->subMonths($i)->endOfMonth();
            
            $data[] = Customer::whereBetween('created_at', [$startDate, $endDate])->count();
        }
        return $data;
    }
}
