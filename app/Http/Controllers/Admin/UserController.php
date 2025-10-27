<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {

        $adminUserId = Auth::id();
        // Obtenemos todos los usuarios, cargando su relación 'role'
        // y ordenándolos por el más reciente.
        $users = User::with('role')
                     ->where('user_id', '!=', $adminUserId)
                     ->orderBy('created_at', 'desc')
                     ->get();

        // Renderiza la vista de Inertia (que tú llamaste CommentsManager)
        // Te recomiendo renombrar el archivo a 'Admin/UsersManager.jsx'
        return Inertia::render('Admin/AccountsManager', [
            'users' => $users
        ]);
    }

    public function show(User $user)
    {
        // Carga el rol y cuenta cuántas notas y comentarios ha hecho
        $user->load('role');
        $user->loadCount(['notes', 'comments']);

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        // --- Comprobación de Seguridad CRÍTICA ---
        // Impide que un administrador se elimine a sí mismo.
        if ($user->user_id === Auth::id()) {
            return back()->with('error', 'No puedes eliminar tu propia cuenta desde el panel.');
        }

        // Asumiendo que tus migraciones tienen "ON DELETE CASCADE" o "ON DELETE SET NULL",
        // esto manejará las notas y comentarios del usuario.
        // Si no, necesitarías borrar sus notas y comentarios primero.
        $user->delete();

        return back()->with('success', 'Usuario eliminado exitosamente.');
    }
}
