import 'user_model.dart';
import 'photo_model.dart';

class AlbumModel {
  final String id;
  final String title;
  final String slug;
  final String? description;
  final String? coverPhotoId;
  final String? coverPhotoUrl;
  final int photoCount;
  final DateTime? createdAt;
  final UserModel? creator;
  final List<PhotoModel> photos;

  AlbumModel({
    required this.id,
    required this.title,
    required this.slug,
    this.description,
    this.coverPhotoId,
    this.coverPhotoUrl,
    this.photoCount = 0,
    this.createdAt,
    this.creator,
    this.photos = const [],
  });

  factory AlbumModel.fromJson(Map<String, dynamic> json) {
    var rawPhotos = json['photos'] as List<dynamic>?;
    List<PhotoModel> photoList = rawPhotos != null
        ? rawPhotos.map((p) => PhotoModel.fromJson(p)).toList()
        : [];

    String? calculatedCover = json['coverPhoto']?['imageUrl'] ?? json['coverPhotoUrl'];
    if (calculatedCover == null && photoList.isNotEmpty) {
      calculatedCover = photoList.first.imageUrl;
    }

    return AlbumModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'],
      coverPhotoId: json['coverPhotoId'],
      coverPhotoUrl: calculatedCover,
      photoCount: json['_count']?['photos'] ?? json['photoCount'] ?? photoList.length,
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : null,
      creator: json['creator'] != null ? UserModel.fromJson(json['creator']) : null,
      photos: photoList,
    );
  }
}
