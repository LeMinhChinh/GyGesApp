<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Customer extends Model
{
    protected $table = 'customers';

    public function shops()
    {
        return $this->belongsTo('App\Models\Shop');
    }

    public function customer_product()
    {
        return $this->hasmany('App\Models\Shop');
    }

    public function getIdCustomer()
    {
        $data = DB::table('customers AS c')
                    ->select('c.*')
                    ->get();
                    // dd($data);
        return $data;
    }
}
