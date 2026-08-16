import '../models/user_model.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';
import '../../config/api_constants.dart';

class AuthRepository {
  final ApiService _apiService = ApiService();

  // Đăng nhập bằng Email & Password
  Future<UserModel> login(String email, String password) async {
    final res = await _apiService.post(ApiConstants.login, body: {
      'email': email.trim(),
      'password': password,
    });

    final data = res['data'];
    final user = UserModel.fromJson(data['user']);
    final token = data['accessToken'];

    if (token != null) {
      await StorageService.saveToken(token);
    }
    await StorageService.saveUser(user);

    return user;
  }

  // Đăng ký tài khoản
  Future<UserModel> register({
    required String fullName,
    required String email,
    required String password,
    String? hometownGroup,
    String? currentLocation,
    String? bio,
  }) async {
    final res = await _apiService.post(ApiConstants.register, body: {
      'fullName': fullName.trim(),
      'email': email.trim(),
      'password': password,
      'hometownGroup': hometownGroup,
      'currentLocation': currentLocation,
      'bio': bio,
    });

    final data = res['data'];
    final user = UserModel.fromJson(data['user']);
    final token = data['accessToken'];

    if (token != null) {
      await StorageService.saveToken(token);
    }
    await StorageService.saveUser(user);

    return user;
  }

  // Đăng nhập bằng Google ID Token
  Future<UserModel> loginWithGoogle(String idToken) async {
    final res = await _apiService.post(ApiConstants.googleAuth, body: {
      'idToken': idToken,
    });

    final data = res['data'];
    final user = UserModel.fromJson(data['user']);
    final token = data['accessToken'];

    if (token != null) {
      await StorageService.saveToken(token);
    }
    await StorageService.saveUser(user);

    return user;
  }

  // Lấy thông tin user hiện tại từ token
  Future<UserModel?> getMe() async {
    try {
      final res = await _apiService.get(ApiConstants.getMe);
      final user = UserModel.fromJson(res['data']['user']);
      await StorageService.saveUser(user);
      return user;
    } catch (_) {
      return await StorageService.getUser();
    }
  }

  // Cập nhật Profile
  Future<UserModel> updateProfile({
    String? fullName,
    String? hometownGroup,
    String? currentLocation,
    String? bio,
    String? avatarUrl,
  }) async {
    final res = await _apiService.put(ApiConstants.updateProfile, body: {
      if (fullName != null) 'fullName': fullName,
      if (hometownGroup != null) 'hometownGroup': hometownGroup,
      if (currentLocation != null) 'currentLocation': currentLocation,
      if (bio != null) 'bio': bio,
      if (avatarUrl != null) 'avatarUrl': avatarUrl,
    });

    final user = UserModel.fromJson(res['data']['user']);
    await StorageService.saveUser(user);
    return user;
  }

  // Đăng xuất
  Future<void> logout() async {
    try {
      await _apiService.post('/auth/logout');
    } catch (_) {}
    await StorageService.clearAll();
  }
}
