<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Shop;
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
        $idCus = $shop->getIdCustomerByIdShop($s->id);

        return \response()->json([
            'idCus' => $idCus
        ]);
    }

    public function filterProducts(Request $request, Shop $shop)
    {
        $idCus = $request->idCus;
        $sh = $shop->getCurrentShop();
        $filter = $shop->getDataFilter($sh->id, $idCus);

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
}
