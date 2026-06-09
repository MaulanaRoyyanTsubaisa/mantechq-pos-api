<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlockedDate;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class BlockedDateController extends Controller
{    public function index(): JsonResponse
    {        $blockedDates = BlockedDate::all()
            ->map(fn($blockedDate) => $blockedDate->date ? Carbon::parse($blockedDate->date)->format('Y-m-d') : null)
            ->filter()
            ->values()
            ->toArray();
            
        return response()->json($blockedDates)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET')
            ->header('Access-Control-Allow-Headers', 'Content-Type');
    }
}
