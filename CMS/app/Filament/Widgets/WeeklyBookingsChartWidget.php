<?php

namespace App\Filament\Widgets;

use App\Models\Shop\Order;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;

class WeeklyBookingsChartWidget extends ChartWidget
{
    protected static ?int $sort = 4;
    
    protected static ?string $heading = 'Grafik Booking per Minggu';
    
    protected static ?string $maxHeight = '300px';
    
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $data = $this->getWeeklyBookings();

        return [
            'datasets' => [
                [
                    'label' => 'Jumlah Booking',
                    'data' => array_values($data),
                    'fill' => 'start',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)', // Light blue with opacity
                    'borderColor' => 'rgb(59, 130, 246)', // Blue
                    'tension' => 0.3,
                ],
            ],
            'labels' => array_keys($data),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getWeeklyBookings(): array
    {
        $data = [];
        
        // Get data for the last 12 weeks
        for ($i = 11; $i >= 0; $i--) {
            $startDate = Carbon::now()->subWeeks($i)->startOfWeek();
            $endDate = Carbon::now()->subWeeks($i)->endOfWeek();
            
            $weekLabel = $startDate->format('d M') . ' - ' . $endDate->format('d M');
            
            $bookingsCount = Order::whereBetween('created_at', [
                $startDate,
                $endDate,
            ])->count();
            
            $data[$weekLabel] = $bookingsCount;
        }
        
        return $data;
    }
}
