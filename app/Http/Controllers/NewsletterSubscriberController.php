<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewsletterVerification;
use App\Mail\NewsletterConfirmation;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletter_subscribers,email'
        ]);

        $token = Str::random(40);

        $subscriber = NewsletterSubscriber::create([
            'email' => $request->email,
            'token' => $token,
            'is_verified' => false
        ]);

        // Send verification email
        Mail::to($request->email)->send(new NewsletterVerification($token));

        return back()->with('success', 'Please check your email to confirm your subscription!');
    }

    public function verify($token)
    {
        $subscriber = NewsletterSubscriber::where('token', $token)->firstOrFail();

        $subscriber->update([
            'is_verified' => true,
            'token' => null
        ]);

        // Send welcome email
        Mail::to($subscriber->email)->send(new NewsletterConfirmation());

        return redirect('/')->with('success', 'You have successfully subscribed to our newsletter!');
    }

    public function unsubscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:newsletter_subscribers,email'
        ]);

        $subscriber = NewsletterSubscriber::where('email', $request->email)->first();
        $subscriber->delete();

        return back()->with('success', 'You have been unsubscribed from our newsletter.');
    }
}