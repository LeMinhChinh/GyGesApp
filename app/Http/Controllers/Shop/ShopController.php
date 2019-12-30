<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\CustomerProduct;
class ShopController extends Controller
{
    public function getProducts(Request $request,Shop $shop){
        $sh = $shop->getCurrentShop();
        $idCustomer = $shop->getIdCustomer($sh->id);
        return response()->json([
            'success' =>true,
            'shop' => $sh,
            'idCustomer' => $idCustomer
        ]) ;
    }

    public function getCustomer(Request $request, Shop $shop)
    {
        $s = $shop->getCurrentShop();
        $sortCount = $shop->getCountProduct($s->id);
        $idCus = $shop->getIdCustomerByIdShop($s->id);

        return response()->json([
            'idCus' => $idCus,
            'count' => $sortCount
        ]) ;
    }

    public function filterProducts(Request $request, Shop $shop)
    {
        $idCus = $request->idCus;
        $s = $shop->getCurrentShop();

        if($idCus[0]){
            $filter = $shop->getDataFilter($s->id, $idCus);
        }else{
            $filter = $shop->getCountProduct($s->id);
        }

        return response()->json([
            'filterProduct' => $filter
        ]);
    }

    public function getWishlist(Request $request, Shop $shop)
    {
        $url = $request->shopUrl;
        $idCus = $request->customerId;

        $wishlist = $shop->getDataWishlist($url, $idCus);

        return response()->json([
            'wishlist' => $wishlist
        ]);
    }

    public function sortCountProduct(Request $request, Shop $shop)
    {
        $s = $shop->getCurrentShop();
        $key = $request->sort;
        if($key){
            $sortCount = $shop->sortCount($s->id, $key);
        }else{
            $sortCount = $shop->getCountProduct($s->id);
        }
        return response()->json([
            'count' => $sortCount
        ]) ;
    }

    public function filterajax(Request $request, Shop $shop)
    {
        $data = $request->data;
        $s = $shop->getCurrentShop();

        $name = $data ? ($data['name'] ? $data['name'] : null) : null;
        $price = $data ? ($data['price'] ? explode(',', $data['price'][0]) : null) : null;
        $tagwith = $data ? ($data['tagwith'] ? $data['tagwith'] : null) : null;

        if($data){
            $filter = $shop->filterDataProduct($s->id, $name, $price, $tagwith);
        }
        return response()->json([
            'data' => $filter
        ]);
    }
}
