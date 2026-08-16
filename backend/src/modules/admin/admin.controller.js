const adminService = require('./admin.service');

class AdminController {
  async getStats(req, res) {
    try {
      const stats = await adminService.getStats();
      return res.status(200).json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lấy thống kê quản trị.',
      });
    }
  }

  async getPendingPosts(req, res) {
    try {
      const { page, limit } = req.query;
      const result = await adminService.getPendingPosts({ page, limit });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải danh sách bài viết chờ duyệt.',
      });
    }
  }

  async reviewPost(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await adminService.reviewPost(id, { status });

      return res.status(200).json({
        success: true,
        message:
          status === 'published'
            ? 'Đã duyệt và xuất bản bài viết thành công.'
            : 'Đã từ chối bài viết.',
        data: { post: updated },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi kiểm duyệt bài viết.',
      });
    }
  }

  async getPendingPhotos(req, res) {
    try {
      const { page, limit } = req.query;
      const result = await adminService.getPendingPhotos({ page, limit });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải ảnh chờ duyệt.',
      });
    }
  }

  async reviewPhoto(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await adminService.reviewPhoto(id, { status });

      return res.status(200).json({
        success: true,
        message:
          status === 'approved'
            ? 'Đã phê duyệt ảnh thành công.'
            : 'Đã từ chối ảnh.',
        data: { photo: updated },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi duyệt ảnh.',
      });
    }
  }

  async getUsers(req, res) {
    try {
      const { page, limit, search, role, status } = req.query;
      const result = await adminService.getUsers({ page, limit, search, role, status });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải danh sách người dùng.',
      });
    }
  }

  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const updated = await adminService.updateUserRole(req.user.id, id, role);

      return res.status(200).json({
        success: true,
        message: `Đã cập nhật vai trò thành ${role}.`,
        data: { user: updated },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật vai trò.',
      });
    }
  }

  async toggleVerifyUser(req, res) {
    try {
      const { id } = req.params;
      const updated = await adminService.toggleVerifyUser(id);

      return res.status(200).json({
        success: true,
        message: updated.isVerified
          ? 'Đã xác minh tài khoản dân làng.'
          : 'Đã hủy xác minh tài khoản.',
        data: { user: updated },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi thay đổi trạng thái xác minh.',
      });
    }
  }

  async banUser(req, res) {
    try {
      const { id } = req.params;
      const { isBanned, banReason } = req.body;

      const updated = await adminService.banUser(req.user.id, id, { isBanned, banReason });

      return res.status(200).json({
        success: true,
        message: isBanned ? 'Đã khóa tài khoản thành viên.' : 'Đã mở khóa tài khoản thành viên.',
        data: { user: updated },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi thay đổi trạng thái khóa tài khoản.',
      });
    }
  }

  async rateUser(req, res) {
    try {
      const { id } = req.params;
      const { rating, badge, adminNote } = req.body;

      const updated = await adminService.rateUser(id, { rating, badge, adminNote });

      return res.status(200).json({
        success: true,
        message: 'Đã lưu đánh giá và khen thưởng thành viên.',
        data: { user: updated },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi lưu đánh giá thành viên.',
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const result = await adminService.deleteUser(req.user.id, id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi xóa thành viên.',
      });
    }
  }
}

module.exports = new AdminController();
