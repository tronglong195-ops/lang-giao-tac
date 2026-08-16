const albumService = require('./album.service');

class AlbumController {
  async getAlbums(req, res) {
    try {
      const { page, limit } = req.query;
      const result = await albumService.getAlbums({ page, limit });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải danh sách Album ảnh.',
      });
    }
  }

  async getAlbumById(req, res) {
    try {
      const { id } = req.params;
      const album = await albumService.getAlbumById(id, req.user);

      return res.status(200).json({
        success: true,
        data: { album },
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Không tìm thấy Album ảnh.',
      });
    }
  }

  async createAlbum(req, res) {
    try {
      const { title, description, coverPhotoId, eventDate } = req.body;
      const album = await albumService.createAlbum(req.user, {
        title,
        description,
        coverPhotoId,
        eventDate,
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo album ảnh thành công.',
        data: { album },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tạo album ảnh.',
      });
    }
  }

  async updateAlbum(req, res) {
    try {
      const { id } = req.params;
      const { title, description, coverPhotoId, eventDate } = req.body;

      const updated = await albumService.updateAlbum(id, {
        title,
        description,
        coverPhotoId,
        eventDate,
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật album ảnh thành công.',
        data: { album: updated },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật album.',
      });
    }
  }

  async deleteAlbum(req, res) {
    try {
      const { id } = req.params;
      const result = await albumService.deleteAlbum(id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi xóa album.',
      });
    }
  }
}

module.exports = new AlbumController();
