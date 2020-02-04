<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::group([
    'prefix' => 'api',
    'namespace' => 'Customer',
    'middleware' => 'cors'
], function () {
    Route::apiResource('customer','CustomerController');
});

Route::group([
    'prefix' => 'api',
    'middleware' => 'cors',
    'namespace' => 'Product',
], function () {
    Route::apiResource('product','ProductController');
    Route::get('product_check','ProductController@check');
    Route::get('wl_delete','ProductController@deleteProduct');
    Route::get('removeWishlist','ProductController@removeWishlist');
});

Route::group([
    'prefix' => 'api',
    'namespace' => 'Shop',
    'middleware' => 'cors'
], function () {
    Route::get('getProducts','ShopController@getProducts');
    Route::post('filterProducts','ShopController@filterProducts');
    Route::post('loadPage','ShopController@loadPage');
    Route::get('getWishlist','ShopController@getWishlist');
    Route::post('sortCountProduct','ShopController@sortCountProduct');
    Route::post('filterajax','ShopController@filterajax');
    Route::get('testAPI','ShopController@testAPI');
    Route::get('getApiKey','ShopController@getTheme');
    Route::post('installTheme','ShopController@installTheme');
    // Route::get('installCssFile/{ids}~{url}~{api}~{password}','ShopController@installCssFile');
    // Route::get('installJsFile/{ids}~{url}~{api}~{password}','ShopController@installJsFile');
    Route::get('installCssFile/{ids}~{shopify}','ShopController@installCssFile');
    Route::get('installJsFile/{ids}~{shopify}','ShopController@installJsFile');
    Route::post('uninstallTheme','ShopController@uninstallTheme');
    Route::post('sortCount','ShopController@sortCount');
    Route::post('restApi/{data}~{url}~{api}~{password}','ShopController@restApi');
});

Route::group([
    'prefix' => 'api',
    'namespace' => 'Setting',
    'middleware' => 'cors'
], function () {
    Route::post('saveSettings','SettingController@saveSettings');
    Route::get('getSettings','SettingController@getSettings');
});


Route::view('admin/{path}', 'TodoApp')->where('path', '.*');
Route::view('wishlist/{path}', 'WishlistApp')->where('path', '.*');
