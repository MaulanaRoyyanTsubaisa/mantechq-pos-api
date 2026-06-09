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
}