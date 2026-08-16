const prisma = require('../../config/db');

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
          },
        },
      },
    });

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

    return updated;
  }

  async getUsers({ page = 1, limit = 15, search, role }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {};
    if (role && role !== 'all') {
      where.role = role;
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
      throw new Error('Vai trò không hợp lệ.');
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
}

module.exports = new AdminService();
