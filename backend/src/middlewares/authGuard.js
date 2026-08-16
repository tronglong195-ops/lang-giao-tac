const { verifyAccessToken } = require('../utils/jwt');
const prisma = require('../config/db');

const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập để thực hiện thao tác này.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        hometownGroup: true,
        currentLocation: true,
        isVerified: true,
        isBanned: true,
        banReason: true,
        rating: true,
        badge: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại.',
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        code: 'USER_BANNED',
        message: user.banReason
          ? `Tài khoản của bạn đã bị khóa: ${user.banReason}`
          : 'Tài khoản của bạn đã bị Ban Quản Trị khóa do vi phạm quy định cộng đồng.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Lỗi authGuard:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực hệ thống.',
    });
  }
};

const optionalAuthGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      if (decoded) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            avatarUrl: true,
            hometownGroup: true,
            currentLocation: true,
            isVerified: true,
            isBanned: true,
            banReason: true,
            rating: true,
            badge: true,
          },
        });
        if (user && !user.isBanned) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authGuard,
  optionalAuthGuard,
};
