# 🚀 HƯỚNG DẪN TRIỂN KHAI TOÀN DIỆN LÊN GOOGLE FIREBASE (100% MIỄN PHÍ - GÓI SPARK)

Hệ thống Website **Làng Giao Tác — TDP 9 Thuận Lộc** đã được nâng cấp toàn diện sang kiến trúc **Google Firebase Serverless**, loại bỏ hoàn toàn sự phụ thuộc vào máy chủ backend Render và cơ sở dữ liệu PostgreSQL cũ.

---

## 🌟 TẠI SAO LẠI CHỌN KIẾN TRÚC FIREBASE SERVERLESS?

| Đặc điểm | Hệ thống cũ (Render + Supabase/Neon) | Hệ thống mới (Google Firebase) |
| :--- | :--- | :--- |
| **Chi phí** | Dễ phát sinh phí hoặc hết hạn dùng thử | **100% Miễn phí trọn đời (Gói Spark 0đ)** |
| **Tốc độ phản hồi** | Chậm 30–50 giây do máy chủ "ngủ đông" (Cold Start) | **Dưới 1 giây** nhờ Google Global CDN & Edge Network |
| **Độ ổn định** | Phụ thuộc vào nhiều dịch vụ rời rạc | **99.95%** do Google Cloud trực tiếp vận hành |
| **Cơ sở dữ liệu** | PostgreSQL cần cấu hình kết nối mạng phức tạp | **Cloud Firestore** Real-time NoSQL, đồng bộ tức thì |
| **Bảo mật** | Tự quản lý mã hóa JWT và Server API | **Firebase Auth & Firestore Rules** chuẩn Google |
| **Lưu trữ & Media** | Giới hạn dung lượng nhỏ | Kết hợp **Google Drive 2TB** lưu trữ video & ảnh 4K |
| **Thông báo** | Khó tích hợp gửi mail miễn phí | **Google Apps Script Webhook** gửi email tự động 0đ |

- 🌍 **Website đang hoạt động thực tế:** **[https://lang-giao-tac-tdp9.web.app](https://lang-giao-tac-tdp9.web.app)**
- 📁 **Mã nguồn GitHub:** **[https://github.com/tronglong195-ops/lang-giao-tac](https://github.com/tronglong195-ops/lang-giao-tac)**

---

## 📋 YÊU CẦU HỆ THỐNG TRƯỚC KHI BẮT ĐẦU

1. Máy tính đã cài đặt **Node.js** (Khuyến nghị phiên bản 18.x hoặc 20.x trở lên).
2. Tài khoản Google (Gmail) cá nhân để quản lý dự án Firebase.
3. Mã nguồn dự án đã được tải về máy tính (hoặc `git clone`).

---

## 📌 BƯỚC 1: TẠO DỰ ÁN TRÊN GOOGLE FIREBASE CONSOLE

1. Truy cập vào **[Google Firebase Console](https://console.firebase.google.com/)** và đăng nhập bằng tài khoản Google của bạn.
2. Nhấn nút **"Thêm dự án" (Add project)**.
3. Đặt tên dự án: `lang-giao-tac-tdp9` (hoặc tên tùy chọn của bạn).
4. Ở bước *Google Analytics*, bạn có thể **Bật** hoặc **Tắt** tùy ý rồi nhấn **Tạo dự án (Create project)**.
5. **Quan trọng về Chi phí:** Giữ nguyên dự án ở **Gói Spark (Miễn phí 0$/tháng)**, không cần nhập thẻ tín dụng hay nâng cấp lên Blaze để tránh mọi nguy cơ phát sinh cước phí ngoài ý muốn.

---

## 📌 BƯỚC 2: KÍCH HOẠT CLOUD FIRESTORE & FIREBASE AUTHENTICATION

### 1. Kích hoạt Cloud Firestore Database:
1. Trong menu bên trái Firebase Console, chọn **Build** ➔ **Firestore Database**.
2. Nhấn **Create database** (Tạo cơ sở dữ liệu).
3. Chọn vị trí lưu trữ (Location): Chọn khu vực gần Việt Nam nhất như **`asia-southeast1` (Singapore)** hoặc **`asia-east1` (Đài Loan)** để tối ưu tốc độ tải.
4. Chọn quy tắc bảo mật: Chọn **Start in test mode** hoặc để mặc định (chúng ta sẽ deploy quy tắc chuẩn từ file `firestore.rules` ở bước sau).
5. Nhấn **Enable** (Bật).

### 2. Kích hoạt Firebase Authentication:
1. Trong menu bên trái, chọn **Build** ➔ **Authentication**.
2. Nhấn **Get started** (Bắt đầu).
3. Chọn tab **Sign-in method** (Phương thức đăng nhập):
   - **Email/Password:** Nhấn vào, bật công tắc **Enable** rồi nhấn **Save**.
   - **Google:** Nhấn vào, bật công tắc **Enable**, chọn email hỗ trợ dự án của bạn rồi nhấn **Save**.

---

## 📌 BƯỚC 3: CÀI ĐẶT FIREBASE CLI VÀ ĐĂNG NHẬP

Mở terminal (PowerShell, Command Prompt hoặc Terminal trong VS Code) tại thư mục gốc của dự án:

```bash
# 1. Di chuyển vào thư mục dự án
cd "c:\Users\MTC\OneDrive\Desktop\Lang giao"

# 2. Đăng nhập tài khoản Firebase bằng trình duyệt
npx firebase-tools login
```
Trình duyệt sẽ mở ra một cửa sổ xác thực của Google, hãy chọn tài khoản Gmail của bạn và nhấn **Allow** (Cho phép).

Sau khi đăng nhập thành công, liên kết dự án:
```bash
# Kiểm tra danh sách dự án hiện có
npx firebase-tools projects:list

# Chọn dự án đã tạo ở Bước 1
npx firebase-tools use lang-giao-tac-tdp9
```

---

## 📌 BƯỚC 4: KIỂM TRA TỆP CẤU HÌNH FIREBASE Ở FRONTEND

Kiểm tra tệp `frontend/src/config/firebase.js`. Thông số cấu hình của bạn đã được thiết lập sẵn sàng:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "...",
  authDomain: "lang-giao-tac-tdp9.firebaseapp.com",
  projectId: "lang-giao-tac-tdp9",
  storageBucket: "lang-giao-tac-tdp9.firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```
*(Nếu bạn tạo một project Firebase mới với tên khác, chỉ cần vào **Project Settings ➔ General ➔ Your apps** trên Firebase Console để lấy khối `firebaseConfig` tương ứng dán vào tệp này)*.

---

## 📌 BƯỚC 5: NẠP DỮ LIỆU MẪU LÊN CLOUD FIRESTORE (SEED DATA)

Để trang web có đầy đủ 45+ tin tức thông báo, 3 album ảnh lớn và hơn 30 bức ảnh di tích lịch sử làng quê ngay sau khi triển khai, hãy chạy 2 lệnh nạp dữ liệu tự động:

```bash
# Di chuyển vào thư mục frontend
cd "c:\Users\MTC\OneDrive\Desktop\Lang giao\frontend"

# 1. Nạp tin tức, sự kiện, bài viết ký ức làng quê:
node scripts/seedFullContent.mjs

# 2. Nạp thư viện album và 30+ ảnh tư liệu lịch sử:
node scripts/seedAlbumsAndPhotos.mjs
```

Sau khi chạy xong, mở tab **Firestore Database** trên Firebase Console bạn sẽ thấy các bảng dữ liệu `news`, `albums`, `photos`, `articles` được tạo và điền dữ liệu đầy đủ.

---

## 📌 BƯỚC 6: BIÊN DỊCH VÀ XUẤT BẢN LÊN FIREBASE HOSTING

Quy trình xuất bản website lên Google CDN diễn ra cực kỳ nhanh chóng:

```bash
# 1. Đảm bảo bạn đang ở thư mục frontend và tiến hành build mã nguồn:
cd "c:\Users\MTC\OneDrive\Desktop\Lang giao\frontend"
npm run build

# 2. Quay về thư mục gốc của dự án:
cd ..

# 3. Deploy toàn bộ website và các quy tắc bảo mật lên Firebase:
npx firebase-tools deploy --only hosting,firestore:rules
```

Khi màn hình hiển thị:
```text
✔  Deploy complete!
Project Console: https://console.firebase.google.com/project/lang-giao-tac-tdp9/overview
Hosting URL: https://lang-giao-tac-tdp9.web.app
```
Chúc mừng! Website chính thức của Làng Giao Tác đã lên sóng với tốc độ siêu tốc và bảo mật SSL HTTPS tự động!

---

## 📌 BƯỚC 7: CẤU HÌNH TÊN MIỀN RIÊNG (CUSTOM DOMAIN)

Nếu bà con hoặc ban cán sự muốn gắn tên miền riêng (ví dụ: `langgiaotac.vn` hoặc `langgiaotac.com`):

1. Truy cập **Firebase Console ➔ Build ➔ Hosting**.
2. Nhấn nút **Add custom domain** (Thêm miền tùy chỉnh).
3. Nhập tên miền của bạn (ví dụ: `langgiaotac.vn` hoặc `www.langgiaotac.vn`).
4. Firebase sẽ cung cấp cho bạn 2 thông số bản ghi DNS:
   - Bản ghi `TXT` (để xác minh quyền sở hữu tên miền).
   - Bản ghi `A` (trỏ địa chỉ IP về cụm máy chủ toàn cầu của Google).
5. Đăng nhập trang quản trị nhà cung cấp tên miền của bạn (Inet, TenTen, MatBao, Cloudflare, Namecheap...) và thêm các bản ghi trên.
6. Firebase sẽ tự động cấp chứng chỉ bảo mật **SSL (HTTPS)** miễn phí trong vòng 15–60 phút.

---

## 📌 BƯỚC 8: CÀI ĐẶT THÔNG BÁO EMAIL TỰ ĐỘNG QUA GOOGLE APPS SCRIPT (0 ĐỒNG)

Hệ thống tích hợp sẵn dịch vụ gửi thông báo tức thời về Gmail khi có đăng nhập mới, tài khoản mới đăng ký hoặc bài viết mới gửi duyệt:

1. Đăng nhập vào trang Quản trị: **`https://lang-giao-tac-tdp9.web.app/quan-tri`**
2. Chọn tab **"Thông Báo Email"** (`/quan-tri?tab=emailalerts`).
3. Làm theo hướng dẫn 3 bước trực quan tại giao diện:
   - Mở **[Google Apps Script](https://script.google.com/)** và tạo dự án mới.
   - Sao chép đoạn mã kịch bản Apps Script được tạo sẵn trong giao diện quản trị dán vào.
   - Nhấn **Deploy ➔ New deployment ➔ Chọn loại Web App ➔ Đặt quyền ai cũng truy cập được (Anyone) ➔ Deploy**.
   - Copy đường dẫn Web App dán vào ô **Webhook URL** trên trang Quản trị và nhấn **"Lưu Cấu Hình"**.
4. Nhấn nút **"Gửi Email Test Ngay"** để kiểm tra: Bạn sẽ nhận được ngay email thông báo đẹp mắt gửi trực tiếp từ chính Gmail của bạn!

---

## 📌 BƯỚC 9: TẬN DỤNG KHO LƯU TRỮ GOOGLE DRIVE 2TB

Vì trang web được vận hành trên tài khoản Google Pro (2.000 GB dung lượng), bạn không cần tốn tiền mua dung lượng Firebase Storage:

1. **Với Video Hội Làng / Lịch Sử:** Tải video lên kênh YouTube của làng hoặc tải lên Google Drive (chọn chế độ "Bất kỳ ai có đường liên kết đều có thể xem").
2. **Với Album Ảnh:** Nhúng đường dẫn ảnh trực tiếp hoặc tải ảnh qua trang quản trị, hệ thống sẽ tự động tối ưu hóa và hiển thị sắc nét trên toàn bộ giao diện.

---

## 🛠️ CÁC LỆNH HỮU ÍCH KHI BẢO TRÌ VÀ PHÁT TRIỂN

```bash
# Khởi chạy frontend cục bộ để kiểm tra giao diện trước khi deploy:
cd frontend
npm run dev

# Kiểm tra log hoặc lỗi thời gian thực từ Firestore:
npx firebase-tools firestore:indexes

# Cập nhật chỉ riêng quy tắc bảo mật rules:
npx firebase-tools deploy --only firestore:rules

# Triển khai cập nhật mới nhất cho giao diện web:
cd frontend && npm run build && cd .. && npx firebase-tools deploy --only hosting
```

---

## 📞 HỖ TRỢ KỸ THUẬT

- **Quản trị viên:** Nguyễn Trọng Long
- **Email:** `tronglong195@gmail.com`
- **Địa bàn:** Làng Giao Tác — TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, Tỉnh Hà Tĩnh.
