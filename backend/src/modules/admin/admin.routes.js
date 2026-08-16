const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { authGuard } = require('../../middlewares/authGuard');
const { roleGuard } = require('../../middlewares/roleGuard');

// Tất cả routes trong /api/admin đều yêu cầu đăng nhập và có quyền admin hoặc moderator
router.use(authGuard);
router.use(roleGuard(['admin', 'moderator']));

router.get('/stats', (req, res) => adminController.getStats(req, res));

// Kiểm duyệt bài viết
router.get('/pending-posts', (req, res) => adminController.getPendingPosts(req, res));
router.patch('/posts/:id/status', (req, res) => adminController.reviewPost(req, res));

// Kiểm duyệt ảnh
router.get('/pending-photos', (req, res) => adminController.getPendingPhotos(req, res));
router.patch('/photos/:id/status', (req, res) => adminController.reviewPhoto(req, res));

// Quản lý người dùng (chỉ Admin)
router.get('/users', (req, res) => adminController.getUsers(req, res));
router.patch('/users/:id/role', roleGuard(['admin']), (req, res) =>
  adminController.updateUserRole(req, res)
);
router.patch('/users/:id/verify', roleGuard(['admin']), (req, res) =>
  adminController.toggleVerifyUser(req, res)
);
router.patch('/users/:id/ban', roleGuard(['admin']), (req, res) =>
  adminController.banUser(req, res)
);
router.patch('/users/:id/rate', roleGuard(['admin']), (req, res) =>
  adminController.rateUser(req, res)
);
router.delete('/users/:id', roleGuard(['admin']), (req, res) =>
  adminController.deleteUser(req, res)
);

module.exports = router;
