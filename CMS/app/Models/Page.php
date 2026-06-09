<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Page extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'title',
        'subtitle',
        'slug',
        'content',
        'meta_description',
        'is_published',
        'template',
        'images',
        'banner_image_url',
        'seo_title',
        'seo_description',
        'hero_title',
        'hero_subtitle',
        'hero_button_text',
        'hero_button_link',
        'hero_background_color',
        'slider_title', 'slider_images',
        'steps_title', 'steps_text', 'steps_images',
        'services_title', 'services_text', 'services_images',
        'story_title', 'story_text', 'story_video',
        'faq_title', 'faq_items',
        'feed_title', 'feed_images', 'feed_instagram',
        'steps_hero_image',
        'steps_gallery_images', 'steps_details',
        'steps_section1_title', 'steps_section1_text', 'steps_section1_image',
        'steps_section2_title', 'steps_section2_text', 'steps_section2_image',
        'steps_section3_title', 'steps_section3_text', 'steps_section3_image',
        'steps_contact_title', 'steps_contact_address', 'steps_contact_phone', 'steps_contact_email',
        // Analyze Section
        'analyze_hero_title','analyze_hero_image',
        'analyze_express_title','analyze_express_subtitle','analyze_express_price_strike','analyze_express_price','analyze_express_duration','analyze_express_location','analyze_express_desc','analyze_express_image',
        'analyze_one_title','analyze_one_subtitle','analyze_one_price_strike','analyze_one_price','analyze_one_duration','analyze_one_location','analyze_one_desc','analyze_one_image',
        'analyze_two_title','analyze_two_subtitle','analyze_two_price_strike','analyze_two_price','analyze_two_duration','analyze_two_location','analyze_two_desc','analyze_two_image',
        'analyze_improve_title','analyze_improve_desc','analyze_improve_cards',
        'analyze_studio_title','analyze_studio_desc','analyze_studio_video','analyze_studio_image',
        'story_hero_image',
        'story_hero_title',
        'story_hero_text',
        'story_profile_image',
        'story_about_title',
        'story_about_text',
        'story_about_text_2',
        'story_about_image',
        'story_about_text1',
        'story_about_text2',
        'story_practice_title',
        'story_practice_image',
        'story_practice_text1',
        'story_practice_text2',
        'story_approach_title',
        'story_approach_text',
        'story_approach_image',
        'story_values_title',
        'story_values',  // This will be a JSON array
        'story_certifications_title',
        'story_certifications',  // This will be a JSON array
        'story_korean_title',
        'story_korean_text',
        'story_korean_text_2',
        'story_korean_image',
        'story_helping_title',
        'story_helping_text',
        'story_helping_image',
        'story_reviews_title',
        'story_reviews_quote',
        'story_reviews_name',
        'story_reviews_image',
        'story_colors_title',
        'story_colors_desc',
        'story_colors_images',
        'story_contact_title',
        'story_contact_address',
        'story_contact_phone',
        'story_contact_email',
        'story_contact_form_title',
        'feed_hero_title',
        'feed_hero_background_color',
        'feed_hero_images',
        'feed_contact_story_title',
        'feed_contact_story_email',
        'feed_contact_address',
        'feed_contact_phone',
        'feed_contact_email',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'content' => 'array',
        'images' => 'array',
        'slider_images' => 'array',
        'steps_images' => 'array',
        'services_images' => 'array',
        'faq_items' => 'array',
        'feed_images' => 'array',
        'sections' => 'array',
        'analyze_improve_cards' => 'array',
        'steps_gallery_images' => 'array',
        'steps_details' => 'array',
        'story_values' => 'array',
        'story_certifications' => 'array',
        'story_colors_images' => 'array',
        'feed_hero_images' => 'array',
        'feed_grid_items' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($page) {
            if (!$page->slug) {
                $page->slug = Str::slug($page->title);
            }
        });

        static::updating(function ($page) {
            if (!$page->slug) {
                $page->slug = Str::slug($page->title);
            }
        });
    }

    // Home Page Getters
    public function getHeroTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : '"If you know your colours, then<br>you\'re one step closer to know<br>yourself."';
    }
    
    public function getHeroButtonTextAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Book Now';
    }
    
    public function getHeroButtonLinkAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : route('analyze');
    }
    
    public function getHeroBackgroundColorAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : '#faa53d';
    }
    
    public function getSliderTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : '';
    }
    
    public function getStepsTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Discovering your true colours is a path to discovering your true self';
    }
    
    public function getStepsTextAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'When you dress authentically to reflect the person one sees in your hair, eyes, and skin, you begin to connect with your unique energy and unlock hidden potential. What could be more empowering than that?';
    }
    
    public function getServicesTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Find your genuine colours and style';
    }
    
    public function getServicesTextAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'When aligned with your chosen colours, attire, and possessions, others can easily identify you, enhancing your attractiveness, and leaving you feeling more vibrant, self-assured, and focused.';
    }
    
    public function getStoryTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'See How We Found Your True Colour';
    }
    
    public function getStoryTextAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : "Discover the ease of our studio as we take you on a simple yet transformative journey of colour discovery. In just one to one and a half hours, you'll find the perfect palette to effortlessly enhance your everyday style. Our expert color analyst will simplify the process of identifying your ideal hues, ensuring you look and feel your best for any occasion.";
    }
    
    public function getStoryVideoAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'https://drive.google.com/file/d/1TcHWNFjy8ln8-iBe1n8ghZ3Wv6nkxnNL/preview';
    }
    
    public function getFaqTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Frequently asked questions';
    }
    
    public function getFeedTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'follow our instagram';
    }
    
    public function getFeedInstagramAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : '@colour_byutie';
    }

    // Steps Page Getters - moved to consolidated section below


    // Analyze Section Getters
    public function getAnalyzeHeroTitleAttribute($value) {
        return $value ?? 'Personal Colour Analysis';
    }
    
    public function getAnalyzeHeroImageAttribute($value) {
        return $value ?? 'assets/images/analyze-hero.jpg';
    }
    
    // Express for One
    public function getAnalyzeExpressTitleAttribute($value) {
        return $value ?? 'Express for One';
    }
    
    public function getAnalyzeExpressSubtitleAttribute($value) {
        return $value ?? 'Personal Colour Analysis for One Person – Express';
    }
    
    public function getAnalyzeExpressPriceStrikeAttribute($value) {
        return $value ?? 'Rp1155000.00';
    }
    
    public function getAnalyzeExpressPriceAttribute($value) {
        return $value ?? 'Rp855000.00';
    }
    
    public function getAnalyzeExpressDurationAttribute($value) {
        return $value ?? '60 min';
    }
    
    public function getAnalyzeExpressLocationAttribute($value) {
        return $value ?? 'Renon, Denpasar Selatan, Kabupaten Badung - Bali';
    }
    
    public function getAnalyzeExpressDescAttribute($value) {
        return $value ?? 'A 45-minute session including an assessment of skin tone, eye colour, and hair colour, along with warm/cool tone analysis. This session features a detailed 12-tone seasonal analysis with comprehensive draping to identify your least and best colours, including neutrals.';
    }
    
    public function getAnalyzeExpressImageAttribute($value) {
        return $value ?? 'assets/images/analysis-one.jpg';
    }
    
    // Analysis for One
    public function getAnalyzeOneTitleAttribute($value) {
        return $value ?? 'Analysis for One';
    }
    
    public function getAnalyzeOneSubtitleAttribute($value) {
        return $value ?? 'Personal Colour Test for One Person';
    }
    
    public function getAnalyzeOnePriceStrikeAttribute($value) {
        return $value ?? 'Rp2000000.00';
    }
    
    public function getAnalyzeOnePriceAttribute($value) {
        return $value ?? 'Rp1555000.00';
    }
    
    public function getAnalyzeOneDurationAttribute($value) {
        return $value ?? '90 min';
    }
    
    public function getAnalyzeOneLocationAttribute($value) {
        return $value ?? 'Renon, Denpasar Selatan, Kabupaten Badung - Bali';
    }
    
    public function getAnalyzeOneDescAttribute($value) {
        return $value ?? 'A 75-minute session including an assessment of skin tone, eye colour, and hair colour, along with warm/cool tone analysis with comprehensive draping to identify your least and best colours, including neutrals. Additionally, you will receive personalized recommendations for hair colour, jewelry, nail polish, and makeup.';
    }
    
    public function getAnalyzeOneImageAttribute($value) {
        return $value ?? 'assets/images/analysis-two.jpg';
    }
    
    // Analysis for Two
    public function getAnalyzeTwoTitleAttribute($value) {
        return $value ?? 'Analysis for Two';
    }
    
    public function getAnalyzeTwoSubtitleAttribute($value) {
        return $value ?? 'Personal Colour Test for Two Person';
    }
    
    public function getAnalyzeTwoPriceStrikeAttribute($value) {
        return $value ?? 'Rp2555000.00';
    }
    
    public function getAnalyzeTwoPriceAttribute($value) {
        return $value ?? 'Rp2155000.00';
    }
    
    public function getAnalyzeTwoDurationAttribute($value) {
        return $value ?? '120 min';
    }
    
    public function getAnalyzeTwoLocationAttribute($value) {
        return $value ?? 'Renon, Denpasar Selatan, Kabupaten Badung - Bali';
    }
    
    public function getAnalyzeTwoDescAttribute($value) {
        return $value ?? 'A perfect session for couples, friends, or family members. This comprehensive 120-minute session includes a detailed skin tone, eye colour, and hair colour assessment for both individuals, along with warm/cool tone analysis and personalized style recommendations.';
    }    public function getAnalyzeTwoImageAttribute($value) {
        return $value ?? 'assets/images/analysis-three.jpg';
    }
    
    // Story Sections Default Values
    public function getStoryKoreanTitleAttribute($value) {
        return $value ?? 'Korean Color Analysis';
    }

    public function getStoryKoreanTextAttribute($value) {
        return $value ?? 'We specialize in Korean color analysis techniques, combining traditional methods with modern approaches.';
    }

    public function getStoryKoreanText2Attribute($value) {
        return $value ?? 'Our methods are based on proven color theory and years of practical experience.';
    }

    public function getStoryHelpingTitleAttribute($value) {
        return $value ?? 'Helping You Look Your Best';
    }

    public function getStoryHelpingTextAttribute($value) {
        return $value ?? 'We are dedicated to helping you discover your perfect colors and enhance your natural beauty.';
    }

    public function getStoryReviewsTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'What Our Clients Say';
    }

    public function getStoryReviewsQuoteAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'The personal color analysis session was transformative! I now understand why certain colors make me look vibrant while others drain my complexion. This has completely changed how I shop for clothes.';
    }

    public function getStoryReviewsNameAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Sarah M.';
    }

    public function getStoryReviewsImageAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : null;
    }

    public function getStoryColorsTitleAttribute($value) {
        return $value ?? 'Our Color Philosophy';
    }

    public function getStoryColorsDescAttribute($value) {
        return $value ?? 'We believe that understanding your personal colors is key to enhancing your natural beauty and confidence.';
    }

    public function getStoryColorsImagesAttribute($value) {
        if (empty($value)) {
            return [
                'assets/images/color-1.jpg',
                'assets/images/color-2.jpg',
                'assets/images/color-3.jpg'
            ];
        }
        return json_decode($value, true) ?? [];
    }

    public function getStoryContactFormTitleAttribute($value) {
        return $value ?? 'Get in Touch';
    }
    
    // Improve Section
    public function getAnalyzeImproveTitleAttribute($value) {
        return $value ?? 'Personal Colour Helps You to Improve';
    }
    
    public function getAnalyzeImproveDescAttribute($value) {
        return $value ?? "By unlocking your personal colour palette, you'll effortlessly choose the perfect hues for everything you wear and use every day.";
    }
      public function getAnalyzeImproveCardsAttribute($value) {
        // First try to parse the value if it's a JSON string
        if (is_string($value) && !empty($value)) {
            $decodedValue = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decodedValue) && count($decodedValue) > 0) {
                return $decodedValue;
            }
        }
        
        // If it's already an array and not empty, return it
        if (is_array($value) && count($value) > 0) {
            return $value;
        }
        
        // Return default values if value is null, empty or invalid
        return [
            ['image' => 'assets/images/improve1.png', 'text' => 'Unlocking your personal colour palette can transform your fashion appearance. Knowing which hues complement your natural features helps you create a cohesive, polished, and vibrant look, boosting your confidence and style.'],
            ['image' => 'assets/images/improve2.png', 'text' => 'Personal colour palette is crucial for perfecting makeup. Identifying shades that complement your skin tone, eyes, and hair enhances your natural beauty. These colours create a polished, radiant look, boosting your confidence.'],
            ['image' => 'assets/images/improve3.png', 'text' => "Understanding your personal colour palette isn't just for clothes and makeup—it also helps you choose accessories. By coordinating items like bags, hats, and shoes with your features, you enhance your overall appearance effortlessly."]
        ];
    }
    
    // Studio Section
    public function getAnalyzeStudioTitleAttribute($value) {
        return $value ?? 'Visit our studio in Denpasar, Bali';
    }
    
    public function getAnalyzeStudioDescAttribute($value) {
        return $value ?? "Visit our vibrant colour studio in the heart of Denpasar, Bali. We're thrilled to be Bali's very first personal colour analysis studio, ready to help you unveil your true colours while you're on the go.";
    }
    
    public function getAnalyzeStudioVideoAttribute($value) {
        return $value ?? 'https://drive.google.com/file/d/1TcHWNFjy8ln8-iBe1n8ghZ3Wv6nkxnNL/preview';
    }
    
    public function getAnalyzeStudioImageAttribute($value) {
        return $value ?? null;
    }

    // Our Story Page Getters
    public function getStoryHeroTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Our Story';
    }

    public function getStoryHeroTextAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Colour by Utie is more than just a personal color analysis service; it\'s a transformative journey that helps individuals discover their perfect palette and enhance their natural beauty.';
    }

    public function getStoryHeroImageAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : null;
    }

    public function getStoryProfileImageAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'assets/images/profile.jpg';
    }

    public function getStoryAboutTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'About Putri Pratiwi';
    }

    public function getStoryAboutTextAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Founded in 2022, Colour by Utie originated from a personal journey of transformation and discovery. After experiencing firsthand how personal color analysis could enhance confidence and self-expression, our founder was inspired to bring this transformative practice to others.';
    }

    public function getStoryAboutText2Attribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Today, we\'re committed to empowering individuals through the science and art of personal color analysis, helping them make confident style choices that authentically represent who they are.';
    }

    public function getStoryAboutText1Attribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : '"I\'m Putri Pratiwi, but everyone knows me as Utie. With my background in Advanced Level Personal Color Analysis from Asian Color Institute and Color Me Beautiful, I help people discover the colors that truly reflect their personality and enhance their natural beauty. My passion lies in helping individuals unlock their unique color potential and boost their self-confidence through color analysis."';
    }

    public function getStoryPracticeTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Korean–Japan<br>Inspired, Balinese<br>Practices';
    }

    public function getStoryPracticeImageAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'assets/images/korean-japan.jpg';
    }

    public function getStoryPracticeText1Attribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'At Colour by Utie, we blend the precision of Korean and Japanese color analysis techniques with the warmth and intuition of Balinese beauty traditions. This unique approach allows us to offer a comprehensive color analysis service that considers both scientific principles and cultural nuances.';
    }

    public function getStoryPracticeText2Attribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Our methodology draws from advanced Asian color theory while incorporating elements of traditional Balinese aesthetic wisdom, creating a holistic approach to personal color analysis that resonates with diverse cultural perspectives.';
    }

    public function getStoryApproachTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Our Approach';
    }

    public function getStoryApproachTextAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'We believe in a personalized approach to color analysis, taking into account not just your physical features but also your lifestyle, preferences, and cultural background. Our aim is to help you discover colors that not only complement your natural features but also align with your personal style and cultural identity.';
    }

    public function getStoryApproachImageAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'assets/images/approach.jpg';
    }

    public function getStoryValuesTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Our Values';
    }

    public function getStoryValuesAttribute($value)
    {
        if (!is_null($value) && $value !== '' && is_array($value)) {
            return $value;
        }
        
        return [
            ['title' => 'Authenticity', 'text' => 'We believe in helping you express your true self through color.'],
            ['title' => 'Expertise', 'text' => 'Our recommendations are backed by professional training and experience.'],
            ['title' => 'Cultural Sensitivity', 'text' => 'We respect and incorporate diverse cultural perspectives in our approach.'],
            ['title' => 'Personal Growth', 'text' => 'We see color analysis as a tool for building confidence and self-awareness.']
        ];
    }

    public function getStoryCertificationsTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Our Certifications';
    }

    public function getStoryCertificationsAttribute($value)
    {
        if (!is_null($value) && $value !== '' && is_array($value)) {
            return $value;
        }
        
        return [
            ['title' => 'Advanced Level Personal Color Analysis', 'institution' => 'Asian Color Institute'],
            ['title' => 'Color Analysis Certification', 'institution' => 'Color Me Beautiful'],
            ['title' => 'Professional Color Consultant', 'institution' => 'International Color Institute']
        ];
    }

    public function getFeedHeroTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Colour Stories';
    }

    public function getFeedHeroBackgroundColorAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : '#fdd79a';
    }

    public function getFeedHeroImagesAttribute($value)
    {
        if (!is_null($value) && $value !== '' && is_array($value)) {
            return $value;
        }
        
        return [
            'assets/images/feed1.jpg', 
            'assets/images/feed2.jpg', 
            'assets/images/feed3.jpg'
        ];
    }

    public function getFeedContactStoryTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Share your colour story';
    }

    public function getFeedContactStoryEmailAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'share@colourbyutie.com';
    }

    public function getFeedContactAddressAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Renon, Denpasar Selatan<br>Kota Denpasar - Bali 80239';
    }

    public function getFeedContactPhoneAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : '+62 811 120 645';
    }

    public function getFeedContactEmailAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'hello@colourbyutie.com';
    }

    public function getFeedGridItemsAttribute($value)
    {
        if (!is_null($value) && $value !== '' && is_array($value)) {
            return $value;
        }
        
        return [
            [
                'image' => 'assets/images/feed1.jpg',
                'title' => 'Finding Your Personal Color Season',
                'category' => 'Color Analysis',
                'author' => 'Putri Pratiwi',
                'date' => 'May 10, 2023',
                'read_time' => '5 min read'
            ],
            [
                'image' => 'assets/images/feed2.jpg',
                'title' => 'How Colors Impact Your Confidence',
                'category' => 'Style Tips',
                'author' => 'Putri Pratiwi',
                'date' => 'June 15, 2023',
                'read_time' => '7 min read'
            ],
            [
                'image' => 'assets/images/feed3.jpg',
                'title' => 'Korean Color Analysis Techniques',
                'category' => 'Color Theory',
                'author' => 'Putri Pratiwi',
                'date' => 'July 22, 2023',
                'read_time' => '6 min read'
            ],
            [
                'image' => 'assets/images/feed4.jpg',
                'title' => 'Seasonal Color Palettes Explained',
                'category' => 'Color Analysis',
                'author' => 'Putri Pratiwi',
                'date' => 'August 5, 2023',
                'read_time' => '8 min read'
            ],
            [
                'image' => 'assets/images/feed5.jpg',
                'title' => 'Dressing for Your Color Type',
                'category' => 'Fashion',
                'author' => 'Putri Pratiwi',
                'date' => 'September 18, 2023',
                'read_time' => '4 min read'
            ],
            [
                'image' => 'assets/images/feed6.jpg',
                'title' => 'Color Analysis for Different Skin Tones',
                'category' => 'Beauty',
                'author' => 'Putri Pratiwi',
                'date' => 'October 2, 2023',
                'read_time' => '5 min read'
            ]
        ];
    }
    
    // Steps Page Accessors
    public function getStepsHeroImageAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : null;
    }
    
    public function getStepsGalleryImagesAttribute($value)
    {
        // EMERGENCY FIX - always return an array no matter what
        // Hard-code default values
        $defaultImages = [
            ['image' => 'assets/images/step1.jpg'],
            ['image' => 'assets/images/step2.jpg'],
            ['image' => 'assets/images/step3.jpg']
        ];
        
        // Only attempt to use stored value if it's not problematic
        try {
            // Handle various input types
            if (is_array($value) && count($value) > 0) {
                return $value;
            }
            
            if (is_string($value) && !empty($value)) {
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded) && count($decoded) > 0) {
                    return $decoded;
                }
            }
        } catch (\Exception $e) {
            // Silently catch any errors
        }
        
        // Always return our default if anything went wrong
        return $defaultImages;
    }
    
    public function getStepsDetailsAttribute($value)
    {
        // EMERGENCY FIX - always return an array no matter what
        // Hard-code default values
        $defaultDetails = [
            [
                'title' => 'Initial Consultation',
                'text' => 'The personal colour analysis begins by discussing the individual\'s goals and preferences, understanding their current fashion choices, and addressing any concerns they have about colour.'
            ],
            [
                'title' => 'Skin Tone Analysis',
                'text' => 'We analyze your skin undertone using specially selected fabric drapes, determining whether you have warm or cool undertones. This foundational step guides the rest of the colour analysis process.'
            ],
            [
                'title' => 'Hair & Eye Colour Assessment',
                'text' => 'We examine your natural hair and eye colours to understand how they interact with different colour families. This helps create a harmonious palette that enhances your overall appearance.'
            ],
            [
                'title' => 'Seasonal Color Analysis',
                'text' => 'Using the 12-season color analysis system, we determine which season best matches your natural coloring. This includes testing various color combinations to find your most flattering palette.'
            ],
            [
                'title' => 'Personal Color Palette',
                'text' => 'We create your personalized color palette, including your best neutrals, accent colors, and metallics. This becomes your guide for making confident color choices in clothing and accessories.'
            ],
            [
                'title' => 'Styling Recommendations',
                'text' => 'We provide practical advice on applying your color palette to your wardrobe, makeup, and accessories. You\'ll learn how to mix and match colors effectively for various occasions.'
            ]
        ];
        
        // Only attempt to use stored value if it's not problematic
        try {
            // Handle various input types
            if (is_array($value) && count($value) > 0) {
                return $value;
            }
            
            if (is_string($value) && !empty($value)) {
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded) && count($decoded) > 0) {
                    return $decoded;
                }
            }
        } catch (\Exception $e) {
            // Silently catch any errors
        }
        
        // Always return our default if anything went wrong
        return $defaultDetails;
    }
    
    public function getStepsSection1TitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Self Expression Through Colour';
    }
    
    public function getStepsSection1TextAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'We believe that personal colour analysis is more than just discovering flattering colours—it\'s about self-expression and authenticity. Our approach helps you unlock your unique colour identity, giving you the confidence to express yourself authentically through colour choices that resonate with your natural features and personality. This foundation of self-expression guides our entire colour analysis process.';
    }
    
    public function getStepsSection1ImageAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'assets/images/section1.jpg';
    }
    
    public function getStepsSection2TitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Empowerment + Confidence';
    }
    
    public function getStepsSection2TextAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Our colour analysis service is designed to empower you with knowledge and confidence about your personal colour palette. By understanding which colours enhance your natural beauty, you gain the tools to make informed decisions about your wardrobe, makeup, and accessories. This empowerment extends beyond aesthetics, fostering a deeper sense of confidence that comes from knowing you\'re presenting your authentic self to the world.';
    }
    
    public function getStepsSection2ImageAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'assets/images/section2.jpg';
    }
    
    public function getStepsSection3TitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Creativity + Innovation';
    }
    
    public function getStepsSection3TextAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'We approach colour analysis with creativity and innovation, combining traditional techniques with modern advancements in colour theory. Our analysis isn\'t rigid—it\'s a creative exploration that considers your unique features, lifestyle, and preferences. This innovative approach allows us to provide personalized recommendations that go beyond standard colour palettes, inspiring you to explore creative ways to incorporate your best colours into your daily life.';
    }
    
    public function getStepsSection3ImageAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'assets/images/section3.jpg';
    }
    
    public function getStepsContactTitleAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Get in touch';
    }
    
    public function getStepsContactAddressAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'Renon, Denpasar Selatan\nKota Denpasar - Bali 80239';
    }
    
    public function getStepsContactPhoneAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : '+62 811 120 645';
    }
    
    public function getStepsContactEmailAttribute($value)
    {
        return (!is_null($value) && $value !== '') ? $value : 'hello@colourbyutie.com';
    }
}
