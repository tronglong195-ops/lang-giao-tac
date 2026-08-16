# 🌾 CỔNG THÔNG TIN CỘNG ĐỒNG LÀNG GIAO TÁC (HÀ TĨNH, VIỆT NAM)

> Website cộng đồng làng quê **Làng Giao Tác** (tỉnh Hà Tĩnh) — Kết nối bà con quê hương và con em xa xứ, lưu giữ ký ức, gia phả dòng họ, văn hóa, danh bạ đồng hương, tin tức chính quyền và thư viện hình ảnh qua các thời kỳ.

---

## 🏛️ TECH STACK

- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion + Lucide React + React-Leaflet (OpenStreetMap) + Tiptap Rich Text Editor.
- **Backend**: Node.js + Express (kiến trúc module: `auth`, `posts`, `news`, `albums`, `photos`, `events`, `villagers`, `history`, `comments`, `heroSlides`, `admin`).
- **Database**: PostgreSQL thông qua Prisma ORM.
- **Authentication**: JWT (Access Token 15 phút + Refresh Token 7 ngày qua `httpOnly` cookie) + Bcrypt băm mật khẩu.
- **Quản lý ảnh**: URL Cloudinary (tích hợp trực tiếp, không scaffold local storage).
- **Phân quyền (RBAC)**: `admin`, `moderator`, `member`. Bài viết & ảnh do thành viên đăng mặc định `pending` chờ Admin/Mod duyệt.

---

## 🎨 BẢNG MÀU & THIẾT KẾ ĐỒNG QUÊ VIỆT NAM

- **Xanh lá mạ (Primary)**: `#4A7C59`
- **Xanh tre già / rêu cổ (Primary Dark)**: `#2F4F3A`
- **Vàng rơm / Lúa chín (Secondary)**: `#D9A441`
- **Nâu đất phù sa / Gốm mộc (Accent)**: `#8B5E3C`
- **Nền kem giấy dó (Background)**: `#FBF6EC`
- **Màu ngà thanh nhã (Surface)**: `#FFFDF7`
- **Nâu than trầm ấm (Text)**: `#2B2118`
- **Font chữ**: Google Font *"Be Vietnam Pro"* (hỗ trợ dấu tiếng Việt đẹp và chuẩn mực).
- **Họa tiết**: Họa tiết SVG mái ngói vảy cá / âm dương, chuyển động êm ái 300–500ms `ease-out`.

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

```text
Lang giao/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma              # Schema PostgreSQL đầy đủ 9 Models
│   │   └── seed.js                    # Script nạp dữ liệu mẫu chân thực Làng Giao Tác
│   ├── src/
│   │   ├── config/db.js               # Prisma Client
│   │   ├── middlewares/               # authGuard.js, roleGuard.js
│   │   ├── modules/                   # auth, posts, news, albums, photos, events, villagers, history, comments, heroSlides, admin
│   │   ├── utils/                     # jwt.js, slugify.js
│   │   ├── app.js                     # Express app configuration & CORS
│   │   └── server.js                  # Entry point chạy backend
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── index.html                     # Be Vietnam Pro Font & Leaflet CSS
│   ├── src/
│   │   ├── components/                # Navbar, Footer, SectionDivider, HeroSlider, LightboxModal, TiptapEditor, VillageMap, StatusBadge, ConfirmModal
│   │   ├── context/AuthContext.jsx    # Authentication & Profile Context
│   │   ├── services/                  # api.js (Axios + auto refresh token), auth, post, news, photo, event, villager, history, admin
│   │   ├── pages/                     # HomePage, HistoryPage, NewsListPage, NewsDetailPage, PostListPage, PostDetailPage, PostEditorPage, GalleryPage, AlbumDetailPage, MapPage, DirectoryPage, EventsPage, LoginPage, RegisterPage, ProfilePage, AdminDashboardPage
│   │   ├── App.jsx                    # All Application Routes
│   │   ├── main.jsx                   # React Entry Point
│   │   └── index.css                  # Tailwind directives & Warm Rural Styles
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & KHỞI ĐỘNG

### 1. Cấu hình Biến Môi Trường (.env)

#### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development

# Kết nối PostgreSQL (Thay đổi theo cấu hình máy tính của bạn)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lang_giao_tac?schema=public"

# Khóa bí mật JWT
JWT_ACCESS_SECRET="giao_tac_access_token_secret_key_super_secure_2026"
JWT_REFRESH_SECRET="giao_tac_refresh_token_secret_key_super_secure_2026"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

#### Frontend (`frontend/.env`):
```env
VITE_API_URL="http://localhost:5000/api"
```

---

### 2. Khởi tạo Cơ sở Dữ liệu & Nạp Dữ Liệu Mẫu (Seed Data)

Mở terminal tại thư mục `backend/` và thực hiện các lệnh:

```bash
cd backend

# Cài đặt dependencies (nếu chưa cài)
npm install

# Tạo và đồng bộ các bảng trong PostgreSQL qua Prisma
npx prisma db push
# hoặc: npx prisma migrate dev --name init

# Nạp dữ liệu mẫu phong phú về Làng Giao Tác
npm run prisma:seed
```

---

### 3. Chạy Development Servers

#### Chạy Backend (Cổng 5000):
```bash
cd backend
npm run dev
```

#### Chạy Frontend (Cổng 5173):
Mở một cửa sổ terminal mới:
```bash
cd frontend
npm run dev
```

Truy cập website trên trình duyệt: **http://localhost:5173**

---

## 👥 TÀI KHOẢN TRẢI NGHIỆM MẪU

Sau khi chạy lệnh `npm run prisma:seed`, hệ thống đã có sẵn các tài khoản sau:

| Vai trò | Email | Mật khẩu | Chức danh |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@langgiaotac.vn` | `123456` | Bác Phan Văn Thuận — Trưởng Ban Quản lý Thôn |
| **Điều hành viên (Mod)** | `mod@langgiaotac.vn` | `123456` | Anh Hoàng Minh Tuấn — Bí thư Chi đoàn |
| **Dân làng (Member)** | `nguyenthimai@gmail.com` | `123456` | Chị Nguyễn Thị Mai — Người con xa quê tại Hà Nội |
| **Dân làng (Member)** | `tranvanan@gmail.com` | `123456` | Bác Trần Văn An — Hội đồng hương miền Nam |

---

## 🗺️ TỔNG HỢP CÁC TRANG & ROUTES

- `/` — **Trang chủ**: Hero slideshow (Ken Burns + crossfade), tin tức nổi bật, giới thiệu làng 300 năm, bài viết cộng đồng, thư viện ảnh preview, sự kiện sắp tới.
- `/lich-su` — **Lịch sử làng**: Timeline dọc các mốc lịch sử với hiệu ứng scroll-reveal, tư liệu lịch sử từ năm 1685.
- `/tin-tuc` & `/tin-tuc/:slug` — **Tin tức chính quyền**: Thông báo chính thức từ Ban Quản lý Thôn và UBND xã.
- `/bai-viet` & `/bai-viet/:slug` — **Bài viết cộng đồng**: Bài viết theo chuyên mục (*Ký ức tuổi thơ*, *Dòng họ - Gia phả*, *Ẩm thực quê*, *Đổi thay của làng*, *Người con xa quê*) kèm phần bình luận tâm tình.
- `/bai-viet/viet-bai` — **Soạn bài viết**: Trình soạn thảo **Tiptap** đầy đủ toolbar, chèn ảnh Cloudinary, format văn bản.
- `/thu-vien-anh` & `/thu-vien-anh/:albumId` — **Thư viện ảnh & Album**: Xem danh sách Album, phóng to ảnh **Lightbox**, cho phép thành viên tải ảnh đóng góp (chờ duyệt).
- `/ban-do` — **Bản đồ Làng**: Tích hợp **React-Leaflet**, animation `flyTo` từ bản đồ Việt Nam vào Hà Tĩnh → Làng Giao Tác, các marker địa danh (Đình làng, Giếng cổ, Bến đò, Nhà thờ họ) có hiệu ứng pulse ấm áp.
- `/dong-huong` — **Danh bạ đồng hương**: Bộ lọc theo vùng miền sinh sống, dòng họ/xóm gốc và form đăng ký vào danh bạ.
- `/su-kien` — **Sự kiện & Lễ hội**: Lịch lễ hội rước thần nông, giỗ tổ, ngày hội thể thao.
- `/dang-nhap` & `/dang-ky` — **Xác thực**: Đăng nhập / đăng ký tài khoản dân làng.
- `/tai-khoan` — **Hồ sơ cá nhân**: Quản lý bài viết đã đăng, ảnh đã tải lên, chỉnh sửa thông tin xóm gốc / nơi ở.
- `/quan-tri` — **Trang Quản trị (Admin/Mod)**: Phê duyệt bài viết `pending`, phê duyệt ảnh `pending`, CRUD tin tức, CRUD sự kiện, CRUD mốc lịch sử, quản lý phân quyền thành viên.
