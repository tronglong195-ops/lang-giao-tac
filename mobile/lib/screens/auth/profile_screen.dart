import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../config/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/custom_app_bar.dart';
import 'login_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.user;

    if (user == null) {
      return Scaffold(
        appBar: const CustomAppBar(title: 'Tài Khoản'),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.account_circle_outlined, size: 64, color: AppColors.inkMuted),
              const SizedBox(height: 16),
              const Text('Bạn chưa đăng nhập.'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
                },
                child: const Text('Đăng nhập ngay'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: CustomAppBar(
        title: 'Hồ Sơ Thành Viên',
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: Colors.red),
            tooltip: 'Đăng xuất',
            onPressed: () async {
              await auth.logout();
              if (context.mounted) Navigator.pop(context);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Avatar
            CircleAvatar(
              radius: 44,
              backgroundColor: AppColors.primarySubtle,
              backgroundImage: user.avatarUrl != null
                  ? CachedNetworkImageProvider(user.avatarUrl!)
                  : null,
              child: user.avatarUrl == null
                  ? Text(
                      user.fullName.isNotEmpty ? user.fullName.substring(0, 1).toUpperCase() : 'U',
                      style: const TextStyle(fontSize: 32, color: AppColors.primary, fontWeight: FontWeight.bold),
                    )
                  : null,
            ),
            const SizedBox(height: 12),

            // Name
            Text(
              user.fullName,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppColors.ink,
              ),
            ),
            const SizedBox(height: 4),

            // Role Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primarySubtle,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                user.role == 'admin'
                    ? '👑 Quản Trị Viên'
                    : user.role == 'moderator'
                    ? '🛡️ Điều Hành Viên'
                    : '🌾 Thành Viên Làng',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primaryDark,
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Info Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _buildInfoRow(Icons.email_outlined, 'Email', user.email),
                    const Divider(color: AppColors.warmBorder),
                    _buildInfoRow(Icons.family_restroom_rounded, 'Dòng họ / Nhóm', user.hometownGroup ?? 'TDP 9 Thuận Lộc'),
                    if (user.currentLocation != null) ...[
                      const Divider(color: AppColors.warmBorder),
                      _buildInfoRow(Icons.location_on_outlined, 'Nơi ở hiện tại', user.currentLocation!),
                    ],
                    if (user.bio != null) ...[
                      const Divider(color: AppColors.warmBorder),
                      _buildInfoRow(Icons.notes_rounded, 'Giới thiệu', user.bio!),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Logout Button
            SizedBox(
              width: double.infinity,
              height: 46,
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.red,
                  side: const BorderSide(color: Colors.red),
                ),
                onPressed: () async {
                  await auth.logout();
                  if (context.mounted) Navigator.pop(context);
                },
                icon: const Icon(Icons.logout_rounded, size: 18),
                label: const Text('Đăng Xuất Tài Khoản'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: AppColors.primary),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(fontSize: 11, color: AppColors.inkMuted),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.ink),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
