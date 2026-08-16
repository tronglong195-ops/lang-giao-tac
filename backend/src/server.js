const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const app = require('./app');
const prisma = require('./config/db');
const { runAutoSeed } = require('./config/autoSeed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Kiểm tra kết nối Database
    await prisma.$connect();
    console.log('✅ Đã kết nối cơ sở dữ liệu PostgreSQL thành công qua Prisma.');

    // Tự động kiểm tra và khởi tạo Admin + Dữ liệu nếu database trống
    await runAutoSeed(prisma);

    app.listen(PORT, () => {
      console.log(`🌾 Máy chủ Làng Giao Tác Backend đang chạy tại http://localhost:${PORT}`);
      console.log(`🌾 API Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Lỗi kết nối cơ sở dữ liệu hoặc khởi động server:', error.message);
    process.exit(1);
  }
};

startServer();
