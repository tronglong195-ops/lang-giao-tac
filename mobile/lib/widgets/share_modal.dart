import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/app_theme.dart';

class ShareModal extends StatelessWidget {
  final String title;
  final String shareUrl;
  final String? imageUrl;
  final String description;

  const ShareModal({
    super.key,
    required this.title,
    required this.shareUrl,
    this.imageUrl,
    this.description = 'Cùng xem và lưu giữ ký ức quê hương Làng Giao Tác (Hà Tĩnh)',
  });

  static void show(
    BuildContext context, {
    required String title,
    required String shareUrl,
    String? imageUrl,
    String? description,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => ShareModal(
        title: title,
        shareUrl: shareUrl,
        imageUrl: imageUrl,
        description: description ?? 'Cùng xem và lưu giữ ký ức quê hương Làng Giao Tác (Hà Tĩnh)',
      ),
    );
  }

  void _shareToZalo(BuildContext context) async {
    final zaloUrl = Uri.parse('https://zalo.me/share?url=${Uri.encodeComponent(shareUrl)}');
    if (await canLaunchUrl(zaloUrl)) {
      await launchUrl(zaloUrl, mode: LaunchMode.externalApplication);
    } else {
      Share.share('$title\n$shareUrl', subject: title);
    }
  }

  void _shareToFacebook(BuildContext context) async {
    final fbUrl = Uri.parse('https://www.facebook.com/sharer/sharer.php?u=${Uri.encodeComponent(shareUrl)}');
    if (await canLaunchUrl(fbUrl)) {
      await launchUrl(fbUrl, mode: LaunchMode.externalApplication);
    } else {
      Share.share('$title\n$shareUrl', subject: title);
    }
  }

  void _copyLink(BuildContext context) {
    Clipboard.setData(ClipboardData(text: shareUrl));
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Đã sao chép liên kết vào bộ nhớ tạm!'),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Drag Handle
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.warmBorderDark,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),

          // Title
          Text(
            'Chia Sẻ Ký Ức Quê Hương',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  color: AppColors.primaryDark,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.ink,
                ),
          ),
          const SizedBox(height: 20),

          // Quick Share Buttons Grid
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              // Zalo
              _buildShareIcon(
                iconColor: const Color(0xFF0068FF),
                bgColor: const Color(0xFF0068FF).withOpacity(0.1),
                label: 'Zalo',
                icon: Icons.chat_bubble_outline,
                onTap: () => _shareToZalo(context),
              ),

              // Facebook
              _buildShareIcon(
                iconColor: const Color(0xFF1877F2),
                bgColor: const Color(0xFF1877F2).withOpacity(0.1),
                label: 'Facebook',
                icon: Icons.facebook,
                onTap: () => _shareToFacebook(context),
              ),

              // Hệ thống (Share Plus)
              _buildShareIcon(
                iconColor: AppColors.primary,
                bgColor: AppColors.primarySubtle,
                label: 'Khác',
                icon: Icons.share_rounded,
                onTap: () {
                  Navigator.pop(context);
                  Share.share('$title\n$shareUrl', subject: title);
                },
              ),

              // Sao chép liên kết
              _buildShareIcon(
                iconColor: AppColors.accent,
                bgColor: AppColors.accent.withOpacity(0.1),
                label: 'Sao chép',
                icon: Icons.copy_rounded,
                onTap: () => _copyLink(context),
              ),
            ],
          ),

          const SizedBox(height: 24),
          const Divider(color: AppColors.warmBorder),
          const SizedBox(height: 12),

          // Mã QR Code chia sẻ trực tiếp
          Text(
            'Quét Mã QR Đón Xem Trực Tiếp',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontSize: 13,
                  color: AppColors.inkMuted,
                ),
          ),
          const SizedBox(height: 12),

          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.warmBorder),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                )
              ],
            ),
            child: QrImageView(
              data: shareUrl,
              version: QrVersions.auto,
              size: 140.0,
              eyeStyle: const QrEyeStyle(
                eyeShape: QrEyeShape.square,
                color: AppColors.primaryDark,
              ),
              dataModuleStyle: const QrDataModuleStyle(
                dataModuleShape: QrDataModuleShape.square,
                color: AppColors.primary,
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildShareIcon({
    required Color iconColor,
    required Color bgColor,
    required String label,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                color: bgColor,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 26),
            ),
            const SizedBox(height: 6),
            Text(
              label,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppColors.ink,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
