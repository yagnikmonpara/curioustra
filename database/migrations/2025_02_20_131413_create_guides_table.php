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
        Schema::create('guides', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('bio')->nullable();
            $table->string('specialization');
            $table->string('contact_number');
            $table->string('email')->nullable();
            $table->string('profile_picture')->nullable(); // Path to profile picture
            $table->text('languages')->default('Gujarati, Hindi, English');
            $table->string('location')->default('Location not specified');
            $table->decimal('price_per_hour', 10, 2)->default(0);
            $table->decimal('rating', 2, 1)->default(4.5);
            $table->integer('tours_completed')->default(50);
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guides');
    }
};
