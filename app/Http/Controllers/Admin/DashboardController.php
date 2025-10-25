<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Note;
use App\Models\User;
use App\Models\Comment;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(){
        // 1. Estadísticas (Counts)
        $noteCount = Note::count();
        $userCount = User::count();
        $commentCount = Comment::count();

        // 2. Notas Recientes (Últimas 5)
        $recentNotes = Note::with(['user', 'sections']) // Carga relaciones
                             ->orderBy('publish_date', 'desc')
                             ->limit(5)
                             ->get();

        // 3. Usuarios Recientes (Últimos 5)
        $recentUsers = User::with('role') // Carga la relación de rol
                             ->orderBy('created_at', 'desc')
                             ->limit(5)
                             ->get();

        // 4. Comentarios Recientes (Últimos 5)
        $recentComments = Comment::with('user') // Carga el usuario que comentó
                                 ->orderBy('publish_date', 'desc')
                                 ->limit(5)
                                 ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'notes' => $noteCount,
                'users' => $userCount,
                'comments' => $commentCount,
            ],
            'recentNotes' => $recentNotes,
            'recentUsers' => $recentUsers,
            'recentComments' => $recentComments,
        ]);
    }
}
