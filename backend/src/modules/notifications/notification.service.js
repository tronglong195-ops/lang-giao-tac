const prisma = require('../../config/db');

class NotificationService {
  /**
   * Tạo 1 thông báo cho user
   */
  async createNotification({ userId, title, message, type = 'system_alert', link = null }) {
    try {
      return await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          link,
        },
      });
    } catch (error) {
      console.error('❌ Lỗi khi tạo notification:', error.message);
      return null;
    }
  }

  /**
   * Gửi thông báo đến tất cả Admin và Moderator trong hệ thống
   */
  async notifyAdminsAndMods({ title, message, type = 'post_pending', link = '/quan-tri' }) {
    try {
      const adminsAndMods = await prisma.user.findMany({
        where: {
          role: { in: ['admin', 'moderator'] },
        },
        select: { id: true },
      });

      if (adminsAndMods.length === 0) return [];

      const notifications = await prisma.notification.createMany({
        data: adminsAndMods.map((u) => ({
          userId: u.id,
          title,
          message,
          type,
          link,
        })),
      });

      return notifications;
    } catch (error) {
      console.error('❌ Lỗi khi gửi notification cho Admin/Mod:', error.message);
      return [];
    }
  }

  /**
   * Lấy danh sách thông báo của user hiện tại (phân trang + unread ưu tiên)
   */
  async getUserNotifications(userId, { page = 1, limit = 20 } = {}) {
    const pageNum = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const limitNum = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 20;
    const skip = (pageNum - 1) * limitNum;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limitNum,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  }

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  async getUnreadCount(userId) {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * Đánh dấu 1 thông báo là đã đọc
   */
  async markAsRead(notificationId, userId) {
    return await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: { isRead: true },
    });
  }

  /**
   * Đánh dấu tất cả thông báo của user là đã đọc
   */
  async markAllAsRead(userId) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Xóa 1 thông báo
   */
  async deleteNotification(notificationId, userId) {
    return await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  /**
   * Xóa tất cả thông báo của user
   */
  async deleteAllNotifications(userId) {
    return await prisma.notification.deleteMany({
      where: { userId },
    });
  }
}

module.exports = new NotificationService();
