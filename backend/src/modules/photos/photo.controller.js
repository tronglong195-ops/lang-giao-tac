const photoService = require('./photo.service');

class PhotoController {
  async addPhoto(req, res) {
    try {
      const { albumId, imageUrl, thumbnailUrl, caption, takenYear } = req.body;
      const photo = await photoService.addPhoto(req.user, {
        albumId,
        imageUrl,
        thumbnailUrl,
        caption,
        takenYear,
      });

      return res.status(201).json({
        success: true,
        message:
          photo.status === 'pending'
            ? 'Ảnh đã được tải lên và đang chờ Ban quản trị duyệt.'
            : 'Đăng ảnh thành công.',
        data: { photo },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải ảnh lên.',
      });
    }
  }

  async addPhotosBatch(req, res) {
    try {
      const { albumId, photos } = req.body;
      const result = await photoService.addPhotosBatch(req.user, { albumId, photos });

      return res.status(201).json({
        success: true,
        message:
          result.status === 'pending'
            ? `Đã tải lên ${result.photos.length} bức ảnh và đang chờ Ban quản trị duyệt.`
            : `Đã tải lên thành công ${result.photos.length} bức ảnh vào Album.`,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải nhiều ảnh lên.',
      });
    }
  }

  async getMyPhotos(req, res) {
    try {
      const { page, limit, status } = req.query;
      const result = await photoService.getMyPhotos(req.user.id, { page, limit, status });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải danh sách ảnh của bạn.',
      });
    }
  }

  async getFeaturedPhotos(req, res) {
    try {
      const { limit } = req.query;
      const photos = await photoService.getFeaturedPhotos(limit);

      return res.status(200).json({
        success: true,
        data: { photos },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải ảnh nổi bật.',
      });
    }
  }

  async deletePhoto(req, res) {
    try {
      const { id } = req.params;
      const result = await photoService.deletePhoto(req.user, id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi xóa ảnh.',
      });
    }
  }
}

module.exports = new PhotoController();
