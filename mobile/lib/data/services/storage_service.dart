import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user_model.dart';

class StorageService {
  static const _storage = FlutterSecureStorage();
  static const String _tokenKey = 'access_token';
  static const String _userKey = 'cached_user';

  // Lưu Access Token an toàn
  static Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  // Lấy Access Token
  static Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  // Xóa Token khi Logout
  static Future<void> clearToken() async {
    await _storage.delete(key: _tokenKey);
  }

  // Lưu thông tin User
  static Future<void> saveUser(UserModel user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, jsonEncode(user.toJson()));
  }

  // Lấy thông tin User
  static Future<UserModel?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_userKey);
    if (raw == null) return null;
    try {
      return UserModel.fromJson(jsonDecode(raw));
    } catch (_) {
      return null;
    }
  }

  // Xóa sạch bộ nhớ
  static Future<void> clearAll() async {
    await clearToken();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userKey);
  }
}
