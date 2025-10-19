<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class NotesExtension
 * 
 * @property int $note_extension_id
 * @property string|null $lead
 * @property string|null $body
 * @property string|null $closing
 * @property int $note_id
 * 
 * @property Note $note
 *
 * @package App\Models
 */
class NotesExtension extends Model
{
	protected $table = 'note_extensions';
	protected $primaryKey = 'note_extension_id';
	public $timestamps = false;

	protected $casts = [
		'note_id' => 'int',
		'media_id' => 'int',
		'position' => 'int'
	];

	protected $fillable = [
		'note_id',
		'type',
		'content',
		'position',
		'media_id'
	];

	public function note()
	{
		return $this->belongsTo(Note::class, 'note_id');
	}

	public function media()
	{
		return $this->belongsTo(Media::class, 'media_id');
	}

}
