<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\NotesController;
use App\Http\Controllers\Users\CommentController;
use App\Http\Controllers\Users\WorkspaceController;


//Home universal
Route::get('/', [HomeController::class, 'index'])->name('home');

//About Us
Route::get('/aboutUs', function (){

    return Inertia::render('AboutUs');
})->name('index.aboutus');

//Ver notas universal
Route::get('/notes/{note}', [NotesController::class, 'showNote'])->name('notes.public.show');

//Operaciones comentarios en las notas
Route::middleware('auth')->group(function () {
    Route::post('/notes/{note}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::patch('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
});




Route::get('/notes', function () {
    return Inertia::render('NoteList');
})->name('index.notes');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    //Panel de control (Administrador)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.panel');

    //Operaciones de notas del administrador
    Route::get('/notesManager', [NotesController::class, 'index'])->name('notes.index');
    Route::post('/notesManager', [NotesController::class, 'store'])->name('notes.store');
    Route::get('/notesManager/{note}', [NotesController::class, 'show'])->name('notes.show');
    Route::put('/notesManager/{note}', [NotesController::class, 'update'])->name('notes.update');
    Route::patch('/noteManager/{note}/toggle-featured', [NotesController::class, 'toggleFeatured'])->name('notes.toggleFeatured');
    Route::delete('/notesManager/{note}', [NotesController::class, 'destroy'])->name('notes.destroy');

    //Operaciones de usuarios del administrador
    Route::get('/usersManager', function(){
        return Inertia::render('Admin/AccountsManager');
    })->name('admin.users');

    //Operaciones de comentarios del administrador
    Route::get('/commentsManager', function(){
        return Inertia::render('Admin/CommentsManager');
    })->name('admin.comments');

    //Espacio de trabajo (Reportero y Editor)
    Route::get('/workspace', [WorkspaceController::class, 'index'])
         ->name('workspace.index')
         ->can('access-workspace');
});

require __DIR__.'/auth.php';
