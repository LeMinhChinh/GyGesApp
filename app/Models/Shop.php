<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Shop extends Model
{
    protected $table = 'shops';

    public function customers()
    {
        return $this->hasmany('App\Models\Customer');
    }

    public function products()
    {
        return $this->hasmany('App\Models\Product');
    }

    public function customer_product()
    {
        return $this->hasmany('App\Models\Product');
    }

    public static function getCurrentShop(){
        // return Shop::where('url', 'https://globolevel1.myshopify.com')->first();
        $data = DB::table('shops')
                    ->select('*')
                    ->where('url','https://globolevel1.myshopify.com')
                    ->first();
        return $data;
    }

    public function getIdCustomer($id)
    {
        $data = DB::table('shops AS s')
                    ->select('s.*','cp.customer_id','p.id AS id_pr','p.name','p.price','p.id_product','p.image')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product AS cp','cp.product_id','=','id_product')
                    ->where('s.id',$id)
                    ->get();
        return $data;
    }

    public function getIdShop()
    {
        $data = DB::table('shops AS s')
                    ->select('s.*')
                    ->get();
        return $data;
    }
}
