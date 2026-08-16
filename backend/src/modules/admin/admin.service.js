const prisma = require('../../config/db');
const emailService = require('../../services/email.service');
const notificationService = require('../notifications/notification.service');

class AdminService {
  async getStats() {
    const [
      totalUsers,
      totalPosts,
      pendingPosts,
      totalPhotos,
      pendingPhotos,
      totalNews,
      totalEvents,
      totalVillagers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.post.count({ where: { status: 'pending' } }),
      prisma.photo.count(),
      prisma.photo.count({ where: { status: 'pending' } }),
      prisma.news.count(),
      prisma.event.count(),
      prisma.villagerDirectory.count(),
    ]);

    return {
      totalUsers,
      totalPosts,
      pendingPosts,
      totalPhotos,
      pendingPhotos,
      totalNews,
      totalEvents,
      totalVillagers,
    };
  }

  async getPendingPosts({ page = 1, limit = 10 }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [total, posts] = await Promise.all([
      prisma.post.count({ where: { status: 'pending' } }),
      prisma.post.findMany({
        where: { status: 'pending' },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
              hometownGroup: true,
            },
          },
        },
      }),
    ]);

    return {
      posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take) || 1,
      },
    };
  }

  async reviewPost(postId, { status }) {
    if (!['published', 'rejected'].includes(status)) {
      throw new Error('Trạng thái duyệt không hợp lệ (chỉ chấp nhận published hoặc rejected).');
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Bài viết không tồn tại.');
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: {
        status,
        publishedAt: status === 'published' ? new Date() : post.publishedAt,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Tạo thông báo in-app và gửi email cho tác giả bài viết
    if (status === 'published') {
      notificationService.createNotification({
        userId: post.authorId,
        title: '🎉 Bài viết của bạn đã được phê duyệt!',
        message: `Bài viết "${post.title}" của bạn đã được xuất bản chính thức trên Làng Giao Tác.`,
        type: 'post_approved',
        link: `/bai-viet/${post.slug}`,
      }).catch(err => console.error('Lỗi tạo notification duyệt bài:', err.message));

      emailService.sendPostApprovedAlert({
        post,
        author: updated.author,
      }).catch(err => console.error('Lỗi gửi email duyệt bài:', err.message));
    } else if (status === 'rejected') {
      notificationService.createNotification({
        userId: post.authorId,
        title: '⚠️ Bài viết chưa được phê duyệt',
        message: `Bài viết "${post.title}" của bạn chưa phù hợp với quy chuẩn cộng đồng.`,
        type: 'post_rejected',
        link: '/tai-khoan',
      }).catch(err => console.error('Lỗi tạo notification từ chối bài:', err.message));
    }

    return updated;
  }

  async getPendingPhotos({ page = 1, limit = 12 }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [total, photos] = await Promise.all([
      prisma.photo.count({ where: { status: 'pending' } }),
      prisma.photo.findMany({
        where: { status: 'pending' },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          album: {
            select: {
              id: true,
              title: true,
            },
          },
          uploader: {
            select: {
              id: true,
              fullName: true,
              email: true,
              hometownGroup: true,
            },
          },
        },
      }),
    ]);

    return {
      photos,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take) || 1,
      },
    };
  }

  async reviewPhoto(photoId, { status }) {
    if (!['approved', 'rejected'].includes(status)) {
      throw new Error('Trạng thái duyệt không hợp lệ (chỉ chấp nhận approved hoặc rejected).');
    }

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { album: true },
    });

    if (!photo) {
      throw new Error('Ảnh không tồn tại.');
    }

    const updated = await prisma.photo.update({
      where: { id: photoId },
      data: { status },
    });

    // Nếu ảnh được duyệt và album chưa có ảnh bìa, gán làm ảnh bìa
    if (status === 'approved' && !photo.album.coverPhotoId) {
      await prisma.album.update({
        where: { id: photo.albumId },
        data: { coverPhotoId: photo.id },
      });
    }

    // Tạo thông báo in-app cho người tải ảnh
    if (status === 'approved') {
      notificationService.createNotification({
        userId: photo.uploaderId,
        title: '🎉 Ảnh của bạn đã được phê duyệt!',
        message: `Hình ảnh bạn đóng góp vào album "${photo.album?.title || 'Quê Hương'}" đã được duyệt và hiển thị.`,
        type: 'photo_approved',
        link: `/thu-vien-anh/${photo.albumId}`,
      }).catch(err => console.error('Lỗi tạo notification duyệt ảnh:', err.message));
    }

    return updated;
  }

  async getUsers({ page = 1, limit = 15, search, role }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {};
    if (role && role !== 'all') {
      where.role = role;
    }
    if (status === 'banned') {
      where.isBanned = true;
    } else if (status === 'active') {
      where.isBanned = false;
    }
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { hometownGroup: { contains: search, mode: 'insensitive' } },
        { currentLocation: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          avatarUrl: true,
          hometownGroup: true,
          currentLocation: true,
          isVerified: true,
          isBanned: true,
          banReason: true,
          rating: true,
          badge: true,
          adminNote: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
              photos: true,
            },
          },
        },
      }),
    ]);

    return {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take) || 1,
      },
    };
  }

  async updateUserRole(currentUserId, targetUserId, newRole) {
    if (!['admin', 'moderator', 'member'].includes(newRole)) {
      throw new Error('Vai trò không hợp lệ (admin, moderator, member).');
    }

    if (currentUserId === targetUserId && newRole !== 'admin') {
      throw new Error('Không thể tự hạ quyền Admin của chính mình.');
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isBanned: true,
      },
    });

    return updated;
  }

  async toggleVerifyUser(targetUserId) {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!user) {
      throw new Error('Người dùng không tồn tại.');
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { isVerified: !user.isVerified },
      select: {
        id: true,
        fullName: true,
        isVerified: true,
      },
    });

    return updated;
  }

  /**
   * Khóa hoặc Mở khóa tài khoản thành viên
   */
  async banUser(currentUserId, targetUserId, { isBanned, banReason }) {
    if (currentUserId === targetUserId) {
      throw new Error('Không thể tự khóa tài khoản của chính mình.');
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new Error('Người dùng không tồn tại.');
    }

    if (targetUser.role === 'admin') {
      throw new Error('Không thể khóa tài khoản của Quản trị viên khác. Vui lòng hạ quyền trước.');
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        isBanned: Boolean(isBanned),
        banReason: isBanned ? (banReason?.trim() || 'Vi phạm quy chuẩn cộng đồng Làng Giao Tác') : null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        isBanned: true,
        banReason: true,
      },
    });

    return updated;
  }

  /**
   * Đánh giá, xếp hạng sao và cấp huy hiệu cho thành viên
   */
  async rateUser(targetUserId, { rating, badge, adminNote }) {
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new Error('Người dùng không tồn tại.');
    }

    const parsedRating = rating !== undefined ? Math.max(1, Math.min(5, Number(rating))) : undefined;

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        ...(parsedRating !== undefined && { rating: parsedRating }),
        ...(badge !== undefined && { badge: badge?.trim() || null }),
        ...(adminNote !== undefined && { adminNote: adminNote?.trim() || null }),
      },
      select: {
        id: true,
        fullName: true,
        rating: true,
        badge: true,
        adminNote: true,
      },
    });

    return updated;
  }

  /**
   * Xóa vĩnh viễn tài khoản thành viên khỏi hệ thống
   */
  async deleteUser(currentUserId, targetUserId) {
    if (currentUserId === targetUserId) {
      throw new Error('Không thể tự xóa tài khoản của chính mình.');
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new Error('Người dùng không tồn tại.');
    }

    if (targetUser.role === 'admin') {
      throw new Error('Không thể xóa tài khoản Quản trị viên.');
    }

    // Xóa người dùng (Prisma onDelete: Cascade sẽ tự xóa bài viết, ảnh, thông báo của người này)
    await prisma.user.delete({
      where: { id: targetUserId },
    });

    return { success: true, message: `Đã xóa vĩnh viễn tài khoản ${targetUser.fullName} (${targetUser.email}).` };
  }
}

module.exports = new AdminService();
