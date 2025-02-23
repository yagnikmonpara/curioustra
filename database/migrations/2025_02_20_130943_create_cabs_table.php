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
        Schema::create('cabs', function (Blueprint $table) {
            $table->id();
            $table->string('make'); // e.g., Toyota, Honda
            $table->string('model'); // e.g., Camry, Civic
            $table->string('registration_number')->unique();
            $table->string('driver_name');
            $table->string('driver_contact_number');
            $table->integer('capacity'); // Number of passengers
            $table->decimal('price_per_km', 8, 2);
            $table->string('location')->nullable(); // Current location if available
            $table->string('status')->default('available'); // available, booked, unavailable
            $table->string('image')->nullable(); // Path to cab image
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cabs');
    }
};
