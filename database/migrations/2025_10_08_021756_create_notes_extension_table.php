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
        Schema::create('notes_extension', function (Blueprint $table) {
            $table->integer('note_extension_id', true);
            $table->string('lead', 100)->nullable();
            $table->string('body', 200)->nullable();
            $table->string('closing', 100)->nullable();
            $table->integer('note_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes_extension');
    }
};
