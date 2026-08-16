import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_theme.dart';
import '../../providers/content_provider.dart';
import '../../widgets/custom_app_bar.dart';

class VillagersScreen extends StatefulWidget {
  const VillagersScreen({super.key});

  @override
  State<VillagersScreen> createState() => _VillagersScreenState();
}

class _VillagersScreenState extends State<VillagersScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedGroup = 'Tất cả';

  final List<String> _groups = [
    'Tất cả',
    'TDP 9 Thuận Lộc (Làng Giao Tác)',
    'Con em xa quê (Hà Nội)',
    'Con em xa quê (TP.HCM / Miền Nam)',
    'Dâu rể quê hương',
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ContentProvider>(context, listen: false).fetchVillagers();
    });
  }

  void _callPhone(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final content = Provider.of<ContentProvider>(context);
    final villagers = content.villagers.where((v) {
      if (_selectedGroup != 'Tất cả' && v.hometownGroup != _selectedGroup) {
        return false;
      }
      final q = _searchController.text.trim().toLowerCase();
      if (q.isNotEmpty) {
        return v.fullName.toLowerCase().contains(q) ||
            (v.currentLocation?.toLowerCase().contains(q) ?? false);
      }
      return true;
    }).toList();

    return Scaffold(
      appBar: const CustomAppBar(
        title: 'Danh Bạ Đồng Hương',
        subtitle: 'Kết nối con em Giao Tác khắp mọi miền',
        showBackButton: false,
      ),
      body: Column(
        children: [
          // Search & Filter Box
          Container(
            padding: const EdgeInsets.all(16),
            color: AppColors.surface,
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Tìm theo tên hoặc nơi ở...',
                    prefixIcon: const Icon(Icons.search_rounded, size: 20, color: AppColors.primary),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    isDense: true,
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear_rounded, size: 16),
                            onPressed: () {
                              _searchController.clear();
                              setState(() {});
                            },
                          )
                        : null,
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  height: 34,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _groups.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (ctx, i) {
                      final grp = _groups[i];
                      final isSelected = grp == _selectedGroup;
                      return ChoiceChip(
                        label: Text(grp),
                        selected: isSelected,
                        onSelected: (val) {
                          if (val) setState(() => _selectedGroup = grp);
                        },
                        selectedColor: AppColors.primarySubtle,
                        labelStyle: TextStyle(
                          fontSize: 11,
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                          color: isSelected ? AppColors.primaryDark : AppColors.ink,
                        ),
                        backgroundColor: AppColors.background,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(
                            color: isSelected ? AppColors.primary : AppColors.warmBorder,
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppColors.warmBorder),

          // Villagers List
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => content.fetchVillagers(),
              color: AppColors.primary,
              child: villagers.isEmpty
                  ? const Center(child: Text('Không tìm thấy thành viên phù hợp.'))
                  : ListView.separated(
                      padding: const EdgeInsets.all(16),
                      itemCount: villagers.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (ctx, i) {
                        final v = villagers[i];
                        return Card(
                          child: Padding(
                            padding: const EdgeInsets.all(12),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  radius: 22,
                                  backgroundColor: AppColors.primarySubtle,
                                  backgroundImage: v.avatarUrl != null
                                      ? CachedNetworkImageProvider(v.avatarUrl!)
                                      : null,
                                  child: v.avatarUrl == null
                                      ? Text(
                                          v.fullName.isNotEmpty ? v.fullName.substring(0, 1).toUpperCase() : 'V',
                                          style: const TextStyle(
                                            color: AppColors.primary,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        )
                                      : null,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        v.fullName,
                                        style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w700,
                                          color: AppColors.ink,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        v.hometownGroup ?? 'TDP 9 Thuận Lộc',
                                        style: const TextStyle(
                                          fontSize: 11,
                                          color: AppColors.primary,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      if (v.currentLocation != null)
                                        Text(
                                          '📍 ${v.currentLocation}',
                                          style: const TextStyle(
                                            fontSize: 11,
                                            color: AppColors.inkMuted,
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                                if (v.phone != null && v.phone!.isNotEmpty)
                                  IconButton(
                                    icon: const Icon(Icons.phone_rounded, color: AppColors.primary),
                                    onPressed: () => _callPhone(v.phone!),
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
