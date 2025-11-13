<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role; // Importa tu modelo Role
use Illuminate\Support\Facades\DB; // Importa DB

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Role::truncate(); // Borra la tabla antes de rellenarla
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Crea los roles
        Role::create(['name' => 'Lector']);
        Role::create(['name' => 'Reportero']);
        Role::create(['name' => 'Editor']);
        Role::create(['name' => 'Administrador']);
    }
}
