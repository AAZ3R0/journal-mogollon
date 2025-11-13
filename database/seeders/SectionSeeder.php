<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Section; // Importa tu modelo Section
use Illuminate\Support\Facades\DB;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Section::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Crea las secciones (añade todas las que necesites)
        Section::create(['name' => 'Juárez']);
        Section::create(['name' => 'El Paso']);
        Section::create(['name' => 'Nacional']);
        Section::create(['name' => 'Salud']);
        Section::create(['name' => 'Economía']);
        Section::create(['name' => 'Deportes']);
        Section::create(['name' => 'Cultura']);
        Section::create(['name' => 'Arte']);
        Section::create(['name' => 'Reportaje']);
        Section::create(['name' => 'Policiaca']);
        Section::create(['name' => 'Internacional']);
    }
}
