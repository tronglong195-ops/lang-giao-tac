import api from './api';

export const newsService = {
  async getNews(params = {}) {
    const res = await api.get('/news', { params });
    return res.data?.data;
  },

  async getNewsBySlug(slug) {
    const res = await api.get(`/news/${slug}`);
    return res.data?.data?.news;
  },

  async createNews(data) {
    const res = await api.post('/news', data);
    return res.data;
  },

  async updateNews(id, data) {
    const res = await api.put(`/news/${id}`, data);
    return res.data;
  },

  async deleteNews(id) {
    const res = await api.delete(`/news/${id}`);
    return res.data;
  },

  async getWardNewsFeed(page, forceRefresh = false) {
    const res = await api.get('/news/ward/feed', { params: { page, forceRefresh } });
    return res.data?.data?.articles || [];
  },

  async getWardArticleDetail(url) {
    const res = await api.get('/news/ward/detail', { params: { url } });
    return res.data?.data?.article;
  },

  async syncWardNews(maxPages = 4) {
    const res = await api.post('/news/ward/sync', { maxPages });
    return res.data;
  },
};
