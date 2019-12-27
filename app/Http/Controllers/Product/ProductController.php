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
        $product = CustomerProduct::firstOrCreate(
            ['customer_id' => $customId, 'product_id' => $id]
        );
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
        $url = $request->shopUrl;
        $cusId = $request->customerId;

        // get shop id
        $shop = Shop::where('url', $url)->first();
        if(!$shop)
            return response()->json([
                'error' => true,
                'message' => 'Not found shop'
            ]);


        //check customer
        $customer = Customer::where('shop_id', $shop->id)->where('id_customer', $cusId)->first();
        if(!$customer)
            return response()->json([
                'error' => true,
                'message' => 'Not found customer'
            ]);

        //get product ids by shopid andcustomer id
        $product_ids = CustomerProduct::where('customer_id', $cusId)->whereIn('product_id', $arrPr)->pluck('product_id')->toArray();
            return response()->json([
                'success' => true,
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

        $cus_pro = CustomerProduct::where('customer_id',$cusId)->where('product_id',$idPro)->first();
        $cus_pro->delete();

        $data_product = CustomerProduct::where('product_id',$idPro)->get();
        $product = Product::where('id_product',$idPro)->first();
        if(!empty($data_product)){
            $product->delete();
        }

        $data_cus = CustomerProduct::where('customer_id',$cusId)->get();
        $customer = Customer::where('id_customer',$cusId)->first();
        if(!empty($data_cus)){
            $customer->delete();
        }

        return response()->json([
            'status' => true
        ]);
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
