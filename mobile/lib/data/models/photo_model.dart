import 'user_model.dart';

class PhotoModel {
  final String id;
  final String albumId;
  final String imageUrl;
  final String? thumbnailUrl;
  final String? caption;
  final int? takenYear;
  final String status;
  final DateTime? createdAt;
  final UserModel? uploader;

  PhotoModel({
    required this.id,
    required this.albumId,
    required this.imageUrl,
    this.thumbnailUrl,
    this.caption,
    this.takenYear,
    this.status = 'approved',
    this.createdAt,
    this.uploader,
  });

  factory PhotoModel.fromJson(Map<String, dynamic> json) {
    return PhotoModel(
      id: json['id'] ?? '',
      albumId: json['albumId'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      thumbnailUrl: json['thumbnailUrl'] ?? json['imageUrl'],
      caption: json['caption'],
      takenYear: json['takenYear'],
      status: json['status'] ?? 'approved',
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : null,
      uploader: json['uploader'] != null ? UserModel.fromJson(json['uploader']) : null,
    );
  }
}
