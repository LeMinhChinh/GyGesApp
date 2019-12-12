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
    'namespace' => 'Product',
    'middleware' => 'cors'
], function () {
    Route::apiResource('product','ProductController');
    Route::get('product_check','ProductController@check');
    Route::get('wl_delete','ProductController@deleteProduct');
});

Route::view('admin/{path}', 'TodoApp')->where('path', '.*');
