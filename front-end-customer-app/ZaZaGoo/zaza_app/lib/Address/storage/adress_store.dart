import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:zaza_app/Address/models/save_address.dart';

class AddressStore extends ChangeNotifier {
  AddressStore._();
  static final AddressStore I = AddressStore._();

  static const String _prefsKey = 'saved_addresses';

  final List<SavedAddress> _items = [];

  List<SavedAddress> get items => List.unmodifiable(_items);

  bool get isEmpty => _items.isEmpty;
  bool get isNotEmpty => _items.isNotEmpty;

  SavedAddress? get selected {
    if (_items.isEmpty) return null;
    final d = _items.where((e) => e.isDefault).toList();
    return d.isNotEmpty ? d.first : _items.first;
  }

  Future<void> loadFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_prefsKey);

    if (raw == null || raw.isEmpty) return;

    final List decoded = jsonDecode(raw);
    final list = decoded
        .map((e) => SavedAddress.fromJson(Map<String, dynamic>.from(e)))
        .toList();

    _items
      ..clear()
      ..addAll(list);

    _ensureDefault();
    notifyListeners();
  }

  Future<void> saveToPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = jsonEncode(_items.map((e) => e.toJson()).toList());
    await prefs.setString(_prefsKey, raw);
  }

  Future<void> setAll(List<SavedAddress> list) async {
    _items
      ..clear()
      ..addAll(list);

    _ensureDefault();
    notifyListeners();
    await saveToPrefs();
  }

  Future<void> setDefault(SavedAddress picked) async {
    if (_items.isEmpty) return;

    for (var i = 0; i < _items.length; i++) {
      final a = _items[i];
      final same =
          a.label == picked.label && a.addressLine == picked.addressLine;
      _items[i] = a.copyWith(isDefault: same);
    }

    _ensureDefault();
    notifyListeners();
    await saveToPrefs();
  }

  Future<void> add(SavedAddress a) async {
    _items.add(a);
    _ensureDefault();
    notifyListeners();
    await saveToPrefs();
  }

  Future<void> updateAt(int index, SavedAddress updated) async {
    if (index < 0 || index >= _items.length) return;

    _items[index] = updated;

    if (updated.isDefault) {
      for (var i = 0; i < _items.length; i++) {
        if (i == index) continue;
        _items[i] = _items[i].copyWith(isDefault: false);
      }
    }

    _ensureDefault();
    notifyListeners();
    await saveToPrefs();
  }

  Future<void> removeAt(int index) async {
    if (index < 0 || index >= _items.length) return;

    final removedWasDefault = _items[index].isDefault;
    _items.removeAt(index);

    if (removedWasDefault) _ensureDefault();
    notifyListeners();
    await saveToPrefs();
  }

  Future<void> clear() async {
    _items.clear();
    notifyListeners();
    await saveToPrefs();
  }

  void _ensureDefault() {
    if (_items.isEmpty) return;

    if (_items.where((e) => e.isDefault).isEmpty) {
      _items[0] = _items[0].copyWith(isDefault: true);
      return;
    }

    final firstDefaultIndex = _items.indexWhere((e) => e.isDefault);
    for (var i = 0; i < _items.length; i++) {
      if (i == firstDefaultIndex) continue;
      if (_items[i].isDefault) {
        _items[i] = _items[i].copyWith(isDefault: false);
      }
    }
  }
}
