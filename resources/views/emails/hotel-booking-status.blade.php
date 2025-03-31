<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #1a1a1a; background-color: #f8fafc;">
    <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <header style="background: linear-gradient(135deg, {{ $statusColor }}); padding: 2rem; text-align: center; border-radius: 0 0 20px 20px;">
            <img src="{{ $logoUrl }}" alt="Hotel Service Logo" style="height: 40px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">
            <h1 style="color: #1e293b; font-size: 1.75rem; margin: 0 0 1rem; font-weight: 600; background: linear-gradient(135deg, {{ $statusColor }}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">
                {{ $subject }}
            </h1>
        </header>

        <!-- Main Content -->
        <div style="padding: 2rem 2rem 1rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="background: linear-gradient(135deg, {{ $statusColor }}); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center;">
                    {!! $statusIcon !!}
                </div>
                <h2 style="color: #1e293b; font-size: 1.5rem; margin: 0 0 1rem; font-weight: 600;">
                    {{ $heading }}
                </h2>
                <p style="color: #64748b; margin: 0; font-size: 1rem;">{{ $subHeading }}</p>
            </div>

            <div style="background-color: #ffffff; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 24px rgba(0,0,0,0.05); border: 1px solid rgba(14, 165, 233, 0.15);">
                <!-- Hotel Details -->
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="color: #0ea5e9; font-size: 1.2rem; margin-bottom: 1rem;">Hotel Details</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        <div>
                            <p style="margin: 0.5rem 0; color: #64748b;">
                                <strong>Hotel:</strong><br>
                                {{ $booking->hotel->name }}
                            </p>
                            <p style="margin: 0.5rem 0; color: #64748b;">
                                <strong>Check-in:</strong><br>
                                {{ $booking->check_in_date->format('d M Y') }}
                            </p>
                        </div>
                        <div>
                            <p style="margin: 0.5rem 0; color: #64748b;">
                                <strong>Guests:</strong><br>
                                {{ $booking->number_of_guests }} {{ Str::plural('guest', $booking->number_of_guests) }}
                            </p>
                            <p style="margin: 0.5rem 0; color: #64748b;">
                                <strong>Check-out:</strong><br>
                                {{ $booking->check_out_date->format('d M Y') }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Price Breakdown -->
                <div style="margin-bottom: 1.5rem; padding: 1rem; background-color: #f8fafc; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="color: #64748b;">{{ $booking->hotel->price_per_night }} x {{ $booking->nights }} nights</span>
                        <span style="color: #1e293b; font-weight: 500;">₹{{ number_format($booking->hotel->price_per_night * $booking->nights, 2) }}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 0.5rem;">
                        <span style="color: #1e293b; font-weight: 600;">Total</span>
                        <span style="color: #0ea5e9; font-weight: 600;">₹{{ number_format($booking->total_price, 2) }}</span>
                    </div>
                </div>

                <!-- Status Message -->
                <div style="color: #1e293b; line-height: 1.6; font-size: 1rem; margin-bottom: 1.5rem;">
                    {!! $content !!}
                </div>

                <!-- Action Timeline -->
                <div style="border-top: 2px solid rgba(14, 165, 233, 0.1); padding-top: 1.5rem; margin-top: 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 12px; color: #64748b;">
                        <svg style="width: 20px; height: 20px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span style="font-size: 0.9rem;">
                            Booking {{ ucfirst($booking->status) }} on<br>
                            <strong style="color: #0ea5e9;">{{ $booking->created_at->format('F j, Y \a\t g:i a') }}</strong>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Support & Actions -->
            <div style="text-align: center; margin: 2rem 0; padding: 1.5rem; background-color: #f8fafc; border-radius: 8px;">
                <div style="display: grid; gap: 1rem; grid-template-columns: repeat(2, 1fr);">
                    <a href="{{ route('hotels.download-receipt', $booking->id) }}" style="color: #0ea5e9; text-decoration: none; font-weight: 500; padding: 0.5rem; border: 1px solid #0ea5e9; border-radius: 6px;">
                        Download Receipt
                    </a>
                    <a href="mailto:info.curioustra@gmail.com" style="color: #ffffff; text-decoration: none; font-weight: 500; padding: 0.5rem; background: #0ea5e9; border-radius: 6px;">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 2rem; text-align: center; border-radius: 20px 20px 0 0;">
            <div style="max-width: 400px; margin: 0 auto;">
                <div style="font-size: 0.875rem; line-height: 1.6;">
                    <p style="margin: 0.5rem 0; color: #e2e8f0;">
                        © {{ date('Y') }} CuriousTra. All rights reserved.
                    </p>
                    <p style="margin: 0.5rem 0; color: #94a3b8;">
                        Surat, Gujarat, India - 395006<br>
                        <a href="mailto:info.curioustra@gmail.com" style="color: #7dd3fc; text-decoration: none;">info.curioustra@gmail.com</a>
                    </p>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>