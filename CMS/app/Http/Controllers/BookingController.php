<?php

namespace App\Http\Controllers;

use App\Mail\BookingInfoMail;
use App\Models\BlockedDate;
use App\Models\Booking;
use App\Models\Shop\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    public function showAnalyze()
    {
        return view('my_pages.analyze');
    }    public function showCheckout(Request $request)
    {
        // Log the incoming data for debugging
        Log::info('Checkout data received:', $request->all());
        
        try {
            // Validate booking data from the form - match fields from analyze page
            $validated = $request->validate([
                'service' => 'required|string',
                'description' => 'required|string',
                'duration' => 'required',
                'price' => 'required',
                'date' => 'required',
                'time' => 'required',
            ]);
            
            // Log validated data
            Log::info('Validated checkout data:', $validated);
            
            // Pass the booking data to the checkout view
            return view('pages.checkout', [
                'booking' => $validated
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Log the error
            Log::error('Validation error in showCheckout: ' . $e->getMessage());
            
            // Return a view with the original data and errors
            return redirect()->back()->withInput()->withErrors($e->errors());
        } catch (\Exception $e) {
            // Log any other errors
            Log::error('Error in showCheckout: ' . $e->getMessage());
            
            // Return a view with the original data and errors
            return view('my_pages.checkout', [
                'booking' => $request->all(),
                'error_message' => $e->getMessage()
            ]);
        }
    }    public function getAvailableDates()
    {
        try {
            $availableDates = BlockedDate::getAvailableDates();
            Log::info('API returning available dates: ' . json_encode($availableDates));
            return response()->json($availableDates);
        } catch (\Exception $e) {
            // If there's an error with BlockedDate, return default available dates (next 60 days)
            Log::error('Error getting available dates: ' . $e->getMessage());
            
            // Generate default dates (Tuesday, Wednesday, Thursday for next 60 days)
            $dates = [];
            $date = Carbon::now();
            $end = Carbon::now()->addDays(60);
            
            while ($date->lte($end)) {
                if (in_array($date->dayOfWeek, [2, 3, 4])) { // 2=Tuesday, 3=Wednesday, 4=Thursday
                    $dates[] = $date->format('Y-m-d');
                }
                $date->addDay();
            }
            
            Log::info('API returning fallback available dates: ' . json_encode($dates));
            return response()->json($dates);
        }
    }public function validateDate(Request $request)
    {
        $date = $request->input('date');
        
        try {
            $isBlocked = BlockedDate::isDateBlocked($date);
            
            return response()->json([
                'available' => !$isBlocked,
                'message' => $isBlocked ? 'This date is not available for booking.' : 'Date is available.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error validating date: ' . $e->getMessage());
            
            // Default to allowing the date if there's an error
            return response()->json([
                'available' => true,
                'message' => 'Date is available.'
            ]);
        }
    }public function processBooking(Request $request)
    {
        Log::info('Processing booking request data:', $request->all());
        $data = [
            'service' => $request->input('service', 'Express for One'),
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'phone' => $request->input('phone'),
            'date' => $request->input('date', date('Y-m-d')),
            'time' => $request->input('time', '10:00 AM'),
            'price' => $request->input('price', '855000'),
            'duration' => $request->input('duration', '60'),
        ];

        try {
            $validated = $request->validate([
                'name' => 'required|string',
                'email' => 'required|email',
                'phone' => 'required|string',
            ]);
            $validated['service'] = $data['service'];
            $validated['date'] = $data['date'];
            $validated['time'] = $data['time'];
            $validated['price'] = $data['price'];
            $validated['duration'] = $data['duration'];

            // Clean and normalize price ONCE
            $pricevalue = $validated['price'];
            $cleanprice = preg_replace('/[^0-9]/', '', $pricevalue);
            $cleanprice = (int)$cleanprice;
            if ($cleanprice > 1000000) {
                $cleanprice = $cleanprice / 100;
            }

            // Format the booking date properly
            try {
                // Log all date/time related fields for debugging
                Log::info('Date values received:', [
                    'date' => $validated['date'] ?? 'not set',
                    'time' => $validated['time'] ?? 'not set',
                    'duration' => $validated['duration'] ?? 'not set',
                ]);
                
                // Make sure date is in the correct format
                $dateString = $validated['date'];
                if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateString)) {
                    // Convert to YYYY-MM-DD if it's not already
                    $dateObj = new \DateTime($dateString);
                    $dateString = $dateObj->format('Y-m-d');
                    Log::info('Date reformatted to: ' . $dateString);
                }
                
                // Validate the date is not blocked
                $isBlocked = BlockedDate::isDateBlocked($dateString);
                
                if ($isBlocked) {
                    throw new \Exception("The selected date is not available for booking.");
                }
                
                // Parse the validated date
                $bookingDate = \Carbon\Carbon::parse($dateString);
                
                // Make sure it's a Tuesday, Wednesday or Thursday
                $dayOfWeek = $bookingDate->dayOfWeek;
                if (!in_array($dayOfWeek, [2, 3, 4])) { // 2 = Tuesday, 3 = Wednesday, 4 = Thursday
                    throw new \Exception("Bookings are only available on Tuesday, Wednesday, and Thursday.");
                }
                
                Log::info('Successfully parsed and validated date: ' . $bookingDate);
            } catch (\Exception $e) {
                Log::error('Date validation error: ' . $e->getMessage() . ' for date: ' . ($validated['date'] ?? 'not set'));
                
                // Find the next available date (Tuesday, Wednesday or Thursday)
                $bookingDate = Carbon::now();
                while (!in_array($bookingDate->dayOfWeek, [2, 3, 4]) || BlockedDate::isDateBlocked($bookingDate->format('Y-m-d'))) {
                    $bookingDate->addDay();
                }
                
                Log::info('Using next available date: ' . $bookingDate);
            }            // Create Order record - the model will generate a unique order number
            try {
                $order = Order::create([
                    'customer_name' => $validated['name'],
                    'customer_email' => $validated['email'],
                    'customer_phone' => $validated['phone'],
                    'total_amount' => $cleanprice, // always use cleanprice
                    'status' => 'pending',
                    'payment_status' => 'pending',
                    'appointment_date' => $bookingDate,
                    'notes' => json_encode([
                        'service' => $validated['service'],
                        'service_description' => $validated['service']
                    ])
                ]);
                
                Log::info('Order created successfully with order number: ' . $order->order_number);            } catch (\Illuminate\Database\QueryException $e) {
                if ($e->errorInfo[1] == 1062) { // MySQL duplicate entry code
                    Log::warning('Duplicate order number detected, retrying with custom logic');
                    try {
                        // Create a guaranteed unique order number using uniqid, microtime, and a random element
                        $timestamp = microtime(true);
                        $random = mt_rand(1000, 9999);
                        $uniqueOrderNumber = 'CBU-' . date('YmdHis') . '-' . $random . '-' . substr(md5(uniqid($timestamp, true)), 0, 8);
                        
                        Log::info('Attempting with custom order number: ' . $uniqueOrderNumber);
                        
                        $order = Order::create([
                            'order_number' => $uniqueOrderNumber, // Override auto-generation
                            'customer_name' => $validated['name'],
                            'customer_email' => $validated['email'],
                            'customer_phone' => $validated['phone'],
                            'total_amount' => $cleanprice, // always use cleanprice
                            'status' => 'pending',
                            'payment_status' => 'pending',
                            'appointment_date' => $bookingDate,
                            'notes' => json_encode([
                                'service' => $validated['service'],
                                'service_description' => $validated['service']
                            ])
                        ]);
                        Log::info('Order created with fallback logic, order number: ' . $order->order_number);
                    } catch (\Exception $retryEx) {
                        Log::error('Second attempt at creating order failed: ' . $retryEx->getMessage());
                        $finalOrderNumber = 'CBU-FALLBACK-' . date('YmdHis') . '-' . uniqid();
                        \Illuminate\Support\Facades\DB::table('orders')->insert([
                            'order_number' => $finalOrderNumber,
                            'customer_name' => $validated['name'],
                            'customer_email' => $validated['email'],
                            'customer_phone' => $validated['phone'],
                            'total_amount' => $cleanprice, // always use cleanprice
                            'status' => 'pending',
                            'payment_status' => 'pending',
                            'appointment_date' => $bookingDate,
                            'notes' => json_encode([
                                'service' => $validated['service'],
                                'service_description' => $validated['service']
                            ]),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                        $order = Order::where('order_number', $finalOrderNumber)->first();
                        Log::info('Order created with emergency fallback, order number: ' . $finalOrderNumber);
                    }
                } else {
                    throw $e; // Re-throw if it's not a duplicate key error
                }
            }
            // Ensure time is in a valid format
            $time = $validated['time'] ?? '10:00 AM';
            if (empty($time)) {
                $time = '10:00 AM';
            }
            
            // Create Booking record for the Filament resource
            $booking = Booking::create([
                'service' => $validated['service'],
                'description' => $validated['service'],
                'duration' => isset($validated['duration']) ? $validated['duration'] : 60,
                'price' => $cleanprice, // always use cleanprice
                'date' => $bookingDate,
                'time' => $time, // Use time from analyze page with validation
                'customer_name' => $validated['name'],
                'customer_email' => $validated['email'],
                'customer_phone' => $validated['phone'],
                'status' => 'pending'
            ]);

            // Send confirmation emails
            Mail::to($validated['email'])->queue(new BookingInfoMail($booking, false));
            
            // Send email to admin
            Mail::to(config('mail.admin_address', 'admin@colorbyutie.com'))->queue(new BookingInfoMail($booking, true));            return redirect()->route('booking.success')->with('booking', $booking);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database-specific errors
            Log::error('Database error when creating booking: ' . $e->getMessage());
            
            // If there's a duplicate key error, try one more time with a fresh order number
            if ($e->errorInfo[1] == 1062) { // MySQL duplicate entry code
                try {
                    // Generate a brand new order number based on current timestamp
                    $orderNumber = 'CBU-' . date('YmdHis') . '-' . strtoupper(substr(uniqid(), -4));
                    
                    // Create Order record with the new number
                    $order = Order::create([
                        'order_number' => $orderNumber,
                        'customer_name' => $validated['name'],
                        'customer_email' => $validated['email'],
                        'customer_phone' => $validated['phone'],
                        'total_amount' => $cleanprice, // always use cleanprice
                        'status' => 'pending',
                        'payment_status' => 'pending',
                        'appointment_date' => $bookingDate,
                        'notes' => json_encode([
                            'service' => $validated['service'],
                            'service_description' => $validated['service']
                        ])
                    ]);
                    
                    // Create Booking record
                    $booking = Booking::create([
                        'service' => $validated['service'],
                        'description' => $validated['description'],
                        'duration' => isset($validated['duration']) ? $validated['duration'] : 60,
                        'price' => $cleanprice, // always use cleanprice
                        'date' => $bookingDate,
                        'time' => $validated['time'], 
                        'customer_name' => $validated['name'],
                        'customer_email' => $validated['email'],
                        'customer_phone' => $validated['phone'],
                        'status' => 'pending'
                    ]);
                    
                    // Send confirmation emails
                    Mail::to($validated['email'])->queue(new BookingInfoMail($booking, false));
                    Mail::to(config('mail.admin_address', 'admin@colorbyutie.com'))->queue(new BookingInfoMail($booking, true));
                    
                    return redirect()->route('booking.success')->with('booking', $booking);
        } catch (\Exception $retryEx) {
                    Log::error('Error in retry attempt: ' . $retryEx->getMessage() . "\n" . $retryEx->getTraceAsString());
                    return back()
                        ->withInput()
                        ->withErrors(['error' => 'We encountered a technical issue. Please try again. Error details: ' . $retryEx->getMessage()]);
                }
            }
            
            return back()
                ->withInput()
                ->withErrors(['error' => 'Unable to create booking. Please try again. Error details: ' . $e->getMessage()]);        } catch (\Exception $e) {
            // Log the detailed error for debugging
            Log::error('General error when creating booking: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            
            // Only return a generic error message to the user
            return back()
                ->withInput()
                ->withErrors(['error' => 'We encountered a technical issue. Please try again.']);
        }
    }

    public function showSuccess()
    {
        return view('my_pages.booking-success');
    }
      /**
     * Generate a unique order number that doesn't exist in the database
     *
     * @return string
     */
    private function generateUniqueOrderNumber()
    {
        $attempts = 0;
        $max_attempts = 10;
        
        do {
            // Create a base order number with timestamp for guaranteed uniqueness
            $timestamp = microtime(true) * 10000;
            $orderNumber = 'CBU-' . date('Ymd') . '-' . strtoupper(substr(uniqid() . $timestamp, -8));
            
            // Log the order number being attempted
            Log::info('Generating order number: ' . $orderNumber);
            
            try {
                // Check if this order number already exists
                $exists = Order::where('order_number', $orderNumber)->exists();
                
                // If unique, return it
                if (!$exists) {
                    Log::info('Generated unique order number: ' . $orderNumber);
                    return $orderNumber;
                }
            } catch (\Exception $e) {
                Log::error('Error checking order number: ' . $e->getMessage());
            }
            
            // Count attempts to prevent infinite loops
            $attempts++;
        } while ($attempts < $max_attempts);
        
        // If we reached here, generate a completely time-based unique ID as fallback
        $fallbackOrderNumber = 'CBU-' . date('YmdHis') . '-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), -4));
        Log::info('Using fallback order number generation: ' . $fallbackOrderNumber);
        return $fallbackOrderNumber;
    }
}
