// Bộ đệm Rate Limit trong bộ nhớ siêu nhẹ & hiệu năng cao
const rateLimitMap = new Map();

/**
 * Middleware giới hạn tần suất gửi request
 * @param {number} windowMs - Khoảng thời gian (ms) ví dụ: 60 * 1000 = 1 phút
 * @param {number} max - Số request tối đa trong khoảng thời gian đó
 * @param {string} message - Thông báo lỗi khi vượt ngưỡng
 */
const rateLimiter = (windowMs = 60 * 1000, max = 30, message = 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.') => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const key = `${ip}_${req.baseUrl || req.path}`;
    const now = Date.now();

    const record = rateLimitMap.get(key);

    if (!record) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (now > record.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    next();
  };
};

// Dọn dẹp bộ đệm định kỳ mỗi 5 phút để tránh rò rỉ bộ nhớ
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

module.exports = { rateLimiter };
