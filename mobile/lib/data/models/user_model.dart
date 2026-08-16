class UserModel {
  final String id;
  final String fullName;
  final String email;
  final String role; // 'admin' | 'moderator' | 'member'
  final String? avatarUrl;
  final String? hometownGroup;
  final String? currentLocation;
  final String? bio;
  final bool isVerified;
  final DateTime? createdAt;

  UserModel({
    required this.id,
    required this.fullName,
    required this.email,
    required this.role,
    this.avatarUrl,
    this.hometownGroup,
    this.currentLocation,
    this.bio,
    this.isVerified = false,
    this.createdAt,
  });

  bool get isAdmin => role == 'admin';
  bool get isAdminOrMod => role == 'admin' || role == 'moderator';

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      fullName: json['fullName'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'member',
      avatarUrl: json['avatarUrl'],
      hometownGroup: json['hometownGroup'],
      currentLocation: json['currentLocation'],
      bio: json['bio'],
      isVerified: json['isVerified'] ?? false,
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'email': email,
      'role': role,
      'avatarUrl': avatarUrl,
      'hometownGroup': hometownGroup,
      'currentLocation': currentLocation,
      'bio': bio,
      'isVerified': isVerified,
      'createdAt': createdAt?.toIso8601String(),
    };
  }
}
