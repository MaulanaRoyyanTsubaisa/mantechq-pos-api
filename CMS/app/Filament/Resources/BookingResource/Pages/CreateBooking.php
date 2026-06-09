<?php

namespace App\Filament\Resources\BookingResource\Pages;

use App\Filament\Resources\BookingResource;
use Filament\Resources\Pages\CreateRecord;

class CreateBooking extends CreateRecord
{
    protected static string $resource = BookingResource::class;
    
    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Make sure duration is an integer
        if (isset($data['duration']) && !is_numeric($data['duration'])) {
            // If it contains a number with 'min', extract just the number
            if (is_string($data['duration']) && preg_match('/(\d+)\s*min/', $data['duration'], $matches)) {
                $data['duration'] = (int)$matches[1];
            } else {
                // Default to 60 minutes if parsing fails
                $data['duration'] = 60;
            }
        }
        
        return $data;
    }
}
