<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CommentsController extends Controller
{
    public function index(Request $request)
    {
        // 1. Obtener filtros de la URL
        $filters = $request->only(['query_message', 'query_user']);

        // 2. Empezar la consulta
        $commentsQuery = Comment::query()->with('user');

        // 3. Aplicar filtro de búsqueda por MENSAJE
        $commentsQuery->when($request->input('query_message'), function ($query, $search) {
            $query->where('message', 'LIKE', '%' . $search . '%');
        });

        // 4. Aplicar filtro de búsqueda por USUARIO (en la tabla relacionada)
        $commentsQuery->when($request->input('query_user'), function ($query, $search) {
            $query->whereHas('user', function ($q) use ($search) {
                // Busca en nombre, username o email del usuario
                $q->where('name', 'LIKE', '%' . $search . '%')
                  ->orWhere('username', 'LIKE', '%' . $search . '%')
                  ->orWhere('email', 'LIKE', '%' . $search . '%');
            });
        });

        // 5. Paginar los resultados
        $comments = $commentsQuery->orderBy('publish_date', 'desc')
                                  ->paginate(20) // 20 por página
                                  ->withQueryString(); // Mantiene los filtros en los enlaces de paginación

        return Inertia::render('Admin/CommentsManager', [
            'comments' => $comments,
            'filters' => $filters, // Devuelve los filtros activos
        ]);
    }
}
