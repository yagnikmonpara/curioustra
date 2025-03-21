<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\PackageBooking;

class PackageBookingConfirmed extends Notification implements ShouldQueue
{
    use Queueable;

    public $booking; // Add public property

    /**
     * Create a new notification instance.
     */
    public function __construct(PackageBooking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Load relationships if not already loaded
        $this->booking->loadMissing(['package']);

        return (new MailMessage)
            ->subject('Package Booking Confirmed: ' . $this->booking->package->title)
            ->line('Your package booking has been confirmed!')
            ->line('Booking ID: ' . $this->booking->id)
            ->line('Package: ' . $this->booking->package->title)
            ->line('Duration: ' . $this->booking->package->duration)
            ->line('Total Amount: ₹' . number_format($this->booking->total_price, 2))
            ->action('View Booking', route('user.bookings'))
            ->line('Thank you for choosing our travel services!');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'package_title' => $this->booking->package->title
        ];
    }
}