import 'package:flutter/material.dart';

class AddressWarningController extends ChangeNotifier {
  static final AddressWarningController I = AddressWarningController();

  bool _visible = false;
  bool _dismissed = false;

  String message =
      "Is this the right delivery address? You seem a bit far away.";

  bool get visible => _visible;

  void checkDistance(double distanceKm) {
    if (_dismissed) return;

    if (distanceKm > 2.0) {
      _visible = true;
    } else {
      _visible = false;
    }

    notifyListeners();
  }

  void hide() {
    _visible = false;
    _dismissed = true;
    notifyListeners();
  }

  void reset() {
    _dismissed = false;
  }
}
