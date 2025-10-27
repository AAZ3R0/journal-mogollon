<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;
use App\Models\Note;
use App\Models\Comment;
use App\Policies\NotePolicy;
use App\Policies\CommentPolicy;



class AppServiceProvider extends ServiceProvider
{


    protected $policies = [
        Comment::class => CommentPolicy::class, // <-- AÑADE ESTA LÍNEA
        Note::class => NotePolicy::class,
    ];


    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('access-workspace', function (User $user) {
            // Solo permite el paso si el rol es Reportero O Editor
            return in_array($user->role->name, ['Reportero', 'Editor']);
        });

        Gate::define('access-admin-panel', function (User $user) {
            return $user->role->name === 'Administrador';
        });

        Vite::prefetch(concurrency: 3);
    }
}
