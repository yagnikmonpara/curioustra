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
        Schema::create('train_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('train_id')->constrained()->onDelete('cascade');
            $table->integer('number_of_seats');
            $table->decimal('total_price', 10, 2);
            $table->string('seat_numbers')->nullable(); // Comma-separated or JSON array of seat numbers
            $table->string('status')->default('pending'); // pending, confirmed, cancelled, completed
            $table->json('additional_info')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('train_bookings');
    }
};
