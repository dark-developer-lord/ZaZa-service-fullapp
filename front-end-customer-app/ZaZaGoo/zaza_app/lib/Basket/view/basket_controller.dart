import 'package:flutter/foundation.dart';
import 'package:zaza_app/Basket/models/basket_model.dart';

class BasketController extends ChangeNotifier {
  final Map<String, BasketLine> _byId = {}; // productId -> line

  List<BasketLine> get items => _byId.values.toList();

  int qtyOf(String id) => _byId[id]?.qty ?? 0;

  int get totalItems => _byId.values.fold<int>(0, (sum, it) => sum + it.qty);

  double get subtotal =>
      _byId.values.fold<double>(0, (sum, it) => sum + (it.price * it.qty));

  void addFirst({
    required String id,
    required String title,
    required double price,
    String? imageUrl,
  }) {
    _byId[id] = BasketLine(
      id: id,
      title: title,
      price: price,
      imageUrl: imageUrl,
      qty: 1,
    );
    notifyListeners();
  }

  void inc({
    required String id,
    required String title,
    required double price,
    String? imageUrl,
  }) {
    final it = _byId[id];
    if (it == null) {
      addFirst(id: id, title: title, price: price, imageUrl: imageUrl);
      return;
    }
    it.qty += 1;
    notifyListeners();
  }

  /// qty==1 -> remove (delete icon state)
  /// qty>=2 -> qty--
  void decOrRemove(String id) {
    final it = _byId[id];
    if (it == null) return;

    it.qty -= 1;
    if (it.qty <= 0) _byId.remove(id);
    notifyListeners();
  }

  void remove(String id) {
    _byId.remove(id);
    notifyListeners();
  }

  void clear() {
    _byId.clear();
    notifyListeners();
  }
}
