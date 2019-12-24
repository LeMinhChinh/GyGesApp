<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class CustomerProduct extends Model
{
    protected $table = 'customer_product';

    public function customers()
    {
        return $this->belongsTo('App\Models\Customer');
    }

    public function products()
    {
        return $this->belongsTo('App\Models\Product');
    }

    public function getDataCP()
    {
        $data = DB::table('customer_product')
                    ->select('*')
                    ->get();
        return $data;
    }

    public function deleteCusPro($idCus,$idPr)
    {
        $del = DB::table('customer_product')
                    ->where('product_id',$idPr)
                    ->where('customer_id',$idCus)
                    ->delete();
        return $del;
    }
}
