<x-filament-panels::page>
    <div class="filament-widgets-container">
        @if (class_exists(\App\Filament\Widgets\BookingStatsWidget::class))
            @livewire(\App\Filament\Widgets\BookingStatsWidget::class)
        @endif
        
        @if (class_exists(\App\Filament\Widgets\TodayBookingsWidget::class))
            @livewire(\App\Filament\Widgets\TodayBookingsWidget::class)
        @endif
        
        @if (class_exists(\App\Filament\Widgets\OrderStatsWidget::class))
            @livewire(\App\Filament\Widgets\OrderStatsWidget::class)
        @endif
    </div>
    
    <div class="filament-widgets-container mt-6">
        @if (class_exists(\App\Filament\Widgets\WeeklyBookingsChartWidget::class))
            @livewire(\App\Filament\Widgets\WeeklyBookingsChartWidget::class)
        @endif
    </div>
</x-filament-panels::page>
