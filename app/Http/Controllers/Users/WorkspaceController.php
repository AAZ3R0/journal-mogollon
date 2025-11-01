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
        
        // 1. Obtener filtros de la URL
        $filters = $request->only(['section_id', 'day', 'month', 'year']);

        // 2. Carga las relaciones clave
        $notesQuery = Note::query()->with(['user.role', 'sections', 'media']);

        // 3. --- LÓGICA DE FILTRADO DE ROLES (NO CAMBIA) ---
        if ($user->role->name === 'Editor') {
            $reporterRoleId = Role::where('name', 'Reportero')->value('rol_id');
            $notesQuery->where(function ($query) use ($user, $reporterRoleId) {
                $query->where('user_id', $user->user_id)
                      ->orWhereHas('user', function ($subQuery) use ($reporterRoleId) {
                          $subQuery->where('rol_id', $reporterRoleId);
                      });
            });
        } elseif ($user->role->name === 'Reportero') {
            $notesQuery->where('user_id', $user->user_id);
        }
        // --- FIN DE LA LÓGICA DE FILTRADO DE ROLES ---

        // 4. --- AÑADIR LÓGICA DE FILTROS DE BÚSQUEDA ---
        $notesQuery->when($request->input('section_id'), function ($query, $sectionId) {
            $query->whereHas('sections', function ($q) use ($sectionId) {
                $q->where('sections.section_id', $sectionId);
            });
        });
        $notesQuery->when($request->input('day'), function ($query, $day) {
            $query->whereDay('publish_date', $day);
        });
        $notesQuery->when($request->input('month'), function ($query, $month) {
            $query->whereMonth('publish_date', $month);
        });
        $notesQuery->when($request->input('year'), function ($query, $year) {
            $query->whereYear('publish_date', $year);
        });
        // --- FIN DE LA LÓGICA DE FILTROS ---

        // 5. Paginar los resultados (en lugar de get())
        $notes = $notesQuery->orderBy('publish_date', 'desc')
                           ->paginate(15) // 15 por página
                           ->withQueryString(); // Mantiene los filtros

        // 6. Obtener nota destacada (de los resultados paginados)
        $featuredNote = $notes->firstWhere('is_featured', true);
        
        // 7. El 'append' se hace en los items paginados
        $notes->getCollection()->each->append('media_by_position');

        return Inertia::render('Workspace/Index', [
            'featuredNote' => $featuredNote,
            'notes' => $notes, // 'notes' ahora es un objeto de paginación
            'sections' => Section::all(),
            'filters' => $filters, // Pasa los filtros a la vista
        ]);
    }
}
