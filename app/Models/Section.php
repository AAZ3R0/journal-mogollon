<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Section
 * 
 * @property int $section_id
 * @property string $name
 * 
 * @property Collection|Note[] $notes
 *
 * @package App\Models
 */
class Section extends Model
{
	protected $table = 'sections';
	protected $primaryKey = 'section_id';
	public $timestamps = false;

	protected $fillable = [
		'name'
	];

	public function notes()
	{
		return $this->belongsToMany(Note::class, 'note_sections')
					->withPivot('note_section_id');
	}
}
