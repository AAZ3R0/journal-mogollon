<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request)
    {

        // 1. Obtener filtros de la URL
        $filters = $request->only(['query', 'role_id']);
        $adminUserId = Auth::id();

        // 2. Empezar la consulta
        $usersQuery = User::with('role')
                          ->where('user_id', '!=', $adminUserId) // Excluye al admin actual
                          ->orderBy('created_at', 'desc');

        // 3. Aplicar filtro de búsqueda (query)
        $usersQuery->when($request->input('query'), function ($query, $search) {
            // Busca en múltiples columnas
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', '%' . $search . '%')
                  ->orWhere('username', 'LIKE', '%' . $search . '%')
                  ->orWhere('email', 'LIKE', '%' . $search . '%');
            });
        });

        // 4. Aplicar filtro de Rol
        $usersQuery->when($request->input('role_id'), function ($query, $roleId) {
            $query->where('rol_id', $roleId);
        });

        // 5. Paginar los resultados
        $users = $usersQuery->paginate(15)->withQueryString(); // 15 por página

        return Inertia::render('Admin/AccountsManager', [ // Renderiza tu vista
            'users' => $users, // Objeto de paginación
            'roles' => Role::all(), // Pasa todos los roles para el dropdown
            'filters' => $filters, // Devuelve los filtros activos
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
