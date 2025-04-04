<?php

namespace App\Http\Controllers;

use App\Mail\PackageBookingStatusMail;
use Illuminate\Support\Facades\Mail;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Notification;
use App\Models\Package;
use App\Models\PackageBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use Barryvdh\DomPDF\Facade\Pdf;

class PackageBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $packageBookings = PackageBooking::with('user', 'package')->where('user_id', $user->id)->get(); // Eager load relationships
        return  $packageBookings;
    }

    public function list()
    {
        $bookings = PackageBooking::with('user', 'package')->get(); // Eager load relationships
        return Inertia::render('Admin/PackageBookings/index', [
            'bookings' => PackageBooking::with(['user', 'package'])->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * (Not typically needed for bookings, as they are created during the booking process)
     */
    public function create()
    {
        // return Inertia::render('User/Packages/create');
    }

    /**
    * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
        try {
            if (!auth()->check()) {
                return response()->json([
                    'message' => 'Authentication required',
                    'error' => 'Unauthenticated'
                ], 401);
            }

            $validated = $request->validate([
                'package_id' => 'required|exists:packages,id',
                'start_date' => 'required|date',
                'number_of_people' => 'required|integer|min:1',
                'additional_notes' => 'nullable|string',
            ]);

            $user = auth()->user();
            $package = Package::findOrFail($validated['package_id']);

            // Calculate booking details
            preg_match('/^(\d+)D/', $package->duration, $matches);
            $days = (int) ($matches[1] ?? 1);
            $endDate = Carbon::parse($validated['start_date'])
                ->addDays($days)
                ->subDay();

            $totalPrice = $package->price * $validated['number_of_people'];

            // Create Razorpay order with booking details in notes
            $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

            $order = $razorpay->order->create([
                'amount' => $totalPrice * 100,
                'currency' => 'INR',
                'receipt' => 'temp_'.uniqid(),
                'notes' => [
                    'user_id' => $user->id,
                    'package_id' => $package->id,
                    'start_date' => $validated['start_date'],
                    'end_date' => $endDate,
                    'number_of_people' => $validated['number_of_people'],
                    'total_price' => $totalPrice,
                    'additional_notes' => $validated['additional_notes'] ?? null,
                ],
                'payment_capture' => 1
            ]);

            return response()->json([
                'razorpay_key' => env('RAZORPAY_KEY_ID'),
                'order_id' => $order->id,
                'amount' => $order->amount,
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'contact' => $user->phone ?? ''
                ]
            ]);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Booking initiation failed: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PackageBooking $packageBooking)
    {
        // $packageBooking->load('user', 'package'); // Eager load relationships
        // return Inertia::render('Admin/Bookings/show', [
        //     'booking' => $packageBooking,
        // ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PackageBooking $packageBooking)
    {
        // $packageBooking->load('user', 'package');
        // return Inertia::render('Admin/Bookings/edit', [
        //     'booking' => $packageBooking,
        // ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PackageBooking $packageBooking)
    {
        // $request->validate([
        //     'booking_date' => 'required|date',
        //     'number_of_people' => 'required|integer',
        //     'total_price' => 'required|numeric',
        //     'status' => 'required|string',
        //     'additional_info' => 'nullable|json',
        // ]);

        // $packageBooking->update($request->all());

        // return redirect()->back()->with('success', 'Booking updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PackageBooking $packageBooking)
    {
        $packageBooking->delete();
        return redirect()->route('packages')->with('success', 'Booking deleted successfully.');
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'payment_id' => 'required|string'
        ]);

        try {
            $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
            $payment = $razorpay->payment->fetch($request->payment_id);

            // Add signature verification
            // $generatedSignature = hash_hmac('sha256', $payment->order_id.'|'.$payment->id, env('RAZORPAY_KEY_SECRET'));
            
            // if ($generatedSignature !== $payment->signature) {
            //     throw new \Exception('Invalid payment signature');
            // }
            
            if ($payment->status !== 'captured') {
                return response()->json(['error' => 'Payment not captured'], 400);
            }

            // Get order details from payment
            $order = $razorpay->order->fetch($payment->order_id);
            
            // Validate essential data
            if (!isset($order->notes['user_id'], $order->notes['package_id'])) {
                throw new \Exception('Invalid booking data in payment notes');
            }

            // Create booking
            $booking = PackageBooking::create([
                'user_id' => $order->notes['user_id'],
                'package_id' => $order->notes['package_id'],
                'booking_date' => now(),
                'start_date' => $order->notes['start_date'] ?? now()->addDays(1),
                'end_date' => $order->notes['end_date'] ?? now()->addDays(5),
                'number_of_people' => $order->notes['number_of_people'] ?? 1,
                'total_price' => $order->notes['total_price'] ?? 0,
                'status' => 'pending',
                'payment_status' => 'paid',
                'payment_id' => $payment->id
            ]);

            return response()->json([
                'success' => true,
                'redirect' => route('bookings'),
                'booking' => $booking
            ]);

        } catch (\Exception $e) {
            \Log::error('Payment verification failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Payment verification failed: ' . $e->getMessage()
            ], 400);
        }
    }

    private function sendStatusEmail(PackageBooking $booking, string $status)
    {
        $booking->load(['package', 'user']);

        $config = [
            'confirmed' => [
                'subject' => 'Booking Confirmed - Ready for Adventure!',
                'color' => '#0ea5e9 0%, #22d3ee 100%',
                'icon' => '<svg style="width: 30px; height: 30px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
                'heading' => 'Your Booking is Confirmed!',
                'subHeading' => 'Get ready for an amazing experience! ✈️',
                'content' => "Hi {$booking->user->name},<br><br>Your {$booking->package->name} package is confirmed!<br>We've successfully processed your payment and everything is set for your adventure."
            ],
            'cancelled' => [
                'subject' => 'Booking Cancelled',
                'color' => '#ef4444 0%, #f87171 100%',
                'icon' => '<svg style="width: 30px; height: 30px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
                'heading' => 'Booking Cancelled',
                'subHeading' => 'We\'re sorry to see you go 😢',
                'content' => "Hi {$booking->user->name},<br><br>Your booking for {$booking->package->name} has been cancelled.<br>A refund of ₹{$booking->total_price} will be processed within 5-7 business days."
            ],
            'in-progress' => [
                'subject' => 'Adventure in Progress!',
                'color' => '#f59e0b 0%, #fbbf24 100%',
                'icon' => '<svg style="width: 30px; height: 30px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
                'heading' => 'Your Adventure Has Begun!',
                'subHeading' => 'Enjoy every moment! 🌍',
                'content' => "Hi {$booking->user->name},<br><br>Your {$booking->package->name} experience is now underway!<br>Our team is ensuring everything runs smoothly."
            ],
            'completed' => [
                'subject' => 'Adventure Completed!',
                'color' => '#10b981 0%, #34d399 100%',
                'icon' => '<svg style="width: 30px; height: 30px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
                'heading' => 'Experience Completed!',
                'subHeading' => 'Hope you had a great time! 🎉',
                'content' => "Hi {$booking->user->name},<br><br>Your {$booking->package->name} journey has concluded successfully.<br>We'd love to hear about your experience!"
            ]
        ];

        Mail::to($booking->user->email)
            ->send(new PackageBookingStatusMail(
                $booking,
                $config[$status]['subject'],
                $config[$status]['color'],
                $config[$status]['icon'],
                $config[$status]['heading'],
                $config[$status]['subHeading'],
                $config[$status]['content']
            ));
    }

    public function confirmBooking(PackageBooking $booking)
    {
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        if ($booking->status !== 'pending') {
            return back()->with('error', 'Booking is not pending.');
        }

        $booking->load(['package', 'user']);
        $booking->status = 'confirmed';
        $booking->save();
        $this->sendStatusEmail($booking, 'confirmed');

        return back()->with('success', 'Booking confirmed.');
    }

    public function cancelBooking(PackageBooking $booking)
    {

        try {
            if ($booking->payment_status === 'paid') {
                $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));

                $refund = $razorpay->payment
                    ->fetch($booking->payment_id)
                    ->refund([
                        'amount' => (int) round($booking->total_price * 100),
                        'speed' => 'normal'
                    ]);

                $booking->update([
                    'refund_id' => $refund->id,
                    'payment_status' => 'refunded',
                    'status' => 'cancelled'
                ]);
            } else {
                $booking->update(['status' => 'cancelled']);
            }

            $this->sendStatusEmail($booking, 'cancelled');

            return back()->with('success', 'Booking cancelled' . 
                ($booking->payment_status === 'refunded' ? ' and refund processed' : ''));

        } catch (\Razorpay\Api\Errors\BadRequestError $e) {
            \Log::error('Razorpay API Error: ' . $e->getMessage());
            return back()->with('error', 'Payment gateway error: ' . $e->getMessage());
        } catch (\Exception $e) {
            \Log::error('Cancellation failed: ' . $e->getMessage());
            return back()->with('error', 'Operation failed: ' . $e->getMessage());
        }
    }

    public function inProgressBooking(PackageBooking $booking)
    {
        // if (!Auth::user()->isAdmin()) { // Replace isAdmin() with your actual admin check
        //     abort(403, 'Unauthorized action.');
        // }

        if ($booking->status !== 'confirmed') {
            return back()->with('error', 'Booking is not confirmed.');
        }

        $booking->status = 'in-progress';
        $booking->save();
        $this->sendStatusEmail($booking, 'in-progress');

        return back()->with('success', 'Booking marked as in-progress.');
    }

    public function completeBooking(PackageBooking $booking)
    {
        // if (!Auth::user()->isAdmin()) { // Replace isAdmin() with your actual admin check
        //     abort(403, 'Unauthorized action.');
        // }

        if ($booking->status !== 'in-progress') {
            return back()->with('error', 'Booking is not in-progress.');
        }

        $booking->status = 'completed';
        $booking->save();
        $this->sendStatusEmail($booking, 'completed');

        return back()->with('success', 'Booking marked as completed.');
    }

    public function downloadReceipt(PackageBooking $booking)
    {

        $booking->load(['package', 'user']);

        $data = [
            'booking' => $booking,
            'company' => [
                'name' => 'CuriousTra',
                'address' => 'Surat, Gujarat, India - 395006',
                'email' => 'info.curioustra@gmail.com',
                'phone' => '+91 800####4591',
                'logo' => public_path('images/logo.png')
            ]
        ];

        $pdf = Pdf::loadView('pdfs.packageReceipt', $data)->setPaper('a4', 'portrait')->setOption('isRemoteEnabled', true);

        $filename = "Receipt-{$booking->id}-" . now()->format('YmdHis') . ".pdf";

        return $pdf->download($filename);
    }
}