<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\CustomerProduct;
use App\Models\Product;
use Log;
use Storage;

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

    public function loadPage(Request $request, Shop $shop)
    {
        $page = $request->page;
        $rangeValue = $request->rangeValue;

        $name = $request->name ? $request->name : null;
        $price = $request->price ? $request->price : null;
        $tagwith = $request->tagwith ? $request->tagwith : null;
        $queryValue = $request->queryValue ? $request->queryValue : null;

        $s = $shop->getCurrentShop();
        $idCus = $shop->getIdCustomerByIdShop($s->id);

        $api = env('APIKEY');
        $password = env('PASSWORD');

        if($name != null && $price != null && $tagwith != null){
            $sortCount = $shop->filterDataProduct($s->id, $name, $price, $tagwith, $page);
        }

        if($rangeValue) {
            $sortCount = $shop->getCountProduct($s->id,$rangeValue[0],$rangeValue[1], $page);
        }

        if($queryValue){
            $sortCount = $shop->getQueryValue($s->id,$queryValue,$page);
        }

        if(!count($sortCount)){
            return response()->json([
                'status' => false
            ]);
        }

        $str = '';
        $handle = array();
        $count = array();
        foreach ($sortCount as $value) {
            $values = $value->id_product;
            $c = $value->count_id;
            $value = array_push($handle, $values);
            $cId = array_push($count, $c);
        }
        $str = implode(',',$handle);
        $config = array(
            'ShopUrl' => $s->url,
            'ApiKey' => $api,
            'Password' => $password,
        );
        $shopify = new \PHPShopify\ShopifySDK($config);

        $params = array(
            'handle' => $str,
            'fields' => 'handle,images,title,variants'
        );
        $products = $shopify->Product()->get($params);
        foreach($products as $key => $product) {
            $countP = $count[$key];
            $product['count'] = $countP;
            $products[$key] = $product;
        }

        return response()->json([
            'idCus' => $idCus,
            'count' => $sortCount,
            'product' => $products
        ]) ;
    }

    public function filterProducts(Request $request, Shop $shop)
    {
        $idCus = $request->idCus;
        $s = $shop->getCurrentShop();

        $api = env('APIKEY');
        $password = env('PASSWORD');

        if($idCus[0]){
            $filter = $shop->getDataFilter($s->id, $idCus);
        }else{
            $filter = $shop->getCountProduct($s->id);
        }

        if(!count($filter)){
            return response()->json([
                'status' => false
            ]);
        }

        $str = '';
        $handle = array();
        foreach ($filter as $value) {
            $values = $value->id_product;
            $value = array_push($handle, $values);
        }
        $str = implode(',',$handle);
        $config = array(
            'ShopUrl' => $s->url,
            'ApiKey' => $api,
            'Password' => $password,
        );
        $shopify = new \PHPShopify\ShopifySDK($config);

        $params = array(
            'handle' => $str,
            'fields' => 'handle,images,title,variants'
        );
        $products = $shopify->Product()->get($params);

        return response()->json([
            'filterProduct' => $filter,
            'product' => $products
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

        $api = env('APIKEY');
        $password = env('PASSWORD');

        if($data){
            $filter = $shop->filterDataProduct($s->id, $name, $price, $tagwith, $page);
        }

        if(!count($filter)){
            return response()->json([
                'status' => false
            ]);
        }

        $str = '';
        $handle = array();
        $count = array();
        foreach ($filter as $value) {
            $values = $value->id_product;
            $c = $value->count_id;
            $value = array_push($handle, $values);
            $cId = array_push($count, $c);
        }
        $str = implode(',',$handle);
        $config = array(
            'ShopUrl' => $s->url,
            'ApiKey' => $api,
            'Password' => $password,
        );
        $shopify = new \PHPShopify\ShopifySDK($config);

        $params = array(
            'handle' => $str,
            'fields' => 'handle,images,title,variants'
        );
        $products = $shopify->Product()->get($params);
        foreach($products as $key => $product) {
            $countP = $count[$key];
            $product['count'] = $countP;
            $products[$key] = $product;
        }

        return response()->json([
            'data' => $filter,
            'product' => $products
        ]);
    }

    public function restAPI(Request $request, Shop $shop)
    {
        $s = $shop->getCurrentShop();
        $api = env('APIKEY');
        $password = env('PASSWORD');

        $str = '';
        $datas = Product::where('shop_id',$s->id)->pluck('id_product')->toArray();
        $str = implode(',',$datas);

        $config = array(
            'ShopUrl' => $s->url,
            'ApiKey' => $api,
            'Password' => $password,
        );
        $shopify = new \PHPShopify\ShopifySDK($config);

        $params = array(
            'handle' => $str,
            'fields' => 'id,handle,images,title,variants'
        );
        $products = $shopify->Product()->get($params);

        return response()->json([
            'product' => $products
        ]);
    }

    public function getTheme(Request $request, Shop $shop)
    {
        $s = $shop->getCurrentShop();
        $api = env('APIKEY');
        $password = env('PASSWORD');

        $config = array(
            'ShopUrl' => $s->url,
            'ApiKey' => $api,
            'Password' => $password,
        );
        $shopify = new \PHPShopify\ShopifySDK($config);

        $theme = $shopify->Theme()->get();

        return response()->json([
            'theme' => $theme,
        ]);
    }

    public function installTheme(Request $request, Shop $shop)
    {
        $ids = $request->idTheme;
        $s = $shop->getCurrentShop();
        $api = env('APIKEY');
        $password = env('PASSWORD');

        // connect shopify
        $config = array(
            'ShopUrl' => $s->url,
            'ApiKey' => $api,
            'Password' => $password,
        );
        $shopify = new \PHPShopify\ShopifySDK($config);

        // check Theme
        if(!$ids) return response()->json(['success' => 'fail']);
        if(!\is_numeric($ids)) return response()->json(['success' => 'Theme not found']);

        // create or update snippet/globo.formbuilder.scripts.liquid
        $isCustomizedScriptsFile = false;
        $script = view('front-script')->render();

        try {
            $currentFormScripts = $shopify->Theme($themeId)->Asset->get(array(
                "asset" => array(
                    "key" => 'snippets/globo.formbuilder.scripts.liquid'
                )
            ));
            if(strpos($currentFormScripts['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedScriptsFile = true;
            }
        } catch (\Throwable $th) {

        }
        if(!$isCustomizedScriptsFile){
            // Create or Update
            $shopify->Theme($ids)->Asset->put(array(
                "key" => "snippets/globo.formbuilder.scripts.liquid",
                "value" => $script,
            ));
        }

        // Include globo.formbuilder.scripts to theme
        $hasInsertInclude = false;

        $currentThemeLiquid = $shopify->Theme($ids)->Asset->get(array(
            "asset" => array(
                "key" => 'layout/theme.liquid'
            )
        ));

        if(\strpos($currentThemeLiquid['asset']['value'],"{% include 'globo.formbuilder.scripts' %}")){
            $hasInsertInclude = true;
        }

        if(!$hasInsertInclude && $currentThemeLiquid){
            $newInserted = $currentThemeLiquid['asset']['value'];
            $newInserted = str_replace('{{ content_for_header }}',"{{ content_for_header }}\n{% include 'globo.formbuilder.scripts' %}",$newInserted);
            try {
                $shopify->Theme($ids)->Asset->put(array(
                    "key" => "layout/theme.liquid",
                    "value" => $newInserted,
                ));
            } catch (\Throwable $th) {
            }
        }

        $this->installJsFile($ids,$s->url,$api,$password);
        $this->installCssFile($ids,$s->url,$api,$password);

        return response()->json([
            'success' => 'success',
            'ids' => $ids
        ]);
    }

    public function installCssFile($ids,$url,$api,$password)
    {
        // connect shopify
        $config = array(
            'ShopUrl' => $url,
            'ApiKey' => $api,
            'Password' => $password,
        );
        $shopify = new \PHPShopify\ShopifySDK($config);

        $cssStyle = Storage::disk('assets')->get('css/style.css');
        $cssRespons320 = Storage::disk('assets')->get('css/respons-320.css');
        $cssRespons375 = Storage::disk('assets')->get('css/respons-375.css');
        $cssRespons768 = Storage::disk('assets')->get('css/respons-768.css');
        $cssRespons1024 = Storage::disk('assets')->get('css/respons-1024.css');
        $cssRespons1920 = Storage::disk('assets')->get('css/respons-1920.css');
        $cssSetting = Storage::disk('assets')->get('css/setting.css');
        $cssBootstrap = Storage::disk('assets')->get('css/bootstrap.min.css');
        $cssFont = Storage::disk('assets')->get('css/fontawesome.min.css');

        // create or update asset/globo.formbuilder.css
        $isCustomizedCssFile = false;

        try {
            $currentFormCss = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.css'
                )
            ));
            if(strpos($currentFormCss['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedCssFile = true;
            }
        } catch (\Throwable $th) {

        }

        if(!$isCustomizedCssFile){
            // Create or Update
            $shopify->Theme($ids)->Asset->put(array(
                "key" => "assets/globo.formbuilder.css",
                "value" => $cssStyle."\r\n".$cssSetting."\r\n".$cssRespons320."\r\n".$cssRespons375."\r\n".$cssRespons768."\r\n".$cssRespons1024."\r\n".$cssRespons1920
            ));
        }

        // create or update asset/globo.formbuilder.lib.css
        $isCustomizedCssLib = false;

        try {
            $currentFormCssLib = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.lib.css'
                )
            ));
            if(strpos($currentFormCssLib['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedCssLib = true;
            }
        } catch (\Throwable $th) {

        }

        if(!$isCustomizedCssLib){
            // Create or Update
            $shopify->Theme($ids)->Asset->put(array(
                "key" => "assets/globo.formbuilder.lib.css",
                "value" => $cssBootstrap."\r\n".$cssFont
            ));
        }
    }

    public function installJsFile($ids,$url,$api,$password)
    {
         // connect shopify
         $config = array(
            'ShopUrl' => $url,
            'ApiKey' => $api,
            'Password' => $password,
        );
        $shopify = new \PHPShopify\ShopifySDK($config);

        $jsResponsive = Storage::disk('assets')->get('js/reponsive.js');
        $jsWishlist = Storage::disk('assets')->get('js/wishlist.js');
        $jsPagination = Storage::disk('assets')->get('js/jquery.twbsPagination.min.js');
        $jsBootstrap = Storage::disk('assets')->get('js/bootstrap.min.js');
        $jsJquery = Storage::disk('assets')->get('js/jquery-3.4.1.min.js');

        // create or update asset/globo.formbuilder.js
        $isCustomizedJsFile = false;

        try {
            $currentFormJs = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.js'
                )
            ));
            if(strpos($currentFormJs['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedJsFile = true;
            }
        } catch (\Throwable $th) {

        }

        if(!$isCustomizedJsFile){
            // Create or Update
            $shopify->Theme($ids)->Asset->put(array(
                "key" => "assets/globo.formbuilder.js",
                "value" => $jsResponsive."\r\n".$jsWishlist
            ));
        }

        // create or update asset/globo.formbuilder.pagination.js
        $isCustomizedJsPagination = false;

        try {
            $currentFormJsPagination = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.pagination.js'
                )
            ));
            if(strpos($currentFormJsPagination['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedJsPagination = true;
            }
        } catch (\Throwable $th) {

        }

        if(!$isCustomizedJsPagination){
            // Create or Update
            $shopify->Theme($ids)->Asset->put(array(
                "key" => "assets/globo.formbuilder.pagination.js",
                "value" => $jsPagination
            ));
        }

        // create or update asset/globo.formbuilder.lib.js
        $isCustomizedJsLib = false;

        try {
            $currentFormJsLib = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.lib.js'
                )
            ));
            if(strpos($currentFormJsLib['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedJsLib = true;
            }
        } catch (\Throwable $th) {

        }

        if(!$isCustomizedJsLib){
            // Create or Update
            $shopify->Theme($ids)->Asset->put(array(
                "key" => "assets/globo.formbuilder.lib.js",
                "value" => $jsJquery."\r\n".$jsBootstrap
            ));
        }
    }

    public function uninstallTheme(Request $request, Shop $shop)
    {
        $ids = $request->idTheme;
        $s = $shop->getCurrentShop();
        $api = env('APIKEY');
        $password = env('PASSWORD');

        // connect shopify
        $config = array(
            'ShopUrl' => $s->url,
            'ApiKey' => $api,
            'Password' => $password,
        );
        $shopify = new \PHPShopify\ShopifySDK($config);

        if(!$ids) return response()->json(['success' => 'fail']);
        if(!\is_numeric($ids)) return response()->json(['success' => 'Theme not found']);

        $isCustomizedScriptsFile = false;

        $isCustomizedCssFile = false;
        $isCustomizedCssLib = false;

        $isCustomizedJsFile = false;
        $isCustomizedJsLib = false;
        $isCustomizedJsPagination = false;

        // Delete script in theme.liquid
        $currentThemeLiquid = $shopify->Theme($ids)->Asset->get(array(
            "asset" => array(
                "key" => 'layout/theme.liquid'
            )
        ));
        if($currentThemeLiquid){
            $newInserted = $currentThemeLiquid['asset']['value'];
            $newInserted = str_replace("{{ content_for_header }}\n{% include 'globo.formbuilder.scripts' %}",'{{ content_for_header }}',$newInserted);
            try {
                $shopify->Theme($ids)->Asset->put(array(
                    "key" => "layout/theme.liquid",
                    "value" => $newInserted,
                ));
            } catch (\Throwable $th) {
            }
        }

        // Delete CssFile
        try {
            $currentFormScriptsFile = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'snippets/globo.formbuilder.scripts.liquid'
                )
            ));
            if(strpos($currentFormScriptsFile['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedScriptsFile = true;
            }

        } catch (\Throwable $th) {

        }
        if(!$isCustomizedScriptsFile){
            $shopify->Theme($ids)->Asset->delete(array(
                "asset" => array(
                    "key" => 'snippets/globo.formbuilder.scripts.liquid'
                )
            ));
        }

        // Delete CssFile
        try {
            $currentFormCssFile = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.css'
                )
            ));
            if(strpos($currentFormCss['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedCssFile = true;
            }

        } catch (\Throwable $th) {

        }
        if(!$isCustomizedCssFile){
            $shopify->Theme($ids)->Asset->delete(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.css'
                )
            ));
        }

        // Delete CssFile.Lib
        try {
            $currentFormCssLib = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.lib.css'
                )
            ));
            if(strpos($currentFormCss['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedCssLib = true;
            }

        } catch (\Throwable $th) {

        }
        if(!$isCustomizedCssLib){
            $shopify->Theme($ids)->Asset->delete(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.lib.css'
                )
            ));
        }

        // Delete JsFile
        try {
            $currentFormJsFile = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.js'
                )
            ));
            if(strpos($currentFormJsFile['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedCssFile = true;
            }

        } catch (\Throwable $th) {

        }
        if(!$isCustomizedCssFile){
            $shopify->Theme($ids)->Asset->delete(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.js'
                )
            ));
        }

        // Delete JsFile.Lib
        try {
            $currentFormJsLib = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.lib.js'
                )
            ));
            if(strpos($currentFormJsLib['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedJsLib = true;
            }

        } catch (\Throwable $th) {

        }
        if(!$isCustomizedJsLib){
            $shopify->Theme($ids)->Asset->delete(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.lib.js'
                )
            ));
        }

        // Delete JsFile.Pagination
        try {
            $currentFormJsPagination = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.pagination.js'
                )
            ));
            if(strpos($currentFormJsPagination['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedJsPagination = true;
            }

        } catch (\Throwable $th) {

        }
        if(!$isCustomizedJsPagination){
            $shopify->Theme($ids)->Asset->delete(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.pagination.js'
                )
            ));
        }

        return response()->json([
            "success" => "success",
            "ids" => $ids
        ]);
    }

    public function getWishlist(Request $request, Shop $shop)
    {
        $url = $request->shopUrl;
        $idCus = $request->customerId;
        $page = $request->page;

        $wishlist = $shop->getDataWishlist($url, $idCus, $page);
        $setting = $shop->getSetting($url);
        $api = env('APIKEY');
        $password = env('PASSWORD');

        if(!count($wishlist))
            return response()->json([
                'status' => false
            ]);

        $str = '';
        $handle = array();
        foreach ($wishlist as $value) {
            $values = $value->id_product;
            $value = array_push($handle, $values);
        }
        $str = implode(',',$handle);
        $config = array(
            'ShopUrl' => $url,
            'ApiKey' => $api,
            'Password' => $password,
        );
        $shopify = new \PHPShopify\ShopifySDK($config);

        $params = array(
            'handle' => $str,
            'fields' => 'handle,images,title,variants'
        );

        $products = $shopify->Product()->get($params);

        return response()->json([
            'status' => true,
            'wishlist' => $wishlist,
            'setting' => $setting,
            'dtProduct' => $products,
            // 'handle' => $handle
        ]);
    }
}
