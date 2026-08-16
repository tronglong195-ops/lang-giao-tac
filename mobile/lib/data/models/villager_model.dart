class VillagerModel {
  final String id;
  final String fullName;
  final String? avatarUrl;
  final String? hometownGroup;
  final String? currentLocation;
  final String? occupation;
  final String? phone;
  final String? email;
  final String? bio;

  VillagerModel({
    required this.id,
    required this.fullName,
    this.avatarUrl,
    this.hometownGroup,
    this.currentLocation,
    this.occupation,
    this.phone,
    this.email,
    this.bio,
  });

  factory VillagerModel.fromJson(Map<String, dynamic> json) {
    return VillagerModel(
      id: json['id'] ?? '',
      fullName: json['fullName'] ?? '',
      avatarUrl: json['avatarUrl'],
      hometownGroup: json['hometownGroup'],
      currentLocation: json['currentLocation'],
      occupation: json['occupation'],
      phone: json['phone'],
      email: json['email'],
      bio: json['bio'],
    );
  }
}
