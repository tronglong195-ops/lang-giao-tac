import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../config/app_theme.dart';
import '../../providers/content_provider.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/share_modal.dart';

class NewsScreen extends StatelessWidget {
  const NewsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final content = Provider.of<ContentProvider>(context);
    final newsList = content.news;
    final dateFormat = DateFormat('dd/MM/yyyy');

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Bản Tin & Thông Báo',
        subtitle: 'Thông tin chính quyền & TDP 9 Thuận Lộc',
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined, color: AppColors.primaryDark),
            onPressed: () {
              ShareModal.show(
                context,
                title: 'Bản Tin & Thông Báo Làng Giao Tác (TDP 9)',
                shareUrl: 'https://lang-giao-tac-1.onrender.com/tin-tuc',
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => content.fetchHomeData(),
        color: AppColors.primary,
        child: newsList.isEmpty
            ? const Center(child: Text('Chưa có thông báo mới nào.'))
            : ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: newsList.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (ctx, i) {
                  final item = newsList[i];
                  return Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.red.shade50,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  item.isOfficial ? '👑 Thông Báo Chính Quyền' : 'Bản Tin Làng',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w700,
                                    color: Colors.red.shade700,
                                  ),
                                ),
                              ),
                              if (item.publishedAt != null)
                                Text(
                                  dateFormat.format(item.publishedAt!),
                                  style: const TextStyle(fontSize: 11, color: AppColors.inkMuted),
                                ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text(
                            item.title,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: AppColors.ink,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            item.contentHtml.replaceAll(RegExp(r'<[^>]*>'), ''),
                            style: const TextStyle(
                              fontSize: 13,
                              color: AppColors.inkMuted,
                              height: 1.5,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Nguồn: ${item.source ?? "Ban Cán Sự TDP 9"}',
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontStyle: FontStyle.italic,
                                  color: AppColors.inkMuted,
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.share_outlined, size: 18, color: AppColors.primary),
                                onPressed: () {
                                  ShareModal.show(
                                    context,
                                    title: item.title,
                                    shareUrl: 'https://lang-giao-tac-1.onrender.com/tin-tuc/${item.slug}',
                                  );
                                },
                              ),
                            ],
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
