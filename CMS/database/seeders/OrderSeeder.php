<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample orders
        $orders = [
            [
                'customer_name' => 'Sarah Johnson',
                'customer_email' => 'sarah.johnson@email.com',
                'customer_phone' => '+1-555-0123',
                'status' => 'completed',
                'payment_status' => 'paid',
                'payment_method' => 'Credit Card',
                'notes' => 'Customer requested express delivery',
                'items' => [
                    [
                        'product_name' => 'Facial Treatment Package',
                        'quantity' => 1,
                        'unit_price' => 150.00,
                        'notes' => 'Anti-aging treatment'
                    ],
                    [
                        'product_name' => 'Beauty Consultation',
                        'quantity' => 1,
                        'unit_price' => 50.00,
                        'notes' => 'Initial consultation'
                    ]
                ]
            ],
            [
                'customer_name' => 'Emily Davis',
                'customer_email' => 'emily.davis@email.com',
                'customer_phone' => '+1-555-0124',
                'status' => 'processing',
                'payment_status' => 'paid',
                'payment_method' => 'PayPal',
                'notes' => 'Regular customer',
                'items' => [
                    [
                        'product_name' => 'Hair Styling Session',
                        'quantity' => 1,
                        'unit_price' => 80.00,
                        'notes' => 'Wedding preparation'
                    ]
                ]
            ],
            [
                'customer_name' => 'Jessica Wilson',
                'customer_email' => 'jessica.wilson@email.com',
                'customer_phone' => '+1-555-0125',
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => null,
                'notes' => 'Waiting for payment confirmation',
                'items' => [
                    [
                        'product_name' => 'Makeup Application',
                        'quantity' => 1,
                        'unit_price' => 120.00,
                        'notes' => 'Special event makeup'
                    ],
                    [
                        'product_name' => 'Nail Art Service',
                        'quantity' => 1,
                        'unit_price' => 45.00,
                        'notes' => 'French manicure'
                    ]
                ]
            ],
            [
                'customer_name' => 'Amanda Brown',
                'customer_email' => 'amanda.brown@email.com',
                'customer_phone' => '+1-555-0126',
                'status' => 'completed',
                'payment_status' => 'paid',
                'payment_method' => 'Cash',
                'notes' => 'Very satisfied customer',
                'items' => [
                    [
                        'product_name' => 'Spa Package Deluxe',
                        'quantity' => 1,
                        'unit_price' => 250.00,
                        'notes' => 'Full day spa experience'
                    ]
                ]
            ],
            [
                'customer_name' => 'Michelle Taylor',
                'customer_email' => 'michelle.taylor@email.com',
                'customer_phone' => '+1-555-0127',
                'status' => 'cancelled',
                'payment_status' => 'refunded',
                'payment_method' => 'Credit Card',
                'notes' => 'Customer cancelled due to scheduling conflict',
                'items' => [
                    [
                        'product_name' => 'Eyebrow Shaping',
                        'quantity' => 1,
                        'unit_price' => 35.00,
                        'notes' => 'Microblading service'
                    ]
                ]
            ]
        ];

        foreach ($orders as $orderData) {
            $items = $orderData['items'];
            unset($orderData['items']);

            // Calculate total amount
            $totalAmount = 0;
            foreach ($items as $item) {
                $totalAmount += $item['quantity'] * $item['unit_price'];
            }
            $orderData['total_amount'] = $totalAmount;

            // Create order
            $order = Order::create($orderData);

            // Create order items
            foreach ($items as $itemData) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_name' => $itemData['product_name'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'notes' => $itemData['notes'] ?? null,
                ]);
            }
        }
    }
}
