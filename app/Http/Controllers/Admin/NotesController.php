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
        $notes = Note::with('user', 'sections', 'media')->orderBy('publish_date', 'desc')->get();
        $sections = Section::all();

        $notes->each->append('media_by_position');

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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'headline' => 'required|string|max:50',
            'lead' => 'required|string|max:200',
            'body' => 'required|string|max:280',
            'closing' => 'required|string|max:200',
            'portrait_url' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'sections' => 'required|array',
            'sections.*' => 'exists:sections,section_id',
            'media_files' => 'nullable|array',
            'media_files.*' => 'nullable|file|mimes:jpg,jpeg,png,mp4,mov,mp3,wav|max:20480',
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

        // ✅✅✅ CORRECCIÓN CLAVE AQUÍ ✅✅✅
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

        return redirect()->route('notes.index')->with('success', '¡Nota creada exitosamente!');
    }

    

    public function update(Request $request, Note $note){


        

        // 1. Validar los datos de entrada (la imagen es opcional en la actualización)
        $validated = $request->validate([
            'headline' => 'required|string|max:50',
            'lead' => 'required|string|max:200',
            'body' => 'required|string|max:280',
            'closing' => 'required|string|max:200',
            'portrait_url' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // 'nullable' la hace opcional
            'sections' => 'required|array',
            'sections.*' => 'exists:sections,section_id',

            'media_files'       => 'nullable|array',
            'media_files.*'     => 'nullable|file|mimes:jpg,jpeg,png,mp4,mov,mp3,wav|max:20480',
            'media_to_delete'   => 'nullable|array', // Arreglo con los IDs de los media a borrar
            'media_to_delete.*' => 'exists:media,media_id',
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


        if (!empty($validated['media_to_delete'])) {
            // Buscamos todos los registros de media que coincidan con los IDs
            $mediaToDelete = Media::whereIn('media_id', $validated['media_to_delete'])->get();
            foreach ($mediaToDelete as $media) {
                // Borramos el archivo físico del disco
                Storage::disk('public')->delete($media->url);
                // Borramos el registro de la base de datos
                $media->delete();
            }
        }

        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $position => $file) {
                if ($file) {
                    // Borramos cualquier archivo viejo que pudiera estar en esta misma posición
                    $oldMedia = $note->media()->where('position', $position)->first();
                    if ($oldMedia) {
                        Storage::disk('public')->delete($oldMedia->url);
                        $oldMedia->delete();
                    }
                    
                    $mediaPath = $file->store('media', 'public');
                    $note->media()->create([
                        'url' => $mediaPath,
                        'position' => $position,
                    ]);
                }
            }
        }

        return redirect()->route('notes.index')->with('success', '¡Nota actualizada exitosamente!');
    }

    public function show(Note $note){

        $note->load(['user', 'sections', 'media']);

        $note->append('media_by_position');

        return response()->json($note);

    }

    public function destroy(Note $note){
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
        return redirect()->route('notes.index')->with('success', '¡Nota eliminada exitosamente!');
    }
}
