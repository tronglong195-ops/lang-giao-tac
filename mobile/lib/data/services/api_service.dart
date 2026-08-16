import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../config/api_constants.dart';
import 'storage_service.dart';

class ApiResponse<T> {
  final bool success;
  final String? message;
  final T? data;

  ApiResponse({required this.success, this.message, this.data});
}

class ApiService {
  final http.Client _client = http.Client();

  // Helper tạo headers có gắn JWT Bearer Token
  Future<Map<String, String>> _getHeaders() async {
    final token = await StorageService.getToken();
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  // GET Request
  Future<dynamic> get(String endpoint, {Map<String, String>? queryParams}) async {
    final headers = await _getHeaders();
    var uri = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    if (queryParams != null && queryParams.isNotEmpty) {
      uri = uri.replace(queryParameters: queryParams);
    }

    try {
      final response = await _client.get(uri, headers: headers).timeout(const Duration(seconds: 15));
      return _processResponse(response);
    } catch (e) {
      throw Exception('Lỗi kết nối mạng: $e');
    }
  }

  // POST Request
  Future<dynamic> post(String endpoint, {Map<String, dynamic>? body}) async {
    final headers = await _getHeaders();
    final uri = Uri.parse('${ApiConstants.baseUrl}$endpoint');

    try {
      final response = await _client
          .post(uri, headers: headers, body: body != null ? jsonEncode(body) : null)
          .timeout(const Duration(seconds: 20));
      return _processResponse(response);
    } catch (e) {
      throw Exception('Lỗi kết nối mạng: $e');
    }
  }

  // PUT Request
  Future<dynamic> put(String endpoint, {Map<String, dynamic>? body}) async {
    final headers = await _getHeaders();
    final uri = Uri.parse('${ApiConstants.baseUrl}$endpoint');

    try {
      final response = await _client
          .put(uri, headers: headers, body: body != null ? jsonEncode(body) : null)
          .timeout(const Duration(seconds: 15));
      return _processResponse(response);
    } catch (e) {
      throw Exception('Lỗi kết nối mạng: $e');
    }
  }

  // DELETE Request
  Future<dynamic> delete(String endpoint) async {
    final headers = await _getHeaders();
    final uri = Uri.parse('${ApiConstants.baseUrl}$endpoint');

    try {
      final response = await _client.delete(uri, headers: headers).timeout(const Duration(seconds: 15));
      return _processResponse(response);
    } catch (e) {
      throw Exception('Lỗi kết nối mạng: $e');
    }
  }

  // Xử lý Response chuẩn
  dynamic _processResponse(http.Response response) {
    final statusCode = response.statusCode;
    final body = response.body.isNotEmpty ? jsonDecode(utf8.decode(response.bodyBytes)) : {};

    if (statusCode >= 200 && statusCode < 300) {
      return body;
    } else {
      final message = body['message'] ?? 'Yêu cầu không thành công (Mã lỗi: $statusCode)';
      throw Exception(message);
    }
  }
}
