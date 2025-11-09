<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

/**
 * Class Note
 * 
 * @property int $note_id
 * @property string $headline
 * @property string $lead
 * @property string $body
 * @property string $closing
 * @property Carbon $publish_date
 * @property string $portrait_url
 * @property bool $is_featured
 * @property int $user_id
 * 
 * @property User $user
 * @property Collection|Comment[] $comments
 * @property Collection|Media[] $media
 * @property Collection|Section[] $sections
 * @property NotesExtension|null $notes_extension
 *
 * @package App\Models
 */
class Note extends Model
{
	protected $table = 'notes';
	protected $primaryKey = 'note_id';
	public $timestamps = false;

	protected $casts = [
		'publish_date' => 'datetime',
		'is_featured' => 'bool',
		'user_id' => 'int'
	];

	protected $fillable = [
		'headline',
		'lead',
		'body',
		'closing',
		'publish_date',
		'portrait_url',
		'is_featured',
		'user_id'
	];

	protected $appends = ['media_by_position'];

	public function user()
	{
		return $this->belongsTo(User::class, 'user_id');
	}

	public function comments()
	{
		// Ordena los comentarios por fecha, los más recientes primero
		return $this->hasMany(Comment::class, 'note_id')->orderBy('publish_date', 'desc'); 
	}

	public function media()
	{
		return $this->hasMany(Media::class, 'note_id');
	}

	public function sections()
	{
		return $this->belongsToMany(Section::class, 'note_sections', 'note_id', 'section_id');
	}

	public function extensions(){
		return $this->hasMany(NotesExtension::class, 'note_id')->orderBy('position', 'asc');
	}


	public function getMediaByPositionAttribute()
	{
		// Carga la relación 'media', la ordena por posición,
		// y la convierte en un objeto donde la clave es la posición.
		// ej: { "0": { ...archivo1 }, "1": { ...archivo2 } }
		return $this->media()->orderBy('position', 'asc')->get()->keyBy('position');
	}

	protected static function boot()
    {
        parent::boot();

        // ✅ 2. AÑADE ESTA FUNCIÓN 'DELETING'
        // Esto se disparará cada vez que llames a $note->delete()
        static::deleting(function($note) {
            
            // 1. Desvincula las secciones (ESTO ARREGLA TU ERROR)
            $note->sections()->detach();

            // 2. Borra los comentarios
            $note->comments()->delete();

            // 3. Borra las extensiones
            $note->extensions()->delete();

            // 4. Borra todos los archivos multimedia asociados
            foreach ($note->media as $mediafile) {
                Storage::disk('public')->delete($mediafile->url);
                $mediafile->delete();
            }

            // 5. Borra la imagen de portada
            if ($note->portrait_url) {
                Storage::disk('public')->delete($note->portrait_url);
            }
        });
    }
}
