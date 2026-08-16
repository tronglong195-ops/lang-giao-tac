const prisma = require('../../config/db');

class PhotoService {
  async addPhoto(user, { albumId, imageUrl, thumbnailUrl, caption, takenYear }) {
    if (!albumId || !imageUrl) {
      throw new Error('Vui lòng chọn Album và cung cấp đường dẫn ảnh.');
    }

    const album = await prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      throw new Error('Album ảnh không tồn tại.');
    }

    // Nếu là admin hoặc moderator thì tự động approved, nếu là member thì pending
    const status = user.role === 'admin' || user.role === 'moderator' ? 'approved' : 'pending';

    const photo = await prisma.photo.create({
      data: {
        albumId,
        uploaderId: user.id,
        imageUrl: imageUrl.trim(),
        thumbnailUrl: thumbnailUrl?.trim() || imageUrl.trim(),
        caption: caption?.trim() || null,
        takenYear: takenYear ? parseInt(takenYear, 10) : null,
        status,
      },
      include: {
        uploader: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            hometownGroup: true,
          },
        },
      },
    });

    // Nếu album chưa có ảnh bìa và ảnh này được approved -> gán làm coverPhotoId
    if (!album.coverPhotoId && status === 'approved') {
      await prisma.album.update({
        where: { id: albumId },
        data: { coverPhotoId: photo.id },
      });
    }

    return photo;
  }

  async getMyPhotos(userId, { page = 1, limit = 12, status }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = { uploaderId: userId };
    if (status && status !== 'all') {
      where.status = status;
    }

    const [total, photos] = await Promise.all([
      prisma.photo.count({ where }),
      prisma.photo.findMany({
        where,
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

  async getFeaturedPhotos(limit = 8) {
    const photos = await prisma.photo.findMany({
      where: { status: 'approved' },
      take: Number(limit),
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
            hometownGroup: true,
          },
        },
      },
    });

    return photos;
  }

  async deletePhoto(user, photoId) {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new Error('Ảnh không tồn tại.');
    }

    const isUploader = photo.uploaderId === user.id;
    const isAdminOrMod = user.role === 'admin' || user.role === 'moderator';

    if (!isUploader && !isAdminOrMod) {
      throw new Error('Bạn không có quyền xóa bức ảnh này.');
    }

    await prisma.photo.delete({
      where: { id: photoId },
    });

    return { message: 'Đã xóa ảnh thành công.' };
  }
}

module.exports = new PhotoService();
