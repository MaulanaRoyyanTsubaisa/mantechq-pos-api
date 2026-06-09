<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\Page;

Route::get('/debug-steps-data', function () {
    // Get data directly from DB
    $dbData = DB::table('pages')->select('id', 'steps_gallery_images', 'steps_details')->first();
    
    // Get data from model
    $page = Page::first();

    $debug = [
        'DB Values (Raw)' => [
            'steps_gallery_images' => $dbData->steps_gallery_images ?? 'NULL',
            'steps_gallery_images_type' => gettype($dbData->steps_gallery_images ?? null),
            'steps_details' => $dbData->steps_details ?? 'NULL',
            'steps_details_type' => gettype($dbData->steps_details ?? null),
        ],
        'Model Accessor Values' => [
            'steps_gallery_images' => $page->steps_gallery_images,
            'steps_gallery_images_type' => gettype($page->steps_gallery_images),
            'steps_details' => $page->steps_details,
            'steps_details_type' => gettype($page->steps_details),
        ],
        
        'JSON Decode Test' => [
            'steps_gallery_images' => json_decode($dbData->steps_gallery_images ?? '[]', true),
            'steps_gallery_images_type' => gettype(json_decode($dbData->steps_gallery_images ?? '[]', true)),
            'steps_details' => json_decode($dbData->steps_details ?? '[]', true),
            'steps_details_type' => gettype(json_decode($dbData->steps_details ?? '[]', true)),
        ],
    ];
    
    // List columns in pages table
    $columns = DB::select('SHOW COLUMNS FROM pages');
    $columnNames = array_map(function($col) {
        return $col->Field;
    }, $columns);
    
    // Fix the issue on the fly
    if (!is_array($page->steps_gallery_images)) {
        DB::table('pages')->where('id', $page->id)->update([
            'steps_gallery_images' => json_encode([
                ['image' => 'assets/images/step1.jpg'],
                ['image' => 'assets/images/step2.jpg'],
                ['image' => 'assets/images/step3.jpg']
            ])
        ]);
        
        $debug['Fix Applied'] = 'steps_gallery_images fixed';
    }
    
    if (!is_array($page->steps_details)) {
        DB::table('pages')->where('id', $page->id)->update([
            'steps_details' => json_encode([
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
                ]
            ])
        ]);
        
        $debug['Fix Applied'] = 'Both fields fixed';
    }
    
    // Get model data after fix
    $pageAfter = Page::first();
    
    $debug['After Fix'] = [
        'steps_gallery_images' => $pageAfter->steps_gallery_images,
        'steps_gallery_images_type' => gettype($pageAfter->steps_gallery_images),
        'steps_details' => $pageAfter->steps_details,
        'steps_details_type' => gettype($pageAfter->steps_details),
    ];

    return response()->json([
        'debug' => $debug,
        'columns' => $columnNames,
    ]);
});
