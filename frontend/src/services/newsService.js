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

        const limit = params.limit ? Number(params.limit) : 20;

        // publishedAt trong collection "news" đang lẫn 2 kiểu: chuỗi ISO (bài nạp bằng script)
        // và Timestamp (bài đăng từ trang Quản trị). Firestore sắp xếp theo KIỂU trước rồi mới
        // theo giá trị, nên nếu lấy đúng `limit` bài thì bài kiểu Timestamp bị đẩy ra ngoài.
        // → Lấy rộng một nhóm bài, chuẩn hóa ngày rồi tự sắp xếp phía client.
        let news = await firestoreDb.getAll('news', {
          conditions,
          orderField: 'publishedAt',
          orderDir: 'desc',
          maxLimit: Math.max(limit * 5, 200),
        });

        const toTime = (v) => {
          const t = Date.parse(v);
          return Number.isNaN(t) ? 0 : t;
        };
        news = news
          .sort((a, b) => toTime(b.publishedAt) - toTime(a.publishedAt))
          .slice(0, params.search ? undefined : limit);

        if (params.search) {
          const q = params.search.toLowerCase();
          news = news.filter(
            (n) =>
              n.title?.toLowerCase().includes(q) ||
              n.contentHtml?.toLowerCase().includes(q) ||
              n.source?.toLowerCase().includes(q)
          );
          news = news.slice(0, limit);
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

    try {
      const res = await api.get('/news', { params });
      return res.data?.data;
    } catch (e) {
      console.warn('Lỗi tải tin tức từ API:', e);
      return { news: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } };
    }
  },

  async getNewsBySlug(slug) {
    if (firestoreDb.isAvailable()) {
      const item = await firestoreDb.getOneByField('news', 'slug', slug);
      if (item) return item;
    }

    try {
      const res = await api.get(`/news/${slug}`);
      return res.data?.data?.news;
    } catch (e) {
      console.warn('Lỗi tải tin tức chi tiết từ API:', e);
      return null;
    }
  },

  async createNews(data) {
    if (firestoreDb.isAvailable()) {
      const slug = data.slug || slugify(data.title) + '-' + Date.now();
      const payload = {
        ...data,
        slug,
        isOfficial: data.isOfficial !== undefined ? Boolean(data.isOfficial) : true,
        source: data.source || 'Ban Cán sự TDP 9 Thuận Lộc',
        // Lưu dạng chuỗi ISO cho đồng nhất với dữ liệu nạp bằng script (xem getNews)
        publishedAt: (data.publishedAt ? new Date(data.publishedAt) : new Date()).toISOString(),
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
