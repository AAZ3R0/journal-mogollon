<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\NotesController;
use App\Http\Controllers\Users\CommentController;


//Home universal
Route::get('/', [HomeController::class, 'index'])->name('home');

//Ver notas universal
Route::get('/notes/{note}', [NotesController::class, 'showNote'])->name('notes.public.show');

//Operaciones comentarios en las notas
Route::middleware('auth')->group(function () {
    Route::post('/notes/{note}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::patch('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
});

//Operaciones de notas del administrador
Route::get('/notesManager', [NotesController::class, 'index'])->name('notes.index');
Route::post('/notesManager', [NotesController::class, 'store'])->name('notes.store');
Route::get('/notesManager/{note}', [NotesController::class, 'show'])->name('notes.show');
Route::put('/notesManager/{note}', [NotesController::class, 'update'])->name('notes.update');
Route::patch('/noteManager/{note}/toggle-featured', [NotesController::class, 'toggleFeatured'])->name('notes.toggleFeatured');
Route::delete('/notesManager/{note}', [NotesController::class, 'destroy'])->name('notes.destroy');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
