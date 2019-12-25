<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Customer extends Model
{
    protected $table = 'customers';

    protected $fillable = ['id_customer','shop_id'];
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
        return $data;
    }
}
