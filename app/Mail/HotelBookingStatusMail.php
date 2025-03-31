<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\HotelBooking;

class HotelBookingStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $config;

    public function __construct(HotelBooking $booking, array $config)
    {
        $this->booking = $booking;
        $this->config = $config;
    }

    public function build()
    {
        return $this->subject($this->config['subject'])
            ->view('emails.hotel-booking-status')
            ->with([
                'booking' => $this->booking,
                'config' => $this->config,
                'subject' => $this->config['subject'],
                'statusColor' => $this->config['color'],
                'statusIcon' => $this->config['icon'],
                'heading' => $this->config['heading'],
                'subHeading' => $this->config['subHeading'],
                'content' => $this->config['content'],
                'logoUrl' => $this->config['logoUrl']
            ]);
    }
}