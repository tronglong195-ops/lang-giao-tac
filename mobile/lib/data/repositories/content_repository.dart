import '../models/history_model.dart';
import '../models/post_model.dart';
import '../models/news_model.dart';
import '../models/album_model.dart';
import '../models/photo_model.dart';
import '../models/event_model.dart';
import '../models/villager_model.dart';
import '../services/api_service.dart';
import '../../config/api_constants.dart';

class ContentRepository {
  final ApiService _apiService = ApiService();

  // --- LỊCH SỬ & ĐÌNH LÀNG ---
  Future<HistoryDataModel> getHistory() async {
    final res = await _apiService.get(ApiConstants.history);
    return HistoryDataModel.fromJson(res['data']);
  }

  // --- BÀI VIẾT & KÝ ỨC ---
  Future<List<PostModel>> getPosts({String? category}) async {
    final params = <String, String>{};
    if (category != null && category.isNotEmpty) {
      params['category'] = category;
    }
    final res = await _apiService.get(ApiConstants.posts, queryParams: params);
    final List list = res['data']['posts'] ?? [];
    return list.map((item) => PostModel.fromJson(item)).toList();
  }

  Future<PostModel> getPostDetail(String slugOrId) async {
    final res = await _apiService.get('${ApiConstants.posts}/$slugOrId');
    return PostModel.fromJson(res['data']['post']);
  }

  Future<PostModel> createPost({
    required String title,
    required String contentHtml,
    String? coverImageUrl,
    String category = 'Ký ức & Tâm tình',
  }) async {
    final res = await _apiService.post(ApiConstants.posts, body: {
      'title': title.trim(),
      'contentHtml': contentHtml,
      'coverImageUrl': coverImageUrl,
      'category': category,
    });
    return PostModel.fromJson(res['data']['post']);
  }

  // --- TIN TỨC & THÔNG BÁO ---
  Future<List<NewsModel>> getNews() async {
    final res = await _apiService.get(ApiConstants.news);
    final List list = res['data']['news'] ?? [];
    return list.map((item) => NewsModel.fromJson(item)).toList();
  }

  Future<NewsModel> getNewsDetail(String slugOrId) async {
    final res = await _apiService.get('${ApiConstants.news}/$slugOrId');
    return NewsModel.fromJson(res['data']['news']);
  }

  // --- ALBUM ẢNH & THƯ VIỆN ---
  Future<List<AlbumModel>> getAlbums() async {
    final res = await _apiService.get(ApiConstants.albums);
    final List list = res['data']['albums'] ?? [];
    return list.map((item) => AlbumModel.fromJson(item)).toList();
  }

  Future<AlbumModel> getAlbumDetail(String slugOrId) async {
    final res = await _apiService.get('${ApiConstants.albums}/$slugOrId');
    return AlbumModel.fromJson(res['data']['album']);
  }

  // Tải lên nhiều ảnh vào album
  Future<List<PhotoModel>> uploadPhotosBatch({
    required String albumId,
    required List<Map<String, dynamic>> photos,
  }) async {
    final res = await _apiService.post(ApiConstants.photoBatch, body: {
      'albumId': albumId,
      'photos': photos,
    });
    final List list = res['data']['photos'] ?? [];
    return list.map((item) => PhotoModel.fromJson(item)).toList();
  }

  // --- DANH BẠ ĐỒNG HƯƠNG ---
  Future<List<VillagerModel>> getVillagers({String? group, String? search}) async {
    final params = <String, String>{};
    if (group != null && group.isNotEmpty) params['group'] = group;
    if (search != null && search.isNotEmpty) params['search'] = search;

    final res = await _apiService.get(ApiConstants.villagers, queryParams: params);
    final List list = res['data']['villagers'] ?? [];
    return list.map((item) => VillagerModel.fromJson(item)).toList();
  }

  // --- SỰ KIỆN LÀNG ---
  Future<List<EventModel>> getEvents() async {
    final res = await _apiService.get(ApiConstants.events);
    final List list = res['data']['events'] ?? [];
    return list.map((item) => EventModel.fromJson(item)).toList();
  }
}
