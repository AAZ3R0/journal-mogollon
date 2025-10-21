<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\NotesController;

Route::get('/', [HomeController::class, 'index'])->name('home');


Route::get('/notes', [NotesController::class, 'index'])->name('notes.index');
Route::post('/notes', [NotesController::class, 'store'])->name('notes.store');
Route::get('/notes/{note}', [NotesController::class, 'show'])->name('notes.show');
Route::put('/notes/{note}', [NotesController::class, 'update'])->name('notes.update');
Route::patch('/note/{note}/toggle-featured', [NotesController::class, 'toggleFeatured'])->name('notes.toggleFeatured');
Route::delete('/notes/{note}', [NotesController::class, 'destroy'])->name('notes.destroy');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
