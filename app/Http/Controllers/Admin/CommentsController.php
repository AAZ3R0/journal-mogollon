<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CommentsController extends Controller
{
    public function index()
    {
        // Obtenemos todos los comentarios, cargando su 'user'
        // y los ordenamos por el más reciente.
        // Paginate() es mejor que get() si tienes muchos comentarios.
        $comments = Comment::with('user')
                           ->orderBy('publish_date', 'desc')
                           ->paginate(20); // 20 comentarios por página

        return Inertia::render('Admin/CommentsManager', [
            'comments' => $comments
        ]);
    }
}
