import 'package:zaza_driver_app/core/api_service.dart';

/// --------------------------------------------------------
/// Профиль курьера
/// --------------------------------------------------------
class ProfileApiService {
  // GET /api/v1/delivery-man/profile
  static Future<DriverProfile> fetchProfile() async {
    final resp = await ApiService.get('/delivery-man/profile');
    return DriverProfile.fromJson(resp);
  }

  // PUT /api/v1/delivery-man/update-profile
  static Future<void> updateProfile({
    required String firstName,
    required String lastName,
    required String email,
    String? password,
  }) async {
    final body = <String, dynamic>{
      'f_name': firstName,
      'l_name': lastName,
      'email': email,
    };
    if (password != null && password.isNotEmpty) {
      body['password'] = password;
    }
    await ApiService.put('/delivery-man/update-profile', body);
  }

  // POST /api/v1/delivery-man/update-fcm-token
  static Future<void> updateFcmToken(String fcmToken) async {
    await ApiService.put('/delivery-man/update-fcm-token', {'fcm_token': fcmToken});
  }
}

class DriverProfile {
  final int id;
  final String firstName;
  final String lastName;
  final String phone;
  final String email;
  final String image;
  final bool isActive;
  final double avgRating;
  final int orderCount;
  final int todayOrderCount;
  final double balance;
  final int memberSinceDays;

  const DriverProfile({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.phone,
    required this.email,
    required this.image,
    required this.isActive,
    required this.avgRating,
    required this.orderCount,
    required this.todayOrderCount,
    required this.balance,
    required this.memberSinceDays,
  });

  String get fullName => '$firstName $lastName'.trim();

  factory DriverProfile.fromJson(Map<String, dynamic> j) {
    return DriverProfile(
      id:              (j['id'] ?? 0) as int,
      firstName:       j['f_name']?.toString() ?? '',
      lastName:        j['l_name']?.toString() ?? '',
      phone:           j['phone']?.toString() ?? '',
      email:           j['email']?.toString() ?? '',
      image:           j['image']?.toString() ?? '',
      isActive:        (j['active'] ?? 0) == 1,
      avgRating:       double.tryParse(j['avg_rating']?.toString() ?? '0') ?? 0,
      orderCount:      (j['order_count'] ?? 0) as int,
      todayOrderCount: (j['todays_order_count'] ?? 0) as int,
      balance:         double.tryParse(j['balance']?.toString() ?? '0') ?? 0,
      memberSinceDays: (j['member_since_days'] ?? 0) as int,
    );
  }
}
