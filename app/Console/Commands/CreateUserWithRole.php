<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateUserWithRole extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-user {name} {email} {role}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // 1. Obtenemos los argumentos de la terminal
        $name = $this->argument('name');
        $email = $this->argument('email');
        $roleName = $this->argument('role');

        // 2. Buscamos el rol en la base de datos
        $role = Role::where('name', $roleName)->first();

        // 3. Validamos que el rol exista
        if (!$role) {
            $this->error("El rol '{$roleName}' no existe. Roles disponibles: Lector, Reportero, Editor, Administrador.");
            return 1; // Retorna un código de error
        }

        // 4. Generamos una contraseña aleatoria (o puedes pedirla como argumento)
        $password = Str::random(12);

        // 5. Creamos el usuario
        try {
            User::create([
                'name' => $name,
                'username' => Str::slug($name), // O genera un username como prefieras
                'email' => $email,
                'password' => Hash::make($password),
                'rol_id' => $role->rol_id,
                'email_verified_at' => now(), // Lo marcamos como verificado
            ]);

            // 6. Mostramos el éxito en la terminal
            $this->info("¡Usuario creado exitosamente!");
            $this->info("Nombre: $name");
            $this->info("Email: $email");
            $this->info("Rol: $roleName");
            $this->warn("Contraseña (guárdala!): $password");

        } catch (\Exception $e) {
            $this->error("Error al crear el usuario: " . $e->getMessage());
            return 1;
        }

        return 0; // Retorna éxito
    }
}
