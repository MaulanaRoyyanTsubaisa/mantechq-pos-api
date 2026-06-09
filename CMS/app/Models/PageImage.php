namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_id',
        'path',
        'alt',
        'title'
    ];

    public function page()
    {
        return $this->belongsTo(Page::class);
    }
}
