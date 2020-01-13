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
        $page = $request->page;
        $rangeValue = $request->rangeValue;

        $name = $request->name ? $request->name : null;
        $price = $request->price ? $request->price : null;
        $tagwith = $request->tagwith ? $request->tagwith : null;
        $queryValue = $request->queryValue ? $request->queryValue : null;

        $s = $shop->getCurrentShop();
        $idCus = $shop->getIdCustomerByIdShop($s->id);

        if($name != null && $price != null && $tagwith != null){
            $sortCount = $shop->filterDataProduct($s->id, $name, $price, $tagwith, $page);
        }

        if($rangeValue) {
            $sortCount = $shop->getCountProduct($s->id,$rangeValue[0],$rangeValue[1], $page);
        }

        if($queryValue){
            $sortCount = $shop->getQueryValue($s->id,$queryValue,$page);
        }

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
        $page = $request->page;
        $config = array(
            'ShopUrl' => $url,
            'ApiKey' => '40dc710e896fbfe26caa80f6744e8f11',
            'Password' => '500b7ee9953b52e5a35ba8bda189d647',
        );
        $shopify = new \PHPShopify\ShopifySDK($config);
        $products = $shopify->Product->get();
        $customers = $shopify->Customer($idCus);
        dd($products, $customers);

        $wishlist = $shop->getDataWishlist($url, $idCus, $page);
        $setting = $shop->getSetting($url);

        return response()->json([
            'wishlist' => $wishlist,
            'setting' => $setting
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
        $page = $request->page;
        $s = $shop->getCurrentShop();

        $name = $data ? ($data['name'] ? $data['name'] : null) : null;
        $price = $data ? ($data['price'] ? explode(',', $data['price'][0]) : null) : null;
        $tagwith = $data ? ($data['tagwith'] ? $data['tagwith'] : null) : null;

        if($data){
            $filter = $shop->filterDataProduct($s->id, $name, $price, $tagwith, $page);
        }
        return response()->json([
            'data' => $filter
        ]);
    }
}
