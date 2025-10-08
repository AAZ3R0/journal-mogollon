<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class NoteSection
 * 
 * @property int $note_section_id
 * @property int $note_id
 * @property int $section_id
 * 
 * @property Note $note
 * @property Section $section
 *
 * @package App\Models
 */
class NoteSection extends Model
{
	protected $table = 'note_sections';
	protected $primaryKey = 'note_section_id';
	public $timestamps = false;

	protected $casts = [
		'note_id' => 'int',
		'section_id' => 'int'
	];

	protected $fillable = [
		'note_id',
		'section_id'
	];

	public function note()
	{
		return $this->belongsTo(Note::class);
	}

	public function section()
	{
		return $this->belongsTo(Section::class);
	}
}
