<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Product extends Model
{
    protected $table = 'products';

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

    public function insertDataWishList($data)
    {
        DB::table('products')->insert($data);
        $id = DB::getPdo()->lastInsertId();
        return $id;
    }

    public function deleteProductWL($id)
    {
        $del = DB::table('products')
                    ->where('id_product',$id)
                    ->delete();
        return $del;
    }
}
