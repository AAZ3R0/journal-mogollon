<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Note;
use App\Models\Role; // <-- Importa el modelo Role
use App\Models\Section;

use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load('role');
        
        // Carga las relaciones clave, incluyendo el rol del autor de la nota
        $notesQuery = Note::query()->with(['user.role', 'sections', 'media']);

        // --- ESTA ES LA LÓGICA DE FILTRADO DE ROLES ---
        if ($user->role->name === 'Editor') {
            // 1. Busca el ID del rol 'Reportero'
            $reporterRoleId = Role::where('name', 'Reportero')->value('rol_id');
            
            // 2. El Editor ve sus propias notas O las notas de todos los Reporteros
            $notesQuery->where(function ($query) use ($user, $reporterRoleId) {
                $query->where('user_id', $user->user_id) // Sus propias notas
                      ->orWhereHas('user', function ($subQuery) use ($reporterRoleId) {
                          $subQuery->where('rol_id', $reporterRoleId); // Notas de Reporteros
                      });
            });

        } elseif ($user->role->name === 'Reportero') {
            // 3. El Reportero solo ve sus propias notas
            $notesQuery->where('user_id', $user->user_id);
        }
        // No necesitamos un 'else' porque el Gate ya bloqueó a otros roles
        // --- FIN DE LA LÓGICA DE FILTRADO ---

        // Obtenemos todas las notas permitidas
        $allAllowedNotes = $notesQuery->orderBy('publish_date', 'desc')->get();

        // Replicamos la lógica de "Nota Destacada" de tu NotesManager
        $featuredNote = $allAllowedNotes->firstWhere('is_featured', true);
        
        // Pasamos TODAS las notas a la tabla (tu lógica de 'notes' en el index)
        $allAllowedNotes->each->append('media_by_position'); 

        return Inertia::render('Workspace/Index', [
            'featuredNote' => $featuredNote,
            'notes' => $allAllowedNotes,
            'sections' => Section::all(),
        ]);
    }
}
