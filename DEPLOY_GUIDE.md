# 🚀 HƯỚNG DẪN DEPLOY TOÀN DIỆN LÊN SERVER MIỄN PHÍ (100% FREE)

Website **Làng Giao Tác — TDP 9 Thuận Lộc** gồm 2 phần (`backend` và `frontend`). Dưới đây là phương án triển khai tối ưu, ổn định và **hoàn toàn miễn phí** được cộng đồng lập trình viên thế giới tin dùng nhất hiện nay:

---

## 🏗️ MÔ HÌNH TRIỂN KHAI ĐỀ XUẤT:
1. **Cơ sở dữ liệu (PostgreSQL):** **[Supabase.com](https://supabase.com)** hoặc **[Neon.tech](https://neon.tech)** (Serverless PostgreSQL miễn phí vĩnh viễn).
2. **Backend API (Node.js/Express):** **[Render.com](https://render.com)** (Free Web Service).
3. **Frontend Web (React Vite):** **[Vercel.com](https://vercel.com)** (Free Hosting tốc độ cao, hỗ trợ SSL HTTPS tự động).

---

## 📌 BƯỚC 1: MÃ NGUỒN ĐÃ ĐƯỢC ĐẨY LÊN GITHUB THÀNH CÔNG

Repository chính thức:
👉 **[https://github.com/tronglong195-ops/lang-giao-tac.git](https://github.com/tronglong195-ops/lang-giao-tac.git)**

Mã nguồn trên nhánh `main` đã được đẩy lên đầy đủ gồm cả Backend, Frontend, 40 ảnh làng, video tư liệu và cấu hình deploy.

---

## 📌 BƯỚC 2: TẠO DATABASE POSTGRESQL MIỄN PHÍ TRÊN SUPABASE HOẶC NEON

1. Truy cập **[https://supabase.com](https://supabase.com)** (hoặc **[https://neon.tech](https://neon.tech)**) và đăng ký tài khoản bằng GitHub.
2. Nhấn **New Project** -> Đặt tên: `lang-giao-tac-db` -> Nhập mật khẩu cơ sở dữ liệu.
3. Vào mục **Settings** -> **Database** -> Copy chuỗi kết nối **URI** (dạng `postgresql://postgres.[id]:[mat-khau]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`).
*(Lưu lại chuỗi `DATABASE_URL` này để cấu hình ở bước sau)*.

---

## 📌 BƯỚC 3: DEPLOY BACKEND LÊN RENDER.COM

1. Truy cập **[https://render.com](https://render.com)** -> Đăng nhập bằng GitHub.
2. Nhấn nút **New +** -> Chọn **Web Service**.
3. Chọn Repository `lang-giao-tac` vừa tạo trên GitHub.
4. Cấu hình các thông số sau:
   - **Name:** `lang-giao-tac-api`
   - **Region:** `Singapore` (để tốc độ tải tại Việt Nam nhanh nhất).
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npx prisma db push`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
5. Cuộn xuống mục **Environment Variables** và thêm các biến sau:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: *(Dán chuỗi kết nối PostgreSQL từ Supabase ở Bước 2)*
   - `JWT_ACCESS_SECRET`: `giao_tac_access_token_secret_key_super_secure_2026`
   - `JWT_REFRESH_SECRET`: `giao_tac_refresh_token_secret_key_super_secure_2026`
   - `FRONTEND_URL`: `https://lang-giao-tac.vercel.app` *(hoặc để tạm `*`)*
6. Nhấn **Create Web Service**. Đợi 1-2 phút Render sẽ build và cấp cho bạn đường link API công khai dạng:
   👉 `https://lang-giao-tac-api.onrender.com`

---

## 📌 BƯỚC 4: DEPLOY FRONTEND LÊN VERCEL.COM

1. Truy cập **[https://vercel.com](https://vercel.com)** -> Đăng nhập bằng GitHub.
2. Nhấn **Add New...** -> **Project**.
3. Tìm và nhấn **Import** repository `lang-giao-tac`.
4. Cấu hình Project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Nhấn Edit -> Chọn thư mục `frontend`
5. Mục **Environment Variables**, thêm biến:
   - `VITE_API_URL`: `https://lang-giao-tac-api.onrender.com/api` *(Lấy từ đường link Render ở Bước 3)*
6. Nhấn **Deploy**. Chỉ mất khoảng 30 giây là website của bạn sẽ hoạt động chính thức với tên miền miễn phí dạng:
   👉 `https://lang-giao-tac.vercel.app`

---

## 📌 BƯỚC 5: NẠP DỮ LIỆU MẪU LẦN ĐẦU CHO DATABASE CLOUD (OPTIONAL)

Sau khi deploy xong, nếu bạn muốn nạp sẵn toàn bộ mốc lịch sử, tin tức, bài viết và danh bạ đồng hương vào Database Cloud:
Mở terminal trên máy tính của bạn:
```bash
cd "C:\Users\MTC\OneDrive\Desktop\Lang giao\backend"
# Thay đổi tạm thời DATABASE_URL trong .env trỏ tới Supabase rồi chạy:
npm run prisma:seed
```
Toàn bộ dữ liệu của **Admin Nguyễn Trọng Long**, video Đình làng, ca nhạc quê hương và ảnh di tích sẽ hiển thị ngay trên website online!
