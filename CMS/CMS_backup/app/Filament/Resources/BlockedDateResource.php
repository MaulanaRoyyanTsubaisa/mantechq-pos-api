<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BlockedDateResource\Pages;
use App\Models\BlockedDate;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BlockedDateResource extends Resource
{
    protected static ?string $model = BlockedDate::class;
    protected static ?string $navigationIcon = 'heroicon-o-calendar'; // changed from heroicon-o-calendar-x-mark
    protected static ?string $navigationGroup = 'Bookings';
    protected static ?string $navigationLabel = 'Edit Tgl Booking';
    protected static ?int $navigationSort = 100;    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\DatePicker::make('date')
                ->label('Tanggal')
                ->required()
                ->unique(ignorable: fn ($record) => $record)
                ->minDate(now())
                ->format('Y-m-d')
                ->weekStartsOnMonday()
                ->closeOnDateSelection(),
            Forms\Components\TextInput::make('note')
                ->label('Catatan')
                ->placeholder('Alasan memblokir tanggal ini')
                ->maxLength(255),
        ]);
    }    public static function table(Table $table): Table
    {
        return $table
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label('Tambah Tanggal Blokir')
                    ->modalHeading('Tambah Tanggal Blokir Baru')
                    ->modalWidth('md')
                    ->modalButton('Simpan')
                    ->successNotificationTitle('Tanggal berhasil diblokir')
            ])
            ->columns([
            Tables\Columns\TextColumn::make('date')
                ->label('Tanggal')
                ->date('d F Y')
                ->sortable()
                ->searchable(),
            Tables\Columns\TextColumn::make('note')
                ->label('Catatan')
                ->limit(50)
                ->searchable(),            ])
        ->defaultSort('date', 'desc')
        ->filters([
            Tables\Filters\Filter::make('future_dates')
                ->label('Hanya Tanggal Mendatang')
                ->query(fn ($query) => $query->where('date', '>=', now()))
                ->default(),
        ])        ->actions([
            Tables\Actions\EditAction::make()
                ->label('Edit')
                ->modalHeading('Edit Tanggal Blokir')
                ->modalWidth('md')
                ->modalButton('Simpan Perubahan'),
            Tables\Actions\DeleteAction::make()
                ->label('Hapus')
                ->modalHeading('Hapus Tanggal Blokir')
                ->modalButton('Ya, Hapus')
                ->successNotificationTitle('Tanggal berhasil dihapus'),
        ])
        ->bulkActions([
            Tables\Actions\DeleteBulkAction::make()
                ->label('Hapus Terpilih')
                ->modalHeading('Hapus Tanggal Blokir Terpilih')
                ->modalButton('Ya, Hapus Semua')
                ->successNotificationTitle('Tanggal-tanggal terpilih berhasil dihapus'),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBlockedDates::route('/'),
            'create' => Pages\CreateBlockedDate::route('/create'),
            'edit' => Pages\EditBlockedDate::route('/{record}/edit'),
        ];
    }
}
