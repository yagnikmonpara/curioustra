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
        Schema::create('cab_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('cab_id')->constrained()->onDelete('cascade');
            $table->string('pickup_location', 100);
            $table->string('dropoff_location', 100);
            $table->dateTime('pickup_time');
            $table->unsignedMediumInteger('distance_km');
            $table->decimal('total_price', 10, 2);
            $table->decimal('rate_per_km', 10, 2);
            $table->string('status', 20)->default('pending'); // pending, confirmed, in_progress, completed, cancelled
            $table->json('additional_info')->nullable();
            $table->timestamps();

            // Add indexes for common search fields
            $table->index('pickup_time');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cab_bookings');
    }
};
