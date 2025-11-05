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
        Schema::create('note_extensions', function (Blueprint $table) {
            $table->integer('note_extension_id', true);
            $table->integer('note_id')->index('note_id');
            $table->enum('type', ['lead', 'body', 'closing']);
            $table->text('content');
            $table->tinyInteger('position');
            $table->integer('media_id')->nullable()->index('media_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('note_extensions');
    }
};
