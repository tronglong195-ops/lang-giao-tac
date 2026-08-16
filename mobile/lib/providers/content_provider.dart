import 'package:flutter/material.dart';
import '../data/models/history_model.dart';
import '../data/models/post_model.dart';
import '../data/models/news_model.dart';
import '../data/models/album_model.dart';
import '../data/models/event_model.dart';
import '../data/models/villager_model.dart';
import '../data/repositories/content_repository.dart';

class ContentProvider extends ChangeNotifier {
  final ContentRepository _repo = ContentRepository();

  // State
  HistoryDataModel? _history;
  List<PostModel> _posts = [];
  List<NewsModel> _news = [];
  List<AlbumModel> _albums = [];
  List<EventModel> _events = [];
  List<VillagerModel> _villagers = [];

  bool _isLoading = false;
  String? _errorMessage;

  HistoryDataModel? get history => _history;
  List<PostModel> get posts => _posts;
  List<NewsModel> get news => _news;
  List<AlbumModel> get albums => _albums;
  List<EventModel> get events => _events;
  List<VillagerModel> get villagers => _villagers;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // Nạp toàn bộ dữ liệu ban đầu cho Trang Chủ
  Future<void> fetchHomeData() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final results = await Future.wait([
        _repo.getHistory().catchError((_) => HistoryDataModel(timelines: [])),
        _repo.getPosts().catchError((_) => <PostModel>[]),
        _repo.getNews().catchError((_) => <NewsModel>[]),
        _repo.getAlbums().catchError((_) => <AlbumModel>[]),
        _repo.getEvents().catchError((_) => <EventModel>[]),
      ]);

      _history = results[0] as HistoryDataModel;
      _posts = results[1] as List<PostModel>;
      _news = results[2] as List<NewsModel>;
      _albums = results[3] as List<AlbumModel>;
      _events = results[4] as List<EventModel>;

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Nạp Lịch sử
  Future<void> fetchHistory() async {
    try {
      _history = await _repo.getHistory();
      notifyListeners();
    } catch (_) {}
  }

  // Nạp Danh sách Bài viết
  Future<void> fetchPosts({String? category}) async {
    try {
      _posts = await _repo.getPosts(category: category);
      notifyListeners();
    } catch (_) {}
  }

  // Tạo bài viết mới
  Future<bool> createPost({
    required String title,
    required String contentHtml,
    String? coverImageUrl,
    String category = 'Ký ức & Tâm tình',
  }) async {
    try {
      final newPost = await _repo.createPost(
        title: title,
        contentHtml: contentHtml,
        coverImageUrl: coverImageUrl,
        category: category,
      );
      _posts.insert(0, newPost);
      notifyListeners();
      return true;
    } catch (_) {
      return false;
    }
  }

  // Nạp Albums
  Future<void> fetchAlbums() async {
    try {
      _albums = await _repo.getAlbums();
      notifyListeners();
    } catch (_) {}
  }

  // Tải ảnh hàng loạt vào Album
  Future<bool> uploadPhotos({
    required String albumId,
    required List<Map<String, dynamic>> photos,
  }) async {
    try {
      await _repo.uploadPhotosBatch(albumId: albumId, photos: photos);
      await fetchAlbums();
      return true;
    } catch (_) {
      return false;
    }
  }

  // Nạp Danh bạ đồng hương
  Future<void> fetchVillagers({String? group, String? search}) async {
    try {
      _villagers = await _repo.getVillagers(group: group, search: search);
      notifyListeners();
    } catch (_) {}
  }
}
