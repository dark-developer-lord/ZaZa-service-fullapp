import 'package:zaza_driver_app/core/api_service.dart';
import 'package:zaza_driver_app/Order/models/order_model.dart';

/// --------------------------------------------------------
/// Сервис заказов — общается с бэкенд API.
/// Все методы бросают [ApiException] при ошибке сети/сервера.
/// --------------------------------------------------------
class OrderApiService {
  // GET /api/v1/delivery-man/latest-orders  → новые заказы
  static Future<List<OrderModel>> fetchNewOrders() async {
    final resp = await ApiService.get('/delivery-man/latest-orders');
    return _parseList(resp['orders'] ?? resp['data'] ?? []);
  }

  // GET /api/v1/delivery-man/current-orders  → активный заказ
  static Future<List<OrderModel>> fetchActiveOrders() async {
    final resp = await ApiService.get('/delivery-man/current-orders');
    return _parseList(resp['orders'] ?? resp['data'] ?? []);
  }

  // GET /api/v1/delivery-man/all-orders  → все (completed included)
  static Future<List<OrderModel>> fetchAllOrders() async {
    final resp = await ApiService.get('/delivery-man/all-orders');
    return _parseList(resp['orders'] ?? resp['data'] ?? []);
  }

  // GET /api/v1/delivery-man/order-delivery-history
  static Future<List<OrderModel>> fetchCompletedOrders() async {
    final resp = await ApiService.get('/delivery-man/order-delivery-history');
    return _parseList(resp['orders'] ?? resp['data'] ?? []);
  }

  // PUT /api/v1/delivery-man/accept-order  { order_id }
  static Future<void> acceptOrder(String orderId) async {
    await ApiService.put('/delivery-man/accept-order', {'order_id': orderId});
  }

  // PUT /api/v1/delivery-man/update-order-status  { order_id, status }
  // status: 'picked_up' | 'delivered'
  static Future<void> updateOrderStatus(String orderId, String status) async {
    await ApiService.put('/delivery-man/update-order-status', {
      'order_id': orderId,
      'status': status,
    });
  }

  // POST /api/v1/delivery-man/update-active-status  (toggle online/offline)
  static Future<void> toggleOnlineStatus() async {
    await ApiService.post('/delivery-man/update-active-status', {}, withToken: true);
  }

  // POST /api/v1/delivery-man/record-location-data
  static Future<void> updateLocation(double lat, double lng) async {
    await ApiService.post('/delivery-man/record-location-data', {
      'latitude': lat,
      'longitude': lng,
    }, withToken: true);
  }

  // ─── Маппинг данных сервера → OrderModel ──────────────
  static List<OrderModel> _parseList(dynamic raw) {
    if (raw == null) return [];
    final list = raw as List<dynamic>;
    return list.map((j) => _fromJson(j as Map<String, dynamic>)).toList();
  }

  static OrderModel _fromJson(Map<String, dynamic> j) {
    // Определяем статус
    final rawStatus = j['order_status']?.toString() ?? '';
    final status = switch (rawStatus) {
      'accepted'  => OrderStatus.accepted,
      'picked_up' => OrderStatus.pickedUp,
      'delivered' => OrderStatus.completed,
      _           => OrderStatus.newOrder,
    };

    // Адрес доставки (вложенные данные из order)
    final delivery = j['delivery_address'] as Map<String, dynamic>?;
    final restaurant = j['restaurant'] as Map<String, dynamic>?;

    return OrderModel(
      orderId:  j['id']?.toString() ?? '',
      customer: (j['customer']?['f_name'] ?? 'Клиент').toString(),
      pickup:   restaurant?['name']?.toString() ?? j['pickup_address']?.toString() ?? '-',
      pickupLat:  _toDouble(restaurant?['latitude']),
      pickupLng:  _toDouble(restaurant?['longitude']),
      dropoff:  delivery?['address']?.toString() ?? '-',
      dropoffLat: _toDouble(delivery?['latitude']),
      dropoffLng: _toDouble(delivery?['longitude']),
      km:       '${j['distance'] ?? '?'} km',
      type:     j['order_type']?.toString() ?? 'delivery',
      price:    '${j['delivery_charge'] ?? 0} с',
      status:   status,
    );
  }

  static double? _toDouble(dynamic v) {
    if (v == null) return null;
    return double.tryParse(v.toString());
  }
}
