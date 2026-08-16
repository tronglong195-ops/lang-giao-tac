const express = require('express');
const cors = require('cors');
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

const app = express();

// Cấu hình CORS hỗ trợ cookie thông tin phiên làm việc
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request không có origin (ví dụ mobile app hoặc curl) hoặc trong whitelist
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Trong môi trường dev linh hoạt
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

// Đăng ký các modules API theo đúng đặc tả
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/villagers', villagerRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/admin', adminRoutes);

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
