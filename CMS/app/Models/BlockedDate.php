<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlockedDate extends Model
{
    use HasFactory;    protected $fillable = ['date', 'reason', 'note'];
    protected $casts = [
        'date' => 'date'
    ];

    // Set to false if the table doesn't have timestamps columns
    public $timestamps = true;    public static function getAvailableDates()
    {
        try {
            // Get all manually blocked dates from admin
            $blockedDates = self::pluck('date')->map(function ($date) {
                return Carbon::parse($date)->format('Y-m-d');
            })->toArray();
            
            \Illuminate\Support\Facades\Log::info('Manually blocked dates: ' . json_encode($blockedDates));

            // Generate array of next 60 days
            $dates = [];
            $date = Carbon::now();
            $end = Carbon::now()->addDays(60);

            while ($date->lte($end)) {
                // Only include Tuesday (2), Wednesday (3), and Thursday (4)
                // AND exclude manually blocked dates
                if (in_array($date->dayOfWeek, [2, 3, 4]) && !in_array($date->format('Y-m-d'), $blockedDates)) {
                    $dates[] = $date->format('Y-m-d');
                }
                $date->addDay();
            }
            
            \Illuminate\Support\Facades\Log::info('Available dates: ' . json_encode($dates));
        } catch (\Exception $e) {
            // If something goes wrong, provide a default set of dates
            \Illuminate\Support\Facades\Log::error('Error generating available dates: ' . $e->getMessage());
            $dates = [];
            $date = Carbon::now();
            $end = Carbon::now()->addDays(60);
            
            while ($date->lte($end)) {
                if (in_array($date->dayOfWeek, [2, 3, 4])) { // Only include Tuesday, Wednesday, Thursday
                    $dates[] = $date->format('Y-m-d');
                }
                $date->addDay();
            }
        }

        return $dates;
    }    public static function isDateBlocked($date)
    {
        try {
            $date = Carbon::parse($date);
            
            // Check if it's a valid weekday (Tuesday = 2, Wednesday = 3, Thursday = 4)
            // Only these days are available for booking
            if (!in_array($date->dayOfWeek, [2, 3, 4])) {
                \Illuminate\Support\Facades\Log::info("Date {$date->format('Y-m-d')} is not a valid booking day (not Tue/Wed/Thu)");
                return true;
            }

            // Check if date is in the past
            if ($date->isPast()) {
                \Illuminate\Support\Facades\Log::info("Date {$date->format('Y-m-d')} is in the past");
                return true;
            }

            // Check if date is more than 60 days in the future
            if ($date->diffInDays(Carbon::now()) > 60) {
                \Illuminate\Support\Facades\Log::info("Date {$date->format('Y-m-d')} is more than 60 days in the future");
                return true;
            }

            // Handle potential database errors gracefully
            try {
                // Check if date is manually blocked by admin in the database
                $formattedDate = $date->format('Y-m-d');
                $isManuallyBlocked = self::where('date', $formattedDate)->exists();
                
                if ($isManuallyBlocked) {
                    \Illuminate\Support\Facades\Log::info("Date {$formattedDate} is manually blocked in admin panel");
                    return true;
                }
                
                // If we reach here, the date is available
                \Illuminate\Support\Facades\Log::info("Date {$formattedDate} is available for booking");
                return false;            } catch (\Exception $e) {
                // Log the error but don't block the date if there's a DB issue
                \Illuminate\Support\Facades\Log::error('Error checking blocked date: ' . $e->getMessage());
                return false;
            }
        } catch (\Exception $e) {
            // If we can't parse the date, consider it not blocked to avoid disrupting the booking flow
            \Illuminate\Support\Facades\Log::error('Error parsing date: ' . $e->getMessage());
            return false;
        }
    }
}
