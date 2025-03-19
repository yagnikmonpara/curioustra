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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Notification title (e.g., "New Package Alert")
            $table->text('message'); // Notification message
            $table->timestamp('timestamp')->useCurrent(); // Timestamp of the notification
            $table->unsignedBigInteger('user_id')->nullable(); // Optional: Link to a specific user
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
