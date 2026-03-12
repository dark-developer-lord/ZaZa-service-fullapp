import 'package:zaza_driver_app/core/api_service.dart';

/// --------------------------------------------------------
/// Аутентификация курьера — OTP-авторизация.
///
/// 1. sendOtp(phone)   → отправляет OTP на телефон (+992XXXXXXXXX)
/// 2. verifyOtp(phone, otp) → проверяет код, возвращает token + driver
/// --------------------------------------------------------
class AuthService {
  // POST /api/v1/auth/delivery-man/send-otp
  static Future<void> sendOtp(String phone) async {
    final resp = await ApiService.post(
      '/auth/delivery-man/send-otp',
      {'phone': phone},
    );
    if (resp['status'] != true) {
      throw ApiException(statusCode: 400, message: resp['message'] ?? 'Ошибка');
    }
  }

  // POST /api/v1/auth/delivery-man/verify-otp
  // Возвращает token строку; также сохраняет token в SharedPreferences
  static Future<DriverAuthResult> verifyOtp(String phone, String otp) async {
    final resp = await ApiService.post(
      '/auth/delivery-man/verify-otp',
      {'phone': phone, 'otp': otp},
    );
    if (resp['status'] != true) {
      throw ApiException(statusCode: 401, message: resp['message'] ?? 'Неверный OTP');
    }

    final token = resp['token'] as String;
    await ApiService.saveToken(token);

    final driverData = resp['driver'] as Map<String, dynamic>;
    return DriverAuthResult(
      token: token,
      id: driverData['id'] as int,
      name: driverData['name'] as String,
      phone: driverData['phone'] as String,
      email: (driverData['email'] as String?) ?? '',
      image: (driverData['image'] as String?) ?? '',
      isActive: driverData['active'] == true,
    );
  }

  // Выход — очищаем токен локально
  static Future<void> logout() async {
    await ApiService.clearToken();
  }

  // Проверяем: есть ли токен → курьер залогинен?
  static Future<bool> isLoggedIn() async {
    final token = await ApiService.getToken();
    return token != null && token.isNotEmpty;
  }
}

class DriverAuthResult {
  final String token;
  final int id;
  final String name;
  final String phone;
  final String email;
  final String image;
  final bool isActive;

  const DriverAuthResult({
    required this.token,
    required this.id,
    required this.name,
    required this.phone,
    required this.email,
    required this.image,
    required this.isActive,
  });
}
