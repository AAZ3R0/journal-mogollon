<?php

namespace App\Policies;

use App\Models\Note;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class NotePolicy
{

    use HandlesAuthorization;


    public function before(User $user, string $ability): ?bool
    {
        if ($user->role && $user->role->name === 'Administrador') {
            return true;
        }
        
        // Retorna null para dejar que los otros métodos decidan
        return null; 
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Note $note): bool
    {
        return in_array($user->role->name, ['Reportero', 'Editor']);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        if ($user->role) {
            return in_array($user->role->name, ['Reportero', 'Editor']);
        }
        
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Note $note): bool
    {
        // El Editor puede actualizar cualquier nota.
        if ($user->role->name === 'Editor') {
            return true;
        }

        // El Reportero solo puede actualizar SUS PROPIAS notas.
        if ($user->role->name === 'Reportero') {
            return $user->user_id === $note->user_id;
        }

        return false; // Los Lectores no pueden.
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Note $note): bool
    {
        return $this->update($user, $note);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Note $note): bool
    {
        return $user->role->name === 'Editor';
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Note $note): bool
    {
        return $user->role->name === 'Editor';
    }
}
