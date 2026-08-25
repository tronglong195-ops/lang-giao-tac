# Prompt cho Google Antigravity — Vá bảo mật & bổ sung tính năng Làng Giao Tác

> Dán toàn bộ nội dung dưới đây vào Antigravity khi đã mở đúng thư mục gốc của repo `lang-giao-tac` (chứa `backend/`, `frontend/`, `mobile/`). Prompt được viết theo từng giai đoạn — có thể dán nguyên khối để agent tự lập kế hoạch, hoặc dán từng giai đoạn một nếu muốn kiểm soát chặt hơn.

---

## Bối cảnh dự án

Đây là mã nguồn cổng thông tin cộng đồng "Làng Giao Tác" (TDP 9 Thuận Lộc, Hà Tĩnh). Stack:

- **Backend**: `backend/` — Node.js + Express, Prisma ORM + PostgreSQL, kiến trúc module (`backend/src/modules/<tên-module>/{*.controller.js, *.service.js, *.routes.js}`). 17 module hiện có: auth, posts, news, albums, photos, events, villagers, history, comments, heroSlides, admin, notifications, upload, genealogy, funds, market, memorial.
- **Frontend**: `frontend/` — React 18 + Vite 5 + Tailwind CSS, React Router. Trang nằm ở `frontend/src/pages/*.jsx`, route khai báo tập trung trong `frontend/src/App.jsx`. Gọi API qua `frontend/src/services/*.js` (dùng Axios, xem `frontend/src/services/api.js` cho cấu hình interceptor/refresh token).
- **Schema dữ liệu**: `backend/prisma/schema.prisma` — 17 model, đã chuẩn hoá tốt, có index theo đúng truy vấn thường dùng. Đừng đổi tên field/model có sẵn trừ khi thật sự cần — nhiều chỗ đã dựa vào tên cũ.
- **Xác thực**: JWT Access Token (15 phút) + Refresh Token (7 ngày, httpOnly cookie). Middleware ở `backend/src/middlewares/authGuard.js` và `roleGuard.js`.

## Ràng buộc bắt buộc — đọc trước khi sửa bất cứ gì

1. **Không được phá vỡ tính năng đang chạy trên production** (`https://lang-giao-tac-1.onrender.com`, backend `https://lang-giao-tac-api.onrender.com`). Mọi thay đổi schema Prisma phải dùng migration có tên rõ ràng (`npx prisma migrate dev --name <mo-ta>`), **không** dùng `prisma db push` cho các thay đổi sẽ merge vào `main`.
2. Giữ đúng convention code hiện có: tên biến/comment tiếng Việt xen tiếng Anh như trong repo, cấu trúc `controller → service → routes` cho mỗi module backend, cấu trúc `page → components → services` cho frontend.
3. Sau mỗi giai đoạn, chạy được `npm run build` (frontend) và server khởi động không lỗi (backend) trước khi coi là hoàn thành.
4. Không hardcode bất kỳ secret/API key nào vào code hoặc vào tài liệu (`README.md`, `DEPLOY_GUIDE.md`). Luôn dùng biến môi trường + cập nhật `.env.example` (không phải `.env`) với placeholder.
5. Với mỗi tính năng lớn, tạo commit hoặc PR riêng, mô tả rõ: file đã đổi, vì sao đổi, đã test bằng cách nào.

---

## GIAI ĐOẠN 0 — Vá bảo mật khẩn cấp (làm trước tiên, không được bỏ qua)

### 0.1 — JWT secret thật đang bị công khai trong tài liệu

`README.md` và `DEPLOY_GUIDE.md` (đã commit, repo public trên GitHub) đang in nguyên văn giá trị thật của `JWT_ACCESS_SECRET` và `JWT_REFRESH_SECRET` (trùng khớp với secret thật đang dùng) làm "ví dụ cấu hình". Bất kỳ ai đọc repo cũng tự ký được token hợp lệ, kể cả giả làm admin.

Việc cần làm:
- Sinh 2 secret ngẫu nhiên mới (ví dụ bằng `openssl rand -hex 32`) cho `JWT_ACCESS_SECRET` và `JWT_REFRESH_SECRET`.
- Sửa `README.md` và `DEPLOY_GUIDE.md`: thay giá trị thật bằng placeholder dạng `JWT_ACCESS_SECRET="<dán-secret-ngẫu-nhiên-của-bạn-tại-đây>"`, thêm một dòng cảnh báo ngắn "Không bao giờ commit secret thật vào Git".
- Cập nhật `backend/.env.example` để chắc chắn cũng chỉ chứa placeholder, không chứa giá trị thật.
- In ra hướng dẫn (không tự làm hộ, chỉ nhắc) rằng tôi cần vào Render Dashboard → Environment để dán 2 secret mới, vì agent không có quyền truy cập Render của tôi.
- Thêm một dòng vào `README.md` phần "Đóng góp"/"Bảo mật" nhắc người sau này không copy giá trị `.env` thật vào tài liệu ví dụ.

### 0.2 — Tài khoản admin mẫu dùng mật khẩu công khai chạy trên production

`backend/src/config/autoSeed.js` tạo/giữ tài khoản `admin@langgiaotac.vn` với mật khẩu `123456` (bcrypt hash cứng trong code) **mỗi lần server khởi động**, không phân biệt môi trường dev/production. `README.md` công khai đúng bảng tài khoản mẫu này (admin/mod/member đều mật khẩu `123456`).

Việc cần làm:
- Sửa `backend/src/config/autoSeed.js`: chỉ tự tạo tài khoản mẫu (admin/mod/member demo) khi `process.env.NODE_ENV !== 'production'`. Ở production, nếu chưa có tài khoản admin nào, đọc mật khẩu ban đầu từ biến môi trường mới `ADMIN_INITIAL_PASSWORD` (bắt buộc phải set, không có giá trị mặc định cứng trong code) thay vì hardcode `123456`.
- Thêm log rõ ràng khi server khởi động ở production và chưa từng có admin: nhắc phải set `ADMIN_INITIAL_PASSWORD` trong Environment Variables.
- Cập nhật `backend/.env.example` thêm dòng `ADMIN_INITIAL_PASSWORD=` với comment giải thích.
- Cập nhật `README.md`: bảng "Tài khoản mẫu" chỉ áp dụng cho môi trường dev local, thêm ghi chú rõ production không dùng chung mật khẩu này.
- Không tự đổi mật khẩu tài khoản admin thật trên Render — việc đó tôi tự làm thủ công.

---

## GIAI ĐOẠN 1 — Nền tảng & khả năng được tìm thấy (làm sau khi Giai đoạn 0 xong)

### 1.1 — Tìm kiếm toàn site
Thêm ô tìm kiếm vào `frontend/src/components/layout/Navbar.jsx`. Khi submit, gọi song song (`Promise.all`) tới `/api/posts?search=`, `/api/news?search=`, `/api/villagers?search=`, `/api/market?search=` (kiểm tra từng `*.service.js` ở backend xem đã có param lọc theo tên/tiêu đề chưa — nếu chưa, bổ sung filter `contains` không phân biệt hoa thường vào Prisma query tương ứng). Hiển thị kết quả gộp theo nhóm (Bài viết / Tin tức / Đồng hương / Chợ quê) trên một trang mới `frontend/src/pages/SearchResultsPage.jsx`, route `/tim-kiem?q=`.

### 1.2 — SEO động theo từng trang
Cài `react-helmet-async`, bọc `<HelmetProvider>` ở `frontend/src/main.jsx`. Thêm `<Helmet>` với `title`, `meta description`, Open Graph (`og:title`, `og:description`, `og:image`) lấy từ dữ liệu thật vào ít nhất: `PostDetailPage.jsx`, `NewsDetailPage.jsx`, `GenealogyPage.jsx`, `MarketPage.jsx`. Trang không có Helmet riêng vẫn giữ fallback tĩnh trong `index.html`.

### 1.3 — sitemap.xml, robots.txt, PWA cơ bản
- Thêm script build-time hoặc endpoint backend `/sitemap.xml` sinh động từ danh sách slug của `Post` (published) và `News`.
- Thêm `frontend/public/robots.txt` trỏ về sitemap.
- Cài `vite-plugin-pwa`, cấu hình `manifest` (tên, icon, theme_color theo bảng màu đã có trong README: `#4A7C59` làm theme_color) để có thể "Thêm vào Màn hình chính".

### 1.4 — Test tự động cho 3 module nhạy cảm nhất
Thêm Jest + Supertest cho backend (`backend/tests/`), viết test cho: `auth` (đăng ký, đăng nhập, refresh token, từ chối token sai), `upload` (từ chối file không phải ảnh, giới hạn kích thước), `funds` (tạo donation, không cho user thường tự set `isVerified: true`). Thêm script `"test": "jest"` vào `backend/package.json`.

### 1.5 — Theo dõi lượt truy cập
Thêm Plausible hoặc GA4 (ưu tiên Plausible vì không cần cookie consent) vào `frontend/index.html`, chỉ load ở production (`import.meta.env.PROD`).

---

## GIAI ĐOẠN 2 — Trung hạn: đúng nhu cầu văn hoá địa phương

### 2.1 — Đối soát Quỹ quê hương tự động
Model `FundCampaign` đã có sẵn field `qrCodePrefix` dùng làm cú pháp nội dung chuyển khoản. Thêm module backend mới `backend/src/modules/funds/webhook/` nhận webhook từ Casso.vn hoặc SePay khi có biến động số dư, đối chiếu nội dung chuyển khoản với `qrCodePrefix` + mã donation, chỉ khi khớp mới set `FundDonation.isVerified = true` và `txCode`. Sửa `fund.service.js`: donation tạo thủ công qua admin panel mặc định `isVerified: false`, chỉ webhook hoặc admin xác nhận tay mới chuyển `true`. Việc đăng ký tài khoản Casso/SePay tôi tự làm — agent chỉ cần code sẵn endpoint nhận webhook và logic đối chiếu, đọc API key từ biến môi trường mới `CASSO_WEBHOOK_SECRET`.

### 2.2 — Thông báo qua Zalo ZNS
Thêm `backend/src/services/zalo.service.js` gửi Zalo Notification Service, gọi song song với `email.service.js` hiện có ở những chỗ đang tạo `Notification` (post_approved, system_alert...). Đọc `ZALO_OA_ACCESS_TOKEN`/`ZALO_ZNS_TEMPLATE_ID` từ env, không hardcode. Nếu chưa cấu hình biến môi trường thì bỏ qua gửi Zalo một cách im lặng (không throw lỗi làm hỏng luồng chính).

### 2.3 — Nâng cấp cây gia phả tương tác
Sửa `frontend/src/components/genealogy/FamilyTreeCanvas.jsx`: thêm zoom/pan (dùng `react-zoom-pan-pinch`), thêm ô tìm theo tên trong cây (highlight node khớp), thêm nút "Xuất PDF" dùng `@react-pdf/renderer` xuất cây phả hệ của một `Clan` ra file A3 để in.

### 2.4 — Tour 360° thật
Thay ảnh JPG tĩnh trong `frontend/src/pages/VirtualTourPage.jsx` bằng viewer panorama thật dùng `react-photo-sphere-viewer`. Giữ nguyên cấu trúc dữ liệu `PANORAMA_LOCATIONS` hiện có (id, name, category, hotspots), chỉ đổi cách hiển thị `imageUrl` — tôi sẽ tự chụp lại ảnh 360 thật và thay URL sau.

---

## Cách báo cáo lại cho tôi

Sau mỗi giai đoạn (0, 1, 2), tóm tắt: danh sách file đã sửa/thêm, lệnh tôi cần tự chạy (migration, cài package mới), và bất kỳ biến môi trường mới nào cần tôi tự điền giá trị thật trên Render/Vercel — không tự bịa giá trị thật cho các biến đó.
