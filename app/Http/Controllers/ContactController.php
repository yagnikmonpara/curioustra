<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactResponseMail;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contacts = Contact::all();
        return Inertia::render('User/Contact/index', [
            'contacts' => $contacts,
        ]);
    }

    public function list()
    {
        $contacts = Contact::all();
        return Inertia::render('Admin/Contacts/index', [
            'contacts' => $contacts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('User/Contact/create'); // or just contact.
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|min:10|max:15|regex:/^[0-9]+$/',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
            'response' => 'nullable|string',
        ]);

        Contact::create($request->all());

        return redirect()->back()->with('success', 'Your Enquiry has been sent successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        return Inertia::render('Admin/Contacts/show', [
            'contact' => $contact,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();
        return redirect()->back()->with('success', 'Contact message deleted successfully.');
    }

    public function markAsRead(Contact $contact)
    {
        $contact->update(['read_at' => now()]);
        return response()->json(['success' => true]);
    }

    public function sendResponse(Contact $contact, Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'response' => 'nullable|string',
        ]);

        // Send email
        Mail::to($contact->email)->send(new ContactResponseMail(
            $request->subject,
            $request->message
        ));

        $contact->update(['response' => $request->response]);

        return redirect()->back()->with('success', 'Response sent successfully');
    }
}