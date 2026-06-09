<?php

namespace App\Filament\Resources\PageResource\Pages;

use App\Filament\Resources\PageResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreatePage extends CreateRecord
{
    protected static string $resource = PageResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Panggil fillFormDefaults untuk mengisi nilai-nilai default
        // Ini akan mengisi data yang kosong dengan default sesuai template yang dipilih
        // Ini dijalankan SEBELUM record disimpan ke database
        $data = array_merge(
            PageResource::fillFormDefaults($data['template']),
            $data
        );

        return $data;
    }
}