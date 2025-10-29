<?php

namespace App\Http\Controllers;

use App\Models\Note; // Importa el modelo Note
use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia; // Importa Inertia

class HomeController extends Controller
{
    public function index()
    {
        // 1. Obtener la nota destacada (carga las relaciones necesarias)
        $featuredNote = Note::with(['user', 'sections']) // Carga usuario y secciones
                            ->where('is_featured', true)
                            ->first(); // Obtiene la primera que encuentre (debería ser solo una)

        // 2. Obtener las notas de hoy (excluyendo la destacada si existe)
        $todayNotes = Note::with(['user', 'sections']) // Carga relaciones
                          ->whereDate('publish_date', today()) // Filtra por fecha de hoy
                          ->when($featuredNote, function ($query) use ($featuredNote) {
                              // Si existe una nota destacada, la excluye de esta lista
                              $query->where('note_id', '!=', $featuredNote->note_id);
                          })
                          ->where('is_featured', false) // También excluye explícitamente las destacadas
                          ->orderBy('publish_date', 'desc') // Las más recientes primero
                          ->get();

        // 3. Pasar los datos a la vista de Inertia
        return Inertia::render('Welcome', [
            'featuredNote' => $featuredNote,
            'todayNotes' => $todayNotes,
            // Puede que aún necesites estas para el footer u otras partes
            'laravelVersion' => app()->version(),
            'phpVersion' => PHP_VERSION,
        ]);
    }


    public function search(Request $request){
        // 1. Validar que el término de búsqueda exista
        $validated = $request->validate([
            'query' => 'nullable|string',
        ]);

        $query = $validated['query'] ?? null;

        $notesQuery = Note::query()->with(['user', 'sections']);
        $sections = Section::all();


        $notesQuery->when($query, function ($q, $search) {
        return $q->where('headline', 'LIKE', '%' . $search . '%');
            });

            $results = $notesQuery->orderBy('publish_date', 'desc')
                                ->paginate(12)
                                ->withQueryString();

        // 3. Devolver una nueva vista de Inertia con los resultados
        return Inertia::render('NoteList', [
            'notes' => $results,
            'searchQuery' => $query, // Devuelve el término para mostrarlo en la vista
            'sections' => $sections,
        ]);
    }
}
