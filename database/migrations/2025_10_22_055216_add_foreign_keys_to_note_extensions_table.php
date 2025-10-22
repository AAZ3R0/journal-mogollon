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
        Schema::table('note_extensions', function (Blueprint $table) {
            $table->foreign(['note_id'], 'note_extensions_ibfk_1')->references(['note_id'])->on('notes')->onUpdate('restrict')->onDelete('cascade');
            $table->foreign(['media_id'], 'note_extensions_ibfk_2')->references(['media_id'])->on('media')->onUpdate('restrict')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('note_extensions', function (Blueprint $table) {
            $table->dropForeign('note_extensions_ibfk_1');
            $table->dropForeign('note_extensions_ibfk_2');
        });
    }
};
