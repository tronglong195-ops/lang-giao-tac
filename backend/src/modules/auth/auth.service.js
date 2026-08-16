const bcrypt = require('bcryptjs');
const prisma = require('../../config/db');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../utils/jwt');

class AuthService {
  async register({ fullName, email, password, hometownGroup, currentLocation, bio }) {
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      throw new Error('Email này đã được đăng ký trên hệ thống.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Kiểm tra xem có phải là người dùng đầu tiên không -> gán quyền admin
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'admin' : 'member';

    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        hometownGroup: hometownGroup?.trim() || null,
        currentLocation: currentLocation?.trim() || null,
        bio: bio?.trim() || null,
        isVerified: role === 'admin',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        avatarUrl: true,
        hometownGroup: true,
        currentLocation: true,
        bio: true,
        isVerified: true,
        createdAt: true,
      },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }

  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    if (!user.passwordHash) {
      throw new Error('Tài khoản này được tạo qua Google/Facebook. Vui lòng sử dụng nút đăng nhập xã hội tương ứng.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      hometownGroup: user.hometownGroup,
      currentLocation: user.currentLocation,
      bio: user.bio,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    const accessToken = generateAccessToken(safeUser);
    const refreshToken = generateRefreshToken(safeUser);

    return { user: safeUser, accessToken, refreshToken };
  }

  // --- GOOGLE OAUTH LOGIN / REGISTER ---
  async loginOrRegisterWithGoogle({ googleId, email, fullName, avatarUrl }) {
    if (!email && !googleId) {
      throw new Error('Thiếu thông tin xác thực từ Google.');
    }

    const normalizedEmail = email ? email.toLowerCase().trim() : null;

    let user = null;

    // Tìm theo googleId trước, sau đó tìm theo email
    if (googleId) {
      user = await prisma.user.findUnique({
        where: { googleId },
      });
    }

    if (!user && normalizedEmail) {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    }

    if (user) {
      // Cập nhật thông tin nếu cần
      const updateData = {};
      if (!user.googleId && googleId) updateData.googleId = googleId;
      if (!user.avatarUrl && avatarUrl) updateData.avatarUrl = avatarUrl;
      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
    } else {
      // Tạo tài khoản mới từ Google
      const userCount = await prisma.user.count();
      const role = userCount === 0 ? 'admin' : 'member';

      user = await prisma.user.create({
        data: {
          fullName: fullName?.trim() || (normalizedEmail ? normalizedEmail.split('@')[0] : 'Thành viên Google'),
          email: normalizedEmail || `google_${googleId}@langgiaotac.vn`,
          googleId: googleId || null,
          avatarUrl: avatarUrl || null,
          role,
          hometownGroup: 'Dâu rể / Con em quê hương',
          currentLocation: null,
          isVerified: role === 'admin',
        },
      });
    }

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      hometownGroup: user.hometownGroup,
      currentLocation: user.currentLocation,
      bio: user.bio,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    const accessToken = generateAccessToken(safeUser);
    const refreshToken = generateRefreshToken(safeUser);

    return { user: safeUser, accessToken, refreshToken };
  }

  // --- FACEBOOK OAUTH LOGIN / REGISTER ---
  async loginOrRegisterWithFacebook({ facebookId, email, fullName, avatarUrl }) {
    if (!facebookId) {
      throw new Error('Thiếu Facebook ID từ tài khoản.');
    }

    const normalizedEmail = email ? email.toLowerCase().trim() : null;

    let user = await prisma.user.findUnique({
      where: { facebookId },
    });

    if (!user && normalizedEmail) {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    }

    if (user) {
      const updateData = {};
      if (!user.facebookId && facebookId) updateData.facebookId = facebookId;
      if (!user.avatarUrl && avatarUrl) updateData.avatarUrl = avatarUrl;
      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
    } else {
      const userCount = await prisma.user.count();
      const role = userCount === 0 ? 'admin' : 'member';

      user = await prisma.user.create({
        data: {
          fullName: fullName?.trim() || 'Thành viên Facebook',
          email: normalizedEmail || `facebook_${facebookId}@langgiaotac.vn`,
          facebookId,
          avatarUrl: avatarUrl || null,
          role,
          hometownGroup: 'Dâu rể / Con em quê hương',
          currentLocation: null,
          isVerified: role === 'admin',
        },
      });
    }

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      hometownGroup: user.hometownGroup,
      currentLocation: user.currentLocation,
      bio: user.bio,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };

    const accessToken = generateAccessToken(safeUser);
    const refreshToken = generateRefreshToken(safeUser);

    return { user: safeUser, accessToken, refreshToken };
  }

  async refreshToken(rawToken) {
    if (!rawToken) {
      throw new Error('Không tìm thấy refresh token.');
    }

    const decoded = verifyRefreshToken(rawToken);
    if (!decoded) {
      throw new Error('Refresh token không hợp lệ hoặc đã hết hạn.');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        avatarUrl: true,
        hometownGroup: true,
        currentLocation: true,
        bio: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('Người dùng không tồn tại.');
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken: newRefreshToken };
  }

  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        avatarUrl: true,
        hometownGroup: true,
        currentLocation: true,
        bio: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            photos: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Không tìm thấy thông tin tài khoản.');
    }

    return user;
  }

  async updateProfile(userId, { fullName, avatarUrl, hometownGroup, currentLocation, bio }) {
    const data = {};
    if (fullName !== undefined) data.fullName = fullName.trim();
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl.trim();
    if (hometownGroup !== undefined) data.hometownGroup = hometownGroup?.trim() || null;
    if (currentLocation !== undefined) data.currentLocation = currentLocation?.trim() || null;
    if (bio !== undefined) data.bio = bio?.trim() || null;

    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        avatarUrl: true,
        hometownGroup: true,
        currentLocation: true,
        bio: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return updated;
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Người dùng không tồn tại.');
    }

    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        throw new Error('Mật khẩu hiện tại không đúng.');
      }
    }

    if (newPassword.length < 6) {
      throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { message: 'Đổi mật khẩu thành công.' };
  }
}

module.exports = new AuthService();
