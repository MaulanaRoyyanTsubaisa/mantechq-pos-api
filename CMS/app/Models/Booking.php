<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;    protected $fillable = [
        'service',
        'description',
        'duration',
        'price',
        'date',
        'time',
        'customer_name',
        'customer_email',
        'customer_phone',
        'notes',
        'status'
    ];

    protected $casts = [
        'date' => 'date',
        'price' => 'decimal:2',
        'duration' => 'integer',
    ];

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', now()->today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', now()->month);
    }

    public function scopeCompareYesterday($query)
    {
        return $query->whereDate('created_at', now()->yesterday());
    }

    public function scopeCompareLastWeek($query)
    {
        return $query->whereBetween('created_at', [
            now()->subWeek()->startOfWeek(), 
            now()->subWeek()->endOfWeek()
        ]);
    }

    public function scopeCompareLastMonth($query)
    {
        return $query->whereMonth('created_at', now()->subMonth()->month);
    }

    /**
     * Process duration input to ensure it's stored as an integer
     */
    public function setDurationAttribute($value)
    {
        // If the value is a string with "min" in it, extract just the number
        if (is_string($value) && preg_match('/(\d+)\s*min/', $value, $matches)) {
            $this->attributes['duration'] = (int)$matches[1];
        } else {
            $this->attributes['duration'] = is_numeric($value) ? (int)$value : 60; // Default to 60 if invalid
        }
    }

    /**
     * Format duration for display if needed
     */
    public function getDurationAttribute($value)
    {
        return $value; // Return as is for now, but can be formatted as "X min" if needed
    }
}