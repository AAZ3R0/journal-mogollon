<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * Class User
 * 
 * @property int $user_id
 * @property string $name
 * @property string $username
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int $rol_id
 * 
 * @property Role $role
 * @property Collection|Comment[] $comments
 * @property Collection|Note[] $notes
 *
 * @package App\Models
 */
class User extends Authenticatable
{
	protected $table = 'users';
	protected $primaryKey = 'user_id';

	protected $casts = [
		'email_verified_at' => 'datetime',
		'rol_id' => 'int'
	];

	protected $hidden = [
		'password',
		'remember_token'
	];

	protected $fillable = [
		'name',
		'username',
		'email',
		'email_verified_at',
		'password',
		'remember_token',
		'rol_id'
	];

	public function role()
	{
		return $this->belongsTo(Role::class, 'rol_id');
	}

	public function comments()
	{
		return $this->hasMany(Comment::class, 'user_id');
	}

	public function notes()
	{
		return $this->hasMany(Note::class, 'user_id');
	}

	protected static function boot()
    {
        parent::boot();

        // Esto se dispara ANTES de que el usuario sea borrado
        static::deleting(function($user) {
            
            // 1. Borra todos los comentarios del usuario (esto es seguro, no tienen más dependencias)
            $user->comments()->delete();

            // 2. ✅ CORRECCIÓN: Borrar cada nota UNA POR UNA
            // Usamos un bucle 'foreach' para cargar cada nota en memoria
            // y luego llamar a delete() en ella.
            foreach ($user->notes as $note) {
                // Al llamar a $note->delete() individualmente,
                // SÍ se dispara el evento 'deleting' del modelo Note,
                // que a su vez SÍ ejecuta el '$note->sections()->detach()'.
                $note->delete();
            }
        });
    }
}
