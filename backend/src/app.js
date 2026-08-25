const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./modules/auth/auth.routes');
const postRoutes = require('./modules/posts/post.routes');
const newsRoutes = require('./modules/news/news.routes');
const albumRoutes = require('./modules/albums/album.routes');
const photoRoutes = require('./modules/photos/photo.routes');
const eventRoutes = require('./modules/events/event.routes');
const villagerRoutes = require('./modules/villagers/villager.routes');
const historyRoutes = require('./modules/history/history.routes');
const commentRoutes = require('./modules/comments/comment.routes');
const heroSlideRoutes = require('./modules/heroSlides/heroSlide.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const uploadRoutes = require('./modules/upload/upload.routes');
const genealogyRoutes = require('./modules/genealogy/genealogy.routes');
const fundRoutes = require('./modules/funds/fund.routes');
const marketRoutes = require('./modules/market/market.routes');
const memorialRoutes = require('./modules/memorial/memorial.routes');
const { rateLimiter } = require('./middlewares/rateLimiter');

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cấu hình CORS hỗ trợ cookie thông tin phiên làm việc
const rawFrontendUrls = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((u) => u.trim().replace(/\/$/, ''))
  : [];

const allowedOrigins = [
  ...rawFrontendUrls,
  'https://lang-giao-tac-1.onrender.com',
  'https://lang-giao-tac.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request không có origin (mobile app, curl, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith('.onrender.com') ||
        normalizedOrigin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend Làng Giao Tác API đang hoạt động tốt.',
    timestamp: new Date(),
  });
});

// Endpoint sinh động sitemap.xml cho SEO
const generateSitemap = async (req, res) => {
  try {
    const prisma = require('./config/db');
    const baseUrl = (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.includes('localhost'))
      ? process.env.FRONTEND_URL.split(',')[0].trim().replace(/\/$/, '')
      : 'https://lang-giao-tac-1.onrender.com';

    const [posts, news, clans] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'published' },
        select: { slug: true, updatedAt: true, createdAt: true },
        take: 1000,
      }),
      prisma.news.findMany({
        select: { slug: true, publishedAt: true, createdAt: true },
        take: 1000,
      }),
      prisma.clan.findMany({
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const staticRoutes = [
      '',
      '/lich-su',
      '/gia-pha',
      '/quy-que-huong',
      '/cho-que',
      '/so-tang',
      '/tham-quan-360',
      '/thu-vien-anh',
      '/dong-huong',
      '/ban-do',
      '/su-kien',
      '/bai-viet',
      '/tin-tuc',
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static Pages
    for (const route of staticRoutes) {
      xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    }

    // Dynamic Clans
    for (const clan of clans) {
      xml += `  <url>\n    <loc>${baseUrl}/gia-pha/${clan.slug}</loc>\n    <lastmod>${new Date(clan.updatedAt).toISOString().split('T')[0]}</lastmod>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    // Dynamic Posts
    for (const post of posts) {
      xml += `  <url>\n    <loc>${baseUrl}/bai-viet/${post.slug}</loc>\n    <lastmod>${new Date(post.updatedAt || post.createdAt).toISOString().split('T')[0]}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    // Dynamic News
    for (const item of news) {
      xml += `  <url>\n    <loc>${baseUrl}/tin-tuc/${item.slug}</loc>\n    <lastmod>${new Date(item.publishedAt || item.createdAt).toISOString().split('T')[0]}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(xml);
  } catch (err) {
    console.error('Lỗi khi sinh sitemap.xml:', err);
    res.status(500).send('Error generating sitemap');
  }
};

app.get('/sitemap.xml', generateSitemap);
app.get('/api/sitemap.xml', generateSitemap);

// Endpoint kiểm tra và test gửi email thông báo tới tronglong195@gmail.com
app.get('/api/health/test-email', async (req, res) => {
  try {
    const emailService = require('./services/email.service');
    const result = await emailService.sendMail({
      to: 'tronglong195@gmail.com',
      subject: '🧪 [Test Kết Nối] Kiểm tra hệ thống gửi Email Làng Giao Tác',
      text: 'Xin chào Admin! Nếu bạn đọc được email này, tính năng gửi email tự động của Làng Giao Tác đã hoạt động 100% hoàn hảo.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #FAF8F5; border-radius: 12px; border: 1px solid #2D5A27;">
          <h2 style="color: #2D5A27;">🌾 KẾT NỐI EMAIL THÀNH CÔNG!</h2>
          <p>Xin chào Admin <b>tronglong195@gmail.com</b>,</p>
          <p>Hệ thống máy chủ Làng Giao Tác đã kết nối thành công tới dịch vụ Gmail / Resend API.</p>
          <p>Từ bây giờ, mọi hoạt động <b>Đăng ký mới</b>, <b>Đăng nhập</b>, <b>Gửi bài viết chờ duyệt</b> và <b>Tải ảnh chờ duyệt</b> sẽ tự động gửi thư báo cáo về hòm thư này.</p>
          <p style="color: #888; font-size: 12px;">Thời gian test: ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
        </div>
      `,
    });
    res.status(200).json({ status: 'ok', emailResult: result });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Test gửi email cảnh báo Đăng Ký Mới
app.get('/api/health/test-register-email', async (req, res) => {
  try {
    const emailService = require('./services/email.service');
    const result = await emailService.sendRegisterAlert({
      user: {
        fullName: 'Nguyễn Văn An (Bà con thử nghiệm)',
        email: 'nguyenvanan.test@gmail.com',
        hometownGroup: 'Xóm 9 Thuận Lộc',
        currentLocation: 'Hà Nội',
      },
      registrationMethod: 'Trang Đăng Ký Thành Viên',
    });
    res.status(200).json({ status: 'ok', message: 'Đã kích hoạt gửi mail thành viên đăng ký mới', emailResult: result });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Test gửi email cảnh báo Bài Viết Chờ Duyệt
app.get('/api/health/test-post-email', async (req, res) => {
  try {
    const emailService = require('./services/email.service');
    const result = await emailService.sendNewPostAlert({
      post: {
        title: 'Ký ức giếng làng và những mùa gặt tháng Năm ở Giao Tác',
        category: 'Ký ức tuổi thơ',
        contentHtml: '<p>Nhớ về tuổi thơ bên giếng làng Giao Tác, nơi bà con tụ họp sau những buổi trưa hè oi ả...</p>',
      },
      author: {
        fullName: 'Trần Thị Mai',
        email: 'tranmai.giaotac@gmail.com',
      },
    });
    res.status(200).json({ status: 'ok', message: 'Đã kích hoạt gửi mail bài viết mới chờ duyệt', emailResult: result });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Test gửi email cảnh báo Ảnh Mới Chờ Duyệt
app.get('/api/health/test-photo-email', async (req, res) => {
  try {
    const emailService = require('./services/email.service');
    const result = await emailService.sendNewPhotoAlert({
      photoCount: 3,
      uploader: {
        fullName: 'Lê Hoàng Long',
        email: 'lelong.hatinh@gmail.com',
      },
      albumTitle: 'Cảnh Sắc Đường Làng Ngõ Xóm Thuận Lộc',
    });
    res.status(200).json({ status: 'ok', message: 'Đã kích hoạt gửi mail ảnh mới chờ duyệt', emailResult: result });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Đăng ký các modules API theo đúng đặc tả
app.use('/api/auth', rateLimiter(60 * 1000, 20, 'Quá nhiều yêu cầu đăng nhập/đăng ký. Vui lòng thử lại sau 1 phút.'), authRoutes);
app.use('/api/posts', rateLimiter(60 * 1000, 30), postRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/villagers', villagerRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/comments', rateLimiter(60 * 1000, 15, 'Bạn đang gửi bình luận quá nhanh. Vui lòng chờ ít giây.'), commentRoutes);
app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', rateLimiter(60 * 1000, 25), uploadRoutes);
app.use('/api/clans', genealogyRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/memorial', memorialRoutes);

// Xử lý 404 Route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Lỗi máy chủ nội bộ.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

module.exports = app;
