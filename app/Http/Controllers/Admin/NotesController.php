<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

use App\Models\Note;
use App\Models\NoteSection;
use App\Models\NoteExtension;
use App\Models\Media;

use Inertia\Inertia; 
use Inertia\Response;

class NotesController extends Controller
{
    public function index(){
        $notes = Note::with('user')->orderBy('publish_date', 'desc')->get();
        return Inertia::render('Admin/NotesManager', [
            'notes' => $notes,
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
            'portrait_url' => 'required|image|mimes:jpg, jpeg, png|max:2048'
        ]);

        $path = $request->file('portrait_url')->store('notes', 'public');

        Note::create([
            'headline' => $validated['headline'],
            'lead' => $validated['lead'],
            'body' => $validated['body'],
            'closing' => $validated['closing'],
            'portrait_url' => $path,
            'is_featured' => false,
            'user_id' => auth()->id(),
            'publish_date' => now(),
        ]);

        return redirect()->route('notes.index')->with('success', '¡Nota creada exitosamente!');

    }

    public function show($id){

    }

    public function update($id){

    }

    public function delete($id){

    }
}
