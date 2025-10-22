<?php

namespace App\Http\Controllers\Users;

use App\Models\Note;
use App\Models\Comment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, Note $note)
    {
        // Solo usuarios autenticados pueden comentar
        if (!Auth::check()) {
            return redirect()->route('login'); // O maneja el error como prefieras
        }

        $validated = $request->validate([
            'message' => 'required|string|max:150', // Coincide con tu VARCHAR(150)
        ]);

        // Crea el comentario asociado a la nota y al usuario actual
        $note->comments()->create([
            'message' => $validated['message'],
            'user_id' => Auth::id(),
            'publish_date' => now(), // Guarda la fecha y hora actual
        ]);

        // Redirige de vuelta a la misma página de la nota
        return back()->with('success', 'Comentario añadido!');
    }
}
