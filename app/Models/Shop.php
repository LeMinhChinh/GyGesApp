<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Shop extends Model
{
    protected $table = 'shops';

    public function customers()
    {
        return $this->hasmany('App\Models\Customer');
    }

    public function customer_product()
    {
        return $this->hasmany('App\Models\Product');
    }

    public function getIdShop()
    {
        $data = DB::table('shops AS s')
                    ->select('s.*')
                    ->get();
        return $data;
    }
}
