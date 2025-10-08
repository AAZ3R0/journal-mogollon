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
	protected $table = 'notes_extension';
	protected $primaryKey = 'note_extension_id';
	public $timestamps = false;

	protected $casts = [
		'note_id' => 'int'
	];

	protected $fillable = [
		'lead',
		'body',
		'closing',
		'note_id'
	];

	public function note()
	{
		return $this->belongsTo(Note::class, 'note_extension_id');
	}
}
