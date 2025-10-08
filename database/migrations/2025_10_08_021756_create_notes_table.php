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
        Schema::create('notes', function (Blueprint $table) {
            $table->integer('note_id', true);
            $table->string('headline', 50);
            $table->string('lead', 100);
            $table->string('body', 200);
            $table->string('closing', 100);
            $table->dateTime('publish_date');
            $table->string('portrait_url');
            $table->boolean('is_featured');
            $table->integer('user_id')->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
