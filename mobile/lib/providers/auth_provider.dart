import 'package:flutter/material.dart';
import '../data/models/user_model.dart';
import '../data/repositories/auth_repository.dart';

class AuthProvider extends ChangeNotifier {
  final AuthRepository _authRepo = AuthRepository();

  UserModel? _user;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  bool get isAdmin => _user?.isAdmin ?? false;
  bool get isAdminOrMod => _user?.isAdminOrMod ?? false;

  // Khởi tạo và kiểm tra phiên đăng nhập đã lưu
  Future<void> initAuth() async {
    _isLoading = true;
    notifyListeners();

    try {
      _user = await _authRepo.getMe();
    } catch (_) {
      _user = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Đăng nhập
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _user = await _authRepo.login(email, password);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Đăng ký
  Future<bool> register({
    required String fullName,
    required String email,
    required String password,
    String? hometownGroup,
    String? currentLocation,
    String? bio,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _user = await _authRepo.register(
        fullName: fullName,
        email: email,
        password: password,
        hometownGroup: hometownGroup,
        currentLocation: currentLocation,
        bio: bio,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Đăng nhập với Google ID Token
  Future<bool> loginWithGoogle(String idToken) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _user = await _authRepo.loginWithGoogle(idToken);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Cập nhật Profile
  Future<bool> updateProfile({
    String? fullName,
    String? hometownGroup,
    String? currentLocation,
    String? bio,
    String? avatarUrl,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _user = await _authRepo.updateProfile(
        fullName: fullName,
        hometownGroup: hometownGroup,
        currentLocation: currentLocation,
        bio: bio,
        avatarUrl: avatarUrl,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Đăng xuất
  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();
    await _authRepo.logout();
    _user = null;
    _isLoading = false;
    notifyListeners();
  }
}
