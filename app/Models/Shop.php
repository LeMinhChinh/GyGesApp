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

    public function getIdCustomerByIdShop($id)
    {
        $data = DB::table('shops AS s')
                        ->select('s.*','c.id_customer')
                        ->join('customers AS c','c.shop_id','=','s.id')
                        ->where('s.id', $id)
                        ->get();
        return $data;
    }

    public function getDataWishlist($urlShop, $idCus,$page)
    {
        $data = DB::table('shops AS s')
                    ->select('p.id_product')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product AS cp','cp.product_id','=','p.id_product')
                    ->where('s.url',$urlShop)
                    ->where('cp.customer_id',$idCus)
                    ->paginate(2, ['*'], 'page', $page);
        return $data;
    }

    public function getSetting($urlShop)
    {
        $data = DB::table('shops AS s')
                    ->select('st.setting')
                    ->join('setting AS st','st.id_shop','=','s.id')
                    ->where('s.url',$urlShop)
                    ->get();
        return $data[0]->setting;
    }

    public function getCountProduct($id,$p1, $p2, $page)
    {
        $data = DB::table('shops AS s')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product as cp','cp.product_id','=','p.id_product')
                    ->select(DB::raw('COUNT(product_id) as count_id,p.id_product'))
                    ->groupby('cp.product_id')
                    ->where('s.id',$id)
                    ->whereBetween('p.price',[$p1, $p2])
                    ->paginate(4, ['*'], 'page', $page);
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

    public function getQueryValue($id, $query,$page)
    {
        $data = DB::table('shops AS s')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product as cp','cp.product_id','=','p.id_product')
                    ->select(DB::raw('COUNT(product_id) as count_id ,p.id_product'))
                    ->groupby('cp.product_id')
                    ->where('s.id',$id)
                    ->where('p.name','like','%'.$query.'%')
                    ->paginate(4, ['*'], 'page', $page);
        return $data;
    }

    public function filterDataProduct($id, $name,$price, $tagwith, $page)
    {

        $data = DB::table('shops AS s')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product as cp','cp.product_id','=','p.id_product')
                    ->select(DB::raw('COUNT(product_id) as count_id ,p.id_product'))
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
                    $data = $data->paginate(4, ['*'], 'page', $page);
        return $data;
    }

    public function getDataSort($id, $sort,$page)
    {
        $data = DB::table('shops AS s')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product as cp','cp.product_id','=','p.id_product')
                    ->select(DB::raw('COUNT(product_id) as count_id ,p.id_product'))
                    ->groupby('cp.product_id')
                    ->where('s.id',$id);
                    if($sort == "descending"){
                        $data = $data->orderby('count_id','DESC');
                    }
                    if($sort == "ascending"){
                        $data = $data->orderby('count_id','ASC');
                    }
                    $data = $data->paginate(4, ['*'], 'page', $page);
        return $data;
    }

    public function getDataTest($id)
    {
        $data = DB::table('shops AS s')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->select('p.id_product')
                    ->where('p.shop_id',$id)
                    ->get();
        return $data;
    }

    public function getDataCustomer($idShop, $idCus, $page)
    {
        $data = DB::table('shops AS s')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product AS cp','cp.product_id','=','id_product')
                    ->select('p.id_product')
                    ->where('s.id',$idShop)
                    ->where('cp.customer_id',$idCus)
                    ->paginate(4, ['*'], 'page', $page);
        return $data;
    }

    public function getData($idShop, $name,$price, $tagwith, $p1, $p2, $query, $sort, $idCus, $page)
    {
        $data = DB::table('shops AS s')
                    ->join('products AS p','p.shop_id','=','s.id')
                    ->join('customer_product AS cp','cp.product_id','=','id_product')
                    ->select(DB::raw('COUNT(product_id) as count_id ,p.id_product'))
                    ->groupby('cp.product_id')
                    ->where('s.id',$idShop)
                    ->whereBetween('p.price',[$p1, $p2]);
                    if($tagwith != null){
                        $data = $data->where('p.name','like','%'.$tagwith.'%');
                    }
                    if($name != null) {
                        $data = $data->wherein('p.name',$name);
                    }
                    if($price != null){
                        if (isset($price[0])) {
                            $data = $data->where('p.price','>',$price[0]);
                        }
                        if (isset($price[1])) {
                            $data = $data->where('p.price','<=',$price[1]);
                        }
                    }
                    if($query != null){
                        $data = $data->where('p.name','like','%'.$query.'%');
                    }
                    if($sort == "descending"){
                        $data = $data->orderby('count_id','DESC');
                    }
                    if($sort == "ascending"){
                        $data = $data->orderby('count_id','ASC');
                    }
                    if($idCus != null){
                        $data = $data->where('cp.customer_id',$idCus);
                    }
                    $data = $data->paginate(4, ['*'], 'page', $page);
        return $data;
    }
}
