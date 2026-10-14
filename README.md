# 🌾 CỔNG THÔNG TIN CỘNG ĐỒNG LÀNG GIAO TÁC
### TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, Tỉnh Hà Tĩnh

> **Hệ sinh thái Đa nền tảng (Web & Mobile App)** kết nối bà con quê hương và con em xa xứ, lưu giữ ký ức, gia phả dòng họ, văn hóa, danh bạ đồng hương, tin tức chính quyền, di tích lịch sử và thư viện hình ảnh qua các thời kỳ.

---

## 🌐 HỆ THỐNG ĐANG HOẠT ĐỘNG (PRODUCTION)

- 🌍 **Website Chính Thức (Tốc độ cao trên Google CDN):**  
  👉 **[https://lang-giao-tac-tdp9.web.app](https://lang-giao-tac-tdp9.web.app)**
- 📱 **Trình Giả Lập Mobile:**  
  👉 **[https://lang-giao-tac-tdp9.web.app/gia-lap](https://lang-giao-tac-tdp9.web.app/gia-lap)**
- 📁 **Kho Mã Nguồn GitHub:**  
  👉 **[https://github.com/tronglong195-ops/lang-giao-tac](https://github.com/tronglong195-ops/lang-giao-tac)**
- 📦 **Tải App Android (APK):** Tải file `.apk` cài đặt trực tiếp trong mục [GitHub Releases / Actions](../../actions)

---

## 🏛️ KIẾN TRÚC HỆ THỐNG MỚI (MODERN SERVERLESS ARCHITECTURE)

Hệ thống đã được chuyển đổi hoàn toàn sang kiến trúc **Serverless trên nền tảng Google Cloud & Firebase**, khắc phục triệt để tình trạng máy chủ bị "ngủ đông" (Cold Start 30-50s) của các nền tảng cũ:

```text
[Người Dùng: Web / Mobile]
            │
            ▼
┌────────────────────────────────────────────────────────┐
│               GOOGLE GLOBAL CDN & EDGE                 │
│         Firebase Hosting (Tốc độ phản hồi < 1s)        │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│Firebase Auth │     │Cloud Fire-   │     │Google Apps   │
│(Đăng nhập    │     │store Database│     │Script Webhook│
│Google & Email│     │(Lưu trữ dữ   │     │(Gửi email    │
│bảo mật cao)  │     │liệu realtime)│     │thông báo 0đ) │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │   GOOGLE DRIVE 2TB &      │
              │   SHEETS 2-WAY SYNC       │
              │  (Tận dụng kho Google Pro)│
              └───────────────────────────┘
```

### 1. Web Frontend (`frontend/`)
- **Nền tảng:** React 18 + Vite 5 (Tối ưu hóa dung lượng minified bundle, Fast Refresh).
- **Lưu trữ & Phân phối:** **Firebase Hosting** với Google Global CDN (bảo mật SSL/HTTPS tự động, phản hồi tức thì, không bao giờ ngủ đông).
- **Giao diện:** Tailwind CSS + Design System phong cách đồng quê Bắc Trung Bộ truyền thống.
- **Bản đồ tương tác:** React-Leaflet + OpenStreetMap (Tọa độ GPS chuẩn xác Đình Làng, Nhà văn hóa, Giếng cổ, Nhà thờ các dòng tộc).
- **Soạn thảo:** Tiptap Rich Text Editor hỗ trợ định dạng, tải ảnh và chèn video.
- **Trình giả lập di động:** Mobile Simulator mô phỏng iPhone 15 Pro & Galaxy S24 trực tiếp trên trình duyệt.

### 2. Dữ Liệu & Xác Thực Serverless
- **Cơ sở dữ liệu:** **Google Cloud Firestore** (Real-time NoSQL Database):
  - Tự động đồng bộ thời gian thực, lưu trữ thông báo làng, bài viết, tin tức Phường Nam Hồng Lĩnh, thư viện 30+ ảnh tư liệu, 3 Album lớn và danh bạ đồng hương.
  - Phân quyền an toàn qua [`firestore.rules`](./firestore.rules) (chống ghi đè, bảo vệ dữ liệu công khai và dữ liệu quản trị viên).
- **Hệ thống xác thực:** **Firebase Authentication**:
  - Đăng nhập một chạm bằng Google (Google One-Tap / Popup).
  - Đăng nhập bằng Email & Mật khẩu bảo mật tiêu chuẩn quốc tế.
  - Tự động cấp quyền Quản trị viên (Admin) cho email ban quản trị (`tronglong195@gmail.com`).

### 3. Thông Báo & Tích Hợp Google Pro
- **Thông báo Email tự động:** `emailAlertService.js` tự động gửi email thông báo chi tiết khi:
  - Có người đăng nhập (kèm thời gian, thiết bị, IP).
  - Có thành viên mới đăng ký tài khoản.
  - Có bài viết hoặc hình ảnh mới gửi chờ duyệt.
  - Hỗ trợ gửi trực tiếp qua Google Apps Script Webhook (miễn phí 100% từ chính Gmail của bạn).
- **Đồng bộ Google Drive & Sheets:** Tận dụng kho lưu trữ 2.000 GB (2 TB) của tài khoản Google Pro để lưu trữ video hội làng 4K, album ảnh dung lượng lớn mà không sợ đầy bộ nhớ.

### 4. Ứng Dụng Di Động (`mobile/`)
- **Framework:** Flutter 3.24+ & Dart (Android & iOS).
- **Kiến trúc:** Clean MVVM (`Models` ➔ `Services` ➔ `Repositories` ➔ `Providers` ➔ `Screens`).
- **Tính năng:** Đọc tin tức, duyệt phả hệ, tải ảnh lên album, tra cứu danh bạ gọi điện nhanh, chia sẻ mạng xã hội.

---

## 🎨 BẢNG MÀU ĐẬM BẢN SẮC TRUYỀN THỐNG

| Màu sắc | Mã Hex | Ý nghĩa văn hóa biểu trưng |
| :--- | :--- | :--- |
| **Xanh lá mạ** | `#4A7C59` | Bờ tre xanh mát, cánh đồng lúa non Thuận Lộc |
| **Xanh tre già** | `#2F4F3A` | Bóng đa rợp bóng mát, sự trường tồn của làng quê |
| **Vàng rơm** | `#D9A441` | Mùa lúa chín vàng trù phú, hạt thóc no ấm |
| **Nâu đất phù sa** | `#8B5E3C` | Đất bồi ven chân núi Hồng Lĩnh |
| **Đỏ son đình làng** | `#C14953` | Mái ngói vảy cá, câu đối cổ linh thiêng |
| **Nền giấy dó** | `#FBF6EC` | Trang giấy dó cổ truyền mộc mạc, trang nhã |

- **Kiểu chữ:** Google Fonts *"Be Vietnam Pro"* — Hiển thị tiếng Việt sắc nét, chuẩn mực trên mọi màn hình.

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

```text
lang-giao-tac/
├── firestore.rules                    # Quy tắc bảo mật dữ liệu Cloud Firestore
├── firebase.json                      # Cấu hình Firebase Hosting & Deploy targets
├── DEPLOY_GUIDE.md                    # Hướng dẫn chi tiết Deploy lên Firebase (100% Free)
├── README.md                          # Tài liệu tổng quan dự án
├── frontend/                          # Ứng dụng Web chính (React + Vite)
│   ├── public/                        # Ảnh làng, favicon, robots.txt, sitemap
│   ├── src/
│   │   ├── components/                # Navbar, Footer, VillageMap, MusicPlayer, TiptapEditor...
│   │   │   └── admin/                 # GoogleSyncSettings, FirebaseSyncSettings, EmailAlertSettings
│   │   ├── config/                    # firebase.js (Khởi tạo kết nối Firebase SDK)
│   │   ├── context/                   # AuthContext.jsx (Quản lý phiên đăng nhập)
│   │   ├── pages/                     # HomePage, NewsListPage, GalleryPage, AdminDashboardPage...
│   │   ├── services/                  # firestoreDb.js, authService.js, newsService.js, emailAlertService.js...
│   │   ├── App.jsx                    # Quản lý định tuyến trang (React Router)
│   │   └── index.css                  # Thiết lập Tailwind CSS
│   ├── scripts/                       # Các script nạp dữ liệu mẫu lên Cloud Firestore
│   │   ├── seedFullContent.mjs        # Nạp 45 tin tức, thông báo, bài viết cộng đồng
│   │   └── seedAlbumsAndPhotos.mjs    # Nạp 3 album lớn & 30 ảnh tư liệu làng
│   ├── package.json
│   └── vite.config.js
├── backend/                           # Máy chủ Node.js REST API phụ trợ (Optional)
└── mobile/                            # Ứng dụng di động Flutter (Android & iOS)
```

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY CỤC BỘ (LOCAL DEV)

Nhờ chuyển sang kiến trúc Serverless, bạn **không cần cài đặt cơ sở dữ liệu PostgreSQL hay cấu hình backend phức tạp** trên máy tính!

### 1. Cài đặt và Chạy Web Frontend:
```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt các thư viện cần thiết
npm install

# Khởi chạy máy chủ phát triển
npm run dev
```

Mở trình duyệt truy cập: **`http://localhost:5173`**

### 2. Nạp Dữ Liệu Lên Cloud Firestore (Nếu cần khởi tạo mới):
```bash
# Nạp tin tức, bài viết, sự kiện:
node scripts/seedFullContent.mjs

# Nạp album và ảnh tư liệu làng:
node scripts/seedAlbumsAndPhotos.mjs
```

### 3. Đóng Gói và Xuất Bản Lên Firebase Hosting:
```bash
# Biên dịch mã nguồn frontend
npm run build

# Deploy Hosting và Rules lên Firebase
npx firebase-tools deploy --only hosting,firestore:rules
```

---

## 🗺️ TỔNG HỢP CÁC CHỨC NĂNG CHÍNH

- `/` — **Trang Chủ:** Hero Banner trình chiếu, video Đình Làng, tin tức làng & tin Phường Nam Hồng Lĩnh mới nhất, Thư viện ảnh thu nhỏ với Lightbox, sự kiện sắp tới.
- `/tin-tuc` — **Tin Tức & Thông Báo:** Bản tin chính thức của TDP 9 và tin tức tự động đồng bộ từ Cổng TTĐT Phường Nam Hồng Lĩnh.
- `/thu-vien-anh` & `/thu-vien-anh/:id` — **Thư Viện Ảnh Làng Quê:** 3 Album lớn (*Cảnh sắc*, *Lễ hội truyền thống*, *Thể thao*) cùng 30+ ảnh tư liệu sắc nét, phóng to Lightbox và tải ảnh lên.
- `/bai-viet` & `/bai-viet/:slug` — **Ký Ức & Tâm Tình:** Không gian chia sẻ kỷ niệm, câu chuyện làng quê của bà con.
- `/ban-do` — **Bản Đồ Di Tích:** Tọa độ GPS chuẩn xác Đình Làng Giao Tác, Nhà văn hóa TDP 9, Giếng cổ, Nhà thờ các dòng tộc.
- `/gia-pha` — **Gia Phả Dòng Họ:** Lưu giữ cội nguồn các dòng tộc trên đất Giao Tác.
- `/quy-que-huong` — **Quỹ Quê Hương:** Minh bạch các khoản đóng góp tu bổ di tích, khuyến học.
- `/dang-nhap` & `/dang-ky` — **Xác Thực:** Đăng nhập an toàn bằng Email hoặc Google 1 chạm.
- `/quan-tri` — **Trang Quản Trị:** Phê duyệt bài viết, duyệt ảnh, quản lý thành viên, cấu hình đồng bộ Google Drive/Sheets và cài đặt thông báo Email.

---

## 📜 LIÊN HỆ & BẢN QUYỀN

- **Đơn vị vận hành:** Ban Cán sự & Con em Làng Giao Tác — TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, Tỉnh Hà Tĩnh.
- **Quản trị hệ thống:** Nguyễn Trọng Long (Email: `tronglong195@gmail.com`).
- **Mục đích:** Dự án phi lợi nhuận phục vụ quê hương và gắn kết cộng đồng làng xã.

