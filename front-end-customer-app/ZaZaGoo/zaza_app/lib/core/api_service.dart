import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

/// ─────────────────────────────────────────────────────────────
/// Base HTTP client — ZAZA Customer App
///
/// Authentication: Bearer token (Passport) in Authorization header.
/// Token stored in SharedPreferences under key 'zaza_customer_token'.
/// ─────────────────────────────────────────────────────────────
class CustomerApiService {
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:8000/api/v1';
    return 'http://10.0.2.2:8000/api/v1'; // Android emulator → host machine
    // Production: return 'https://api.zaza.tj/api/v1';
  }

  static const _tokenKey = 'zaza_customer_token';

  // ─── Token helpers ────────────────────────────────────────
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }

  static Future<bool> isLoggedIn() async {
    final t = await getToken();
    return t != null && t.isNotEmpty;
  }

  // ─── Base headers ──────────────────────────────────────────
  static Future<Map<String, String>> _headers({bool withToken = true}) async {
    final h = <String, String>{
      'Content-Type': 'application/json',
      'Accept':       'application/json',
    };
    if (withToken) {
      final token = await getToken();
      if (token != null) h['Authorization'] = 'Bearer $token';
    }
    return h;
  }

  // ─── GET ──────────────────────────────────────────────────
  static Future<Map<String, dynamic>> get(String path) async {
    final uri = Uri.parse('$baseUrl$path');
    final resp = await http
        .get(uri, headers: await _headers())
        .timeout(const Duration(seconds: 30));
    return _parse(resp);
  }

  // ─── POST (public — no token) ──────────────────────────────
  static Future<Map<String, dynamic>> postPublic(
    String path,
    Map<String, dynamic> body,
  ) async {
    final uri  = Uri.parse('$baseUrl$path');
    final resp = await http
        .post(uri,
            headers: await _headers(withToken: false),
            body: jsonEncode(body))
        .timeout(const Duration(seconds: 30));
    return _parse(resp);
  }

  // ─── POST (authenticated) ──────────────────────────────────
  static Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body,
  ) async {
    final uri  = Uri.parse('$baseUrl$path');
    final resp = await http
        .post(uri, headers: await _headers(), body: jsonEncode(body))
        .timeout(const Duration(seconds: 30));
    return _parse(resp);
  }

  // ─── PUT ──────────────────────────────────────────────────
  static Future<Map<String, dynamic>> put(
    String path,
    Map<String, dynamic> body,
  ) async {
    final uri  = Uri.parse('$baseUrl$path');
    final resp = await http
        .put(uri, headers: await _headers(), body: jsonEncode(body))
        .timeout(const Duration(seconds: 30));
    return _parse(resp);
  }

  // ─── Response parser ──────────────────────────────────────
  static Map<String, dynamic> _parse(http.Response resp) {
    final body = jsonDecode(resp.body) as Map<String, dynamic>;
    if (resp.statusCode >= 200 && resp.statusCode < 300) return body;
    throw CustomerApiException(
      statusCode: resp.statusCode,
      message:    (body['message'] ?? body['errors']?.toString() ?? 'Server error').toString(),
    );
  }
}

/// Thrown on non-2xx responses
class CustomerApiException implements Exception {
  final int    statusCode;
  final String message;

  const CustomerApiException({required this.statusCode, required this.message});

  @override
  String toString() => message;
}
