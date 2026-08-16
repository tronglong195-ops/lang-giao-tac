import 'user_model.dart';

class PostModel {
  final String id;
  final String title;
  final String slug;
  final String contentHtml;
  final String? coverImageUrl;
  final String category;
  final String status;
  final int viewCount;
  final int commentCount;
  final DateTime? publishedAt;
  final DateTime? createdAt;
  final UserModel? author;

  PostModel({
    required this.id,
    required this.title,
    required this.slug,
    required this.contentHtml,
    this.coverImageUrl,
    this.category = 'Ký ức & Tâm tình',
    this.status = 'published',
    this.viewCount = 0,
    this.commentCount = 0,
    this.publishedAt,
    this.createdAt,
    this.author,
  });

  factory PostModel.fromJson(Map<String, dynamic> json) {
    return PostModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      slug: json['slug'] ?? '',
      contentHtml: json['contentHtml'] ?? '',
      coverImageUrl: json['coverImageUrl'],
      category: json['category'] ?? 'Ký ức & Tâm tình',
      status: json['status'] ?? 'published',
      viewCount: json['viewCount'] ?? 0,
      commentCount: json['_count']?['comments'] ?? json['commentCount'] ?? 0,
      publishedAt: json['publishedAt'] != null ? DateTime.tryParse(json['publishedAt']) : null,
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : null,
      author: json['author'] != null ? UserModel.fromJson(json['author']) : null,
    );
  }
}
