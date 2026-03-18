<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\PartnerRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Обрабатывает заявки от ресторанов-партнёров и B2B-клиентов
 * с лендинга zazaTJ (React).
 *
 * POST /api/v1/partner-request/restaurant
 * POST /api/v1/partner-request/b2b
 */
class PartnerRequestController extends Controller
{
    // ---------------------------------------------------------------
    // POST /api/v1/partner-request/restaurant
    // Форма «Подключить ресторан» (страница /resDeliver на сайте)
    // ---------------------------------------------------------------
    public function storeRestaurant(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'merchant_name' => 'required|string|max:200',
            'contact_name'  => 'nullable|string|max:200',
            'phone'         => 'required|string|max:30',
            'email'         => 'nullable|email|max:200',
            'city'          => 'nullable|string|max:100',
            'address'       => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        $partner = PartnerRequest::create([
            'type'          => 'restaurant',
            'merchant_name' => $request->merchant_name,
            'contact_name'  => $request->contact_name,
            'phone'         => $request->phone,
            'email'         => $request->email,
            'city'          => $request->city,
            'address'       => $request->address,
            'status'        => 'new',
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Ваша заявка принята! Мы свяжемся с вами в ближайшее время.',
            'id'      => $partner->id,
        ], 201);
    }

    // ---------------------------------------------------------------
    // POST /api/v1/partner-request/b2b
    // Форма «B2B доставка» (страница /b2bdeliver на сайте)
    // ---------------------------------------------------------------
    public function storeB2B(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'company_name'  => 'required|string|max:200',
            'contact_name'  => 'required|string|max:200',
            'phone'         => 'required|string|max:30',
            'email'         => 'required|email|max:200',
            'city'          => 'nullable|string|max:100',
            'description'   => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        $partner = PartnerRequest::create([
            'type'          => 'b2b',
            'merchant_name' => $request->company_name, // нормализуем в одно поле
            'company_name'  => $request->company_name,
            'contact_name'  => $request->contact_name,
            'phone'         => $request->phone,
            'email'         => $request->email,
            'city'          => $request->city,
            'description'   => $request->description,
            'status'        => 'new',
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Спасибо! Наш менеджер свяжется с вами в течение 24 часов.',
            'id'      => $partner->id,
        ], 201);
    }
}
