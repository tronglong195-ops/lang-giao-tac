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
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại.',
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
          },
        });
        if (user) {
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
