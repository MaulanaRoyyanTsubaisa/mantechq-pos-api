<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use App\Http\Middleware\Cors;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('admin')
            ->path('admin')
            ->default()
            ->login()
            ->colors([
                'primary' => Color::Amber,
            ])
            ->brandName('ColorBeauty CMS')
            ->favicon(asset('favicon.ico'))
            ->discoverResources(app_path('Filament/Resources'), 'App\\Filament\\Resources')
            ->discoverPages(app_path('Filament/Pages'), 'App\\Filament\\Pages')
            ->pages([
                Pages\Dashboard::class,
                \App\Filament\Pages\AllBookings::class,
                \App\Filament\Pages\MonthlyBookings::class,
                \App\Filament\Pages\WeeklyBookings::class,
                \App\Filament\Pages\TodayBookings::class,
            ])
            ->resources([
                \App\Filament\Resources\BookingResource::class,
                \App\Filament\Resources\BlockedDateResource::class,
            ])
            ->widgets([
                \App\Filament\Widgets\BookingStatsWidget::class,
                \App\Filament\Widgets\TodayBookingsWidget::class,
                \App\Filament\Widgets\WeeklyBookingsChartWidget::class,
                \App\Filament\Widgets\OrderStatsWidget::class,
            ])
            ->navigationGroups([
                'Bookings',
                'Blog',
                'Shop',
                'Settings',
            ])
            ->middleware([
                Cors::class,
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
