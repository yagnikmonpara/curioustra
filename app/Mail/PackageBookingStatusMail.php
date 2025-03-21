<?php

namespace App\Mail;

use App\Models\PackageBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PackageBookingStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $subject;
    public $statusColor;
    public $statusIcon;
    public $heading;
    public $subHeading;
    public $content;
    public $logoUrl;

    public function __construct(
        PackageBooking $booking,
        string $subject,
        string $statusColor,
        string $statusIcon,
        string $heading,
        string $subHeading,
        string $content
    ) {
        $this->booking = $booking;
        $this->subject = $subject;
        $this->statusColor = $statusColor;
        $this->statusIcon = $statusIcon;
        $this->heading = $heading;
        $this->subHeading = $subHeading;
        $this->content = $content;
        $this->logoUrl = url('/images/logo.png');
    }

    public function build()
    {
        return $this->subject($this->subject)
            ->view('emails.package-booking-status')
            ->with([
                'booking' => $this->booking,
                'subject' => $this->subject,
                'statusColor' => $this->statusColor,
                'statusIcon' => $this->statusIcon,
                'heading' => $this->heading,
                'subHeading' => $this->subHeading,
                'content' => $this->content,
                'logoUrl' => $this->logoUrl
            ]);
    }
}