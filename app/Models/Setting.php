<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Setting extends Model
{
    protected $table = 'setting';

    public function getAllDataSetting($id)
    {
        $data = DB::table('setting AS s')
                    ->select('s.*')
                    ->where('s.id_shop',$id)
                    ->first();
        return $data;
    }

    public function updateSetting($id, $data)
    {
        $data = DB::table('setting AS s')
                        ->where('s.id_shop',$id)
                        ->update($data);
        return $data;
    }
}
