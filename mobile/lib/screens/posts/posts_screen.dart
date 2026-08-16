import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../config/app_theme.dart';
import '../../providers/content_provider.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/share_modal.dart';
import 'post_detail_screen.dart';
import 'create_post_screen.dart';

class PostsScreen extends StatefulWidget {
  const PostsScreen({super.key});

  @override
  State<PostsScreen> createState() => _PostsScreenState();
}

class _PostsScreenState extends State<PostsScreen> {
  String _selectedCategory = 'Tất cả';
  final List<String> _categories = [
    'Tất cả',
    'Ký ức & Tâm tình',
    'Dòng họ & Gia phả',
    'Ca khúc quê hương',
    'Phong tục tập quán',
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ContentProvider>(context, listen: false).fetchPosts();
    });
  }

  @override
  Widget build(BuildContext context) {
    final content = Provider.of<ContentProvider>(context);
    final posts = content.posts.where((p) {
      if (_selectedCategory == 'Tất cả') return true;
      return p.category == _selectedCategory;
    }).toList();

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Bài Viết & Ký Ức',
        subtitle: 'Tâm tình, dòng họ, ca khúc quê hương',
        showBackButton: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_note_rounded, color: AppColors.primary, size: 28),
            tooltip: 'Viết bài mới',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CreatePostScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.share_outlined, color: AppColors.primaryDark),
            onPressed: () {
              ShareModal.show(
                context,
                title: 'Bài Viết & Ký Ức Làng Giao Tác',
                shareUrl: 'https://lang-giao-tac-1.onrender.com/bai-viet',
              );
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CreatePostScreen()),
          );
        },
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.edit_rounded),
        label: const Text('Viết Bài', style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: Column(
        children: [
          // Category Pills
          Container(
            height: 48,
            color: AppColors.surface,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              itemCount: _categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (ctx, i) {
                final cat = _categories[i];
                final isSelected = cat == _selectedCategory;
                return ChoiceChip(
                  label: Text(cat),
                  selected: isSelected,
                  onSelected: (val) {
                    if (val) {
                      setState(() => _selectedCategory = cat);
                    }
                  },
                  selectedColor: AppColors.primarySubtle,
                  labelStyle: TextStyle(
                    fontSize: 12,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    color: isSelected ? AppColors.primaryDark : AppColors.ink,
                  ),
                  backgroundColor: AppColors.background,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                    side: BorderSide(
                      color: isSelected ? AppColors.primary : AppColors.warmBorder,
                    ),
                  ),
                );
              },
            ),
          ),
          const Divider(height: 1, color: AppColors.warmBorder),

          // Posts List
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => content.fetchPosts(),
              color: AppColors.primary,
              child: posts.isEmpty
                  ? const Center(child: Text('Chưa có bài viết nào trong danh mục này.'))
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: posts.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (ctx, i) {
                        final post = posts[i];
                        return InkWell(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => PostDetailScreen(post: post),
                              ),
                            );
                          },
                          borderRadius: BorderRadius.circular(16),
                          child: Card(
                            clipBehavior: Clip.antiAlias,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                if (post.coverImageUrl != null)
                                  CachedNetworkImage(
                                    imageUrl: post.coverImageUrl!,
                                    height: 160,
                                    width: double.infinity,
                                    fit: BoxFit.cover,
                                    placeholder: (_, __) => Container(color: AppColors.paper),
                                    errorWidget: (_, __) => Container(
                                      color: AppColors.paper,
                                      child: const Icon(Icons.image),
                                    ),
                                  ),
                                Padding(
                                  padding: const EdgeInsets.all(14),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.between,
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                            decoration: BoxDecoration(
                                              color: AppColors.primarySubtle,
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              post.category,
                                              style: const TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w700,
                                                color: AppColors.primaryDark,
                                              ),
                                            ),
                                          ),
                                          Row(
                                            children: [
                                              const Icon(Icons.chat_bubble_outline_rounded, size: 14, color: AppColors.inkMuted),
                                              const SizedBox(width: 4),
                                              Text(
                                                '${post.commentCount}',
                                                style: const TextStyle(fontSize: 11, color: AppColors.inkMuted),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        post.title,
                                        style: const TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w700,
                                          color: AppColors.ink,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Row(
                                        children: [
                                          const Icon(Icons.person_outline_rounded, size: 14, color: AppColors.inkMuted),
                                          const SizedBox(width: 4),
                                          Text(
                                            post.author?.fullName ?? 'Bà con quê hương',
                                            style: const TextStyle(
                                              fontSize: 11,
                                              color: AppColors.inkMuted,
                                            ),
                                          ),
                                        ],
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
          ),
        ],
      ),
    );
  }
}
