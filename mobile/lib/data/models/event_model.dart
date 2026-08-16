import 'user_model.dart';

class EventModel {
  final String id;
  final String title;
  final String? description;
  final DateTime eventDate;
  final String? location;
  final String? coverImageUrl;
  final DateTime? createdAt;
  final UserModel? createdBy;

  EventModel({
    required this.id,
    required this.title,
    this.description,
    required this.eventDate,
    this.location,
    this.coverImageUrl,
    this.createdAt,
    this.createdBy,
  });

  factory EventModel.fromJson(Map<String, dynamic> json) {
    return EventModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'],
      eventDate: json['eventDate'] != null ? DateTime.parse(json['eventDate']) : DateTime.now(),
      location: json['location'],
      coverImageUrl: json['coverImageUrl'],
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : null,
      createdBy: json['createdBy'] != null ? UserModel.fromJson(json['createdBy']) : null,
    );
  }
}
