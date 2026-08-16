import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:intl/intl.dart';
import '../../config/app_theme.dart';
import '../../data/models/post_model.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/share_modal.dart';

class PostDetailScreen extends StatelessWidget {
  final PostModel post;

  const PostDetailScreen({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd/MM/yyyy');

    return Scaffold(
      appBar: CustomAppBar(
        title: post.title,
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined, color: AppColors.primaryDark),
            onPressed: () {
              ShareModal.show(
                context,
                title: post.title,
                shareUrl: 'https://lang-giao-tac-1.onrender.com/bai-viet/${post.slug}',
                imageUrl: post.coverImageUrl,
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Category Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primarySubtle,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                post.category,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primaryDark,
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Title
            Text(
              post.title,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: AppColors.ink,
                height: 1.35,
              ),
            ),
            const SizedBox(height: 12),

            // Author & Date Info
            Row(
              children: [
                CircleAvatar(
                  radius: 16,
                  backgroundColor: AppColors.primarySubtle,
                  backgroundImage: post.author?.avatarUrl != null
                      ? CachedNetworkImageProvider(post.author!.avatarUrl!)
                      : null,
                  child: post.author?.avatarUrl == null
                      ? Text(
                          post.author?.fullName.isNotEmpty == true
                              ? post.author!.fullName.substring(0, 1).toUpperCase()
                              : 'U',
                          style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold),
                        )
                      : null,
                ),
                const SizedBox(width: 10),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      post.author?.fullName ?? 'Bà con quê hương',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.ink,
                      ),
                    ),
                    Text(
                      post.createdAt != null
                          ? 'Đăng ngày ${dateFormat.format(post.createdAt!)}'
                          : 'Làng Giao Tác',
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.inkMuted,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(color: AppColors.warmBorder),
            const SizedBox(height: 16),

            // Cover Image
            if (post.coverImageUrl != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: CachedNetworkImage(
                  imageUrl: post.coverImageUrl!,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  placeholder: (_, __) => Container(height: 200, color: AppColors.paper),
                ),
              ),
            if (post.coverImageUrl != null) const SizedBox(height: 20),

            // Content Text
            Text(
              post.contentHtml.replaceAll(RegExp(r'<[^>]*>'), ''), // Simple HTML tag stripper
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.ink,
                height: 1.65,
              ),
            ),
            const SizedBox(height: 32),

            // Share Box
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.warmBorder),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Chia sẻ bài viết này với bà con',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.ink),
                  ),
                  ElevatedButton.icon(
                    onPressed: () {
                      ShareModal.show(
                        context,
                        title: post.title,
                        shareUrl: 'https://lang-giao-tac-1.onrender.com/bai-viet/${post.slug}',
                      );
                    },
                    icon: const Icon(Icons.share_rounded, size: 16),
                    label: const Text('Chia sẻ'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
