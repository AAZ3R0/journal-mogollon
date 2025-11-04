<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

use App\Models\Note;
use App\Models\NoteSection;
use App\Models\Section;
use App\Models\NotesExtension;
use App\Models\Media;

use Inertia\Inertia; 
use Inertia\Response;

class NotesController extends Controller
{

    use AuthorizesRequests;

    public function index(Request $request){

        // 1. Autorización (ya la tienes)
        $this->authorize('viewAny', Note::class);

        // 2. Obtener filtros de la URL
        $filters = $request->only(['section_id', 'day', 'month', 'year']);

        // 3. Empezar la consulta
        $notesQuery = Note::query()->with(['user', 'sections', 'media']);

        // 4. Aplicar filtros (lógica idéntica a viewList)
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

        // 5. Paginar los resultados en lugar de usar get()
        $notes = $notesQuery->orderBy('publish_date', 'desc')
                        ->paginate(15) // Puedes ajustar este número
                        ->withQueryString(); // Mantiene los filtros en los enlaces de paginación

        // 6. Obtener la nota destacada (de los resultados paginados actuales, si existe)
        $featuredNote = $notes->firstWhere('is_featured', true);

        return Inertia::render('Admin/NotesManager', [
            'featuredNote' => $featuredNote,
            'notes' => $notes, // 'notes' ahora es un objeto de paginación
            'sections' => Section::all(),
            'filters' => $filters, // ✅ Pasa los filtros a la vista
        ]);
    }

    public function workSpaceIndex(Request $request){
        return Inertia::render('Editor_Reporter/WorkSpace');
    }

    public function viewList(Request $request){
        // 1. Obtener los filtros de la URL (ej. /notes?section_id=9&year=2025)
        $filters = $request->only(['section_id', 'day', 'month', 'year']);
        
        // 2. Empezar la consulta de notas
        $notesQuery = Note::query()->with(['user', 'sections']);

        // 3. Aplicar los filtros dinámicamente
        $notesQuery->when($request->input('section_id'), function ($query, $sectionId) {
            // Filtra notas que pertenezcan a esa sección
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

        // 4. Obtener resultados paginados
        $notes = $notesQuery->orderBy('publish_date', 'desc')
                        ->paginate(12) // 12 por página (puedes cambiarlo)
                        ->withQueryString(); // MUY IMPORTANTE: Mantiene los filtros en los enlaces de paginación

        return Inertia::render('NoteList', [ // Asegúrate que el nombre de la vista sea 'NoteList'
            'auth' => [
                'user' => $request->user() ? $request->user()->load('role') : null,],
            'notes' => $notes,
            'sections' => Section::all(), // Pasa todas las secciones para el dropdown
            'filters' => $filters,     // Devuelve los filtros aplicados al frontend
        ]);
    }

    public function store(Request $request)
    {

        $this->authorize('create', Note::class);

        $validated = $request->validate([
            'headline' => 'required|string|max:50',
            'lead' => 'required|string',
            'body' => 'required|string',
            'closing' => 'required|string',
            'portrait_url' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'sections' => 'required|array',
            'sections.*' => 'exists:sections,section_id',
            'media_files' => 'nullable|array',
            'media_files.*' => 'nullable|file|mimes:jpg,jpeg,png,mp4,mov,mp3,wav|max:20480',
            'extensions' => 'nullable|array',
            'extensions.lead' => 'nullable|array|max:3', // Aceptan hasta 3 extensiones
            'extensions.body' => 'nullable|array|max:3',
            'extensions.closing' => 'nullable|array|max:3',
            'extensions.*.*.content' => 'required|string', // Cada extensión debe tener contenido
            'extensions.*.*.media_file' => 'nullable|file|mimes:jpg,jpeg,png,mp4,mov,mp3,wav|max:20480',

        ]);

        $path = $request->file('portrait_url')->store('notes', 'public');

        $note = Note::create([
            'headline' => $validated['headline'],
            'lead' => $validated['lead'],
            'body' => $validated['body'],
            'closing' => $validated['closing'],
            'portrait_url' => $path,
            'is_featured' => false,
            'user_id' => auth()->id(),
            'publish_date' => now(),
        ]);

        if (!empty($validated['sections'])) {
            $note->sections()->attach($validated['sections']);
        }

        // Lógica para guardar las extensiones
        if ($request->has('extensions')) {
            foreach ($request->input('extensions') as $type => $extensionGroup) {
                foreach ($extensionGroup as $position => $extensionData) {
                    
                    $mediaId = null;
                    // Verificamos si existe un archivo para esta extensión específica
                    if ($request->hasFile("extensions.$type.$position.media_file")) {
                        $file = $request->file("extensions.$type.$position.media_file");
                        $path = $file->store('media', 'public');
                        
                        // Creamos el registro Media y nos aseguramos de que se guarde
                        $mediaPosition = 0;
                        if($type === 'lead') $mediaPosition = 100 + $position;
                        if($type === 'body') $mediaPosition = 200 + $position;
                        if($type === 'closing') $mediaPosition = 300 + $position;

                        $media = new Media();
                        $media->url = $path;
                        $media->note_id = $note->note_id;
                        $media->position = $mediaPosition; // Posición alta para distinguirlos
                        $media->save();
                        
                        $mediaId = $media->media_id;
                    }
                    
                    // Creamos la extensión con su contenido y el ID del archivo (si existe)
                    $note->extensions()->create([
                        'type' => $type,
                        'content' => $extensionData['content'],
                        'position' => $position,
                        'media_id' => $mediaId,
                    ]);
                }
            }
        }

        // El foreach ahora captura tanto la $position (0, 1, etc.) como el $file.
        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $position => $file) {
                if ($file) {
                    $mediaPath = $file->store('media', 'public');
                    $note->media()->create([
                        'url' => $mediaPath,
                        'position' => $position, // Se guarda la posición correcta
                    ]);
                }
            }
        }

        return back()->with('success', '¡Nota eliminada exitosamente!');
    }

    

    public function update(Request $request, Note $note)
    {

        $this->authorize('update', $note);

        // 1. --- VALIDACIÓN ---
        // Añadimos las mismas reglas de validación para 'extensions' que en el método store.
        $validated = $request->validate([
            'headline' => 'required|string|max:50',
            'lead' => 'required|string|max:200',
            'body' => 'required|string|max:280',
            'closing' => 'required|string|max:200',
            'portrait_url' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'sections' => 'required|array',
            'sections.*' => 'exists:sections,section_id',
            'media_files' => 'nullable|array',
            'media_files.*' => 'nullable|file|mimes:jpg,jpeg,png,mp4,mov,mp3,wav|max:20480',
            'media_to_delete' => 'nullable|array',
            'media_to_delete.*' => 'exists:media,media_id',
            'extensions' => 'nullable|array',
            'extensions.lead' => 'nullable|array|max:3',
            'extensions.body' => 'nullable|array|max:3',
            'extensions.closing' => 'nullable|array|max:3',
            'extensions.*.*.content' => 'required|string',
            'extensions.*.*.media_file' => 'nullable|file|mimes:jpg,jpeg,png,mp4,mov,mp3,wav|max:20480',
            'extensions.*.*.existing_media_id' => 'nullable|integer|exists:media,media_id',
        ]);

        // 2. --- ACTUALIZACIÓN DE DATOS PRINCIPALES ---
        // (Esta parte no cambia)
        $note->update([
            'headline' => $validated['headline'],
            'lead' => $validated['lead'],
            'body' => $validated['body'],
            'closing' => $validated['closing'],
        ]);
        if ($request->hasFile('portrait_url')) {
            Storage::disk('public')->delete($note->portrait_url);
            $path = $request->file('portrait_url')->store('notes', 'public');
            $note->update(['portrait_url' => $path]);
        }
        $note->sections()->sync($validated['sections'] ?? []);
        
        // (La lógica para borrar archivos multimedia principales tampoco cambia)
        $mediaIdsToDelete = $request->input('media_to_delete', []);
        if (!empty($mediaIdsToDelete)) {
            // ... (código para borrar media_to_delete)
        }

        // 3. --- SINCRONIZACIÓN DE EXTENSIONES (BORRAR Y RECREAR) ---

        foreach ($note->extensions as $extension) {
        if ($extension->media) {
            // Solo borramos el archivo si NO está en la lista de los que se quieren conservar
            $wasKept = false;
            if ($request->has('extensions')) {
                foreach ($request->input('extensions') as $type => $group) {
                    foreach ($group as $extData) {
                        if (isset($extData['existing_media_id']) && $extData['existing_media_id'] == $extension->media_id) {
                            $wasKept = true;
                            break 2;
                        }
                    }
                }
            }
            if (!$wasKept) {
                Storage::disk('public')->delete($extension->media->url);
                $extension->media->delete();
            }
        }
    }
    $note->extensions()->delete();

    // Recreamos las extensiones que vienen del formulario
    if ($request->has('extensions')) {
        foreach ($request->input('extensions') as $type => $extensionGroup) {
            foreach ($extensionGroup as $position => $extensionData) {
                
                $mediaId = null;

                // Prioridad 1: ¿Se subió un archivo nuevo?
                if ($request->hasFile("extensions.$type.$position.media_file")) {
                    $file = $request->file("extensions.$type.$position.media_file");
                    $path = $file->store('media', 'public');
                    $mediaPosition = 0;
                    if ($type === 'lead') $mediaPosition = 100 + $position;
                    if ($type === 'body') $mediaPosition = 200 + $position;
                    if ($type === 'closing') $mediaPosition = 300 + $position;
                    $media = Media::create(['url' => $path, 'note_id' => $note->note_id, 'position' => $mediaPosition]);
                    $mediaId = $media->media_id;
                } 
                // Prioridad 2: Si no, ¿se envió el ID de un archivo existente para conservarlo?
                else if (isset($extensionData['existing_media_id'])) {
                    $mediaId = $extensionData['existing_media_id'];
                }
                
                $note->extensions()->create([
                    'type' => $type,
                    'content' => $extensionData['content'],
                    'position' => $position,
                    'media_id' => $mediaId,
                ]);
            }
        }
    }
        
        // 4. --- ACTUALIZACIÓN DE ARCHIVOS MULTIMEDIA PRINCIPALES ---
        // (Esta parte no cambia, pero es importante que vaya después de la lógica de extensiones)
        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $position => $file) {
                if ($file) {
                    $oldMainMedia = $note->media()->where('position', $position)->where('position', '<', 100)->first();
                    if ($oldMainMedia) {
                        Storage::disk('public')->delete($oldMainMedia->url);
                        $oldMainMedia->delete();
                    }
                    $mediaPath = $file->store('media', 'public');
                    $note->media()->create(['url' => $mediaPath, 'position' => $position]);
                }
            }
        }
        
        return back()->with('success', '¡Nota actualizada exitosamente!');
    }


    public function toggleFeatured(Note $note)
    {
        // Use a database transaction to ensure atomicity
        DB::transaction(function () use ($note) {
            // 1. Unfeature all other notes first.
            Note::where('note_id', '!=', $note->note_id)->update(['is_featured' => false]);

            // 2. Toggle the selected note.
            // If it was false, it becomes true. If it was true, it becomes false.
            $note->update(['is_featured' => !$note->is_featured]);
        });

        return redirect()->route('notes.index')->with('success', 'Portada actualizada!');
    }

    //ADMINISTRADOR
    public function show(Note $note){

        $note->load(['user', 'sections', 'media', 'extensions']);

        if($note->extensions->isNotEmpty()){
            $note->extensions->load('media');
        }

        $note->append('media_by_position');

        return response()->json($note);

    }

    //LECTOR
    public function showNote(Note $note) // Using Route Model Binding
    {
        // Load all necessary relationships for display
        $note->load(['user', 'sections', 'media', 'extensions.media', 'comments.user']);

        // 2. Obtener los IDs de las secciones de la nota actual
        $currentSectionIds = $note->sections->pluck('section_id')->toArray();

        // 3. Buscar notas relacionadas (que compartan al menos una sección)
        $relatedNotes = Note::with(['user', 'sections']) // Carga relaciones básicas
                            ->where('note_id', '!=', $note->note_id) // Excluye la nota actual
                            ->whereHas('sections', function ($query) use ($currentSectionIds) {
                                // Busca notas que tengan secciones cuyo ID esté en nuestra lista
                                $query->whereIn('sections.section_id', $currentSectionIds);
                            })
                            ->orderBy('publish_date', 'desc') // Las más recientes primero
                            ->limit(9) // Limita a 2 resultados
                            ->get();

        // 4. Pasar todo a la vista
        return Inertia::render('Notes/NoteDetails', [
            'note' => $note,
            'relatedNotes' => $relatedNotes, //Pasa las notas relacionadas
        ]);
    }

    public function destroy(Note $note){

        $this->authorize('delete', $note);

        $note->extensions()->delete();
        
        // 1. Eliminar las relaciones en la tabla pivote (note_sections)
        // detach() sin argumentos elimina todas las relaciones para esta nota.

        foreach ($note->media as $mediafile){
            Storage::disk('public')->delete($mediafile->url);
            $mediafile->delete();
        }


        $note->sections()->detach();

        // 2. Eliminar la imagen de portada del almacenamiento
        // Es una buena práctica verificar si el archivo existe antes de intentar borrarlo.
        if ($note->portrait_url) {
            Storage::disk('public')->delete($note->portrait_url);
        }

        // 3. Eliminar la nota de la base de datos
        $note->delete();

        // 4. Redirigir de vuelta con un mensaje de éxito
        return back()->with('success', '¡Nota eliminada exitosamente!');
    }
}
