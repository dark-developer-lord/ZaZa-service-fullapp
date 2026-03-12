import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:zaza_driver_app/Wallet/models/tx_model.dart';

class WalletTxStore extends ChangeNotifier {
  WalletTxStore._();
  static final WalletTxStore I = WalletTxStore._();

  final List<TxModel> _items = [];

  List<TxModel> get items => List.unmodifiable(_items);

  void add(TxModel tx) {
    _items.insert(0, tx); // recent first
    notifyListeners();
  }

  /// ✅ call after order completed
  void addDeliveryFee({
    required String orderId,
    required double amount,
    required String currency, // "AED" or "c"
    DateTime? at,
  }) {
    final d = at ?? DateTime.now();
    final subtitle1 = _formatDateTime(d);

    add(
      TxModel(
        title: "Delivery fee",
        subtitle1: subtitle1,
        subtitle2: "Order #$orderId",
        amountText: "+${amount.toStringAsFixed(2)} $currency",
        amountColor: const Color(0xFF00A884),
        icon: Icons.south_west,
        iconBg: const Color(0xFFDFFAF3),
        iconColor: const Color(0xFF00A884),
      ),
    );
  }

  // ✅ simple formatter without intl
  String _formatDateTime(DateTime d) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    final m = months[d.month - 1];
    final day = d.day.toString().padLeft(2, '0');
    final year = d.year;
    final hh = ((d.hour % 12) == 0 ? 12 : (d.hour % 12)).toString().padLeft(
      2,
      '0',
    );
    final mm = d.minute.toString().padLeft(2, '0');
    final ampm = d.hour >= 12 ? "PM" : "AM";
    return "$m $day, $year   $hh:$mm $ampm";
  }
}
