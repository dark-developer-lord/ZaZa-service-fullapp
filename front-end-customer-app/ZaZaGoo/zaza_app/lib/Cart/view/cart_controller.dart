import 'package:flutter/material.dart';
import 'package:zaza_app/Cart/models/cart_models.dart';

class CartController extends ChangeNotifier {
  final Map<String, CartItem> _items = {};

  int qtyOf(String id) => _items[id]?.qty ?? 0;

  int get totalItems => _items.values.fold<int>(0, (sum, it) => sum + it.qty);

  void addFirst({required String id, required String title}) {
    if (_items.containsKey(id)) return;
    _items[id] = CartItem(id: id, title: title, qty: 1);
    notifyListeners();
  }

  void inc({required String id, required String title}) {
    final it = _items[id];
    if (it == null) {
      _items[id] = CartItem(id: id, title: title, qty: 1);
    } else {
      it.qty += 1;
    }
    notifyListeners();
  }

  /// qty==1 -> delete (remove), qty>=2 -> minus
  void decOrRemove(String id) {
    final it = _items[id];
    if (it == null) return;

    if (it.qty <= 1) {
      _items.remove(id);
    } else {
      it.qty -= 1;
    }
    notifyListeners();
  }

  void remove(String id) {
    if (_items.remove(id) != null) notifyListeners();
  }

  void clear() {
    if (_items.isEmpty) return;
    _items.clear();
    notifyListeners();
  }
}
