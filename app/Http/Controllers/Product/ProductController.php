<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Shop;
use App\Models\CustomerProduct;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request,Product $product,Shop $shop,Customer $cus)
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request,Customer $customer,Shop $shop, Product $product, CustomerProduct $cp)
    {
        $idPr = $request->idPr;
        $titlePr = $request->titlePr;
        $pricePr = $request->pricePr;
        $imgPr = $request->imgPr;
        $shopUrl = $request->shopUrl;
        $customId = $request->customerId;

        $validator = Validator::make(
            ['id_product' => $idPr],
            ['id_product' => 'unique:products,id_product,'.$idPr]
        );

        $validator1 = Validator::make(
            ['id_customer' => $customId],
            ['id_customer' => 'unique:customers,id_customer,'.$customId]
        );

        $s = $shop->getIdShop();
        $checkCP = $cp->getDataCP();

        foreach ($s as $item) {
            if($shopUrl == $item->url){
                if($validator->fails()){
                    if($validator1->fails()){
                        foreach ($checkCP as $check) {
                            if($idPr == $check->product_id && $customId == $check->customer_id){
                                return response()->json([
                                    'statusCP' => false
                                ]);
                            }else{
                                $cus_prod = new CustomerProduct;
                                $cus_prod->customer_id = $customId;
                                $cus_prod->product_id = $idPr;

                                $cus_prod->save();

                                return response()->json([
                                    'cus_prod' => $cus_prod
                                ]);
                            }
                        }
                    }else{
                        $customer = new Customer;
                        $customer->id_customer = $customId;
                        $customer->shop_id = $item->id;

                        $customer->save();

                        $cus_prod = new CustomerProduct;
                        $cus_prod->customer_id = $customId;
                        $cus_prod->product_id = $idPr;

                        $cus_prod->save();

                        return response()->json([
                            'cus_prod' => $cus_prod,
                            'customer' => $customer
                        ]);
                    }
                }else{
                    $products = new Product;
                    $products->id_product = $idPr;
                    $products->shop_id = $item->id;
                    $products->name = $titlePr;
                    $products->price = $pricePr;
                    $products->image = $imgPr;

                    $products->save();

                    if($validator1->fails()){
                        $cus_prod = new CustomerProduct;
                        $cus_prod->customer_id = $customId;
                        $cus_prod->product_id = $idPr;
                        $cus_prod->save();

                        return response()->json([
                            'cus_prod' => $cus_prod,
                            'product' => $products
                        ]);
                    }else{
                        $customer = new Customer;
                        $customer->id_customer = $customId;
                        $customer->shop_id = $item->id;
                        $customer->save();

                        $cus_prod = new CustomerProduct;

                        $cus_prod->customer_id = $customId;
                        $cus_prod->product_id = $idPr;

                        $cus_prod->save();

                        return response()->json([
                            'cus_prod' => $cus_prod,
                            'customer' => $customer,
                            'product' => $products
                        ]);
                    }
                }
            }else{
                return response()->json([
                    'statusShop' => false
                ]);
            }
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }
    public function check(Request $request, Product $product, Customer $customer, Shop $shop, CustomerProduct $cp)
    {
        $arrPr = $request->arr_id;
        $url = $request->shopUrl;
        $cusId = $request->customerId;

        $arr_idProduct = [];
        $arr_urlShop = [];
        $arr_idCustomer = [];
        $pr = $product->getAllProduct();
        $cus = $customer->getIdCustomer();
        $sh = $shop->getIdShop();
        $checkCP = $cp->getDataCP();

        foreach ($pr as $value1) {
            array_push($arr_idProduct,$value1->id_product);
        }

        foreach ($sh as $value2) {
            array_push($arr_urlShop,$value2->url);
        }

        foreach ($cus as $value3) {
            array_push($arr_idCustomer,$value3->id_customer);
        }

        foreach ($arr_urlShop as $s) {
            if($s == $url){
                foreach ($checkCP as $item) {
                    foreach ($arrPr as $value) {
                        if($item->customer_id == $cusId && $item->product_id == $value){
                            return response()->json([
                                'status' => true,
                                'value' => $value
                            ]);
                        }
                    }
                }
            }
        }
        return response()->json([
            'statusShop' => false
        ]);
    }

    public function deleteProduct(Request $request, Product $product, CustomerProduct $cuspr, Shop $shop, Customer $customer)
    {
        $idPro = $request->idPr;
        $idCus = $request->idCus;
        $url = $request->idShop;

        $arr_idProduct = [];
        $pr = $product->getAllProduct();
        foreach ($pr as $value1) {
            array_push($arr_idProduct,$value1->id_product);
        }

        $cp = $cuspr->getDataCP();

        $arr_idShop = [];
        $sh = $shop->getIdShop();
        foreach ($sh as $value3) {
            array_push($arr_idShop,$value3->url);
        }

        $arr_idCustomer = [];
        $cus = $customer->getIdCustomer();
        foreach ($cus as $value4) {
            array_push($arr_idCustomer,$value4->id_customer);
        }

        foreach ($arr_idShop as $s) {
            if($url == $s){
                foreach ($arr_idCustomer as $c) {
                    if($idCus == $c){
                        foreach ($cp as $cusp) {
                            if($idPro == $cusp->product_id && $idCus == $cusp->customer_id){
                                $delCp = $cuspr->deleteCusPro($idCus,$idPro);
                                if($delCp){
                                    return response()->json([
                                        'status' => true
                                    ]);
                                }
                            }
                        }
                    }
                }
            }else{
                return response()->json([
                    'statusShop' => false
                ]);
            }
        }

        // foreach ($arr_idCP as $cusp) {
        //     if($cusp == $idPro){
        //         $delCp = $cuspr->deleteCusPro($cusp);
        //         if($delCp){
        //             foreach ($arr_idProduct as $p) {
        //                 if($p == $idPro){
        //                     $del = $product->deleteProductWL($p);
        //                     if($del){
        //                         echo "Ok";
        //                     }else{
        //                         echo "fail";
        //                     }
        //                 }
        //             }
        //         }else{
        //             echo "fail";
        //         }
        //     }
        // }

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
