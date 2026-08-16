import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/content_provider.dart';
import '../../widgets/custom_app_bar.dart';
import '../auth/login_screen.dart';

class CreatePostScreen extends StatefulWidget {
  const CreatePostScreen({super.key});

  @override
  State<CreatePostScreen> createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends State<CreatePostScreen> {
  final _titleController = TextEditingController();
  final _contentController = TextEditingController();
  final _imageUrlController = TextEditingController();
  String _selectedCategory = 'Ký ức & Tâm tình';
  bool _isSubmitting = false;
  String? _error;

  final List<String> _categories = [
    'Ký ức & Tâm tình',
    'Dòng họ & Gia phả',
    'Ca khúc quê hương',
    'Phong tục tập quán',
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    _imageUrlController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (!auth.isAuthenticated) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
      return;
    }

    final title = _titleController.text.trim();
    final content = _contentController.text.trim();
    final imageUrl = _imageUrlController.text.trim();

    if (title.isEmpty || content.isEmpty) {
      setState(() => _error = 'Vui lòng nhập đầy đủ tiêu đề và nội dung.');
      return;
    }

    setState(() {
      _isSubmitting = true;
      _error = null;
    });

    final contentProvider = Provider.of<ContentProvider>(context, listen: false);
    final success = await contentProvider.createPost(
      title: title,
      contentHtml: content,
      coverImageUrl: imageUrl.isNotEmpty ? imageUrl : null,
      category: _selectedCategory,
    );

    if (success) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🎉 Đăng bài viết thành công!'),
            backgroundColor: AppColors.primary,
            behavior: SnackBarBehavior.floating,
          ),
        );
        Navigator.pop(context);
      }
    } else {
      setState(() {
        _error = 'Đăng bài không thành công. Vui lòng thử lại sau.';
        _isSubmitting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    if (!auth.isAuthenticated) {
      return Scaffold(
        appBar: const CustomAppBar(title: 'Viết Bài Mới'),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.lock_outline_rounded, size: 56, color: AppColors.primary),
                const SizedBox(height: 16),
                const Text(
                  'Cần Đăng Nhập',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.primaryDark),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Vui lòng đăng nhập tài khoản thành viên để chia sẻ câu chuyện và bài viết của bạn.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, color: AppColors.inkMuted),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
                  },
                  child: const Text('Đăng nhập ngay'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: const CustomAppBar(
        title: 'Viết Bài Mới',
        subtitle: 'Chia sẻ tâm tình & ký ức quê nhà',
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_error != null)
              Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline_rounded, color: Colors.red, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _error!,
                        style: const TextStyle(color: Colors.red, fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),

            // Tiêu đề
            const Text(
              'Tiêu đề bài viết *',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.ink),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                hintText: 'Nhập tiêu đề bài viết (Ví dụ: Nhớ mùa gặt làng Giao Tác)...',
              ),
            ),
            const SizedBox(height: 16),

            // Danh mục
            const Text(
              'Chuyên mục *',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.ink),
            ),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.warmBorder),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedCategory,
                  isExpanded: true,
                  items: _categories.map((cat) {
                    return DropdownMenuItem<String>(
                      value: cat,
                      child: Text(
                        cat,
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.ink),
                      ),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) {
                      setState(() => _selectedCategory = val);
                    }
                  },
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Link Ảnh Bìa
            const Text(
              'Link ảnh bìa (Tùy chọn)',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.ink),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _imageUrlController,
              decoration: const InputDecoration(
                hintText: 'https://images.unsplash.com/...',
              ),
            ),
            const SizedBox(height: 16),

            // Nội dung
            const Text(
              'Nội dung câu chuyện *',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.ink),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _contentController,
              maxLines: 8,
              decoration: const InputDecoration(
                hintText: 'Viết những kỷ niệm, câu chuyện văn hóa, con người làng Giao Tác...',
              ),
            ),
            const SizedBox(height: 24),

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: _isSubmitting ? null : _submit,
                icon: _isSubmitting
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Icon(Icons.send_rounded),
                label: Text(
                  _isSubmitting ? 'Đang đăng bài...' : 'Đăng Bài Viết',
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
