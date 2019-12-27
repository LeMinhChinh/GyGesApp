<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = ['id_product','shop_id','name','price','image'];

    public function shops()
    {
        return $this->belongsTo('App\Models\Shop');
    }

    public function customer_product()
    {
        return $this->hasmany('App\Models\Shop');
    }

    public function getAllProduct()
    {
        $data = DB::table('products AS p')
                    ->select('p.*')
                    ->get();
        return $data;
    }

    public function getProductByPrice($shop_id)
    {
        $data = DB::table('products as p')
                    ->select('p.*')
                    ->join('shops as s','s.id','=','p.shop_id')
                    ->where('p.price','>=','30')
                    ->where('s.id_shop',$shop_id)
                    ->get();
        return $data;
    }
}
