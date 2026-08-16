const notificationService = require('./notification.service');

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const userId = req.user.id;
      const { page, limit } = req.query;
      const data = await notificationService.getUserNotifications(userId, { page, limit });

      res.status(200).json({
        success: true,
        data: data.notifications,
        unreadCount: data.unreadCount,
        pagination: data.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const userId = req.user.id;
      const count = await notificationService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        unreadCount: count,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await notificationService.markAsRead(id, userId);

      res.status(200).json({
        success: true,
        message: 'Đã đánh dấu thông báo là đã đọc.',
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const userId = req.user.id;
      await notificationService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: 'Đã đánh dấu tất cả thông báo là đã đọc.',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
