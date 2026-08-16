# 🌾 CỔNG THÔNG TIN CỘNG ĐỒNG LÀNG GIAO TÁC
### TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, Tỉnh Hà Tĩnh

> **Hệ sinh thái Đa nền tảng (Web & Mobile App)** kết nối bà con quê hương và con em xa xứ, lưu giữ ký ức, gia phả dòng họ, văn hóa, danh bạ đồng hương, tin tức chính quyền, di tích lịch sử và thư viện hình ảnh qua các thời kỳ.

---

## 🌐 HỆ THỐNG ĐANG HOẠT ĐỘNG (PRODUCTION)

- 🌍 **Website Chính Thức:** [https://lang-giao-tac-1.onrender.com](https://lang-giao-tac-1.onrender.com)
- ⚙️ **Backend RESTful API:** [https://lang-giao-tac.onrender.com/api](https://lang-giao-tac.onrender.com/api)
- 📱 **Trình Giả Lập Mobile:** [https://lang-giao-tac-1.onrender.com/gia-lap](https://lang-giao-tac-1.onrender.com/gia-lap)
- 📦 **Tải App Android (APK):** Tải trực tiếp file `.apk` trong mục [GitHub Actions Artifacts](../../actions)

---

## 🏛️ CÔNG NGHỆ & KIẾN TRÚC (TECH STACK)

### 1. Web Frontend (`frontend/`)
- **Core:** React 18 + Vite 5 (Fast Refresh, Bundle Minification).
- **Styling:** Tailwind CSS + Design System phong cách đồng quê Việt Nam cổ truyền.
- **Bản đồ:** React-Leaflet + Leaflet + OpenStreetMap (Tọa độ chuẩn di tích TDP 9 Thuận Lộc).
- **Trình soạn thảo:** Tiptap Rich Text Editor đầy đủ công cụ định dạng và tải ảnh.
- **Xác thực:** Google Identity Services SDK (Google One-Tap & Sign-In chính thức).
- **Âm nhạc:** Trình phát nhạc nền quê hương (*Hà Tĩnh Nhớ Về...*).
- **Trình giả lập:** Mobile Simulator mô phỏng iPhone 15 Pro & Samsung Galaxy S24 tương tác cảm ứng.

### 2. Backend Server (`backend/`)
- **Nền tảng:** Node.js + Express.js (Kiến trúc Module hóa: `auth`, `posts`, `news`, `albums`, `photos`, `events`, `villagers`, `history`, `comments`, `heroSlides`, `admin`).
- **Cơ sở dữ liệu:** PostgreSQL thông qua Prisma ORM (Tự động migrate & auto-seed).
- **Xác thực & Bảo mật:**
  - JWT Access Token (15 phút) + Refresh Token (7 ngày qua `httpOnly` cookie).
  - Xác thực Google OAuth server-side qua `google-auth-library` (`idToken`).
  - Auth Rate Limiter bảo vệ chống tấn công Brute-Force (`express-rate-limit`).
  - `helmet` bảo vệ HTTP security headers.
  - CORS Whitelist đa môi trường (Render & Localhost).

### 3. Ứng Dụng Di Động (`mobile/`)
- **Framework:** Flutter 3.24+ & Dart.
- **Kiến trúc:** Clean MVVM Layered Architecture (`Models` ➔ `Services` ➔ `Repositories` ➔ `Providers` ➔ `Screens`).
- **Nền tảng hỗ trợ:** Android (APK / App Bundle) & iOS (iPhone / iPad).
- **Tính năng nổi bật:** Chụp/chọn nhiều ảnh từ thư viện tải lên Album, phóng to ảnh toàn màn hình, chia sẻ Zalo / Facebook / QR Code, gọi điện nhanh từ danh bạ đồng hương.
- **CI/CD Tự động:** GitHub Actions Workflow (`.github/workflows/build-apk.yml`) tự động biên dịch file `.apk` cài đặt trực tiếp.

---

## 🎨 BẢNG MÀU & THIẾT KẾ ĐẬM BẢN SẮC DÂN TỘC

| Màu sắc | Mã màu | Ý nghĩa biểu trưng |
| :--- | :--- | :--- |
| **Xanh lá mạ** | `#4A7C59` | Lũy tre xanh, bờ dâu non xanh mướt của làng quê |
| **Xanh tre già** | `#2F4F3A` | Bóng đa cổ thụ, sự trường tồn của làng quê |
| **Vàng rơm** | `#D9A441` | Mùa lúa chín vàng, sự trù phú và ấm no |
| **Nâu đất phù sa** | `#8B5E3C` | Đất bãi bồi ven sông Lam, gốm mộc dân dã |
| **Đỏ son đình làng** | `#C14953` | Mái ngói vảy cá, câu đối cổ Đình Làng Giao Tác |
| **Nền giấy dó** | `#FBF6EC` | Giấy dó cổ truyền ấm áp, thanh nhã |
| **Màu ngà bề mặt** | `#FFFDF7` | Tươi sáng, dễ đọc trên mọi thiết bị |

- **Kiểu chữ:** Google Fonts *"Be Vietnam Pro"* — Tối ưu hiển thị dấu tiếng Việt sắc nét.

---

## 📁 CẤU TRÚC DỰ ÁN

```text
lang-giao-tac/
├── .github/
│   └── workflows/
│       └── build-apk.yml              # CI/CD tự động build file APK Android trên Cloud
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma              # Schema PostgreSQL đầy đủ 9 Models
│   │   └── seed.js                    # Script nạp dữ liệu mẫu Làng Giao Tác
│   ├── src/
│   │   ├── config/                    # db.js, autoSeed.js (Tự nạp data khi khởi động)
│   │   ├── middlewares/               # authGuard.js, roleGuard.js
│   │   ├── modules/                   # auth, posts, news, albums, photos, events, villagers, history, admin
│   │   ├── utils/                     # jwt.js, slugify.js
│   │   ├── app.js                     # Express app, Helmet, CORS whitelist
│   │   └── server.js                  # Entrypoint khởi chạy server
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── index.html                     # Be Vietnam Pro Font, Leaflet & Google GIS SDK
│   ├── src/
│   │   ├── components/                # Navbar, Footer, VillageMap, MusicPlayer, TiptapEditor, Lightbox
│   │   ├── context/AuthContext.jsx    # Authentication & Profile Context
│   │   ├── services/api.js            # Axios Client + Auto-refresh JWT Token
│   │   ├── pages/                     # HomePage, HistoryPage, GalleryPage, PostPage, MobileSimulatorPage...
│   │   ├── App.jsx                    # Central Routing Configuration
│   │   └── index.css                  # Tailwind CSS & Cultural Design Tokens
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── mobile/
│   ├── android/                       # Cấu hình Native Android & Gradle
│   ├── ios/                           # Cấu hình Native iOS (Runner)
│   ├── lib/
│   │   ├── config/                    # api_constants.dart, app_theme.dart
│   │   ├── data/                      # models, services, repositories
│   │   ├── providers/                 # auth_provider.dart, content_provider.dart
│   │   ├── screens/                   # home, history, gallery, posts, news, villagers, auth
│   │   ├── widgets/                   # custom_app_bar.dart, share_modal.dart
│   │   └── main.dart                  # Flutter App Entrypoint
│   ├── pubspec.yaml
│   └── README.md
├── DEPLOY_GUIDE.md                    # Hướng dẫn chi tiết Deploy Render & Vercel
└── README.md
```

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY DỰ ÁN CỤC BỘ (LOCAL DEV)

### 1. Cấu hình Môi Trường (`.env`)

#### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/lang_giao_tac?schema=public"
JWT_ACCESS_SECRET="giao_tac_access_token_secret_key_super_secure_2026"
JWT_REFRESH_SECRET="giao_tac_refresh_token_secret_key_super_secure_2026"
GOOGLE_CLIENT_ID="17339925701-s0tiajuplhl8e5h0o4epke98ksm3g00r.apps.googleusercontent.com"
FRONTEND_URL="http://localhost:5173"
```

#### Frontend (`frontend/.env`):
```env
VITE_API_URL="http://localhost:5000/api"
VITE_GOOGLE_CLIENT_ID="17339925701-s0tiajuplhl8e5h0o4epke98ksm3g00r.apps.googleusercontent.com"
```

---

### 2. Khởi Chạy Web & Backend

```bash
# 1. Cài đặt và khởi chạy Backend (Port 5000):
cd backend
npm install
npx prisma db push
npm run prisma:seed
npm run dev

# 2. Cài đặt và khởi chạy Frontend (Port 5173):
cd ../frontend
npm install
npm run dev
```

Truy cập: **`http://localhost:5173`** hoặc **`http://localhost:5173/gia-lap`** (Trình giả lập Mobile).

---

### 3. Khởi Chạy Ứng Dụng Di Động (Flutter)

```bash
cd mobile
flutter pub get

# Chạy trực tiếp trên máy ảo hoặc điện thoại kết nối qua USB:
flutter run

# Xuất file APK Release cài vào điện thoại:
flutter build apk --release
# File APK tại: mobile/build/app/outputs/flutter-apk/app-release.apk
```

---

## 👥 TÀI KHOẢN MẪU ĐỂ TRẢI NGHIỆM

| Vai trò | Email | Mật khẩu | Chức năng |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@langgiaotac.vn` | `123456` | Toàn quyền duyệt bài, duyệt ảnh, quản lý thành viên, CRUD tin tức & lịch sử |
| **Điều hành viên (Mod)** | `mod@langgiaotac.vn` | `123456` | Duyệt bài viết và kiểm duyệt hình ảnh của dân làng tải lên |
| **Dân làng (Member)** | `nguyenthimai@gmail.com` | `123456` | Đăng bài viết, tải nhiều ảnh vào album, bình luận, kết nối đồng hương |
| **Đăng nhập nhanh Google** | *Bất kỳ Gmail nào* | *Google OAuth* | Tự động liên kết tài khoản thành viên sau 1 cú nhấp |

---

## 🗺️ TỔNG HỢP CÁC TRANG & TÍNH NĂNG CHÍNH

- `/` — **Trang Chủ:** Banner trình chiếu, video giới thiệu Đình Làng, tin tức nóng, album tiêu biểu, danh sách mốc lịch sử.
- `/lich-su` — **Lịch Sử Làng:** Dòng thời gian 6 mốc son từ năm 1685 đến nay và phóng sự di tích lịch sử cấp Tỉnh.
- `/thu-vien-anh` & `/thu-vien-anh/:id` — **Thư Viện Ảnh:** Kho tư liệu ảnh chất lượng cao, hỗ trợ xem phóng to Lightbox và tải ảnh trực tiếp từ điện thoại.
- `/bai-viet` & `/bai-viet/:slug` — **Bài Viết & Ký Ức:** Đọc và chia sẻ bài viết, câu chuyện dòng họ, ẩm thực quê hương kèm bình luận.
- `/bai-viet/viet-bai` — **Soạn Bài Viết:** Trình soạn thảo văn bản phong phú Tiptap, đính kèm ảnh bìa.
- `/tin-tuc` & `/tin-tuc/:slug` — **Tin Tức & Thông Báo:** Bản tin chính quyền và hoạt động của TDP 9 Thuận Lộc.
- `/dong-huong` — **Danh Bạ Đồng Hương:** Kết nối bà con xa quê tại Hà Nội, TP.HCM và các tỉnh thành, hỗ trợ gọi điện nhanh.
- `/ban-do` — **Bản Đồ Di Tích:** Tọa độ GPS chuẩn xác Đình Làng Giao Tác, Nhà văn hóa TDP 9, Giếng cổ, Nhà thờ các dòng tộc.
- `/su-kien` — **Lịch Sự Kiện:** Lịch lễ hội rước thần nông, hội làng, giải thể thao hàng năm.
- `/gia-lap` — **Mobile Simulator:** Trình giả lập điện thoại chân thực để kiểm thử giao diện mobile ngay trên máy tính.
- `/dang-nhap` & `/dang-ky` — **Xác Thực:** Đăng nhập an toàn bằng Email hoặc Google Sign-In chính thức.
- `/quan-tri` — **Trang Quản Trị:** Bảng điều khiển quản lý nội dung và phê duyệt tài nguyên toàn hệ thống.

---

## 📜 BẢN QUYỀN & LIÊN HỆ

- **Đơn vị vận hành:** Ban Liên Lạc & Con em Làng Giao Tác — TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, Tỉnh Hà Tĩnh.
- **Admin / Kỹ thuật:** Nguyễn Trọng Long (SĐT: `0832991002` | Email: `banquantri@langgiaotac.vn`).
- **Giấy phép:** Mã nguồn mở phục vụ cộng đồng quê hương.
