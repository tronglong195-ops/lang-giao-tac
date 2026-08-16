import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../config/app_theme.dart';
import '../../providers/content_provider.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/share_modal.dart';
import 'album_detail_screen.dart';
import 'upload_photo_screen.dart';

class GalleryScreen extends StatefulWidget {
  const GalleryScreen({super.key});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ContentProvider>(context, listen: false).fetchAlbums();
    });
  }

  @override
  Widget build(BuildContext context) {
    final content = Provider.of<ContentProvider>(context);
    final albums = content.albums;

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Thư Viện Album Ảnh',
        subtitle: 'Kho tư liệu hình ảnh làng quê xưa & nay',
        showBackButton: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.add_photo_alternate_rounded, color: AppColors.primary),
            tooltip: 'Tải ảnh lên',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const UploadPhotoScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.share_outlined, color: AppColors.primaryDark),
            onPressed: () {
              ShareModal.show(
                context,
                title: 'Kho Ảnh Quê Hương Làng Giao Tác',
                shareUrl: 'https://lang-giao-tac-1.onrender.com/thu-vien-anh',
              );
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const UploadPhotoScreen()),
          );
        },
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.camera_alt_rounded),
        label: const Text('Góp Ảnh', style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: RefreshIndicator(
        onRefresh: () => content.fetchAlbums(),
        color: AppColors.primary,
        child: albums.isEmpty
            ? const Center(
                child: Text('Chưa có album ảnh nào.'),
              )
            : GridView.builder(
                padding: const EdgeInsets.all(16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 14,
                  mainAxisSpacing: 14,
                  childAspectRatio: 0.78,
                ),
                itemCount: albums.length,
                itemBuilder: (ctx, i) {
                  final album = albums[i];
                  return InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => AlbumDetailScreen(album: album),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Card(
                      clipBehavior: Clip.antiAlias,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Cover Image
                          Expanded(
                            child: Stack(
                              fit: StackFit.expand,
                              children: [
                                if (album.coverPhotoUrl != null)
                                  CachedNetworkImage(
                                    imageUrl: album.coverPhotoUrl!,
                                    fit: BoxFit.cover,
                                    placeholder: (_, __) => Container(color: AppColors.paper),
                                    errorWidget: (_, __) => Container(
                                      color: AppColors.paper,
                                      child: const Icon(Icons.image_not_supported_outlined),
                                    ),
                                  )
                                else
                                  Container(
                                    color: AppColors.primarySubtle,
                                    child: const Icon(Icons.photo_album_rounded, color: AppColors.primary, size: 36),
                                  ),
                                Positioned(
                                  bottom: 8,
                                  right: 8,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.65),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.photo_camera_rounded, color: Colors.white, size: 10),
                                        const SizedBox(width: 4),
                                        Text(
                                          '${album.photoCount} ảnh',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 10,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Album Info
                          Padding(
                            padding: const EdgeInsets.all(10),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  album.title,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.ink,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  album.description ?? 'Album ảnh quê hương',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: AppColors.inkMuted,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }
}
