<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('package_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // User who booked
            $table->foreignId('package_id')->constrained()->onDelete('cascade'); // Booked package
            $table->date('booking_date'); // Date of booking
            $table->integer('number_of_people'); // Number of people going
            $table->decimal('total_price', 10, 2); // Total price of the booking
            $table->string('status')->default('pending'); // Booking status (e.g., pending, confirmed, cancelled)
            $table->json('additional_info')->nullable(); // Any additional information (e.g., special requests)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_bookings');
    }
};
