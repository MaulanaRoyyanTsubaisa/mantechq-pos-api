<?php

namespace App\Models\Shop;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\OrderItem;

class Order extends Model
{
    use HasFactory;    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'phone', // Added phone field
        'total_amount',
        'status',
        'payment_status',
        'payment_method',
        'appointment_date',
        'notes'
    ];    protected $casts = [
        'total_amount' => 'int:2',
        'appointment_date' => 'date',
        'notes' => 'array'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($order) {
            $order->order_number = static::generateOrderNumber();
        });
    }    public static function generateOrderNumber(): string
    {
        $prefix = 'ORD';
        $date = now()->format('Ymd');
        
        // Add microseconds to ensure uniqueness even for quick successive orders
        $microtime = sprintf('%03d', (microtime(true) - floor(microtime(true))) * 1000);
        
        // Try to find the latest order number for today
        $lastOrder = static::whereDate('created_at', now())->latest()->first();
        
        if ($lastOrder) {
            // Extract the serial number from the last order
            $lastNumber = (int) substr($lastOrder->order_number, -4);
            // Increment the serial number
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
            
            // Double-check if this number already exists (concurrent transactions safeguard)
            $orderNumber = $prefix . $date . $newNumber;
            $exists = static::where('order_number', $orderNumber)->exists();
            
            if ($exists) {
                // If it exists, use an alternative with timestamp to ensure uniqueness
                return $prefix . $date . mt_rand(1000, 9999) . $microtime;
            }
        } else {
            $newNumber = '0001';
        }
        return $prefix . $date . $newNumber;
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', now());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year);
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'warning',
            'processing' => 'info',
            'completed' => 'success',
            'cancelled' => 'danger',
            default => 'secondary',
        };
    }

    public function getPaymentStatusColorAttribute(): string
    {
        return match($this->payment_status) {
            'pending' => 'warning',
            'paid' => 'success',
            'failed' => 'danger',
            'refunded' => 'info',
            default => 'secondary',
        };
    }
}
