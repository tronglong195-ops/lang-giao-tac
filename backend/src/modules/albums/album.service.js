const prisma = require('../../config/db');

class AlbumService {
  async getAlbums({ page = 1, limit = 12 }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [total, albums] = await Promise.all([
      prisma.album.count(),
      prisma.album.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          photos: {
            where: { status: 'approved' },
            take: 4,
            select: {
              id: true,
              imageUrl: true,
              thumbnailUrl: true,
            },
          },
          _count: {
            select: {
              photos: {
                where: { status: 'approved' },
              },
            },
          },
        },
      }),
    ]);

    return {
      albums,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take) || 1,
      },
    };
  }

  async getAlbumById(id, user) {
    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        photos: {
          where:
            user && (user.role === 'admin' || user.role === 'moderator')
              ? {}
              : { status: 'approved' },
          orderBy: { createdAt: 'desc' },
          include: {
            uploader: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                hometownGroup: true,
              },
            },
            comments: {
              orderBy: { createdAt: 'desc' },
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!album) {
      throw new Error('Không tìm thấy album ảnh.');
    }

    return album;
  }

  async createAlbum(user, { title, description, coverPhotoId, eventDate }) {
    if (!title) {
      throw new Error('Vui lòng nhập tên Album ảnh.');
    }

    const album = await prisma.album.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        coverPhotoId: coverPhotoId || null,
        eventDate: eventDate ? new Date(eventDate) : null,
        createdById: user.id,
      },
    });

    return album;
  }

  async updateAlbum(id, { title, description, coverPhotoId, eventDate }) {
    const existing = await prisma.album.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Album ảnh không tồn tại.');
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (coverPhotoId !== undefined) updateData.coverPhotoId = coverPhotoId || null;
    if (eventDate !== undefined) updateData.eventDate = eventDate ? new Date(eventDate) : null;

    const updated = await prisma.album.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async deleteAlbum(id) {
    const existing = await prisma.album.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Album ảnh không tồn tại.');
    }

    await prisma.album.delete({
      where: { id },
    });

    return { message: 'Đã xóa album ảnh thành công.' };
  }
}

module.exports = new AlbumService();
