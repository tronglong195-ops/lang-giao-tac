import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import '../../config/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/content_provider.dart';
import '../../widgets/custom_app_bar.dart';
import '../auth/login_screen.dart';

class LocalSelectedPhoto {
  final File file;
  String caption;
  int? takenYear;

  LocalSelectedPhoto({required this.file, this.caption = '', this.takenYear});
}

class UploadPhotoScreen extends StatefulWidget {
  final String? preselectedAlbumId;

  const UploadPhotoScreen({super.key, this.preselectedAlbumId});

  @override
  State<UploadPhotoScreen> createState() => _UploadPhotoScreenState();
}

class _UploadPhotoScreenState extends State<UploadPhotoScreen> {
  final ImagePicker _picker = ImagePicker();
  final List<LocalSelectedPhoto> _selectedPhotos = [];
  String? _selectedAlbumId;
  bool _isUploading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _selectedAlbumId = widget.preselectedAlbumId;
  }

  // Chọn nhiều ảnh từ Thư viện (Gallery)
  Future<void> _pickImagesFromGallery() async {
    try {
      final List<XFile> picked = await _picker.pickMultiImage(
        imageQuality: 85,
        maxWidth: 1600,
      );

      if (picked.isNotEmpty) {
        setState(() {
          _selectedPhotos.addAll(
            picked.map((x) => LocalSelectedPhoto(file: File(x.path))),
          );
        });
      }
    } catch (e) {
      setState(() => _error = 'Không thể mở thư viện ảnh: $e');
    }
  }

  // Chụp ảnh trực tiếp từ Camera
  Future<void> _takePhotoWithCamera() async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 85,
        maxWidth: 1600,
      );

      if (photo != null) {
        setState(() {
          _selectedPhotos.add(LocalSelectedPhoto(file: File(photo.path)));
        });
      }
    } catch (e) {
      setState(() => _error = 'Không thể mở máy ảnh: $e');
    }
  }

  // Xóa ảnh đã chọn
  void _removePhoto(int index) {
    setState(() {
      _selectedPhotos.removeAt(index);
    });
  }

  // Bắt đầu tải ảnh lên Server
  Future<void> _submitUpload() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    if (!auth.isAuthenticated) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
      return;
    }

    if (_selectedAlbumId == null || _selectedAlbumId!.isEmpty) {
      setState(() => _error = 'Vui lòng chọn Album để lưu ảnh.');
      return;
    }

    if (_selectedPhotos.isEmpty) {
      setState(() => _error = 'Vui lòng chọn ít nhất 1 bức ảnh.');
      return;
    }

    setState(() {
      _isUploading = true;
      _error = null;
    });

    try {
      final contentProvider = Provider.of<ContentProvider>(context, listen: false);

      // Chuyển đổi các file ảnh sang dạng base64 data URL
      final List<Map<String, dynamic>> photosPayload = [];
      for (final item in _selectedPhotos) {
        final bytes = await item.file.readAsBytes();
        final ext = item.file.path.split('.').last.toLowerCase();
        final mimeType = ext == 'png' ? 'image/png' : 'image/jpeg';
        final base64String = base64Encode(bytes);
        final dataUrl = 'data:$mimeType;base64,$base64String';

        photosPayload.add({
          'imageUrl': dataUrl,
          'caption': item.caption.trim().isNotEmpty ? item.caption.trim() : null,
          'takenYear': item.takenYear,
        });
      }

      final success = await contentProvider.uploadPhotos(
        albumId: _selectedAlbumId!,
        photos: photosPayload,
      );

      if (success) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('🎉 Tải ảnh lên thành công!'),
              backgroundColor: AppColors.primary,
              behavior: SnackBarBehavior.floating,
            ),
          );
          Navigator.pop(context);
        }
      } else {
        setState(() {
          _error = 'Tải ảnh lên thất bại. Vui lòng kiểm tra lại.';
          _isUploading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Lỗi trong quá trình tải ảnh: $e';
        _isUploading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final content = Provider.of<ContentProvider>(context);
    final albums = content.albums;

    // Tự động gán album đầu tiên nếu chưa chọn
    if (_selectedAlbumId == null && albums.isNotEmpty) {
      _selectedAlbumId = albums.first.id;
    }

    return Scaffold(
      appBar: const CustomAppBar(
        title: 'Tải Ảnh Lên Album',
        subtitle: 'Chụp hoặc chọn ảnh từ điện thoại',
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Error Alert
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

            // 1. Chọn Album đích
            const Text(
              'Chọn Album Lưu Ảnh',
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
                  value: _selectedAlbumId,
                  isExpanded: true,
                  hint: const Text('Chọn một album'),
                  items: albums.map((album) {
                    return DropdownMenuItem<String>(
                      value: album.id,
                      child: Text(
                        album.title,
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.ink),
                      ),
                    );
                  }).toList(),
                  onChanged: (val) {
                    setState(() {
                      _selectedAlbumId = val;
                    });
                  },
                ),
              ),
            ),
            const SizedBox(height: 20),

            // 2. Nút Chọn / Chụp ảnh
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _pickImagesFromGallery,
                    icon: const Icon(Icons.photo_library_rounded, size: 18, color: AppColors.primary),
                    label: const Text('Chọn từ Thư viện'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _takePhotoWithCamera,
                    icon: const Icon(Icons.camera_alt_rounded, size: 18, color: AppColors.primary),
                    label: const Text('Chụp từ Camera'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // 3. Danh sách ảnh đã chọn
            if (_selectedPhotos.isNotEmpty) ...[
              Text(
                'Ảnh đã chọn (${_selectedPhotos.length})',
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.ink),
              ),
              const SizedBox(height: 10),
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _selectedPhotos.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (ctx, i) {
                  final item = _selectedPhotos[i];
                  return Card(
                    child: Padding(
                      padding: const EdgeInsets.all(10),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.file(
                              item.file,
                              width: 70,
                              height: 70,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              children: [
                                TextField(
                                  decoration: const InputDecoration(
                                    hintText: 'Mô tả / Chú thích ảnh...',
                                    contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                    isDense: true,
                                  ),
                                  style: const TextStyle(fontSize: 12),
                                  onChanged: (val) => item.caption = val,
                                ),
                                const SizedBox(height: 6),
                                TextField(
                                  decoration: const InputDecoration(
                                    hintText: 'Năm chụp (Ví dụ: 2024)',
                                    contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                    isDense: true,
                                  ),
                                  keyboardType: TextInputType.number,
                                  style: const TextStyle(fontSize: 12),
                                  onChanged: (val) => item.takenYear = int.tryParse(val),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.close_rounded, color: Colors.red, size: 18),
                            onPressed: () => _removePhoto(i),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 24),
            ],

            // 4. Submit Upload Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: _isUploading || _selectedPhotos.isEmpty ? null : _submitUpload,
                icon: _isUploading
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Icon(Icons.cloud_upload_rounded),
                label: Text(
                  _isUploading ? 'Đang tải ảnh lên...' : 'Tải ${_selectedPhotos.length} Ảnh Lên',
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
