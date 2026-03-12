import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:zaza_driver_app/Order/models/order_model.dart';
import 'package:zaza_driver_app/Order/services/order_api_service.dart';

class OrdersStore extends ChangeNotifier {
  final List<OrderModel> newOrders = [];
  final List<OrderModel> activeOrders = [];
  final List<OrderModel> completedOrders = [];

  OrdersStore();

  bool _isOnline = false;
  bool get isOnline => _isOnline;

  // ✅ pull-to-refresh state
  bool _isRefreshing = false;
  bool get isRefreshing => _isRefreshing;

  void setOnline(bool v) {
    if (_isOnline == v) return;
    _isOnline = v;
    notifyListeners();
  }

  /// OPTIONAL: seed demo
  OrdersStore.seed(List<OrderModel> demo) {
    seed(demo);
  }

  OrderModel? get activeOrder =>
      activeOrders.isEmpty ? null : activeOrders.first;

  int get newCount => newOrders.length;
  int get activeCount => activeOrders.length;
  int get completedCount => completedOrders.length;

  bool get hasActive => activeOrders.isNotEmpty;
  bool canAcceptNewOrder() => activeOrders.isEmpty;

  void seed(List<OrderModel> demo) {
    newOrders
      ..clear()
      ..addAll(
        demo.map((e) => e.copyWith(status: OrderStatus.newOrder, badge: "New")),
      );

    activeOrders.clear();
    completedOrders.clear();

    notifyListeners();
  }

  /// ✅ Pull-to-refresh — загружает данные с сервера
  Future<void> refreshFromServer() async {
    if (_isRefreshing) return;

    _isRefreshing = true;
    notifyListeners();

    try {
      // ✅ Реальные API вызовы
      final fetchedNew       = await OrderApiService.fetchNewOrders();
      final fetchedActive    = await OrderApiService.fetchActiveOrders();
      final fetchedCompleted = await OrderApiService.fetchCompletedOrders();

      newOrders
        ..clear()
        ..addAll(fetchedNew);

      activeOrders
        ..clear()
        ..addAll(fetchedActive);

      completedOrders
        ..clear()
        ..addAll(fetchedCompleted);

      notifyListeners();
    } catch (e) {
      // При ошибке сети — оставляем текущие данные, не сбрасываем
      debugPrint('[OrdersStore] refreshFromServer error: $e');
    } finally {
      _isRefreshing = false;
      notifyListeners();
    }
  }

  String _badgeForStatus(OrderStatus s) {
    switch (s) {
      case OrderStatus.newOrder:
        return "New";
      case OrderStatus.accepted:
        return "Accepted";
      case OrderStatus.pickedUp:
        return "Picked Up";
      case OrderStatus.completed:
        return "Completed";
    }
  }

  /// ✅ Accept: new -> accepted (active)
  /// Policy: only 1 active order
  /// returns true if accepted, false if blocked
  bool accept(OrderModel o) {
    // ❌ already has another active order (block)
    if (activeOrders.isNotEmpty) return false;

    // already active same? (safe)
    if (activeOrders.any((x) => x.orderId == o.orderId)) return true;

    // remove from new
    newOrders.removeWhere((x) => x.orderId == o.orderId);

    // add as active
    activeOrders.add(
      o.copyWith(status: OrderStatus.accepted, badge: "Accepted"),
    );

    notifyListeners();

    // ✅ Вызываем API в фоне (optimistic update)
    OrderApiService.acceptOrder(o.orderId).catchError(
      (e) => debugPrint('[OrdersStore] acceptOrder API error: $e'),
    );

    return true;
  }

  /// ✅ Pickup: accepted -> pickedUp
  bool pickup(OrderModel o) {
    final idx = activeOrders.indexWhere((x) => x.orderId == o.orderId);
    if (idx == -1) return false;

    final current = activeOrders[idx];
    if (current.status != OrderStatus.accepted) return false;

    activeOrders[idx] = current.copyWith(
      status: OrderStatus.pickedUp,
      badge: "Picked Up",
    );

    notifyListeners();

    // ✅ Вызываем API в фоне
    OrderApiService.updateOrderStatus(o.orderId, 'picked_up').catchError(
      (e) => debugPrint('[OrdersStore] pickup API error: $e'),
    );

    return true;
  }

  /// ✅ Complete: pickedUp -> completed
  bool complete(OrderModel o) {
    final idx = activeOrders.indexWhere((x) => x.orderId == o.orderId);
    if (idx == -1) return false;

    final current = activeOrders[idx];
    if (current.status != OrderStatus.pickedUp) return false;

    final item = activeOrders.removeAt(idx);

    completedOrders.add(
      item.copyWith(status: OrderStatus.completed, badge: "Completed"),
    );

    notifyListeners();

    // ✅ Вызываем API в фоне
    OrderApiService.updateOrderStatus(o.orderId, 'delivered').catchError(
      (e) => debugPrint('[OrdersStore] complete API error: $e'),
    );

    return true;
  }

  /// ✅ Reject: remove from new
  void reject(OrderModel o) {
    newOrders.removeWhere((x) => x.orderId == o.orderId);
    notifyListeners();
  }

  /// ✅ Cancel active (accepted/pickedUp)
  /// backToNew=true => returns to newOrders
  void cancelActive({bool backToNew = true}) {
    if (activeOrders.isEmpty) return;

    final item = activeOrders.removeAt(0);

    if (backToNew) {
      newOrders.insert(
        0,
        item.copyWith(status: OrderStatus.newOrder, badge: "New"),
      );
    }

    notifyListeners();
  }

  /// ✅ Helpers
  bool isAccepted(OrderModel o) => activeOrders.any(
    (x) => x.orderId == o.orderId && x.status == OrderStatus.accepted,
  );

  bool isPickedUp(OrderModel o) => activeOrders.any(
    (x) => x.orderId == o.orderId && x.status == OrderStatus.pickedUp,
  );
}
