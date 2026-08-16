import 'user_model.dart';

class NewsModel {
  final String id;
  final String title;
  final String slug;
  final String contentHtml;
  final String? source;
  final bool isOfficial;
  final DateTime? publishedAt;
  final DateTime? createdAt;
  final UserModel? author;

  NewsModel({
    required this.id,
    required this.title,
    required this.slug,
    required this.contentHtml,
    this.source,
    this.isOfficial = true,
    this.publishedAt,
    this.createdAt,
    this.author,
  });

  factory NewsModel.fromJson(Map<String, dynamic> json) {
    return NewsModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      slug: json['slug'] ?? '',
      contentHtml: json['contentHtml'] ?? '',
      source: json['source'],
      isOfficial: json['isOfficial'] ?? true,
      publishedAt: json['publishedAt'] != null ? DateTime.tryParse(json['publishedAt']) : null,
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : null,
      author: json['author'] != null ? UserModel.fromJson(json['author']) : null,
    );
  }
}
