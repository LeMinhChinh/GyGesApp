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
    public function store(Request $request,Customer $customer,Shop $shop, Product $product)
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
        if($validator->fails()){
            $validator1 = Validator::make(
                ['id_customer' => $customId],
                ['id_customer' => 'unique:customers,id_customer,'.$customId]
            );
            if($validator1->fails()){
                $validator2 = Validator::make(
                    [
                        'customer_id' => $customId,
                        'product_id' => $idPr
                    ],
                    [
                        'customer_id' => 'unique:customer_product,customer_id,'.$customId,
                        'product_id' => 'unique:customer_product,product_id,'.$idPr
                    ]
                );
                if($validator2->fails()){
                    echo "Error";
                }else{
                    $cus_prod = new CustomerProduct;
                    $cus_prod->customer_id = $customId;
                    $cus_prod->product_id = $idPr;
                    $cus_prod->save();
                }
            }else{
                $customer = new Customer;
                $customer->id_customer = $customId;
                $customer->shop_id = $val->id;
                $customer->save();

                $validator2 = Validator::make(
                    [
                        'customer_id' => $customId,
                        'product_id' => $idPr
                    ],
                    [
                        'customer_id' => 'unique:customer_product,customer_id,'.$customId,
                        'product_id' => 'unique:customer_product,product_id,'.$idPr
                    ]
                );
                if($validator2->fails()){
                    echo "Error";
                }else{
                    $cus_prod = new CustomerProduct;
                    $cus_prod->customer_id = $customId;
                    $cus_prod->product_id = $idPr;
                    $cus_prod->save();
                }
            }
        }else{
            $s = $shop->getIdShop();
            foreach ($s as $val) {
                if($val->url == $shopUrl){
                    $products = new Product;
                    $products->id_product = $idPr;
                    $products->shop_id = $val->id;
                    $products->name = $titlePr;
                    $products->price = $pricePr;
                    $products->image = $imgPr;

                    $products->save();

                    $validator1 = Validator::make(
                        ['id_customer' => $customId],
                        ['id_customer' => 'unique:customers,id_customer,'.$customId]
                    );
                    if($validator1->fails()){
                        $cus_prod = new CustomerProduct;
                        $cus_prod->customer_id = $customId;
                        $cus_prod->product_id = $idPr;
                        $cus_prod->save();
                    }else{
                        $customer = new Customer;
                        $customer->id_customer = $customId;
                        $customer->shop_id = $val->id;
                        $customer->save();

                        $validator2 = Validator::make(
                            [
                                'customer_id' => $customId,
                                'product_id' => $idPr
                            ],
                            [
                                'customer_id' => 'unique:customer_product,customer_id,'.$customId,
                                'product_id' => 'unique:customer_product,product_id,'.$idPr
                            ]
                        );
                        if($validator2->fails()){
                            echo "Error";
                        }else{
                            $cus_prod = new CustomerProduct;
                            $cus_prod->customer_id = $customId;
                            $cus_prod->product_id = $idPr;
                            $cus_prod->save();
                        }
                    }
                }
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
    public function check(Request $request, Product $product, Customer $customer, Shop $shop)
    {
        $idPro = $request->idPr;
        $url = $request->shopUrl;
        $cusId = $request->customerId;

        $arr_idProduct = [];
        $arr_urlShop = [];
        $arr_idCustomer = [];
        $pr = $product->getAllProduct();
        $cus = $customer->getIdCustomer();
        $sh = $shop->getIdShop();
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
                foreach ($arr_idCustomer as $cs) {
                    if($cs == $cusId){
                        foreach ($arr_idProduct as $p) {
                            if($p == $idPro){
                                echo "Success";
                            }
                        }
                    }else{
                        echo "Error Cus";
                    }
                }
            }else{
                echo "Error Shop";
            }
        }
    }

    public function deleteProduct(Request $request, Product $product, CustomerProduct $cuspr)
    {
        $idPro = $request->idPr;
        // dd($idPro);
        $arr_idProduct = [];
        $pr = $product->getAllProduct();
        foreach ($pr as $value1) {
            array_push($arr_idProduct,$value1->id_product);
        }

        $arr_idCP = [];
        $cp = $cuspr->getDataCP();
        foreach ($cp as $value2) {
            array_push($arr_idCP,$value2->product_id);
        }

        // dd($arr_idCP);

        foreach ($arr_idCP as $cusp) {
            if($cusp == $idPro){
                $delCp = $cuspr->deleteCusPro($cusp);
                if($delCp){
                    foreach ($arr_idProduct as $p) {
                        if($p == $idPro){
                            $del = $product->deleteProductWL($p);
                            if($del){
                                echo "Ok";
                            }else{
                                echo "fail";
                            }
                        }
                    }
                }else{
                    echo "fail";
                }
            }
        }

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
