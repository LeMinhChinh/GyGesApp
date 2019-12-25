<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Shop extends Model
{
    protected $table = 'shops';

    protected $fillable = ['url','token'];

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

    public function getDataFilter($idShop, $idCus)
    {
        $data = DB::table('shops AS s')
                    ->select('s.*','cp.customer_id','p.id AS id_pr','p.name','p.price','p.id_product','p.image')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product AS cp','cp.product_id','=','id_product')
                    ->where('s.id',$idShop)
                    ->where('cp.customer_id',$idCus)
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

    public function getIdCustomerByIdShop($id)
    {
        $data = DB::table('shops AS s')
                        ->select('s.*','c.id_customer')
                        ->join('customers AS c','c.shop_id','=','s.id')
                        ->where('s.id', $id)
                        ->get();
        return $data;
    }

    public function getDataWishlist($urlShop, $idCus)
    {
        $data = DB::table('shops AS s')
                    ->select('s.*','cp.customer_id','p.id AS id_pr','p.name','p.price','p.id_product','p.image')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product AS cp','cp.product_id','=','p.id_product')
                    ->where('s.url',$urlShop)
                    ->where('cp.customer_id',$idCus)
                    ->get();
        return $data;
    }
}
