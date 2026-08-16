const newsService = require('./news.service');

class NewsController {
  async getNews(req, res) {
    try {
      const { page, limit, search, isOfficial } = req.query;
      const result = await newsService.getNews({ page, limit, search, isOfficial });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải danh sách tin tức.',
      });
    }
  }

  async getNewsBySlug(req, res) {
    try {
      const { slug } = req.params;
      const newsItem = await newsService.getNewsBySlug(slug);

      return res.status(200).json({
        success: true,
        data: { news: newsItem },
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Không tìm thấy tin tức.',
      });
    }
  }

  async createNews(req, res) {
    try {
      const { title, contentHtml, source, isOfficial, publishedAt } = req.body;
      const newsItem = await newsService.createNews(req.user, {
        title,
        contentHtml,
        source,
        isOfficial,
        publishedAt,
      });

      return res.status(201).json({
        success: true,
        message: 'Đăng tin tức/thông báo thành công.',
        data: { news: newsItem },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tạo tin tức.',
      });
    }
  }

  async updateNews(req, res) {
    try {
      const { id } = req.params;
      const { title, contentHtml, source, isOfficial, publishedAt } = req.body;

      const updated = await newsService.updateNews(id, {
        title,
        contentHtml,
        source,
        isOfficial,
        publishedAt,
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật tin tức thành công.',
        data: { news: updated },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật tin tức.',
      });
    }
  }

  async deleteNews(req, res) {
    try {
      const { id } = req.params;
      const result = await newsService.deleteNews(id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi xóa tin tức.',
      });
    }
  }
}

module.exports = new NewsController();
