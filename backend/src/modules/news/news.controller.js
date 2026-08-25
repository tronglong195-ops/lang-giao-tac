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

  async getWardFeed(req, res) {
    try {
      const { page, forceRefresh } = req.query;
      const { getAllWardArticles, scrapeWardNewsPage } = require('../../services/wardCrawler.service');
      
      let articles = [];
      if (page) {
        articles = await scrapeWardNewsPage(Number(page));
      } else {
        articles = await getAllWardArticles(4, forceRefresh === 'true');
      }

      return res.status(200).json({
        success: true,
        data: { articles, total: articles.length },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi tải tin tức từ Cổng TTĐT Phường.',
      });
    }
  }

  async getWardDetail(req, res) {
    try {
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ success: false, message: 'Thiếu url bài viết.' });
      }
      const { scrapeArticleDetail } = require('../../services/wardCrawler.service');
      const article = await scrapeArticleDetail(url);
      if (!article) {
        return res.status(404).json({ success: false, message: 'Không thể lấy nội dung chi tiết bài viết.' });
      }
      return res.status(200).json({
        success: true,
        data: { article },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi tải chi tiết bài viết phường.',
      });
    }
  }

  async syncWardNews(req, res) {
    try {
      const { maxPages = 4 } = req.body || {};
      const { syncWardNews } = require('../../services/wardCrawler.service');
      const result = await syncWardNews({ maxPages: Number(maxPages) || 4 });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Lỗi khi đồng bộ tin tức phường.',
      });
    }
  }
}

module.exports = new NewsController();
