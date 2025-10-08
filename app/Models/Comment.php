<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Comment
 * 
 * @property int $comment_id
 * @property string $message
 * @property Carbon|null $publish_date
 * @property int $user_id
 * @property int $note_id
 * 
 * @property User $user
 * @property Note $note
 *
 * @package App\Models
 */
class Comment extends Model
{
	protected $table = 'comments';
	protected $primaryKey = 'comment_id';
	public $timestamps = false;

	protected $casts = [
		'publish_date' => 'datetime',
		'user_id' => 'int',
		'note_id' => 'int'
	];

	protected $fillable = [
		'message',
		'publish_date',
		'user_id',
		'note_id'
	];

	public function user()
	{
		return $this->belongsTo(User::class);
	}

	public function note()
	{
		return $this->belongsTo(Note::class);
	}
}
