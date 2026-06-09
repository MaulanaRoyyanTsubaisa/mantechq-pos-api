<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// API routes for blocked dates
Route::get('/blocked-dates', [\App\Http\Controllers\Api\BlockedDateController::class, 'index']);

// API routes for bookings
Route::post('/bookings', [\App\Http\Controllers\Api\BookingController::class, 'store']);
Route::get('/bookings', [\App\Http\Controllers\Api\BookingController::class, 'index']);

// API routes for orders
Route::apiResource('orders', \App\Http\Controllers\Api\OrderController::class);
Route::get('/orders-statistics', [\App\Http\Controllers\Api\OrderController::class, 'statistics']);

Route::middleware('api')->group(function () {
    Route::get('/booking/available-dates', [BookingController::class, 'getAvailableDates']);
    Route::post('/booking/validate-date', [BookingController::class, 'validateDate']);
});
