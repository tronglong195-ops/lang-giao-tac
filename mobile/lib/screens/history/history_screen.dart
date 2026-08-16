import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_theme.dart';
import '../../providers/content_provider.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/share_modal.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ContentProvider>(context, listen: false).fetchHistory();
    });
  }

  void _openYoutubeVideo(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final content = Provider.of<ContentProvider>(context);
    final history = content.history;

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Di Tích & Đình Làng',
        subtitle: 'Lịch sử hình thành & phát triển (1685 — Nay)',
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined, color: AppColors.primaryDark),
            onPressed: () {
              ShareModal.show(
                context,
                title: 'Lịch Sử & Đình Làng Giao Tác (Hà Tĩnh)',
                shareUrl: 'https://lang-giao-tac-1.onrender.com/lich-su',
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => content.fetchHistory(),
        color: AppColors.primary,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. YouTube Video Card
              if (history?.youtubeVideoUrl != null)
                _buildVideoCard(context, history!),

              const SizedBox(height: 20),

              // 2. Đình Làng Overview Box
              _buildOverviewBox(context),

              const SizedBox(height: 24),

              // 3. Section Title
              const Text(
                '⏳ Dòng Thời Gian Lịch Sử Làng',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primaryDark,
                ),
              ),
              const SizedBox(height: 16),

              // 4. Timeline Milestones List
              if (history != null && history.timelines.isNotEmpty)
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: history.timelines.length,
                  itemBuilder: (ctx, i) {
                    final item = history.timelines[i];
                    final isLast = i == history.timelines.length - 1;

                    return IntrinsicHeight(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Timeline Bar with Milestone Dot
                          Column(
                            children: [
                              Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  color: AppColors.primary,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AppColors.secondaryLight, width: 3),
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppColors.primary.withOpacity(0.3),
                                      blurRadius: 6,
                                      offset: const Offset(0, 2),
                                    )
                                  ],
                                ),
                                child: Center(
                                  child: Text(
                                    '${i + 1}',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ),
                              if (!isLast)
                                Expanded(
                                  child: Container(
                                    width: 2,
                                    color: AppColors.primaryLight.withOpacity(0.3),
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(width: 12),

                          // Milestone Content Card
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(bottom: 20),
                              child: Card(
                                child: Padding(
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
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: Text(
                                              item.yearLabel,
                                              style: const TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.w800,
                                                color: AppColors.primaryDark,
                                              ),
                                            ),
                                          ),
                                          if (item.significance != null)
                                            Text(
                                              item.significance!,
                                              style: const TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w600,
                                                color: AppColors.accent,
                                              ),
                                            ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        item.title,
                                        style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w700,
                                          color: AppColors.ink,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        item.content,
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: AppColors.inkMuted,
                                          height: 1.45,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
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

  Widget _buildVideoCard(BuildContext context, dynamic history) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            alignment: Alignment.center,
            children: [
              Container(
                height: 180,
                width: double.infinity,
                color: Colors.black87,
                child: Image.network(
                  'https://images.unsplash.com/photo-1548625361-195973b40092?auto=format&fit=crop&w=800&q=80',
                  fit: BoxFit.cover,
                ),
              ),
              Container(
                height: 180,
                color: Colors.black38,
              ),
              InkWell(
                onTap: () => _openYoutubeVideo(history.youtubeVideoUrl!),
                child: Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: Colors.red.shade600,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.4),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.play_arrow_rounded,
                    color: Colors.white,
                    size: 36,
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  history.youtubeTitle ?? 'Video Phục Dựng Đình Làng Giao Tác',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.ink,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  history.youtubeDescription ?? 'Phóng sự tư liệu lịch sử đình làng Thuận Lộc, TX Hồng Lĩnh.',
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.inkMuted,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOverviewBox(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.warmBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '🏛️ Tổng Quan Di Tích',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.primaryDark,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Làng Giao Tác thuộc Tổ dân phố 9, phường Thuận Lộc, thị xã Hồng Lĩnh, tỉnh Hà Tĩnh. Trải qua hơn 340 năm lịch sử, nhân dân Giao Tác luôn gìn giữ truyền thống hiếu học, đoàn kết, cần cù lao động và bảo tồn di tích đình làng uy nghiêm.',
            style: TextStyle(
              fontSize: 12,
              color: AppColors.inkMuted,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}
