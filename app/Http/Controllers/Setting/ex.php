<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Storage;
use Log;

class ShopifyController extends Controller
{
    public function getThemes(Request $request)
    {
        $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $request->get('shop')->url, 'AccessToken' => $request->get('shop')->token ));
        return $shopify->Theme->get();
    }
    public function installTheme(Request $request,$themeId)
    {
        $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $request->get('shop')->url, 'AccessToken' => $request->get('shop')->token ));
        $shop =  $request->get('shop');
        if(!$themeId) return response()->json(['success' => 'false','msg' => config('translate.THEME_NOT_FOUND')]); // Theme not found

        // Install Dynamic Assets
        $this->installDynamicAsset($request,$themeId);

        // Insert scripts to theme.liquid
        $hasInsertInclude = false;
        try {
            $currentThemeLiquid = $shopify->Theme($themeId)->Asset->get(array(
                "asset" => array(
                    "key" => 'layout/theme.liquid'
                )
            ));
            if(strpos($currentThemeLiquid['asset']['value'],"{% include 'globo.formbuilder.scripts' %}")){
                $hasInsertInclude = true;
            }

        } catch (\Throwable $th) { }
        if(!$hasInsertInclude && $currentThemeLiquid){
            $newInserted = $currentThemeLiquid['asset']['value'];
            $newInserted = str_replace('{{ content_for_header }}',"{{ content_for_header }}\n{% include 'globo.formbuilder.scripts' %}",$newInserted);
            try {
                $shopify->Theme($themeId)->Asset->put(array(
                    "key" => "layout/theme.liquid",
                    "value" => $newInserted,
                ));
            } catch (\Throwable $th) {
            }
        }


        $shop->last_installed_theme_id = $themeId;
        $shop->save();
        // Install Static Assets
        // Disk assets is public
        $pluginCss = Storage::disk('assets')->get('css/plugin.css');
        $formCss = Storage::disk('assets')->get('css/form.min.css');

        $pluginJs = Storage::disk('assets')->get('js/plugin.js');
        $formJs = Storage::disk('assets')->get('js/form.js');
        $renderJs = Storage::disk('assets')->get('js/form.render.js');


        $isCustomizedCssFile = false;
        $isCustomizedJsFile = false;
        $isCustomizedInitJsFile = false;
        // Create or update CSS
        try {
            $currentFormCss = $shopify->Theme($themeId)->Asset->get(array(
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
            $shopify->Theme($themeId)->Asset->put(array(
                "key" => "assets/globo.formbuilder.css",
                "value" => $pluginCss."\r\n".$formCss,
            ));
        }


        // Create or update JS
        try {
            $currentFormJs = $shopify->Theme($themeId)->Asset->get(array(
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
            $shopify->Theme($themeId)->Asset->put(array(
                "key" => "assets/globo.formbuilder.js",
                "value" => $pluginJs."\r\n".$formJs."\r\n".$renderJs,
            ));
        }

        // Create or update Init file
        try {
            $currentFormInitJs = $shopify->Theme($themeId)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.init.js'
                )
            ));
            if(strpos($currentFormInitJs['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedInitJsFile = true;
            }
        } catch (\Throwable $th) {

        }
        if(!$isCustomizedInitJsFile){
            // Create or Update
            $formInitJs = $shopify->Theme($themeId)->Asset->put(array(
                "key" => "assets/globo.formbuilder.init.js",
                "value" => "var GFBInstalled = true;",
            ));
        }

        if($formInitJs){
            $formInitJs['public_url'] = explode('?', $formInitJs['public_url'])[0];
            // Script Tag
            // Delete script tag has ben registered.
            $scriptTags = $shopify->ScriptTag->get();
            foreach ($scriptTags as $key => $scriptTag) {
                $shopify->ScriptTag($scriptTag['id'])->delete();
            }
            // Register new script tag
            $shopify->ScriptTag->post(array(
                "event" => "onload",
                "src" => $formInitJs['public_url'],
            ));
        }


        return response()->json(['success' => 'true','msg' => config('translate.INSTALL_THEME_SUCCESS')]);
    }
    public function installDynamicAsset(Request $request,$themeId,$form = false)
    {
        if(!$themeId) return response()->json(['success' => 'false','msg' => config('translate.THEME_NOT_FOUND')]); // Theme not found
        $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $request->get('shop')->url, 'AccessToken' => $request->get('shop')->token ));
        $shop =  $request->get('shop');

        // Create or Update Form data
        if($form){
            $this->installFormData($shop,$themeId,$form);
        }else{
            foreach($shop->formsWithoutTrashed as $form){
                $this->installFormData($shop,$themeId,$form);
            }
        }

        $dynamicCSS = Storage::disk('assets')->get('template/dynamicCSS.liquid');
        $element = Storage::disk('assets')->get('template/element.liquid');
        $template = Storage::disk('assets')->get('template/template.liquid');
        $scriptJs = view('front.scripts-liquid', compact(['shop','dynamicCSS', 'element', 'template']))->render();

        $isCustomizedScriptsFile = false;
        // Create or update Scripts
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
            $shopify->Theme($themeId)->Asset->put(array(
                "key" => "snippets/globo.formbuilder.scripts.liquid",
                "value" => $scriptJs,
            ));
        }
        // Insert sections
        $forms = $shop->formsWithoutTrashed;
        if(count($forms)){
            $this->installSection($shop,$themeId,$forms);
        }


        return response()->json(['success' => 'true']);
    }
    public function installFormData($shop,$themeId,$form)
    {
        $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $shop->url, 'AccessToken' => $shop->token ));
        $formData = view('front.form-data-liquid', compact(['form']))->render();
            $isCustomizedDataFile = false;
            // Create or update Data
            try {
                $currentFormData = $shopify->Theme($themeId)->Asset->get(array(
                    "asset" => array(
                        "key" => 'assets/globo.formbuilder.data.'.$form->id.'.js'
                    )
                ));
                if(isset($currentFormData['asset']) && strpos($currentFormData['asset']['value'],'***CUSTOMIZED FILE***')){
                    $isCustomizedDataFile = true;
                }
            } catch (\Throwable $th) {}
            if(!$isCustomizedDataFile){
                // Create or Update
                $shopify->Theme($themeId)->Asset->put(array(
                    "key" => "assets/globo.formbuilder.data.".$form->id.".js",
                    "value" => $formData,
                ));
            }
    }
    public function uninstallFormData($shop,$themeId,$form)
    {
        $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $shop->url, 'AccessToken' => $shop->token ));
        $isCustomizedDataFile = false;
        try {
            $currentFormData = $shopify->Theme($themeId)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.data.'.$form->id.'.js'
                )
            ));
            if(strpos($currentFormData['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedDataFile = true;
            }

        } catch (\Throwable $th) {}
        if(!$isCustomizedDataFile){
            // Delete
            $shopify->Theme($themeId)->Asset->delete(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.data.'.$form->id.'.js'
                )
            ));
        }
    }
    public function installSection($shop,$themeId,$forms)
    {
        $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $shop->url, 'AccessToken' => $shop->token ));
        $section = view('front.form-section', compact(['forms']))->render();
        $isCustomizedSectionFile = false;
        // Create or update Section
        try {
            $currentFormScripts = $shopify->Theme($themeId)->Asset->get(array(
                "asset" => array(
                    "key" => 'sections/globo-formbuilder.liquid'
                )
            ));
            if(isset($currentFormScripts['asset']) && strpos($currentFormScripts['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedSectionFile = true;
            }
        } catch (\Throwable $th) {

        }

        if(!$isCustomizedSectionFile){
            // Create or Update
            $shopify->Theme($themeId)->Asset->put(array(
                "key" => "sections/globo-formbuilder.liquid",
                "value" => $section,
            ));
        }
    }
    public function installFloatingFormToTheme(Request $request,$themeId,$form)
    {
        if(!$themeId) return response()->json(['success' => 'false','msg' => config('translate.THEME_NOT_FOUND')]); // Theme not found
        $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $request->get('shop')->url, 'AccessToken' => $request->get('shop')->token ));

        // Insert floating form to theme.liquid
        $hasFormShortCodeInclude = false;
        try {
            $currentThemeLiquid = $shopify->Theme($themeId)->Asset->get(array(
                "asset" => array(
                    "key" => 'layout/theme.liquid'
                )
            ));
            if(strpos($currentThemeLiquid['asset']['value'],'{formbuilder:'.$form->id.'}') > -1 || strpos($currentThemeLiquid['asset']['value'],'<div class="globo-formbuilder" data-id='.$form->id.' ></div>') > -1 || strpos($currentThemeLiquid['asset']['value'],'<div class="globo-formbuilder add-by-option" data-id='.$form->id.' ></div>') > -1){
                $hasFormShortCodeInclude = true;
            }

        } catch (\Throwable $th) { }
        if(!$hasFormShortCodeInclude && isset($currentThemeLiquid)){
            $newInserted = $currentThemeLiquid['asset']['value'];
            $newInserted = str_replace('</body>',"<div class=\"globo-formbuilder add-by-option\" data-id=".$form->id." ></div>\n</body>",$newInserted);
            try {
                $shopify->Theme($themeId)->Asset->put(array(
                    "key" => "layout/theme.liquid",
                    "value" => $newInserted,
                ));
            } catch (\Throwable $th) {
            }
        }
    }
    public function uninstallFloatingFormToTheme(Request $request,$themeId,$form)
    {
        if(!$themeId) return response()->json(['success' => 'false','msg' => config('translate.THEME_NOT_FOUND')]); // Theme not found
        $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $request->get('shop')->url, 'AccessToken' => $request->get('shop')->token ));

        // Insert floating form to theme.liquid
        $hasFormShortCodeInclude = false;
        try {
            $currentThemeLiquid = $shopify->Theme($themeId)->Asset->get(array(
                "asset" => array(
                    "key" => 'layout/theme.liquid'
                )
            ));
            if(strpos($currentThemeLiquid['asset']['value'],'<div class="globo-formbuilder add-by-option" data-id='.$form->id.' ></div>') > -1){
                $hasFormShortCodeInclude = true;
            }

        } catch (\Throwable $th) { }

        if($hasFormShortCodeInclude && isset($currentThemeLiquid)){
            $newInserted = $currentThemeLiquid['asset']['value'];
            $newInserted = str_replace("<div class=\"globo-formbuilder add-by-option\" data-id=".$form->id." ></div>\n</body>",'</body>',$newInserted);
            try {
                $shopify->Theme($themeId)->Asset->put(array(
                    "key" => "layout/theme.liquid",
                    "value" => $newInserted,
                ));
            } catch (\Throwable $th) {
            }
        }
    }
    public function uninstallTheme(Request $request,$themeId)
    {
        $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $request->get('shop')->url, 'AccessToken' => $request->get('shop')->token ));
        $shop =  $request->get('shop');
        if(!$themeId) return response()->json(['success' => 'false','msg' => config('translate.THEME_NOT_FOUND')]); // Theme not found

        $isCustomizedCssFile = false;
        $isCustomizedJsFile = false;
        $isCustomizedInitJsFile = false;
        $isCustomizedSectionFile = false;
        // Create or update CSS
        try {
            $currentFormCss = $shopify->Theme($themeId)->Asset->get(array(
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
            // Delete
            $shopify->Theme($themeId)->Asset->delete(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.css'
                )
            ));
        }


        // Create or update JS
        try {
            $currentFormJs = $shopify->Theme($themeId)->Asset->get(array(
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
            // Delete
            $shopify->Theme($themeId)->Asset->delete(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.js'
                )
            ));
        }


        // Delete Scripts
        $isCustomizedScriptsFile = false;
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
            // Delete
            $shopify->Theme($themeId)->Asset->delete(array(
                "asset" => array(
                    "key" => 'snippets/globo.formbuilder.scripts.liquid'
                )
            ));
        }

        // Delete Init file
        try {
            $currentFormInitJs = $shopify->Theme($themeId)->Asset->get(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.init.js'
                )
            ));
            if(strpos($currentFormInitJs['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedInitJsFile = true;
            }
        } catch (\Throwable $th) {

        }
        if(!$isCustomizedInitJsFile){
            // Delete
            $formInitJs = $shopify->Theme($themeId)->Asset->delete(array(
                "asset" => array(
                    "key" => 'assets/globo.formbuilder.init.js'
                )
            ));
        }

        // Delete Sections
        try {
            $currentSection = $shopify->Theme($themeId)->Asset->get(array(
                "asset" => array(
                    "key" => 'sections/globo-formbuilder.liquid'
                )
            ));
            if(strpos($currentSection['asset']['value'],'***CUSTOMIZED FILE***')){
                $isCustomizedSectionFile = true;
            }
        } catch (\Throwable $th) {

        }
        if(!$isCustomizedSectionFile){
            // Delete
            $shopify->Theme($themeId)->Asset->delete(array(
                "asset" => array(
                    "key" => 'sections/globo-formbuilder.liquid'
                )
            ));
        }

        // Delete Form Data
        foreach($shop->formsWithoutTrashed as $form){
            $this->uninstallFormData($shop,$themeId,$form);
        }

        // Script Tag
        // Delete script tag has ben registered.
        $scriptTags = $shopify->ScriptTag->get();
        foreach ($scriptTags as $key => $scriptTag) {
            $shopify->ScriptTag($scriptTag['id'])->delete();
        }

        return response()->json(['success' => 'true','msg' => config('translate.UNINSTALL_THEME_SUCCESS')]);
    }
    public function addCustomer($shop,$submission,$formConfigs)
    {
        $isEnable = false;
        $sendEmailInvite = false;
        if(isset($formConfigs->integration) && isset($formConfigs->integration->shopify) && isset($formConfigs->integration->shopify->createAccount) && $formConfigs->integration->shopify->createAccount){
            $isEnable = $formConfigs->integration->shopify->createAccount;
            if(isset($formConfigs->integration->shopify->sendEmailInvite) && $formConfigs->integration->shopify->sendEmailInvite){
                $sendEmailInvite = true;
            }
        }
        if($isEnable){
            $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $shop->url, 'AccessToken' => $shop->token ));

            $data = [];
            $data['customer'] = [];
            if($sendEmailInvite){
                $data['customer']['send_email_invite'] = true;
            }
            foreach ($formConfigs->integration->shopify->integrationElements as $elementId => $shopifyCode) {
                if(!empty($shopifyCode)){
                    $nestedProp = explode(".", $shopifyCode);
                    if(count($nestedProp) > 1){
                        $data['customer'][$nestedProp[0]] = isset($data['customer'][$nestedProp[0]]) ? $data['customer'][$nestedProp[0]] : [];
                        $data['customer'][$nestedProp[0]][0] = isset($data['customer'][$nestedProp[0]][0]) ? $data['customer'][$nestedProp[0]][0] : new \stdClass();
                        $data['customer'][$nestedProp[0]][0]->{$nestedProp[1]} = collect($submission)->get($elementId);
                    }else{
                        $data['customer'][$shopifyCode] = collect($submission)->get($elementId);
                    }
                }
            }

            if(isset($data['customer']['email']) && $data['customer']['email'] != ''){
                $isExist = count($shopify->Customer->search("email:".$data['customer']['email']));
                if($isExist == 0){
                    try {
                        $shopify->Customer->post($data['customer']);
                    } catch (\Throwable $th) {
                        return $th->getMessage();
                    }
                }else{
                    return config('translate.CUSTOMER_ALREADY_EXIST');
                }
            }
        }
        return;
    }
    public function getHooks(Request $request)
    {
        $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $request->get('shop')->url, 'AccessToken' => $request->get('shop')->token ));
        return $shopify->Webhook->get();
    }
    public function registerHooks(Request $request)
    {
        $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $request->get('shop')->url, 'AccessToken' => $request->get('shop')->token ));
        $topics = [
            'app/uninstalled'
        ];
        foreach ($topics as $topic) {
            $isExist = $shopify->Webhook->get(array( "topic" => $topic ));
            if(count($isExist) == 0){
                $shopify->Webhook->post(array(
                    "topic" => $topic,
                    "address" => url('hook/'.$topic),
                    "format" => "json"
                ));
            }
        }
    }
    public function unregisterHooks(Request $request)
    {
        $shopify = new \PHPShopify\ShopifySDK(array( 'ShopUrl' => $request->get('shop')->url, 'AccessToken' => $request->get('shop')->token ));
        $hooks = $this->getHooks($request);

        foreach ($hooks as $hook) {
            $shopify->Webhook($hook['id'])->delete();
        }
    }
}
