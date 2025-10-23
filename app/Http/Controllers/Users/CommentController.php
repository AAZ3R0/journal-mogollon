<?php

namespace App\Http\Controllers\Users;

use App\Models\Note;
use App\Models\Comment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CommentController extends Controller
{

    use AuthorizesRequests;

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

    public function update(Request $request, Comment $comment)
    {
        // 1. Autoriza la acción usando la Política que creamos.
        // Si el usuario no es el propietario, esto fallará automáticamente.
        $this->authorize('update', $comment);

        // 2. Valida los nuevos datos.
        $validated = $request->validate([
            'message' => 'required|string|max:150',
        ]);

        // 3. Actualiza el comentario.
        $comment->update([
            'message' => $validated['message'],
        ]);

        // 4. Redirige de vuelta.
        return back();
    }


    public function destroy(Comment $comment)
    {
        // 1. Autoriza la acción usando la Política (falla si no es el propietario)
        $this->authorize('delete', $comment);

        // 2. Elimina el comentario de la base de datos
        $comment->delete();

        // 3. Redirige de vuelta a la página anterior
        return back()->with('success', 'Comentario eliminado.');
    }
}
