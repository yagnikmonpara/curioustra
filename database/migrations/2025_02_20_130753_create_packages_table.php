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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->json('images')->nullable(); // Image path or URL
            $table->string('duration'); // e.g., "5D/4N"
            $table->integer('pax'); // Number of people (passengers)
            $table->string('location');
            $table->string('country');
            $table->integer('reviews')->default(0); // Number of reviews
            $table->decimal('rating', 2, 1)->default(0); // Rating (e.g., 4.5)
            $table->decimal('price', 10, 2); // Price (e.g., 1299.00)
            $table->string('amenities')->nullable(); // JSON array of amenities
            $table->string('highlights')->nullable(); // JSON array of highlights
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
