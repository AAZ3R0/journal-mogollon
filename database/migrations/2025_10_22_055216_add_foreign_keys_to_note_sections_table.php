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
        Schema::table('note_sections', function (Blueprint $table) {
            $table->foreign(['note_id'], 'note_sections_ibfk_1')->references(['note_id'])->on('notes')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['section_id'], 'note_sections_ibfk_2')->references(['section_id'])->on('sections')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('note_sections', function (Blueprint $table) {
            $table->dropForeign('note_sections_ibfk_1');
            $table->dropForeign('note_sections_ibfk_2');
        });
    }
};
