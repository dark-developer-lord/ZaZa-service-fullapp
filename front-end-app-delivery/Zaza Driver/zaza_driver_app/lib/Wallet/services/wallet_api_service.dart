import 'package:zaza_driver_app/core/api_service.dart';

/// --------------------------------------------------------
/// Кошелёк курьера — баланс + транзакции + вывод средств
/// --------------------------------------------------------
class WalletApiService {
  // GET /api/v1/delivery-man/profile  (поля balance, cash_in_hands)
  static Future<WalletSummary> fetchSummary() async {
    final resp = await ApiService.get('/delivery-man/profile');
    return WalletSummary(
      balance:      _toDouble(resp['balance']),
      cashInHands:  _toDouble(resp['cash_in_hands']),
      todayEarning: _toDouble(resp['todays_earning']),
      weekEarning:  _toDouble(resp['this_week_earning']),
      monthEarning: _toDouble(resp['this_month_earning']),
      todayTrips:   (resp['todays_order_count'] ?? 0) as int,
      weekTrips:    (resp['this_week_order_count'] ?? 0) as int,
    );
  }

  // GET /api/v1/delivery-man/order-delivery-history  (история заказов = история транзакций)
  static Future<List<WalletTransaction>> fetchTransactions() async {
    final resp = await ApiService.get('/delivery-man/order-delivery-history');
    final list = resp['orders'] ?? resp['data'] ?? [];
    return (list as List).map((j) {
      final m = j as Map<String, dynamic>;
      return WalletTransaction(
        id:        m['id']?.toString() ?? '',
        amount:    _toDouble(m['original_delivery_charge']),
        type:      'earning',
        label:     'Доставка #${m['id']}',
        createdAt: m['updated_at']?.toString() ?? '',
      );
    }).toList();
  }

  // POST /api/v1/vendor/request-withdraw (через vendor-маршрут; если нужен DM-маршрут — добавить)
  // TODO: уточнить маршрут вывода для DM на бэкенде
  static Future<void> requestWithdraw(double amount) async {
    await ApiService.post('/delivery-man/request-withdraw', {
      'amount': amount,
    }, withToken: true);
  }

  static double _toDouble(dynamic v) {
    if (v == null) return 0.0;
    return double.tryParse(v.toString()) ?? 0.0;
  }
}

class WalletSummary {
  final double balance;
  final double cashInHands;
  final double todayEarning;
  final double weekEarning;
  final double monthEarning;
  final int todayTrips;
  final int weekTrips;

  const WalletSummary({
    required this.balance,
    required this.cashInHands,
    required this.todayEarning,
    required this.weekEarning,
    required this.monthEarning,
    required this.todayTrips,
    required this.weekTrips,
  });
}

class WalletTransaction {
  final String id;
  final double amount;
  final String type;   // 'earning' | 'withdrawal'
  final String label;
  final String createdAt;

  const WalletTransaction({
    required this.id,
    required this.amount,
    required this.type,
    required this.label,
    required this.createdAt,
  });
}
