<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Shop;
class ShopController extends Controller
{
    public function getProducts(Request $request,Shop $shop){
        // $shop = Shop::getCurrentShop();
        $sh = $shop->getCurrentShop();
        $idCustomer = $shop->getIdCustomer($sh->id);
        return response()->json([
            'success' =>true,
            'shop' => $sh,
            'idCustomer' => $idCustomer
        ]) ;
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
}
