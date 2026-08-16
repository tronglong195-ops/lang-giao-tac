# Ứng Dụng Di Động Làng Giao Tác (Flutter — Android & iOS)

Ứng dụng di động chính thức của **Làng Giao Tác** (Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh), được xây dựng bằng **Flutter & Dart**, kết nối trực tiếp với hệ thống máy chủ Backend Production (`https://lang-giao-tac.onrender.com`).

---

## 📱 Các Tính Năng Nổi Bật

1. **Trang Chủ Quê Hương:**
   - Cập nhật tin tức, sự kiện nổi bật, dòng thời gian lịch sử và bài viết mới nhất.
2. **Di Tích Đình Làng (1685 — Nay):**
   - 6 mốc son lịch sử lập làng và xây dựng đình làng.
   - Video tư liệu phục dựng Đình Làng Giao Tác xem trực tiếp.
3. **Thư Viện Album Ảnh & Tải Ảnh:**
   - Xem kho ảnh quê hương, phóng to/thu nhỏ toàn màn hình mượt mà.
   - **Chụp ảnh từ Camera hoặc chọn nhiều ảnh từ Thư viện** điện thoại để đóng góp vào album quê nhà.
4. **Chia Sẻ Đa Nền Tảng:**
   - Nút chia sẻ 1-chạm sang **Zalo**, **Facebook**, **Messenger** và tạo mã **QR Code**.
5. **Ký Ức & Bài Viết:**
   - Đọc và chia sẻ bài viết, câu chuyện dòng họ, ca khúc quê hương.
   - Viết bài mới trực tiếp từ điện thoại.
6. **Danh Bạ Đồng Hương:**
   - Kết nối bà con xa quê khắp mọi miền đất nước (Hà Nội, TP.HCM, Miền Nam...).
   - Tìm kiếm nhanh và gọi điện thoại trực tiếp.
7. **Đăng Nhập & Bảo Mật:**
   - Hỗ trợ đăng nhập Email & Mật khẩu hoặc Google Sign-In bảo mật.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Yêu Cầu Tiên Quyết:
- Đã cài đặt **Flutter SDK** (phiên bản `>= 3.0.0`)
- **Android Studio** (để chạy Android / xuất file APK)
- **Xcode** (trên máy Mac nếu muốn build iOS)

### 1. Cài đặt các thư viện (Dependencies):
Mở terminal trong thư mục `mobile`:
```bash
cd mobile
flutter pub get
```

### 2. Chạy ứng dụng ở chế độ Debug:
```bash
# Chạy trên thiết bị Android / Giả lập:
flutter run

# Hoặc chọn thiết bị cụ thể:
flutter devices
flutter run -d <device-id>
```

---

## 📦 Hướng Dẫn Xuất File Cài Đặt (Build APK / IPA)

### 1. Xuất file APK cài đặt trực tiếp cho Android:
Chạy lệnh:
```bash
flutter build apk --release
```
File cài đặt APK sẽ được tạo tại:
👉 **`mobile/build/app/outputs/flutter-apk/app-release.apk`**

Bạn chỉ cần chép file `.apk` này sang điện thoại Android hoặc gửi qua Zalo là có thể cài đặt và sử dụng ngay lập tức!

### 2. Xuất file App Bundle (đăng lên Google Play Store):
```bash
flutter build appbundle --release
```
File `.aab` tại: `mobile/build/app/outputs/bundle/release/app-release.aab`

### 3. Xuất file cho iOS (iPhone/iPad):
```bash
flutter build ios --release
```
Mở file `mobile/ios/Runner.xcworkspace` bằng **Xcode** để cài đặt trực tiếp lên iPhone hoặc phát hành qua TestFlight / App Store.
