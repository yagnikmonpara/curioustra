<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\NewsletterSubscriber;
use App\Mail\NewsletterMail;
use Illuminate\Support\Facades\Mail;

class SendNewsletter extends Command
{
    protected $signature = 'newsletter:send';
    protected $description = 'Send newsletter to all subscribers';

    public function handle()
    {
        $subscribers = NewsletterSubscriber::where('is_verified', true)->get();
        
        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)->send(new NewsletterMail());
        }
        
        $this->info('Newsletter sent to '.$subscribers->count().' subscribers.');
    }
}