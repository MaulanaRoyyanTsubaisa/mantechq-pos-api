<?php

namespace App\Filament\App\Resources;

use App\Filament\App\Resources\PageResource\Pages;
use App\Filament\App\Resources\PageResource\RelationManagers;
use App\Models\Page;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PageResource extends Resource
{
    protected static ?string $model = Page::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // Section untuk Konten Utama Halaman
                Section::make('Page Content')
                    ->description('Masukkan detail utama halaman ini.')
                    ->schema([
                        TextInput::make('title')
                            ->required() // Field ini wajib diisi
                            ->maxLength(255)
                            ->label('Judul Halaman'), // Label yang akan muncul di UI
                        TextInput::make('subtitle')
                            ->maxLength(255)
                            ->nullable() // Field ini boleh kosong
                            ->label('Subjudul'),
                        TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true) // Slug harus unik, abaikan saat edit record yang sama
                            ->hint('Slug akan digunakan di URL, misal: our-story') // Petunjuk
                            ->label('Slug (URL Bagian)'),
                        RichEditor::make('content')
                            ->required()
                            ->columnSpanFull() // Membuat field ini menempati seluruh lebar kolom
                            ->label('Isi Konten Halaman'),
                        FileUpload::make('banner_image_url')
                            ->disk('public') // Menyimpan file di storage/app/public
                            ->directory('page-banners') // Menyimpan di sub-folder 'page-banners'
                            ->image() // Hanya mengizinkan file gambar
                            ->nullable()
                            ->label('Gambar Banner Halaman'),
                    ])->columns(2), // Mengatur layout ke 2 kolom dalam section ini

                // Section untuk Optimasi SEO
                Section::make('Search Engine Optimization (SEO)')
                    ->description('Atur meta data untuk mesin pencari.')
                    ->schema([
                        TextInput::make('seo_title')
                            ->maxLength(255)
                            ->nullable()
                            ->label('Meta Title (Judul SEO)'),
                        Textarea::make('seo_description')
                            ->maxLength(500)
                            ->nullable()
                            ->rows(3)
                            ->label('Meta Description (Deskripsi SEO)'),
                    ]),
                // Contoh komponen lain:
                // Toggle::make('is_published')
                //     ->label('Publikasikan Halaman')
                //     ->default(false),
            ]);
    }


    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                //
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPages::route('/'),
            'create' => Pages\CreatePage::route('/create'),
            'edit' => Pages\EditPage::route('/{record}/edit'),
        ];
    }
}
