<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $isAdmin ? 'Booking Baru dari Customer' : 'Konfirmasi Booking Anda' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            background-color: #fff;
        }
        h2 {
            color: #0066cc;
            margin-top: 0;
        }
        .booking-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            font-size: 0.9em;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        @if($isAdmin)
            <h2>Booking Baru dari Customer!</h2>
            <p>Ada booking baru yang perlu ditinjau di sistem. Berikut detail bookingnya:</p>
        @else
            <h2>Terima Kasih Atas Booking Anda!</h2>
            <p>Booking Anda telah kami terima. Berikut detail booking Anda:</p>
        @endif
        
        <div class="booking-details">
            <p><strong>Nama:</strong> {{ $booking->customer_name }}</p>
            <p><strong>Email:</strong> {{ $booking->customer_email }}</p>
            <p><strong>Telepon:</strong> {{ $booking->customer_phone }}</p>
            <p><strong>Service:</strong> {{ $booking->service }}</p>
            <p><strong>Durasi:</strong> {{ $booking->duration }} menit</p>
            <p><strong>Harga:</strong> Rp{{ number_format((float) $booking->price, 0, ',', '.') }}</p>
            <p><strong>Tanggal & Jam:</strong> {{ $booking->date }} {{ $booking->time }}</p>
            <p><strong>Catatan:</strong> {{ $booking->notes ?? '-' }}</p>
        </div>
        
        @if($isAdmin)
            <p>Silahkan cek dashboard CMS untuk manajemen booking lebih lanjut.</p>
        @else
            <p>Kami akan segera menghubungi Anda untuk mengkonfirmasi booking ini.</p>
            <p>Jika Anda memiliki pertanyaan, silakan hubungi kami.</p>
        @endif
        
        <div class="footer">
            <p>Terima kasih telah menggunakan layanan kami.</p>
        </div>
    </div>
</body>
</html>
