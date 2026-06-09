<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;

// Include debug routes
if (file_exists(base_path('routes/debug.php'))) {
    require base_path('routes/debug.php');
}

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::middleware(['cors'])->group(function () {
    
    // Frontend Routes
    Route::get('/', [PageController::class, 'show'])->name('home');
    // Booking Routes
    // Route::get('/analyze', [BookingController::class, 'showAnalyze'])->name('analyze'); // DISABLED: Use CMS dynamic page instead
    Route::get('/analyze', [PageController::class, 'show'])->defaults('slug', 'analyze')->name('analyze');
    Route::post('/checkout', [BookingController::class, 'showCheckout'])->name('checkout');
    Route::post('/booking/process', [BookingController::class, 'processBooking'])->name('booking.process');
    Route::get('/booking/success', [BookingController::class, 'showSuccess'])->name('booking.success');
    // API Routes for Booking
    Route::get('/api/booking/available-dates', [BookingController::class, 'getAvailableDates']);
    Route::post('/api/booking/validate-date', [BookingController::class, 'validateDate']);    // Steps Route (use PageController to get Page model with CMS data)    Route::get('/steps', [PageController::class, 'show'])->defaults('slug', 'steps')->name('steps');
    //Dinamic CMS Pages
    Route::get('/steps', [PageController::class, 'show'])->defaults('slug', 'steps')->name('steps');
    Route::get('/our-story', [PageController::class, 'show'])->defaults('slug', 'our-story')->name('our-story');
    Route::get('/feed', [PageController::class, 'show'])->defaults('slug', 'feed')->name('feed');
    // General Pages - Keep this last to avoid route conflicts
    Route::get('/{slug}', [PageController::class, 'show'])->name('page.show');
});

// Do NOT define custom /admin/login routes. Filament handles admin authentication automatically.
// Admin Panel Routes (Filament will handle these automatically)
