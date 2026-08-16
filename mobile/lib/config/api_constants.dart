class ApiConstants {
  // Base URL của Backend Production trên Render
  static const String baseUrl = 'https://lang-giao-tac.onrender.com/api';

  // Fallback Localhost khi chạy trên Android Emulator: 10.0.2.2 / iOS Simulator: localhost
  static const String localBaseUrlAndroid = 'http://10.0.2.2:5000/api';
  static const String localBaseUrlIos = 'http://localhost:5000/api';

  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String googleAuth = '/auth/google';
  static const String facebookAuth = '/auth/facebook';
  static const String getMe = '/auth/me';
  static const String updateProfile = '/auth/profile';
  static const String changePassword = '/auth/change-password';

  // History & Video Đình Làng
  static const String history = '/history';

  // Posts & Articles
  static const String posts = '/posts';

  // News
  static const String news = '/news';

  // Albums & Photos
  static const String albums = '/albums';
  static const String photos = '/photos';
  static const String photoBatch = '/photos/batch';

  // Villagers & Directory
  static const String villagers = '/villagers';

  // Events
  static const String events = '/events';

  // Upload Cloudinary / Backend Storage
  static const String upload = '/upload';

  // Google OAuth Web / Mobile Client ID
  static const String googleClientId =
      '17339925701-s0tiajuplhl8e5h0o4epke98ksm3g00r.apps.googleusercontent.com';
}
