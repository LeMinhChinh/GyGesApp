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

    public function getCountProduct($id, $page)
    {
        $data = DB::table('shops AS s')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product as cp','cp.product_id','=','p.id_product')
                    ->select(DB::raw('COUNT(product_id) as count_id ,p.name,p.price,p.id_product,p.image'))
                    ->where('s.id',$id)
                    ->groupby('cp.product_id')
                    ->paginate(2, ['*'], 'page', $page);
                    // ->get();
        return $data;
    }

    public function sortCount($id, $key)
    {
        $data = DB::table('shops AS s')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product as cp','cp.product_id','=','p.id_product')
                    ->select(DB::raw('COUNT(product_id) as count_id ,p.name,p.price,p.id_product,p.image'))
                    ->where('s.id',$id)
                    ->groupby('cp.product_id')
                    ->orderby('count_id',$key)
                    ->get();
        return $data;
    }

    public function filterDataProduct($id, $name,$price, $tagwith)
    {

        $data = DB::table('shops AS s')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product as cp','cp.product_id','=','p.id_product')
                    ->select(DB::raw('COUNT(product_id) as count_id ,p.name,p.price,p.id_product,p.image'))
                    ->where('s.id',$id)
                    ->groupby('cp.product_id');
                    if($tagwith){
                        $data = $data->where('p.name','like','%'.$tagwith.'%');
                    }
                    if($name) {
                        $data = $data->wherein('p.name',$name);
                    }
                    if($price){
                        if (isset($price[0])) {
                            $data = $data->where('p.price','>',$price[0]);
                        }
                        if (isset($price[1])) {
                            $data = $data->where('p.price','<=',$price[1]);
                        }
                    }
                    $data = $data->get();
        return $data;
    }
}
