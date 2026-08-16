import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../config/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/content_provider.dart';
import '../history/history_screen.dart';
import '../gallery/gallery_screen.dart';
import '../posts/posts_screen.dart';
import '../posts/post_detail_screen.dart';
import '../news/news_screen.dart';
import '../villagers/villagers_screen.dart';
import '../auth/profile_screen.dart';
import '../auth/login_screen.dart';
import '../../widgets/share_modal.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final content = Provider.of<ContentProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.holiday_village_rounded,
                color: AppColors.secondaryLight,
                size: 20,
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'LÀNG GIAO TÁC',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AppColors.primaryDark,
                    letterSpacing: 0.5,
                  ),
                ),
                Text(
                  'TDP 9 Thuận Lộc (Hà Tĩnh)',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: AppColors.accent,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          // Nút Profile / Login
          IconButton(
            icon: auth.isAuthenticated && auth.user?.avatarUrl != null
                ? CircleAvatar(
                    radius: 14,
                    backgroundImage: CachedNetworkImageProvider(auth.user!.avatarUrl!),
                  )
                : const Icon(Icons.account_circle_outlined, size: 26, color: AppColors.primaryDark),
            onPressed: () {
              if (auth.isAuthenticated) {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen()));
              } else {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
              }
            },
          ),
          const SizedBox(width: 6),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => content.fetchHomeData(),
        color: AppColors.primary,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Hero Welcome Banner
              _buildHeroBanner(context),
              const SizedBox(height: 20),

              // 2. Quick Action Grid
              _buildQuickActions(context),
              const SizedBox(height: 24),

              // 3. Đình Làng Giao Tác Spotlight
              _buildHeritageSpotlight(context, content),
              const SizedBox(height: 24),

              // 4. Tin tức & Thông Báo TDP 9
              _buildNewsSection(context, content),
              const SizedBox(height: 24),

              // 5. Bài viết & Ký ức mới nhất
              _buildLatestPostsSection(context, content),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeroBanner(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primary, AppColors.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.25),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.secondaryLight.withOpacity(0.25),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  '🌾 Nơi Nguồn Cội & Ký Ức',
                  style: TextStyle(
                    color: AppColors.secondaryLight,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            'Chào mừng bà con và con em xa quê về với Làng Giao Tác',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w700,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Lưu giữ lịch sử đình làng, kết nối dòng họ và chia sẻ khoảnh khắc quê hương.',
            style: TextStyle(
              color: Colors.white.withOpacity(0.85),
              fontSize: 12,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    final actions = [
      {
        'title': 'Đình Làng',
        'icon': Icons.account_balance_rounded,
        'color': AppColors.primary,
        'bg': AppColors.primarySubtle,
        'screen': const HistoryScreen(),
      },
      {
        'title': 'Album ảnh',
        'icon': Icons.photo_library_rounded,
        'color': const Color(0xFFD97706),
        'bg': const Color(0xFFFEF3C7),
        'screen': const GalleryScreen(),
      },
      {
        'title': 'Tin TDP 9',
        'icon': Icons.newspaper_rounded,
        'color': const Color(0xFFDC2626),
        'bg': const Color(0xFFFEE2E2),
        'screen': const NewsScreen(),
      },
      {
        'title': 'Đồng hương',
        'icon': Icons.people_alt_rounded,
        'color': const Color(0xFF0D9488),
        'bg': const Color(0xFFCCFBF1),
        'screen': const VillagersScreen(),
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 0.85,
      ),
      itemCount: actions.length,
      itemBuilder: (ctx, i) {
        final item = actions[i];
        return InkWell(
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => item['screen'] as Widget));
          },
          borderRadius: BorderRadius.circular(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: item['bg'] as Color,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: (item['color'] as Color).withOpacity(0.2)),
                ),
                child: Icon(item['icon'] as IconData, color: item['color'] as Color, size: 24),
              ),
              const SizedBox(height: 6),
              Text(
                item['title'] as String,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  color: AppColors.ink,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeritageSpotlight(BuildContext context, ContentProvider content) {
    final history = content.history;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.warmBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: AppColors.accent.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.history_edu_rounded, color: AppColors.accent, size: 18),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'Lịch Sử Đình Làng Giao Tác',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primaryDark,
                    ),
                  ),
                ],
              ),
              TextButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const HistoryScreen()));
                },
                child: const Text('Xem tất cả', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primary)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'Khởi lập từ năm Ất Sửu (1685) thời Hậu Lê. Đình làng là biểu tượng văn hóa tâm linh của toàn thể bà con TDP 9 Thuận Lộc.',
            style: TextStyle(
              fontSize: 12,
              color: AppColors.inkMuted,
              height: 1.45,
            ),
          ),
          const SizedBox(height: 12),
          if (history != null && history.timelines.isNotEmpty)
            SizedBox(
              height: 70,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: history.timelines.length.clamp(0, 4),
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (ctx, i) {
                  final m = history.timelines[i];
                  return Container(
                    width: 130,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.warmBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          m.yearLabel,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: AppColors.primary,
                          ),
                        ),
                        Text(
                          m.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppColors.ink,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildNewsSection(BuildContext context, ContentProvider content) {
    final newsList = content.news;
    if (newsList.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            const Text(
              '📢 Bản Tin & Thông Báo TDP 9',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppColors.primaryDark,
              ),
            ),
            TextButton(
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const NewsScreen()));
              },
              child: const Text('Xem thêm', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primary)),
            ),
          ],
        ),
        const SizedBox(height: 6),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: newsList.length.clamp(0, 2),
          separatorBuilder: (_, __) => const SizedBox(height: 8),
          itemBuilder: (ctx, i) {
            final item = newsList[i];
            return Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.red.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            'Chính quyền',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: Colors.red,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          item.source ?? 'Ban Cán Sự TDP 9',
                          style: const TextStyle(
                            fontSize: 11,
                            color: AppColors.inkMuted,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item.title,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.ink,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildLatestPostsSection(BuildContext context, ContentProvider content) {
    final posts = content.posts;
    if (posts.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            const Text(
              '📖 Ký Ức & Tâm Tình Quê Hương',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppColors.primaryDark,
              ),
            ),
            TextButton(
              onPressed: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const PostsScreen()));
              },
              child: const Text('Xem tất cả', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primary)),
            ),
          ],
        ),
        const SizedBox(height: 6),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: posts.length.clamp(0, 3),
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (ctx, i) {
            final p = posts[i];
            return InkWell(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => PostDetailScreen(post: p)));
              },
              borderRadius: BorderRadius.circular(16),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      if (p.coverImageUrl != null)
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: CachedNetworkImage(
                            imageUrl: p.coverImageUrl!,
                            width: 75,
                            height: 75,
                            fit: BoxFit.cover,
                            placeholder: (_, __) => Container(color: AppColors.paper),
                            errorWidget: (_, __) => Container(color: AppColors.paper, child: const Icon(Icons.image)),
                          ),
                        ),
                      if (p.coverImageUrl != null) const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.primarySubtle,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                p.category,
                                style: const TextStyle(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.primaryDark,
                                ),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              p.title,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: AppColors.ink,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Đăng bởi ${p.author?.fullName ?? "Bà con quê hương"}',
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
              ),
            );
          },
        ),
      ],
    );
  }
}
