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

    public function restApi($data, $url, $api, $password)
    {
        $str = '';
        $handle = array();
        $count = array();
        foreach ($data as $value) {
            $values = $value->id_product;
            $c = $value->count_id;
            $value = array_push($handle, $values);
            $cId = array_push($count, $c);
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
        foreach($products as $key => $product) {
            $countP = $count[$key];
            $product['count'] = $countP;
            $products[$key] = $product;
        }
    }

    public function loadPage(Request $request, Shop $shop)
    {
        // dd($request->all());
        $page = $request->page;
        $rangeValue = $request->rangeValue;

        $name = $request->name ? $request->name : null;
        $price = $request->price ? $request->price : null;
        $tagwith = $request->tagwith ? $request->tagwith : null;
        $queryValue = $request->queryValue ? $request->queryValue : null;

        $pageSort = $request->pageSort;

        $selected = $request->selected;

        $s = $shop->getCurrentShop();
        $idCus = $shop->getIdCustomerByIdShop($s->id);

        $api = env('APIKEY');
        $password = env('PASSWORD');

        // if($name != null && $price != null && $tagwith != null){
        //     $sortCount = $shop->filterDataProduct($s->id, $name, $price, $tagwith, $page);
        // }

        // if($rangeValue) {
        //     $sortCount = $shop->getCountProduct($s->id,$rangeValue[0],$rangeValue[1], $page);
        // }

        // if($queryValue){
        //     $sortCount = $shop->getQueryValue($s->id,$queryValue,$page);
        // }

        // if($pageSort){
        //     $sortCount = $shop->getDataSort($s->id,$pageSort,$page);
        // }

        // if($selected[0] != NULL){
        //     $sortCount = $shop->getDataCustomer($s->id, $selected[0], $page);
        // }

        $sortCount = $shop->getData($s->id, $name, $price, $tagwith, $rangeValue[0], $rangeValue[1], $queryValue, $pageSort, $selected[0], $page);

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
            if(isset($value->count_id)){
                $c = $value->count_id;
                $cId = array_push($count, $c);
            }

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
        if(count($count) > 0){
            foreach($products as $key => $product) {
                $countP = $count[$key];
                $product['count'] = $countP;
                $products[$key] = $product;
            }
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

    public function testAPI(Request $request, Shop $shop)
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

        $themeId = Shop::where('url', $s->url)->pluck('theme_id')->first();

        return response()->json([
            'theme' => $theme,
            'themeid' => $themeId
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
        if(!$ids || $ids == 0) return response()->json(['status' => 'Error']);

        // update Theme to database
        $update = Shop::where('url',$s->url)->update(['theme_id' => $ids]);


        // Include globo.formbuilder.scripts to theme
        $hasInsertInclude = false;

        try {
            $currentThemeLiquid = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'layout/theme.liquid'
                )
            ));
            if(isset($currentThemeLiquid['asset']['value']) && strpos( $currentThemeLiquid['asset']['value'], "{% include 'globo.formbuilder.scripts' %}") !== false){
                $hasInsertInclude = true;
            }
        } catch (\Throwable $th) {

        }

        if(!$hasInsertInclude){
            $newInserted = $currentThemeLiquid['asset']['value'];
            $newInserted = str_replace("{% include 'globo.theme.scripts' %}","{% include 'globo.theme.scripts' %}\n{% include 'globo.formbuilder.scripts' %}",$newInserted);
            try {
                $shopify->Theme($ids)->Asset->put(array(
                    "key" => "layout/theme.liquid",
                    "value" => $newInserted,
                ));
            } catch (\Throwable $th) {
            }
        }

        // create or update snippet/globo.formbuilder.scripts.liquid
        $isCustomizedScriptsFile = false;
        $script = view('front-script')->render();
        try {
            $currentFormScripts = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'snippets/globo.formbuilder.scripts.liquid'
                )
            ));
            if(isset($currentFormScripts['asset']['value']) && strpos($currentFormScripts['asset']['value'],'***CUSTOMIZED FILE***') !== false){
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

        $this->installJsFile($ids,$shopify);
        $this->installCssFile($ids,$shopify);

        return response()->json([
            'status' => 'success',
            'ids' => $ids
        ]);
    }

    public function installCssFile($ids,$shopify)
    {
        $cssSetting = Storage::disk('assets')->get('css/setting.css');

        // create or update asset/globo.formbuilder.css
        $isCustomizedCssFile = false;

        try {
            $currentFormCss = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.wishlist.css'
                )
            ));
            if(isset($currentFormCss['asset']['value']) && strpos($currentFormCss['asset']['value'],'***CUSTOMIZED FILE***') !== false){
                $isCustomizedCssFile = true;
            }
        } catch (\Throwable $th) {

        }

        if(!$isCustomizedCssFile){
            // Create or Update
            $shopify->Theme($ids)->Asset->put(array(
                "key" => "assets/globo.wishlist.css",
                "value" => $cssSetting
            ));
        }
    }

    public function installJsFile($ids,$shopify)
    {
        $jsWishlist = Storage::disk('assets')->get('js/wishlist.js');
        $jsPagination = Storage::disk('assets')->get('js/jquery.twbsPagination.min.js');

        // create or update asset/globo.formbuilder.js
        $isCustomizedJsFile = false;

        try {
            $currentFormJs = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.wishlist.js'
                )
            ));
            if(isset($currentFormJs['asset']['value']) && strpos($currentFormJs['asset']['value'],'***CUSTOMIZED FILE***') !== false){
                $isCustomizedJsFile = true;
            }
        } catch (\Throwable $th) {

        }

        if(!$isCustomizedJsFile){
            // Create or Update
            $shopify->Theme($ids)->Asset->put(array(
                "key" => "assets/globo.wishlist.js",
                "value" => $jsPagination."\r\n".$jsWishlist
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

        if(!$ids || $ids == 0) return response()->json(['status' => 'Error']);

        // update Theme to database
        $update = Shop::where('url',$s->url)->update(['theme_id' => 0]);

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
            $newInserted = str_replace("{% include 'globo.theme.scripts' %}\n{% include 'globo.formbuilder.scripts' %}","{% include 'globo.theme.scripts' %}",$newInserted);
            try {
                $shopify->Theme($ids)->Asset->put(array(
                    "key" => "layout/theme.liquid",
                    "value" => $newInserted,
                ));
            } catch (\Throwable $th) {
            }
        }

        // Delete scripts.liquid
        try {
            $currentFormScriptsFile = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'snippets/globo.formbuilder.scripts.liquid'
                )
            ));
            if(isset($currentFormScriptsFile['asset']['value']) && strpos($currentFormScriptsFile['asset']['value'],'***CUSTOMIZED FILE***') !== false){
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
                    "key" => 'assets/globo.wishlist.css'
                )
            ));
            if(isset($currentFormCssFile['asset']['value']) && strpos($currentFormCss['asset']['value'],'***CUSTOMIZED FILE***') !== false){
                $isCustomizedCssFile = true;
            }

        } catch (\Throwable $th) {

        }
        if(!$isCustomizedCssFile){
            $shopify->Theme($ids)->Asset->delete(array(
                "asset" => array(
                    "key" => 'assets/globo.wishlist.css'
                )
            ));
        }

        // Delete JsFile
        try {
            $currentFormJsFile = $shopify->Theme($ids)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.wishlist.js'
                )
            ));
            if(isset($currentFormJsFile['asset']['value']) && strpos($currentFormJsFile['asset']['value'],'***CUSTOMIZED FILE***') !== false){
                $isCustomizedCssFile = true;
            }

        } catch (\Throwable $th) {

        }
        if(!$isCustomizedCssFile){
            $shopify->Theme($ids)->Asset->delete(array(
                "asset" => array(
                    "key" => 'assets/globo.wishlist.js'
                )
            ));
        }

        return response()->json([
            "status" => "success",
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
