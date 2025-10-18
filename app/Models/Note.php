<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

	public function user()
	{
		return $this->belongsTo(User::class, 'user_id');
	}

	public function comments()
	{
		return $this->hasMany(Comment::class);
	}

	public function media()
	{
		return $this->hasMany(Media::class, 'note_id');
	}

	public function sections()
	{
		return $this->belongsToMany(Section::class, 'note_sections', 'note_id', 'section_id');
	}

	public function notes_extension()
	{
		return $this->hasOne(NotesExtension::class, 'note_extension_id');
	}


	public function getMediaByPositionAttribute()
	{
		// Carga la relación 'media', la ordena por posición,
		// y la convierte en un objeto donde la clave es la posición.
		// ej: { "0": { ...archivo1 }, "1": { ...archivo2 } }
		return $this->media()->orderBy('position', 'asc')->get()->keyBy('position');
	}
}
