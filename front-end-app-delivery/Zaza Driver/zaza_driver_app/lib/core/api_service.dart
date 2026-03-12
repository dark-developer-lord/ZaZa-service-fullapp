import 'dart:convert';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

/// --------------------------------------------------------
/// Базовый HTTP-клиент для ZAZA Driver App.
///
/// Все запросы идут на [baseUrl].
/// Токен курьера хранится в SharedPreferences и автоматически
/// добавляется в заголовок ?token=<TOKEN> (как ожидает бэкенд).
/// --------------------------------------------------------
class ApiService {
  /// Auto-selects the correct host:
  ///   - Flutter web / iOS simulator → localhost
  ///   - Android emulator             → 10.0.2.2  (routes to host machine)
  ///   - Production                   → https://api.zaza.tj
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:8000/api/v1';
    // Android emulator
    return 'http://10.0.2.2:8000/api/v1';
  }

  static const String _tokenKey = 'dm_token';

  // ─── Token helpers ────────────────────────────────────
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

  // ─── Headers ──────────────────────────────────────────
  static Future<Map<String, String>> _headers({bool withToken = true}) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (withToken) {
      final token = await getToken();
      if (token != null) headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  // ─── Query param token (бэкенд ждёт ?token=) ─────────
  static Future<Uri> _uri(String path, {Map<String, dynamic>? query}) async {
    final token = await getToken();
    final params = <String, dynamic>{};
    if (token != null) params['token'] = token;
    if (query != null) params.addAll(query);
    return Uri.parse('$baseUrl$path').replace(
      queryParameters: params.map((k, v) => MapEntry(k, v.toString())),
    );
  }

  // ─── GET ──────────────────────────────────────────────
  static Future<Map<String, dynamic>> get(
    String path, {
    Map<String, dynamic>? query,
  }) async {
    final uri = await _uri(path, query: query);
    final resp = await http
        .get(uri, headers: await _headers())
        .timeout(const Duration(seconds: 30));
    return _parse(resp);
  }

  // ─── POST ─────────────────────────────────────────────
  static Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body, {
    bool withToken = false,
  }) async {
    final uri = withToken ? await _uri(path) : Uri.parse('$baseUrl$path');
    final resp = await http
        .post(
          uri,
          headers: await _headers(withToken: withToken),
          body: jsonEncode(body),
        )
        .timeout(const Duration(seconds: 30));
    return _parse(resp);
  }

  // ─── PUT ──────────────────────────────────────────────
  static Future<Map<String, dynamic>> put(
    String path,
    Map<String, dynamic> body,
  ) async {
    final uri = await _uri(path);
    final resp = await http
        .put(
          uri,
          headers: await _headers(),
          body: jsonEncode(body),
        )
        .timeout(const Duration(seconds: 30));
    return _parse(resp);
  }

  // ─── Response parser ──────────────────────────────────
  static Map<String, dynamic> _parse(http.Response resp) {
    final body = jsonDecode(resp.body) as Map<String, dynamic>;
    if (resp.statusCode >= 200 && resp.statusCode < 300) return body;
    throw ApiException(
      statusCode: resp.statusCode,
      message: (body['message'] ?? body['errors']?.toString() ?? 'Ошибка сервера').toString(),
    );
  }
}

/// Выбрасывается при не-2xx ответе
class ApiException implements Exception {
  final int statusCode;
  final String message;
  const ApiException({required this.statusCode, required this.message});

  @override
  String toString() => 'ApiException($statusCode): $message';
}
