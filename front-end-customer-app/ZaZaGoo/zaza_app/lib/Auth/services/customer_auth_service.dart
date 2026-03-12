import 'package:zaza_app/core/api_service.dart';

/// ─────────────────────────────────────────────────────────────
/// Customer OTP authentication service.
///
/// Flow:
///   1. sendOtp(phone)        → POST auth/customer/send-otp
///   2. verifyOtp(phone, otp) → POST auth/customer/verify-otp
///                              saves token → SharedPreferences
/// ─────────────────────────────────────────────────────────────
class CustomerAuthService {
  // POST /api/v1/auth/customer/send-otp
  static Future<void> sendOtp(String phone) async {
    final resp = await CustomerApiService.postPublic(
      '/auth/customer/send-otp',
      {'phone': phone},
    );
    if (resp['status'] != true) {
      throw CustomerApiException(
        statusCode: 400,
        message: resp['message']?.toString() ?? 'Failed to send OTP',
      );
    }
  }

  // POST /api/v1/auth/customer/verify-otp  → returns token + user
  static Future<CustomerAuthResult> verifyOtp(String phone, String otp) async {
    final resp = await CustomerApiService.postPublic(
      '/auth/customer/verify-otp',
      {'phone': phone, 'otp': otp},
    );
    if (resp['status'] != true) {
      throw CustomerApiException(
        statusCode: 401,
        message: resp['message']?.toString() ?? 'Invalid OTP',
      );
    }

    final token = resp['token'] as String;
    await CustomerApiService.saveToken(token);

    final u = resp['user'] as Map<String, dynamic>;
    return CustomerAuthResult(
      token:  token,
      id:     (u['id'] ?? 0) as int,
      name:   u['name']?.toString()  ?? '',
      phone:  u['phone']?.toString() ?? phone,
      email:  u['email']?.toString() ?? '',
      image:  u['image']?.toString() ?? '',
      wallet: double.tryParse(u['wallet']?.toString() ?? '0') ?? 0,
    );
  }

  static Future<void> logout() async {
    await CustomerApiService.clearToken();
  }

  static Future<bool> isLoggedIn() => CustomerApiService.isLoggedIn();
}

class CustomerAuthResult {
  final String token;
  final int    id;
  final String name;
  final String phone;
  final String email;
  final String image;
  final double wallet;

  const CustomerAuthResult({
    required this.token,
    required this.id,
    required this.name,
    required this.phone,
    required this.email,
    required this.image,
    required this.wallet,
  });
}
