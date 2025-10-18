<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Medium
 * 
 * @property int $media_id
 * @property string|null $url
 * @property int $note_id
 * @property int $position
 * @property Note $note
 *
 * @package App\Models
 */
class Media extends Model
{
	protected $table = 'media';
	protected $primaryKey = 'media_id';
	public $timestamps = false;

	protected $casts = [
		'note_id' => 'int'
	];

	protected $fillable = [
		'url',
		'note_id',
		'position'
	];

	public function note()
	{
		return $this->belongsTo(Note::class, 'note_id');
	}
}
