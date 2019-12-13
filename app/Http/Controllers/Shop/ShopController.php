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
            // 'products' => $shop->products,
            'idCustomer' => $idCustomer
        ]) ;
    }
}
