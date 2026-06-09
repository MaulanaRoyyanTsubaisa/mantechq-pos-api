<?php

namespace App\Filament\Resources\PageResource\Pages;

use App\Filament\Resources\PageResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPage extends EditRecord
{
    protected static string $resource = PageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),            Actions\Action::make('resetToDefault')
                ->label('Reset to Default')
                ->color('warning')
                ->requiresConfirmation()
                ->action(function ($record) {
                    if ($record->template === 'home') {
                        // Reset home page sections
                        $record->slider_title = null;
                        $record->slider_images = null;
                        $record->steps_title = null;
                        $record->steps_text = null;
                        $record->steps_images = null;
                        $record->services_title = null;
                        $record->services_text = null;
                        $record->services_images = null;
                        $record->story_title = null;
                        $record->story_text = null;
                        $record->story_video = null;
                        $record->faq_title = null;
                        $record->faq_items = null;
                        $record->feed_title = null;
                        $record->feed_images = null;
                        $record->feed_instagram = null;
                    } else if ($record->template === 'analyze') {
                        // Reset analyze page sections
                        $record->analyze_hero_title = null;
                        $record->analyze_hero_image = null;
                        
                        // Express for One
                        $record->analyze_express_title = null;
                        $record->analyze_express_subtitle = null;
                        $record->analyze_express_price_strike = null;
                        $record->analyze_express_price = null;
                        $record->analyze_express_duration = null;
                        $record->analyze_express_location = null;
                        $record->analyze_express_desc = null;
                        $record->analyze_express_image = null;
                        
                        // Analysis for One
                        $record->analyze_one_title = null;
                        $record->analyze_one_subtitle = null;
                        $record->analyze_one_price_strike = null;
                        $record->analyze_one_price = null;
                        $record->analyze_one_duration = null;
                        $record->analyze_one_location = null;
                        $record->analyze_one_desc = null;
                        $record->analyze_one_image = null;
                        
                        // Analysis for Two
                        $record->analyze_two_title = null;
                        $record->analyze_two_subtitle = null;
                        $record->analyze_two_price_strike = null;
                        $record->analyze_two_price = null;
                        $record->analyze_two_duration = null;
                        $record->analyze_two_location = null;
                        $record->analyze_two_desc = null;
                        $record->analyze_two_image = null;
                        
                        // Improve section
                        $record->analyze_improve_title = null;
                        $record->analyze_improve_desc = null;
                        $record->analyze_improve_cards = null;
                        
                        // Studio section
                        $record->analyze_studio_title = null;
                        $record->analyze_studio_desc = null;
                        $record->analyze_studio_video = null;
                        $record->analyze_studio_image = null;
                    }
                    
                    $record->save();
                    \Filament\Notifications\Notification::make()
                        ->title('Section reset to default!')
                        ->success()
                        ->send();
                    // Force Livewire/Filament to refresh the form state after reset
                    $this->redirect($this->getResource()::getUrl('edit', ['record' => $record->getKey()]));
                    $this->dispatch('refresh'); // Livewire event to force refresh
                })
                ->visible(fn ($record) => in_array($record->template, ['home', 'analyze'])),
        ];
    }
}
