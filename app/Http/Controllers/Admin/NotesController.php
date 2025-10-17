<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

use App\Models\Note;
use App\Models\NoteSection;
use App\Models\Section;
use App\Models\NoteExtension;
use App\Models\Media;

use Inertia\Inertia; 
use Inertia\Response;

class NotesController extends Controller
{
    public function index(){
        $notes = Note::with('user', 'sections')->orderBy('publish_date', 'desc')->get();
        $sections = Section::all();
        return Inertia::render('Admin/NotesManager', [
            'notes' => $notes,
            'sections' => $sections,
        ]);
    }

    public function workSpaceIndex(){
        return Inertia::render('Editor_Reporter/WorkSpace');
    }

    public function viewList(){
        return Inertia::render('Notes/NoteList');
    }

    public function store(Request $request){

        $validated = $request->validate([
            'headline' => 'required|string|max:50',
            'lead' => 'required|string|max:100',
            'body' => 'required|string|max:200',
            'closing' => 'required|string|max:100',
            'portrait_url' => 'required|image|mimes:jpg, jpeg, png|max:2048',
            'sections' => 'required|array',
            'sections.*' => 'exists:sections,section_id',
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

        if(!empty($validated['sections'])){
            $note->sections()->attach($validated['sections']);
        }

        return redirect()->route('notes.index')->with('success', '¡Nota creada exitosamente!');

    }

    public function show(Note $note){

        $note->load(['user', 'sections']);

        return response()->json($note);

    }

    public function update(Request $request, Note $note){
        // 1. Validar los datos de entrada (la imagen es opcional en la actualización)
        $validated = $request->validate([
            'headline' => 'required|string|max:50',
            'lead' => 'required|string|max:100',
            'body' => 'required|string|max:200',
            'closing' => 'required|string|max:100',
            'portrait_url' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // 'nullable' la hace opcional
            'sections' => 'required|array',
            'sections.*' => 'exists:sections,section_id',
        ]);

        // 2. Actualizar los campos principales de la nota
        $note->update([
            'headline' => $validated['headline'],
            'lead' => $validated['lead'],
            'body' => $validated['body'],
            'closing' => $validated['closing'],
        ]);

        // 3. Manejar la actualización de la imagen de portada (solo si se sube una nueva)
        if ($request->hasFile('portrait_url')) {
            // Opcional: Eliminar la imagen anterior para no acumular archivos
            // Storage::disk('public')->delete($note->portrait_url);

            $path = $request->file('portrait_url')->store('notes', 'public');
            $note->update(['portrait_url' => $path]);
        }

        // 4. Sincronizar las secciones
        // sync() es el método ideal para actualizar. Elimina las relaciones viejas
        // y añade las nuevas en un solo paso.
        if (!empty($validated['sections'])) {
            $note->sections()->sync($validated['sections']);
        } else {
            // Si no se envía ninguna sección, las elimina todas
            $note->sections()->sync([]);
        }

        return redirect()->route('notes.index')->with('success', '¡Nota actualizada exitosamente!');
    }

    public function destroy(Note $note){
        // 1. Eliminar las relaciones en la tabla pivote (note_sections)
        // detach() sin argumentos elimina todas las relaciones para esta nota.
        $note->sections()->detach();

        // 2. Eliminar la imagen de portada del almacenamiento
        // Es una buena práctica verificar si el archivo existe antes de intentar borrarlo.
        if ($note->portrait_url) {
            Storage::disk('public')->delete($note->portrait_url);
        }

        // 3. Eliminar la nota de la base de datos
        $note->delete();

        // 4. Redirigir de vuelta con un mensaje de éxito
        return redirect()->route('notes.index')->with('success', '¡Nota eliminada exitosamente!');
    }
}
