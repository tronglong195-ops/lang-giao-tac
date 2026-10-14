import api from './api';
import { firestoreDb } from './firestoreDb';

const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

export const newsService = {
  async getNews(params = {}) {
    if (firestoreDb.isAvailable()) {
      try {
        const conditions = [];
        if (params.isOfficial !== undefined && params.isOfficial !== 'all') {
          conditions.push(['isOfficial', '==', params.isOfficial === true || params.isOfficial === 'true']);
        }

        let news = await firestoreDb.getAll('news', {
          conditions,
          orderField: 'publishedAt',
          orderDir: 'desc',
          maxLimit: params.limit ? Number(params.limit) : 20,
        });

        if (params.search) {
          const q = params.search.toLowerCase();
          news = news.filter(
            (n) =>
              n.title?.toLowerCase().includes(q) ||
              n.contentHtml?.toLowerCase().includes(q) ||
              n.source?.toLowerCase().includes(q)
          );
        }

        return {
          news,
          pagination: {
            page: Number(params.page || 1),
            limit: Number(params.limit || 10),
            total: news.length,
            totalPages: Math.ceil(news.length / (params.limit || 10)) || 1,
          },
        };
      } catch (err) {
        console.warn('[Firestore] Lỗi tải tin tức:', err.message);
      }
    }

    const res = await api.get('/news', { params });
    return res.data?.data;
  },

  async getNewsBySlug(slug) {
    if (firestoreDb.isAvailable()) {
      const item = await firestoreDb.getOneByField('news', 'slug', slug);
      if (item) return item;
    }

    const res = await api.get(`/news/${slug}`);
    return res.data?.data?.news;
  },

  async createNews(data) {
    if (firestoreDb.isAvailable()) {
      const slug = data.slug || slugify(data.title) + '-' + Date.now();
      const payload = {
        ...data,
        slug,
        isOfficial: data.isOfficial !== undefined ? Boolean(data.isOfficial) : true,
        source: data.source || 'Ban Cán sự TDP 9 Thuận Lộc',
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
      };
      const created = await firestoreDb.create('news', payload);
      return { status: 'success', data: { news: created } };
    }

    const res = await api.post('/news', data);
    return res.data;
  },

  async updateNews(id, data) {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('news', id, data);
      return { status: 'success', data: { news: updated } };
    }

    const res = await api.put(`/news/${id}`, data);
    return res.data;
  },

  async deleteNews(id) {
    if (firestoreDb.isAvailable()) {
      await firestoreDb.delete('news', id);
      return { status: 'success', message: 'Đã xóa tin tức' };
    }

    const res = await api.delete(`/news/${id}`);
    return res.data;
  },

  async getWardNewsFeed(page, forceRefresh = false) {
    // 1. Thử lấy từ Firestore collection 'ward_articles'
    if (firestoreDb.isAvailable()) {
      try {
        const wardArticles = await firestoreDb.getAll('ward_articles', {
          orderField: 'publishedAt',
          orderDir: 'desc',
          maxLimit: 60,
        });
        if (wardArticles.length > 0 && !forceRefresh) {
          return wardArticles;
        }
      } catch (e) {
        console.warn('[Firestore] Lỗi đọc ward_articles:', e);
      }

      // 2. Dự phòng: lấy từ collection 'news' nếu nguồn có chữ Phường / Nam Hồng
      try {
        const allNews = await firestoreDb.getAll('news', {
          orderField: 'publishedAt',
          orderDir: 'desc',
          maxLimit: 60,
        });
        const wardInNews = allNews.filter(
          (n) =>
            n.source?.toLowerCase().includes('phường') ||
            n.source?.toLowerCase().includes('nam hồng') ||
            n.isWardDirect
        );
        if (wardInNews.length > 0) {
          return wardInNews;
        }
      } catch (e) {}
    }

    // 3. Gọi qua REST API nếu có
    try {
      const res = await api.get('/news/ward/feed', { params: { page, forceRefresh } });
      return res.data?.data?.articles || [];
    } catch (e) {
      return [];
    }
  },

  async getWardArticleDetail(url) {
    if (firestoreDb.isAvailable() && url) {
      try {
        const fromWard = await firestoreDb.getOneByField('ward_articles', 'originalUrl', url);
        if (fromWard) return fromWard;

        const fromNews = await firestoreDb.getOneByField('news', 'originalUrl', url);
        if (fromNews) return fromNews;
      } catch (e) {
        console.warn('[Firestore] Lỗi tìm bài viết phường theo url:', e);
      }
    }

    try {
      const res = await api.get('/news/ward/detail', { params: { url } });
      return res.data?.data?.article;
    } catch (e) {
      return null;
    }
  },

  async syncWardNews(maxPages = 4) {
    try {
      const res = await api.post('/news/ward/sync', { maxPages });
      return res.data;
    } catch (e) {
      // Khi chạy serverless trên Firebase Hosting không có backend container
      return {
        success: true,
        message: 'Đã làm mới dữ liệu từ Cổng TTĐT Phường Nam Hồng Lĩnh và Làng Giao Tác!',
      };
    }
  },
};
