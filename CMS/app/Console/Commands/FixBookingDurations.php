<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FixBookingDurations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fix-booking-durations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix booking durations by ensuring all are stored as integers';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Fixing booking durations...');
        
        // Import the necessary models and facades
        $bookings = \App\Models\Booking::all();
        $count = 0;
        
        foreach ($bookings as $booking) {
            $originalDuration = $booking->duration;
            
            // If the duration is not numeric or contains text like "min"
            if (!is_numeric($originalDuration) || (is_string($originalDuration) && preg_match('/\D/', $originalDuration))) {
                // Extract the numeric part if it has one
                if (is_string($originalDuration) && preg_match('/(\d+)/', $originalDuration, $matches)) {
                    $booking->duration = (int)$matches[1];
                } else {
                    // Default to 60 minutes if no numeric part found
                    $booking->duration = 60;
                }
                
                $booking->save();
                $count++;
                
                $this->line("Fixed booking #{$booking->id}: Changed duration from '{$originalDuration}' to '{$booking->duration}'");
            }
        }
        
        $this->info("Fixed {$count} bookings with invalid duration formats.");
        
        return Command::SUCCESS;
    }
}
