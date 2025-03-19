<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PackageBookingConfirmed extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    // app/Notifications/BookingConfirmed.php
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Package Booking Confirmed: ' . $this->booking->package->name)
            ->line('Your Package booking has been confirmed!')
            ->line('Booking ID: ' . $this->booking->id)
            ->line('Package: ' . $this->booking->package->name)
            ->line('Total Amount: ₹' . $this->booking->total_price)
            ->action('View Booking', route('bookings', $this->booking))
            ->line('Thank you for choosing us!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
