const authService = require('./auth.service');
const { getRefreshCookieOptions } = require('../../utils/jwt');

class AuthController {
  async register(req, res) {
    try {
      const { fullName, email, password, hometownGroup, currentLocation, bio } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu.',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.',
        });
      }

      const { user, accessToken, refreshToken } = await authService.register({
        fullName,
        email,
        password,
        hometownGroup,
        currentLocation,
        bio,
      });

      // Lưu refresh token vào httpOnly cookie (7 ngày)
      res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

      return res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công.',
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Đăng ký không thành công.',
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp Email và Mật khẩu.',
        });
      }

      const { user, accessToken, refreshToken } = await authService.login({
        email,
        password,
      });

      res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công.',
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Đăng nhập thất bại.',
      });
    }
  }

  // --- GOOGLE AUTH HANDLER ---
  async googleAuth(req, res) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu idToken xác thực từ Google.',
        });
      }

      const { user, accessToken, refreshToken } = await authService.loginOrRegisterWithGoogle({
        idToken,
      });

      res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập bằng Google thành công.',
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Đăng nhập bằng Google thất bại.',
      });
    }
  }

  // --- FACEBOOK AUTH HANDLER ---
  async facebookAuth(req, res) {
    try {
      const { accessToken: fbAccessToken } = req.body;

      if (!fbAccessToken) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu accessToken xác thực từ Facebook.',
        });
      }

      const { user, accessToken, refreshToken } = await authService.loginOrRegisterWithFacebook({
        accessToken: fbAccessToken,
      });

      res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập bằng Facebook thành công.',
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Đăng nhập bằng Facebook thất bại.',
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const rawToken = req.cookies?.refreshToken;

      if (!rawToken) {
        return res.status(401).json({
          success: false,
          message: 'Không tìm thấy refresh token trong cookie.',
        });
      }

      const { user, accessToken, refreshToken } = await authService.refreshToken(rawToken);

      // Cập nhật lại cookie với refreshToken mới (xoay vòng token)
      res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

      return res.status(200).json({
        success: true,
        message: 'Cấp lại access token thành công.',
        data: {
          user,
          accessToken,
        },
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Phiên làm việc hết hạn.',
      });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie('refreshToken', getRefreshCookieOptions());

      return res.status(200).json({
        success: true,
        message: 'Đăng xuất thành công.',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi đăng xuất.',
      });
    }
  }

  async getMe(req, res) {
    try {
      const user = await authService.getMe(req.user.id);

      return res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Không thể lấy thông tin người dùng.',
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const { fullName, avatarUrl, hometownGroup, currentLocation, bio } = req.body;

      const updatedUser = await authService.updateProfile(req.user.id, {
        fullName,
        avatarUrl,
        hometownGroup,
        currentLocation,
        bio,
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thành công.',
        data: { user: updatedUser },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Cập nhật thất bại.',
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới.',
        });
      }

      const result = await authService.changePassword(req.user.id, {
        currentPassword,
        newPassword,
      });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Đổi mật khẩu thất bại.',
      });
    }
  }
}

module.exports = new AuthController();
