import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../config/app_theme.dart';
import '../../data/models/album_model.dart';
import '../../data/repositories/content_repository.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/share_modal.dart';
import 'photo_viewer_screen.dart';
import 'upload_photo_screen.dart';

class AlbumDetailScreen extends StatefulWidget {
  final AlbumModel album;

  const AlbumDetailScreen({super.key, required this.album});

  @override
  State<AlbumDetailScreen> createState() => _AlbumDetailScreenState();
}

class _AlbumDetailScreenState extends State<AlbumDetailScreen> {
  late AlbumModel _album;
  bool _isLoading = false;
  final ContentRepository _repo = ContentRepository();

  @override
  void initState() {
    super.initState();
    _album = widget.album;
    _fetchDetail();
  }

  Future<void> _fetchDetail() async {
    setState(() => _isLoading = true);
    try {
      final updated = await _repo.getAlbumDetail(_album.slug.isNotEmpty ? _album.slug : _album.id);
      setState(() {
        _album = updated;
        _isLoading = false;
      });
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: _album.title,
        subtitle: '${_album.photos.length} bức ảnh',
        actions: [
          IconButton(
            icon: const Icon(Icons.add_photo_alternate_outlined, color: AppColors.primary),
            tooltip: 'Thêm ảnh vào album này',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => UploadPhotoScreen(preselectedAlbumId: _album.id),
                ),
              ).then((_) => _fetchDetail());
            },
          ),
          IconButton(
            icon: const Icon(Icons.share_outlined, color: AppColors.primaryDark),
            onPressed: () {
              ShareModal.show(
                context,
                title: _album.title,
                shareUrl: 'https://lang-giao-tac-1.onrender.com/thu-vien-anh/${_album.slug}',
                description: _album.description ?? 'Album ảnh làng quê Làng Giao Tác',
              );
            },
          ),
        ],
      ),
      body: _isLoading && _album.photos.isEmpty
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : RefreshIndicator(
              onRefresh: _fetchDetail,
              color: AppColors.primary,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Album Header Description
                    if (_album.description != null && _album.description!.isNotEmpty)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.warmBorder),
                        ),
                        child: Text(
                          _album.description!,
                          style: const TextStyle(
                            fontSize: 13,
                            color: AppColors.ink,
                            height: 1.45,
                          ),
                        ),
                      ),

                    // Photo Grid
                    if (_album.photos.isEmpty)
                      Center(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 40),
                          child: Column(
                            children: [
                              const Icon(Icons.image_search_rounded, size: 48, color: AppColors.inkMuted),
                              const SizedBox(height: 12),
                              const Text('Chưa có bức ảnh nào trong album này.'),
                              const SizedBox(height: 16),
                              ElevatedButton.icon(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => UploadPhotoScreen(preselectedAlbumId: _album.id),
                                    ),
                                  ).then((_) => _fetchDetail());
                                },
                                icon: const Icon(Icons.add_a_photo_rounded, size: 18),
                                label: const Text('Góp ảnh đầu tiên'),
                              ),
                            ],
                          ),
                        ),
                      )
                    else
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 10,
                          mainAxisSpacing: 10,
                          childAspectRatio: 1.0,
                        ),
                        itemCount: _album.photos.length,
                        itemBuilder: (ctx, i) {
                          final photo = _album.photos[i];
                          return InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => PhotoViewerScreen(
                                    photos: _album.photos,
                                    initialIndex: i,
                                    albumTitle: _album.title,
                                  ),
                                ),
                              );
                            },
                            borderRadius: BorderRadius.circular(12),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Stack(
                                fit: StackFit.expand,
                                children: [
                                  CachedNetworkImage(
                                    imageUrl: photo.imageUrl,
                                    fit: BoxFit.cover,
                                    placeholder: (_, __) => Container(color: AppColors.paper),
                                    errorWidget: (_, __) => Container(
                                      color: AppColors.paper,
                                      child: const Icon(Icons.broken_image_rounded),
                                    ),
                                  ),
                                  if (photo.takenYear != null)
                                    Positioned(
                                      bottom: 6,
                                      left: 6,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: Colors.black.withOpacity(0.6),
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          'Năm ${photo.takenYear}',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 9,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                  ],
                ),
              ),
            ),
    );
  }
}
