<!DOCTYPE html>
<html>
<head>
    <title>Guide Booking Receipt</title>
    <style>
        @page { margin: 50px 30px; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
            color: #1a1a1a;
            line-height: 1.6;
        }
        .header { 
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
            border-bottom: 2px solid #0ea5e9;
        }
        .logo { 
            height: 60px;
            filter: drop-shadow(0 2px 4px rgba(14, 165, 233, 0.1));
        }
        .company-info {
            text-align: right;
            color: #64748b;
        }
        .watermark {
            position: fixed;
            opacity: 0.1;
            font-size: 80px;
            color: #0ea5e9;
            transform: rotate(-30deg);
            top: 40%;
            left: 20%;
        }
        .details-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 2rem 0;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .details-table th {
            background: #f8fafc;
            padding: 1rem;
            text-align: left;
            color: #0ea5e9;
            border-bottom: 2px solid #e2e8f0;
        }
        .details-table td { 
            padding: 1rem;
            border-bottom: 1px solid #e2e8f0;
        }
        .total-row { 
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            font-weight: 600;
            color: #0f172a;
        }
        .footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 2px solid #e2e8f0;
            color: #64748b;
            text-align: center;
        }
        .payment-status {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            display: inline-block;
            font-weight: 600;
        }
        .paid { background: #dcfce7; color: #166534; }
        .refunded { background: #fee2e2; color: #991b1b; }
        .pending { background: #fef9c3; color: #854d0e; }
        .status {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            display: inline-block;
            font-weight: 600;
        }
        .confirmed { background: #dcfce7; color: #166534; }
        .completed { background: #dbeafe; color: #1e40af; }
        .cancelled { background: #fee2e2; color: #991b1b; }
        .in-progress { background: #fef3c7; color: #92400e; }
    </style>
</head>
<body>
    @if($booking->payment_status === 'paid')
    <div class="watermark">PAID</div>
    @endif

    <div class="header">
        <div>
            <img src="{{ $company['logo'] }}" class="logo" alt="CuriousTra Logo">
            <h1 style="color: #0ea5e9; margin: 0.5rem 0; font-size: 24px;">Guide Booking Receipt</h1>
        </div>
        <div class="company-info">
            <h2 style="margin: 0; color: #0f172a;">{{ $company['name'] }}</h2>
            <p style="margin: 0.25rem 0;">{{ $company['address'] }}</p>
            <p style="margin: 0.25rem 0;">{{ $company['email'] }}</p>
            <p style="margin: 0.25rem 0;">{{ $company['phone'] }}</p>
        </div>
    </div>

    <div class="booking-info">
        <table class="details-table">
            <tr>
                <th colspan="2" style="background: linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%); color: white;">
                    Tour Summary
                </th>
            </tr>
            <tr>
                <td width="30%">Booking ID</td>
                <td><strong>#{{ $booking->id }}</strong></td>
            </tr>
            <tr>
                <td>Booking Date</td>
                <td>{{ $booking->created_at->format('d M Y, h:i A') }}</td>
            </tr>
            <tr>
                <td>Guide Details</td>
                <td>
                    {{ $booking->guide->name }}<br>
                    <small style="color: #64748b;">Specialization: {{ $booking->guide->specialization }}</small>
                </td>
            </tr>
            <tr>
                <td>Guide Contact</td>
                <td>
                    {{ $booking->guide->contact_number }}<br>
                    <small style="color: #64748b;">Email: {{ $booking->guide->email }}</small>
                </td>
            </tr>
            <tr>
                <td>Tour Date & Time</td>
                <td>
                    {{ \Carbon\Carbon::parse($booking->booking_date)->format('d M Y') }}<br>
                    <small style="color: #64748b;">{{ \Carbon\Carbon::parse($booking->booking_time)->format('h:i A') }} ({{ $booking->duration_hours }} hours)</small>
                </td>
            </tr>
            <tr>
                <td>Meeting Location</td>
                <td>{{ $booking->meeting_location }}</td>
            </tr>
            <tr>
                <td>Rate</td>
                <td>₹{{ $booking->rate_per_hour }} per hour</td>
            </tr>
            <tr class="total-row">
                <td>Total Amount</td>
                <td style="font-size: 1.2em;">
                    ₹{{ number_format($booking->total_price, 2) }}
                    <div style="font-size: 0.8em; color: #64748b;">
                        ({{ $booking->duration_hours }} hours × ₹{{ $booking->rate_per_hour }}/hour)
                    </div>
                </td>
            </tr>
            <tr>
                <td>Booking Status</td>
                <td>
                    <span class="status {{ str_replace(' ', '-', strtolower($booking->status)) }}">
                        {{ strtoupper($booking->status) }}
                    </span>
                </td>
            </tr>
            <tr>
                <td>Payment Status</td>
                <td>
                    <span class="payment-status {{ $booking->payment_status }}">
                        {{ strtoupper($booking->payment_status) }}
                    </span>
                </td>
            </tr>
            @if($booking->payment_status === 'refunded')
            <tr>
                <td>Refund ID</td>
                <td>{{ $booking->refund_id }}</td>
            </tr>
            <tr>
                <td>Refund Date</td>
                <td>{{ $booking->updated_at->format('d M Y, h:i A') }}</td>
            </tr>
            @endif
        </table>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-top: 2rem;">
            <div>
                <h3 style="color: #0ea5e9; margin-bottom: 1rem;">Customer Details</h3>
                <p style="margin: 0.5rem 0;"><strong>Name:</strong> {{ $booking->user->name }}</p>
                <p style="margin: 0.5rem 0;"><strong>Email:</strong> {{ $booking->user->email }}</p>
                <p style="margin: 0.5rem 0;"><strong>Phone:</strong> {{ $booking->user->phone ?? 'N/A' }}</p>
            </div>
            
            <div>
                <h3 style="color: #0ea5e9; margin-bottom: 1rem;">Payment Method</h3>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="{{ public_path('images/razorpay-logo.png') }}" 
                         style="height: 30px;" 
                         alt="Razorpay">
                    <div>
                        <p style="margin: 0;">•••• 4242 (Visa)</p>
                        <small style="color: #64748b;">Transaction ID: {{ $booking->payment_id }}</small>
                    </div>
                </div>
            </div>
        </div>

        @if($booking->additional_info)
        <div style="margin-top: 2rem;">
            <h3 style="color: #0ea5e9; margin-bottom: 1rem;">Additional Information</h3>
            <div style="background: #f8fafc; padding: 1rem; border-radius: 8px;">
                {{ $booking->additional_info }}
            </div>
        </div>
        @endif
    </div>

    <div class="footer">
        <p>Thank you for choosing {{ $company['name'] }} for your tour experience!</p>
        <p>This is a computer-generated receipt and does not require a physical signature.</p>
        <p style="margin-top: 1rem; font-size: 0.9em;">
            Need assistance? Contact us at {{ $company['email'] }} or call {{ $company['phone'] }}
        </p>
    </div>
</body>
</html>