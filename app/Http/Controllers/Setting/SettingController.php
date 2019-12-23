<?php

namespace App\Http\Controllers\Setting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\Shop;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    public function getSettings(Request $request,Setting $st,Shop $s)
    {
        $id_shop = $s->getCurrentShop();
        $dtSetting = $st->getAllDataSetting($id_shop->id);

        return \response()->json([
            'dtSetting' => $dtSetting
        ]);
    }

    public function saveSettings(Request $request,Setting $st)
    {
        $data = $request->data;
        $data = \json_encode($data);
        $id_shop =  $request->idShop;
        $dtSetting = $st->getAllDataSetting($id_shop);
        if($dtSetting) {
            $dtUpdate = [
                'setting' => $data
            ];
        $updateData = $st->updateSetting($id_shop, $dtUpdate);
        return \response()->json([
            'success' => true
        ]);
        } else{
            $setting = new Setting;
            $setting->id_shop = $id_shop;
            $setting->setting = $data;
            $setting->save();

            return response()->json([
                'success' => true
            ]);
        }
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
