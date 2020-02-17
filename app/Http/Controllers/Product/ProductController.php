<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illiminate\Http\Response;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Shop;
use App\Models\CustomerProduct;
use Illuminate\Support\Facades\Validator;
use Log;
use Illuminate\Support\Facades\Session;
use Cookie;

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
    public function store(Request $request)
    {
        $id = $request->idPr;
        $name = $request->titlePr;
        $price = $request->pricePr;
        $img = $request->imgPr;
        $shopUrl = $request->shopUrl;
        $customId = $request->customerId;

        //check shop
        $shop = Shop::where('url', $shopUrl)->first();
        if(!$shop)
            return response()->json([
                'error' => true,
                'message' => 'Not found shop'
            ]);

        if(!$customId){
            return response()->json([
                'status' => 'error',
                'message' => 'Customer not found'
            ]);
        }

        // first or create customer
        $customer = Customer::firstOrCreate(
            ['id_customer' => $customId],
            ['shop_id' => $shop->id]
        );

        //first or create product
        $product = Product::firstOrCreate(
            ['id_product' => $id],
            ['shop_id' => $shop->id, 'name' => $name, 'price' => $price, 'image' => $img]
        );

        //first or create customer product
        $products = CustomerProduct::firstOrCreate(
            ['customer_id' => $customId, 'product_id' => $id]
        );

        return response()->json([
            'status' => 'success'
        ]);
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
    public function check(Request $request)
    {
        $arrPr = $request->arr_id;
        $arr_info = $request->arr_info;
        $arr_handle = $request->arr_handle;
        $url = $request->shopUrl;
        $cusId = $request->customerId;

        // get shop id
        $shop = Shop::where('url', $url)->first();
        if(!$shop)
            return response()->json([
                'error' => true,
                'message' => 'Shop not found'
            ]);

        // check customer_request
        if(!$cusId){
            if(empty($arr_handle)){
                return response()->json([
                    "status" => "Cookie is not exits"
                ]);
            }else{
                return response()->json([
                    "status" => "Set cookie success",
                    "ids_cookie" => $arr_handle
                ]);
            }
        }

        //check customer_db
        $customer = Customer::where('shop_id', $shop->id)->where('id_customer', $cusId)->first();
        if(!$customer){
            // first or create customer
            Customer::firstOrCreate(
                ['id_customer' => $cusId],
                ['shop_id' => $shop->id]
            );
        }

        if(!empty($arr_info)){
            //first or create product
            foreach ($arr_info as $key => $value) {
                Product::firstOrCreate(
                    ['id_product' => $value[0]],
                    ['shop_id' => $shop->id, 'name' => $value[1], 'price' => $value[2], 'image' => $value[3]]
                );

                //first or create customer product
                CustomerProduct::firstOrCreate(
                    ['customer_id' => $cusId, 'product_id' => $value[0]]
                );
            }
        }

        //get product ids by shopid andcustomer id
        $product_ids = CustomerProduct::where('customer_id', $cusId)->whereIn('product_id', $arrPr)->pluck('product_id')->toArray();
            return response()->json([
                'status' => "Success",
                'ids' => $product_ids
            ]);

    }

    public function deleteProduct(Request $request)
    {
        $idPro = $request->idPr;
        $cusId = $request->idCus;
        $shopUrl = $request->idShop;

        //check shop
        $shop = Shop::where('url', $shopUrl)->first();
        if(!$shop)
            return response()->json([
                'error' => true,
                'message' => 'Not found shop'
            ]);

        //check customer
        $customer = Customer::where('id_customer',$cusId)->first();
        if(!$customer){
            return response()->json([
                'error' => true,
                'message' => 'Not found customer'
            ]);
        }

        $cus_pro = CustomerProduct::where('customer_id',$cusId)->where('product_id',$idPro)->delete();

        $data_product = CustomerProduct::where('product_id',$idPro)->get();
        if(isset($data_product) && count($data_product) == 0){
            $product = Product::where('id_product',$idPro)->first();
            if($product)
                $product->delete();
        }

        $data_cus = CustomerProduct::where('customer_id',$cusId)->get();
        if(isset($data_cus) && count($data_cus) == 0){
            $customer = Customer::where('id_customer',$cusId)->first();
            if($customer)
                $customer->delete();
        }

        return response()->json([
            'status' => 'success',
            'idPr' => $idPro
        ]);
    }

    public function addCookieProduct(Request $request)
    {
        $url = $request->shopUrl;
        $idCus = $request->customerId;
        $data = $request->data;
        dd($data);
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
