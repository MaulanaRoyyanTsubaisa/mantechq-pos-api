<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PageResource\Pages;
use App\Models\Page;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PageResource extends Resource
{
    protected static ?string $model = Page::class;
    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationGroup = 'Content Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\Select::make('template')
                            ->label('Page Template')
                            ->options([
                                'home' => 'Home Page',
                                'analyze' => 'Analysis Page',
                                'steps' => 'Steps Page',
                                'feed' => 'Feed Page',
                                'our-story' => 'Our Story',
                                'checkout' => 'Checkout Page',
                            ])
                            ->required()
                            ->reactive()
                            ->afterStateUpdated(fn (callable $set, $state) => $set('template', $state))
                            ->helperText('Select which template to use for this page'),

                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->label('Page Title')
                                    ->required(),

                                Forms\Components\Toggle::make('is_published')
                                    ->label('Published')
                                    ->default(true),
                            ],),

                        Forms\Components\Tabs::make('Page Content')
                            ->tabs([
                                // --- Home Tabs (hanya untuk template home) ---
                                Forms\Components\Tabs\Tab::make('Hero Section')
                                    ->visible(fn (callable $get) => $get('template') === 'home')
                                    ->schema([
                                        Forms\Components\Grid::make(2)
                                            ->schema([
                                                Forms\Components\TextInput::make('hero_title')
                                                    ->label('Hero Title')
                                                    ->placeholder('Enter the main heading')
                                                    ->helperText('This will appear as the main headline'),
                                                Forms\Components\TextInput::make('hero_subtitle')
                                                    ->label('Hero Subtitle')
                                                    ->placeholder('Enter the subtitle')
                                                    ->helperText('This will appear below the main headline'),
                                                Forms\Components\TextInput::make('hero_button_text')
                                                    ->label('Button Text')
                                                    ->placeholder('e.g., Book Now'),
                                                Forms\Components\TextInput::make('hero_button_link')
                                                    ->label('Button Link')
                                                    ->placeholder('e.g., /analyze'),
                                                Forms\Components\ColorPicker::make('hero_background_color')
                                                    ->label('Background Color')
                                                    ->default('#faa53d'),
                                            ]),
                                        Forms\Components\FileUpload::make('banner_image_url')
                                            ->label('Banner Image')
                                            ->image()
                                            ->directory('page-banners')
                                            ->imageResizeMode('cover')
                                            ->imageResizeTargetWidth('1920')
                                            ->imageResizeTargetHeight('1080'),
                                    ],),

                                Forms\Components\Tabs\Tab::make('Slider Section')
                                    ->visible(fn (callable $get) => $get('template') === 'home')
                                    ->schema([
                                        Forms\Components\TextInput::make('slider_title')
                                            ->label('Slider Title')
                                            ->placeholder('Enter slider section title'),
                                        Forms\Components\FileUpload::make('slider_images')
                                            ->label('Slider Images')
                                            ->multiple()
                                            ->reorderable()
                                            ->image()
                                            ->directory('slider-images')
                                            ->maxFiles(10)
                                            ->imageResizeMode('cover')
                                            ->imageResizeTargetWidth('1920')
                                            ->imageResizeTargetHeight('1080'),
                                    ]),

                                Forms\Components\Tabs\Tab::make('Steps Section (Home)')
                                    ->visible(fn (callable $get) => $get('template') === 'home')
                                    ->schema([
                                        Forms\Components\TextInput::make('steps_title')
                                            ->label('Steps Title')
                                            ->placeholder('Enter steps section title'),
                                        Forms\Components\RichEditor::make('steps_text')
                                            ->label('Steps Description'),
                                        Forms\Components\FileUpload::make('steps_images')
                                            ->label('Steps Images')
                                            ->multiple()
                                            ->image()
                                            ->directory('steps-images')
                                            ->maxFiles(3)
                                            ->imageResizeMode('cover')
                                            ->imageResizeTargetWidth('600')
                                            ->imageResizeTargetHeight('600'),
                                    ]),

                                Forms\Components\Tabs\Tab::make('Services Section')
                                    ->visible(fn (callable $get) => $get('template') === 'home')
                                    ->schema([
                                        Forms\Components\TextInput::make('services_title')
                                            ->label('Services Title')
                                            ->placeholder('Enter services section title'),
                                        Forms\Components\RichEditor::make('services_text')
                                            ->label('Services Description'),
                                        Forms\Components\FileUpload::make('services_images')
                                            ->label('Services Images')
                                            ->multiple()
                                            ->image()
                                            ->directory('services-images')
                                            ->maxFiles(3)
                                            ->imageResizeMode('cover')
                                            ->imageResizeTargetWidth('600')
                                            ->imageResizeTargetHeight('600'),
                                    ]),

                                Forms\Components\Tabs\Tab::make('Story Section (Home)')
                                    ->visible(fn (callable $get) => $get('template') === 'home')
                                    ->schema([
                                        Forms\Components\TextInput::make('story_title')
                                            ->label('Story Title')
                                            ->placeholder('Enter story section title'),
                                        Forms\Components\RichEditor::make('story_text')
                                            ->label('Story Description'),
                                        Forms\Components\TextInput::make('story_video')
                                            ->label('Story Video URL')
                                            ->placeholder('Enter video embed URL'),
                                    ]),

                                    Forms\Components\Tabs\Tab::make('FAQ Section')
                                    ->visible(fn (callable $get) => $get('template') === 'home')
                                    ->schema([
                                        Forms\Components\TextInput::make('faq_title')
                                            ->label('FAQ Title')
                                            ->placeholder('Enter FAQ section title'),
                                        Forms\Components\Repeater::make('faq_items')
                                            ->label('FAQ Items')
                                            ->schema([
                                                Forms\Components\TextInput::make('question')->label('Question'),
                                                Forms\Components\Textarea::make('answer')->label('Answer'),
                                            ])
                                            ->cloneable()
                                            ->collapsible(),
                                    ]),

                                Forms\Components\Tabs\Tab::make('Feed Section (Home)')
                                    ->visible(fn (callable $get) => $get('template') === 'home')
                                    ->schema([
                                        Forms\Components\TextInput::make('feed_title')
                                            ->label('Feed Title')
                                            ->placeholder('Enter feed section title'),
                                        Forms\Components\FileUpload::make('feed_images')
                                            ->label('Feed Images')
                                            ->multiple()
                                            ->image()
                                            ->directory('feed-images')
                                            ->maxFiles(6)
                                            ->imageResizeMode('cover')
                                            ->imageResizeTargetWidth('400')
                                            ->imageResizeTargetHeight('400'),
                                        Forms\Components\TextInput::make('feed_instagram')
                                            ->label('Instagram Username')
                                            ->placeholder('@colour_byutie'),
                                    ]),

                                // --- ANALYZE PAGE TAB ---
                                Forms\Components\Tabs\Tab::make('Analyze Page Content')
                                    ->visible(fn (callable $get) => $get('template') === 'analyze')
                                    ->schema([
                                        Forms\Components\Tabs::make('Analyze Sections')
                                            ->tabs([
                                                Forms\Components\Tabs\Tab::make('Hero')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('analyze_hero_title')->label('Hero Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Personal Colour Analysis');
                                                                }
                                                            }),
                                                        Forms\Components\FileUpload::make('analyze_hero_image')
                                                            ->label('Hero Image')
                                                            ->image()
                                                            ->directory('analyze-hero'),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('Express for One')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('analyze_express_title')->label('Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Express for One');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_express_subtitle')->label('Subtitle')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Personal Colour Analysis for One Person – Express');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_express_price_strike')->label('Price Strike')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Rp1155000.00');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_express_price')->label('Price')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Rp855000.00');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_express_duration')->label('Duration')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('60');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_express_location')->label('Location')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Renon, Denpasar Selatan, Kabupaten Badung - Bali');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('analyze_express_desc')->label('Description')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('A 45-minute session including an assessment of skin tone, eye colour, and hair colour, along with warm/cool tone analysis. This session features a detailed 12-tone seasonal analysis with comprehensive draping to identify your least and best colours, including neutrals.');
                                                                }
                                                            }),
                                                        Forms\Components\FileUpload::make('analyze_express_image')
                                                            ->label('Image')
                                                            ->image()
                                                            ->directory('analyze-express'),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('Analysis for One')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('analyze_one_title')->label('Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Analysis for One');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_one_subtitle')->label('Subtitle')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Personal Colour Test for One Person');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_one_price_strike')->label('Price Strike')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Rp2000000.00');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_one_price')->label('Price')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Rp1555000.00');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_one_duration')->label('Duration')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('90');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_one_location')->label('Location')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Renon, Denpasar Selatan, Kabupaten Badung - Bali');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('analyze_one_desc')->label('Description')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('A 75-minute session including an assessment of skin tone, eye colour, and hair colour, along with warm/cool tone analysis with comprehensive draping to identify your least and best colours, including neutrals. Additionally, you will receive personalized recommendations for hair colour, jewelry, nail polish, and makeup.');
                                                                }
                                                            }),
                                                        Forms\Components\FileUpload::make('analyze_one_image')
                                                            ->label('Image')
                                                            ->image()
                                                            ->directory('analyze-one'),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('Analysis for Two')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('analyze_two_title')->label('Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Analysis for Two');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_two_subtitle')->label('Subtitle')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Personal Colour Test for Two Person');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_two_price_strike')->label('Price Strike')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Rp2555000.00');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_two_price')->label('Price')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Rp2155000.00');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_two_duration')->label('Duration')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('120');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('analyze_two_location')->label('Location')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Renon, Denpasar Selatan, Kabupaten Badung - Bali');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('analyze_two_desc')->label('Description')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('A perfect session for couples, friends, or family members. This comprehensive 120-minute session includes a detailed skin tone, eye colour, and hair colour assessment for both individuals, along with warm/cool tone analysis and personalized style recommendations.');
                                                                }
                                                            }),
                                                        Forms\Components\FileUpload::make('analyze_two_image')
                                                            ->label('Image')
                                                            ->image()
                                                            ->directory('analyze-two'),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('Improve')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('analyze_improve_title')->label('Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state('Personal Colour<br>Helps You to Improve');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('analyze_improve_desc')->label('Description')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state("By unlocking your personal colour palette, you'll effortlessly choose the perfect hues for everything you wear and use every day.");
                                                                }
                                                            }),
                                                        Forms\Components\Repeater::make('analyze_improve_cards')->label('Cards')
                                                            ->schema([
                                                                Forms\Components\FileUpload::make('image')
                                                                    ->label('Image')
                                                                    ->image()
                                                                    ->directory('analyze-improve-cards')
                                                                    ->preserveFilenames()
                                                                    ->visibility('public'),
                                                                Forms\Components\Textarea::make('text')->label('Text'),
                                                            ])
                                                            ->minItems(3)
                                                            ->maxItems(3)
                                                            ->cloneable()
                                                            ->collapsible()
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || empty($state) || $state === '') && $record && $record->template === 'analyze') {
                                                                    $component->state([
                                                                        [
                                                                            'image' => null,
                                                                            'text' => 'Unlocking your personal colour palette can transform your fashion appearance. Knowing which hues complement your natural features helps you create a cohesive, polished, and vibrant look, boosting your confidence and style.'
                                                                        ],
                                                                        [
                                                                            'image' => null,
                                                                            'text' => 'Personal colour palette is crucial for perfecting makeup. Identifying shades that complement your skin tone, eyes, and hair enhances your natural beauty. These colours create a polished, radiant look, boosting your confidence.'
                                                                        ],
                                                                        [
                                                                            'image' => null,
                                                                            'text' => "Understanding your personal colour palette isn't just for clothes and makeup—it also helps you choose accessories. By coordinating items like bags, hats, and shoes with your features, you enhance your overall appearance effortlessly."
                                                                        ]
                                                                    ]);
                                                                }
                                                            }),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('Studio')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('analyze_studio_title')->label('Title'),
                                                        Forms\Components\Textarea::make('analyze_studio_desc')->label('Description'),
                                                        Forms\Components\TextInput::make('analyze_studio_video')->label('Video URL'),
                                                        Forms\Components\FileUpload::make('analyze_studio_image')
                                                            ->label('Image')
                                                            ->image()
                                                            ->directory('analyze-studio'),
                                                    ]),
                                            ]),
                                    ]),

                                // --- STEPS PAGE TAB ---
                                Forms\Components\Tabs\Tab::make('Steps Page')
                                    ->visible(fn (callable $get) => $get('template') === 'steps')
                                    ->schema([                                        Forms\Components\FileUpload::make('steps_hero_image')
                                            ->label('Hero Image')
                                            ->image()
                                            ->directory('steps-hero'),
                                        Forms\Components\TextInput::make('steps_section1_title')->label('Section 1 Title')
                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                if (($state === null || $state === '') && $record && $record->template === 'steps') {
                                                    $component->state('Self Expression');
                                                }
                                            }),
                                        Forms\Components\Textarea::make('steps_section1_text')->label('Section 1 Text')
                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                if (($state === null || $state === '') && $record && $record->template === 'steps') {
                                                    $component->state("Color selection for fashion is a powerful form of self-expression. Through personal colour analysis, individuals can discover and embrace colours that authentically represent their personality. This process encourages confidence in choosing outfits that reflect one's true self, fostering a deeper connection between inner essence and outward appearance.");
                                                }
                                            }),
                                        Forms\Components\FileUpload::make('steps_section1_image')
                                            ->label('Section 1 Image')
                                            ->image()
                                            ->directory('steps-section1'),
                                        Forms\Components\TextInput::make('steps_section2_title')->label('Section 2 Title')
                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                if (($state === null || $state === '') && $record && $record->template === 'steps') {
                                                    $component->state('Empowerment + Confidence');
                                                }
                                            }),
                                        Forms\Components\Textarea::make('steps_section2_text')->label('Section 2 Text')
                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                if (($state === null || $state === '') && $record && $record->template === 'steps') {
                                                    $component->state('Personal colour analysis is a powerful tool for building self-confidence. Understanding which colors enhance your natural features leads to more informed fashion choices. This knowledge empowers individuals to express themselves authentically through their wardrobe, fostering a positive self-image and increased confidence in personal style decisions.');
                                                }
                                            }),
                                        Forms\Components\FileUpload::make('steps_section2_image')
                                            ->label('Section 2 Image')
                                            ->image()
                                            ->directory('steps-section2'),
                                        Forms\Components\TextInput::make('steps_section3_title')->label('Section 3 Title')
                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                if (($state === null || $state === '') && $record && $record->template === 'steps') {
                                                    $component->state('Creativity + Innovation');
                                                }
                                            }),
                                        Forms\Components\Textarea::make('steps_section3_text')->label('Section 3 Text')
                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                if (($state === null || $state === '') && $record && $record->template === 'steps') {
                                                    $component->state('Experimenting with colour in fashion fosters creativity and innovation. Personal colour practice encourages individuals to explore unique and unconventional colour combinations in their clothing and accessories. This experimentation helps push fashion boundaries, leading to original and trend-setting styles. By embracing diverse colours, individuals can develop a distinctive fashion sense that reflects their creativity and individuality.');
                                                }
                                            }),
                                        Forms\Components\FileUpload::make('steps_section3_image')
                                            ->label('Section 3 Image')
                                            ->image()
                                            ->directory('steps-section3'),
                                        Forms\Components\Repeater::make('steps_gallery_images')
                                            ->label('Gallery Images')
                                            ->schema([
                                                Forms\Components\FileUpload::make('image')
                                                    ->label('Image')
                                                    ->image()
                                                    ->directory('steps-gallery'),
                                            ])->minItems(0)->maxItems(3),
                                        Forms\Components\Repeater::make('steps_details')
                                            ->label('Step Details')
                                            ->schema([
                                                Forms\Components\TextInput::make('title')->label('Title'),
                                                Forms\Components\Textarea::make('text')->label('Text'),
                                            ])->minItems(0)->maxItems(6),
                                        Forms\Components\TextInput::make('steps_contact_title')->label('Contact Title')
                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                if (($state === null || $state === '') && $record && $record->template === 'steps') {
                                                    $component->state('Get in touch');
                                                }
                                            }),
                                        Forms\Components\TextInput::make('steps_contact_address')->label('Contact Address')
                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                if (($state === null || $state === '') && $record && $record->template === 'steps') {
                                                    $component->state('Renon, Denpasar Selatan\nKota Denpasar - Bali 80239');
                                                }
                                            }),
                                        Forms\Components\TextInput::make('steps_contact_phone')->label('Contact Phone')
                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                if (($state === null || $state === '') && $record && $record->template === 'steps') {
                                                    $component->state('+62 811 120 645');
                                                }
                                            }),
                                        Forms\Components\TextInput::make('steps_contact_email')->label('Contact Email')
                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                if (($state === null || $state === '') && $record && $record->template === 'steps') {
                                                    $component->state('hello@colourbyutie.com');
                                                }
                                            }),
                                    ]),

                                // --- OUR STORY PAGE TAB ---
                                Forms\Components\Tabs\Tab::make('Our Story Page Content')
                                    ->visible(fn (callable $get) => $get('template') === 'our-story')
                                    ->schema([
                                        Forms\Components\Tabs::make('Our Story Page Sections')
                                            ->tabs([
                                                Forms\Components\Tabs\Tab::make('Hero')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('story_hero_title')->label('Hero Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Our Story');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('story_hero_text')->label('Hero Text')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Colour by Utie is more than just a personal color analysis service; it\'s a transformative journey that helps individuals discover their perfect palette and enhance their natural beauty.');
                                                                }
                                                            }),
                                                        Forms\Components\FileUpload::make('story_hero_image')
                                                            ->label('Hero Image')
                                                            ->image()
                                                            ->directory('story-hero'),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('About')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('story_about_title')->label('About Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('About Colour by Utie');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('story_about_text')->label('About Text')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Founded in 2022, Colour by Utie originated from a personal journey of transformation and discovery. After experiencing firsthand how personal color analysis could enhance confidence and self-expression, our founder Utie was inspired to bring this transformative practice to others.');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('story_about_text_2')->label('Additional Text')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Today, we\'re committed to empowering individuals through the science and art of personal color analysis, helping them make confident style choices that authentically represent who they are.');
                                                                }
                                                            }),
                                                        Forms\Components\FileUpload::make('story_about_image')
                                                            ->label('Profile Image')
                                                            ->image()
                                                            ->directory('story-about'),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('Korean-Japan')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('story_korean_title')->label('Section Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Korean-Japan Personal Colour Analysis');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('story_korean_text')->label('Text')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Drawing inspiration from both Korean and Japanese color analysis methodologies, we offer a unique fusion approach. These techniques have been refined over decades to help individuals understand how different colors interact with their natural features.');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('story_korean_text_2')->label('Additional Text')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Our approach combines the precision of Asian color theory with personalized consultations, resulting in a thorough understanding of each individual\'s unique color profile.');
                                                                }
                                                            }),
                                                        Forms\Components\FileUpload::make('story_korean_image')
                                                            ->label('Section Image')
                                                            ->image()
                                                            ->directory('story-korean'),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('Helping People')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('story_helping_title')->label('Section Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Helping People Find Their Perfect Palette');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('story_helping_text')->label('Text')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('At Colour by Utie, our mission extends beyond simple color recommendations. We aim to empower individuals to make confident style choices that authentically represent who they are. Through personalized consultations, we analyze unique skin tones, hair colors, and eye colors to identify the most harmonious palette for each person.');
                                                                }
                                                            }),
                                                        Forms\Components\FileUpload::make('story_helping_image')
                                                            ->label('Section Image')
                                                            ->image()
                                                            ->directory('story-helping'),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('Reviews')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('story_reviews_title')->label('Reviews Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('What Our Clients Say');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('story_reviews_quote')->label('Quote')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('The personal color analysis session was transformative! I now understand why certain colors make me look vibrant while others drain my complexion. This has completely changed how I shop for clothes.');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('story_reviews_name')->label('Name')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Sarah M.');
                                                                }
                                                            }),
                                                        Forms\Components\FileUpload::make('story_reviews_image')
                                                            ->label('Profile Image')
                                                            ->image()
                                                            ->directory('story-reviews'),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('Find Colors')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('story_colors_title')->label('Section Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Find Your Perfect Colors');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('story_colors_desc')->label('Description')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Discover the colors that harmonize with your natural features and enhance your appearance. Our personalized analysis helps you build a wardrobe that truly complements your unique coloring.');
                                                                }
                                                            }),
                                                        Forms\Components\FileUpload::make('story_colors_images')
                                                            ->label('Gallery Images')
                                                            ->multiple()
                                                            ->image()
                                                            ->directory('story-colors')
                                                            ->maxFiles(3),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('Contact (Our Story)')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('story_contact_title')->label('Contact Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Get in Touch');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('story_contact_address')->label('Address')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Renon, Denpasar Selatan\nKota Denpasar - Bali 80239');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('story_contact_phone')->label('Phone')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('+62 811 120 645');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('story_contact_email')->label('Email')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('hello@colourbyutie.com');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('story_contact_form_title')->label('Form Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'our-story') {
                                                                    $component->state('Send us a message');
                                                                }
                                                            }),
                                                    ]),
                                            ]),
                                    ]),                                Forms\Components\Tabs\Tab::make('Feed Page Content')
                                    ->visible(fn (callable $get) => $get('template') === 'feed')
                                    ->schema([
                                        Forms\Components\Tabs::make('Feed Page Sections')
                                            ->tabs([
                                                Forms\Components\Tabs\Tab::make('Hero Section')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('feed_hero_title')
                                                            ->label('Hero Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'feed') {
                                                                    $component->state('Colourful story to tell');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('feed_hero_background_color')
                                                            ->label('Hero Background Color')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'feed') {
                                                                    $component->state('#fbb8ad');
                                                                }
                                                            }),
                                                        Forms\Components\FileUpload::make('feed_hero_images')
                                                            ->label('Hero Images')
                                                            ->multiple()
                                                            ->image()
                                                            ->directory('feed-hero')
                                                            ->maxFiles(3),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('Grid Section')
                                                    ->schema([
                                                        Forms\Components\Repeater::make('feed_grid_items')
                                                            ->label('Feed Grid Items')
                                                            ->schema([
                                                                Forms\Components\FileUpload::make('image')
                                                                    ->label('Image')
                                                                    ->image()
                                                                    ->directory('feed-grid'),
                                                                Forms\Components\TextInput::make('title')
                                                                    ->label('Title')
                                                                    ->required(),
                                                                Forms\Components\TextInput::make('category')
                                                                    ->label('Category'),
                                                                Forms\Components\TextInput::make('author')
                                                                    ->label('Author'),
                                                                Forms\Components\TextInput::make('date')
                                                                    ->label('Date'),
                                                                Forms\Components\TextInput::make('read_time')
                                                                    ->label('Read Time'),
                                                            ])
                                                            ->columns(2)
                                                            ->defaultItems(9),
                                                    ]),
                                                Forms\Components\Tabs\Tab::make('Contact Section')
                                                    ->schema([
                                                        Forms\Components\TextInput::make('feed_contact_story_title')
                                                            ->label('Story Title')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'feed') {
                                                                    $component->state('Share your story to:');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('feed_contact_story_email')
                                                            ->label('Story Email')
                                                            ->email()
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'feed') {
                                                                    $component->state('story@colourbyutie.com');
                                                                }
                                                            }),
                                                        Forms\Components\Textarea::make('feed_contact_address')
                                                            ->label('Address')
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'feed') {
                                                                    $component->state('Renon, Denpasar Selatan<br>Kota Denpasar - Bali 80239');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('feed_contact_phone')
                                                            ->label('Phone')
                                                            ->tel()
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'feed') {
                                                                    $component->state('+62 811 120 645');
                                                                }
                                                            }),
                                                        Forms\Components\TextInput::make('feed_contact_email')
                                                            ->label('Email')
                                                            ->email()
                                                            ->afterStateHydrated(function ($component, $state, $record) {
                                                                if (($state === null || $state === '') && $record && $record->template === 'feed') {
                                                                    $component->state('hello@colourbyutie.com');
                                                                }
                                                            }),
                                                    ]),
                                            ]),
                                    ]),

                                Forms\Components\Tabs\Tab::make('Checkout Page Content')
                                    ->visible(fn (callable $get) => $get('template') === 'checkout')
                                    ->schema([
                                        Forms\Components\TextInput::make('checkout_page_title')
                                            ->label('Checkout Page Title')
                                            ->placeholder('Enter specific checkout page title'),
                                        Forms\Components\RichEditor::make('checkout_page_instructions')
                                            ->label('Checkout Instructions')
                                            ->placeholder('Instructions for users on the checkout page'),
                                    ]),

                                Forms\Components\Tabs\Tab::make('About Us Page Content')
                                    ->visible(fn (callable $get) => $get('template') === 'about')
                                    ->schema([
                                        Forms\Components\TextInput::make('about_page_title')
                                            ->label('About Page Title')
                                            ->placeholder('Enter specific about page title'),
                                        Forms\Components\RichEditor::make('about_page_content')
                                            ->label('About Us Content')
                                            ->placeholder('The main content for the About Us page'),
                                        Forms\Components\FileUpload::make('about_page_image')
                                            ->label('About Us Image')
                                            ->image()
                                            ->directory('about-us'),
                                    ]),
                            ])
                            ->persistTabInQueryString(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('template')
                    ->badge()
                    ->sortable()
                    ->searchable(),
                Tables\Columns\ImageColumn::make('banner_image_url')
                    ->label('Banner'),
                Tables\Columns\IconColumn::make('is_published')
                    ->boolean()
                    ->label('Published'),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->label('Last Updated'),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getWidgets(): array
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

    public static function fillFormDefaults(string $pageType, ?Page $record = null): array
    {
        $data = [];

        if ($record) {
            $data = $record->toArray();
        }

        $homeDefaults = [
            'hero_title' => 'Discover Your True Colours',
            'hero_subtitle' => '',
            'hero_button_text' => 'Book Now',
            'hero_button_link' => '/analyze',
            'hero_background_color' => '#faa53d',
            'slider_title' => 'Discover Your True Colours',
            'steps_title' => 'Discovering your true colours is a path to discovering your true self',
            'steps_text' => 'When you dress authentically to reflect the person one sees in your hair, eyes, and skin, you begin to connect with your unique energy and unlock hidden potential. What could be more empowering than that?',
            'services_title' => 'Find your genuine colours and style',
            'services_text' => 'When aligned with your chosen colours, attire, and possessions, others can easily identify you, enhancing your attractiveness, and leaving you feeling more vibrant, self-assured, and focused.',
            'story_title' => 'See How We Found Your True Colour',
            'story_text' => 'Discover the ease of our studio as we take you on a simple yet transformative journey of colour discovery. In just one to one and a half hours, you\'ll find the perfect palette to effortlessly enhance your everyday style. Our expert color analyst will simplify the process of identifying your ideal hues, ensuring you look and feel your best for any occasion.',
            'story_video' => 'https://drive.google.com/file/d/1TcHWNFjy8ln8-iBe1n8ghZ3Wv6nkxnNL/preview',
            'faq_title' => 'Frequently asked questions',
            'feed_title' => 'follow our instagram',
            'feed_instagram' => '@colour_byutie',
        ];

        $analyzeDefaults = [
            'analyze_hero_title' => 'Personal Colour Analysis',
            'analyze_express_title' => 'Express for One',
            'analyze_express_subtitle' => 'Personal Colour Analysis for One Person – Express',
            'analyze_express_price_strike' => 'Rp1155000.00',
            'analyze_express_price' => 'Rp855000.00',
            'analyze_express_duration' => '60',
            'analyze_express_location' => 'Renon, Denpasar Selatan, Kabupaten Badung - Bali',
            'analyze_express_desc' => 'A 45-minute session including an assessment of skin tone, eye colour, and hair colour, along with warm/cool tone analysis. This session features a detailed 12-tone seasonal analysis with comprehensive draping to identify your least and best colours, including neutrals.',
            'analyze_one_title' => 'Analysis for One',
            'analyze_one_subtitle' => 'Personal Colour Test for One Person',
            'analyze_one_price_strike' => 'Rp2000000.00',
            'analyze_one_price' => 'Rp1555000.00',
            'analyze_one_duration' => '90',
            'analyze_one_location' => 'Renon, Denpasar Selatan, Kabupaten Badung - Bali',
            'analyze_one_desc' => 'A 75-minute session including an assessment of skin tone, eye colour, and hair colour, along with warm/cool tone analysis with comprehensive draping to identify your least and best colours, including neutrals. Additionally, you will receive personalized recommendations for hair colour, jewelry, nail polish, and makeup.',
            'analyze_two_title' => 'Analysis for Two',
            'analyze_two_subtitle' => 'Personal Colour Test for Two Person',
            'analyze_two_price_strike' => 'Rp2555000.00',
            'analyze_two_price' => 'Rp2155000.00',
            'analyze_two_duration' => '120',
            'analyze_two_location' => 'Renon, Denpasar Selatan, Kabupaten Badung - Bali',
            'analyze_two_desc' => 'A perfect session for couples, friends, or family members. This comprehensive 120-minute session includes a detailed skin tone, eye colour, and hair colour assessment for both individuals, along with warm/cool tone analysis and personalized style recommendations.',
            'analyze_improve_title' => 'Personal Colour Helps You to Improve',
            'analyze_improve_desc' => "By unlocking your personal colour palette, you'll effortlessly choose the perfect hues for everything you wear and use every day.",
            'analyze_studio_title' => 'Visit our studio in Denpasar, Bali',
            'analyze_studio_desc' => "Visit our vibrant colour studio in the heart of Denpasar, Bali. We're thrilled to be Bali's very first personal colour analysis studio, ready to help you unveil your true colours while you're on the go.",
            'analyze_studio_video' => 'https://drive.google.com/file/d/1TcHWNFjy8ln8-iBe1n8ghZ3Wv6nkxnNL/preview',
        ];

        $stepsDefaults = [
            'steps_hero_title' => 'Step by Step - Personal Color Analysis',
            'steps_expression_title' => 'Self Expression',
            'steps_expression_subtitle' => 'WHAT WE STAND FOR',
            'steps_expression_desc' => 'Color selection for fashion is a powerful form of self-expression. Through personal colour analysis, individuals can discover and embrace colours that authentically represent their personality. This process encourages confidence in choosing outfits that reflect one\'s true self, fostering a deeper connection between inner essence and outward appearance.',
            'steps_empowerment_title' => 'Empowerment + Confidence',
            'steps_empowerment_subtitle' => 'WHAT WE STAND FOR',
            'steps_empowerment_desc' => 'Personal colour analysis is a powerful tool for building self-confidence. Understanding which colors enhance your natural features leads to more informed fashion choices. This knowledge empowers individuals to express themselves authentically through their wardrobe, fostering a positive self-image and increased confidence in personal style decisions.',
            'steps_creativity_title' => 'Creativity + Innovation',
            'steps_creativity_subtitle' => 'WHAT WE STAND FOR',
            'steps_creativity_desc' => 'Experimenting with colour in fashion fosters creativity and innovation. Personal colour practice encourages individuals to explore unique and unconventional colour combinations in their clothing and accessories. This experimentation helps push fashion boundaries, leading to original and trend-setting styles. By embracing diverse colours, individuals can develop a distinctive fashion sense that reflects their creativity and individuality.',
            'steps_gallery_title' => 'Step-by-step Colour Analysis',
            'steps_contact_title' => 'Get in touch',
            'steps_contact_address' => "Renon, Denpasar Selatan\nKota Denpasar - Bali 80239",
            'steps_contact_phone' => '+62 811 120 645',
            'steps_contact_email' => 'hello@colourbyutie.com',
            'steps_contact_map' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.5959062332117!2d115.2227181147775!3d-8.62561999395277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd24068c2225a81%3A0xc3f6d7d7d7d7d7d7!2sRenon!5e0!3m2!1sen!2sid!4v1678888888888!5m2!1sen!2sid',
        ];        $ourStoryDefaults = [
            'story_hero_title' => 'Our Story - Colour by Utie',
            'story_about_title' => 'About Putri Pratiwi',
            'story_about_text' => '"I\'m Putri Pratiwi, but everyone knows me as Utie. With my background in Advanced Level Personal Color Analysis from Asian Color Institute and Color Me Beautiful, I help people discover the colors that truly reflect their personality and enhance their natural beauty. My passion lies in helping individuals unlock their unique color potential and boost their self-confidence through color analysis."',
            'story_about_text_2' => 'My journey in color analysis began with a simple idea: everyone deserves to feel confident and authentic in their appearance. Through years of study and practice, I\'ve developed a keen eye for identifying the perfect color combinations that bring out each person\'s natural radiance.',
            'story_korean_title' => 'Korean–Japan Inspired, Balinese Practices',
            'story_korean_text' => 'Our color analysis approach combines the precision of Korean and Japanese color theory with the warmth and spirituality of Balinese traditions. This unique blend allows us to offer a comprehensive color analysis service that considers both technical accuracy and holistic well-being.',
            'story_korean_text_2' => 'We incorporate elements from both Eastern and Western color analysis methodologies, ensuring that our clients receive the most thorough and culturally-informed color consultation possible.',
            'story_helping_title' => 'It\'s about Helping People',
            'story_helping_text' => 'At our core, we\'re dedicated to helping people discover their authentic selves through color. Our mission extends beyond simple color matching – we aim to empower individuals to express their true personality and enhance their confidence through understanding their unique color characteristics.',
            'story_reviews_quote' => '"When you dress authentically to reflect the person I see in your hair, eyes, and skin, you begin to connect with your unique energy and unlock hidden potential."',
            'story_reviews_name' => 'Putri Pratiwi',
            'story_colors_title' => 'Find Your True Colours',
            'story_colors_desc' => 'Your true colours reveal your true self. Dress in harmony with who you are and access newfound energy and creativity. 🌸🦋✨ #BeYourself #ColourConfidence',
            'story_contact_address' => "Renon, Denpasar Selatan\nKota Denpasar - Bali 80239",
            'story_contact_phone' => '+62 811 120 645',
            'story_contact_email' => 'hello@colourbyutie.com',
            'story_contact_form_title' => 'Submit your email to get our company profile',
        ];
        
        $feedDefaults = [
            'feed_hero_title' => 'Colourful story to tell',
            'feed_hero_background_color' => '#fbb8ad',
            'feed_contact_story_title' => 'Share your story to:',
            'feed_contact_story_email' => 'story@colourbyutie.com',
            'feed_contact_address' => "Renon, Denpasar Selatan<br>Kota Denpasar - Bali 80239",
            'feed_contact_phone' => '+62 811 120 645',
            'feed_contact_email' => 'hello@colourbyutie.com',
        ];        // --- Ini adalah bagian yang menyebabkan masalah: defaultArrayValues ---
        // Anda tidak boleh memberikan path statis assets ke FileUpload multiple.
        // FileUpload multiple hanya menerima path ke file yang sudah di-upload ke storage yang dikelola Filament/Laravel.
        // Jika tidak ada file, nilai defaultnya harus kosong atau null.
        // Default gambar untuk front-end harus ditangani di Blade views Anda.
        
        $defaultArrayValues = [
            'home' => [
                'slider_images' => [], // <-- Ubah dari array path statis menjadi array kosong
                'steps_images' => [], // <-- Ubah dari array array-image menjadi array kosong
                'services_images' => [], // <-- Ubah dari array array-image menjadi array kosong
                'faq_items' => [], // Biarkan ini kosong, atau isi dengan default yang tidak memerlukan path file
                'feed_images' => [], // <-- Ubah dari array path statis menjadi array kosong
            ],
            'analyze' => [
                'analyze_improve_cards' => [], // <-- Ubah dari array array-image menjadi array kosong
            ],
            'feed' => [
                'feed_hero_images' => [], // Empty array for file uploads
                'feed_grid_items' => [
                    [
                        'title' => 'Embracing Your True Colours',
                        'category' => 'Fashion & Style',
                        'author' => 'Putri Pratiwi',
                        'date' => '6/1/2024',
                        'read_time' => '2 min read'
                    ],
                    [
                        'title' => 'The Art of Self Expression',
                        'category' => 'Personal Growth',
                        'author' => 'Dewi Kristanti',
                        'date' => '6/1/2024',
                        'read_time' => '2 min read'
                    ],
                    [
                        'title' => 'Finding Your Perfect Palette',
                        'category' => 'Color Analysis',
                        'author' => 'Canny Sutanto',
                        'date' => '6/1/2024',
                        'read_time' => '2 min read'
                    ],
                ],
            ],
            'steps' => [
                'steps_details_items' => [ // Ini adalah repeater, biarkan jika default itemnya teks
                    [
                        'title' => 'Initial Consultation',
                        'description' => 'The personal colour analysis begins by discussing the individual\'s goals and preferences, understanding their current fashion choices, and addressing any concerns they have about colour.',
                    ],
                    [
                        'title' => 'Skin Tone Analysis',
                        'description' => 'We analyze your skin undertone using specially selected fabric drapes, determining whether you have warm or cool undertones. This foundational step guides the rest of the colour analysis process.',
                    ],
                    [
                        'title' => 'Hair & Eye Colour Assessment',
                        'description' => 'We examine your natural hair and eye colours to understand how they interact with different colour families. This helps create a harmonious palette that enhances your overall appearance.',
                    ],
                    [
                        'title' => 'Seasonal Color Analysis',
                        'description' => 'Using the 12-season color analysis system, we determine which season best matches your natural coloring. This includes testing various color combinations to find your most flattering palette.',
                    ],
                    [
                        'title' => 'Personal Color Palette',
                        'description' => 'We create your personalized color palette, including your best neutrals, accent colors, and metallics. This becomes your guide for making confident color choices in clothing and accessories.',
                    ],
                    [
                        'title' => 'Styling Recommendations',
                        'description' => 'We provide practical advice on applying your color palette to your wardrobe, makeup, and accessories. You\'ll learn how to mix and match colors effectively for various occasions.',
                    ],
                ],
            ],
            'our-story' => [
                'story_colors_images' => [], // <-- Ubah dari array path statis menjadi array kosong
                // Untuk single file upload (bukan multiple), defaultnya juga harus null atau string kosong
                'story_reviews_image' => null, // Atau ''
                'story_about_image' => null,   // Atau ''
                'story_korean_image' => null,  // Atau ''
                'story_helping_image' => null, // Atau ''
            ],        ];

        // Apply general defaults for the chosen template
        switch ($pageType) {
            case 'home':
                $data = array_merge($homeDefaults, $data);
                break;
            case 'analyze':
                $data = array_merge($analyzeDefaults, $data);
                break;
            case 'steps':
                $data = array_merge($stepsDefaults, $data);
                break;
            case 'our-story':
                $data = array_merge($ourStoryDefaults, $data);
                break;
            case 'feed':
                $data = array_merge($feedDefaults, $data);
                break;
            // Tambahkan case untuk template lain jika ada default khusus
            // case 'checkout':
            //     $data = array_merge($checkoutDefaults, $data);
            //     break;
            // case 'about':
            //     $data = array_merge($aboutDefaults, $data);
            //     break;
        }

        // Apply array defaults if the data is null or empty
        foreach ($defaultArrayValues[$pageType] ?? [] as $key => $defaultValue) {
            // Periksa apakah key ada DAN apakah nilainya kosong (null atau array kosong)
            // Ini agar tidak menimpa data yang sudah ada di database
            if (!isset($data[$key]) || (is_array($data[$key]) && empty($data[$key])) || ($data[$key] === null && is_array($defaultValue))) {
                $data[$key] = $defaultValue;
            }
        }
        
        return $data;
    }
}