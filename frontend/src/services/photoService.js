import api from './api';

export const photoService = {
  async getAlbums(params = {}) {
    const res = await api.get('/albums', { params });
    return res.data?.data;
  },

  async getAlbumById(id) {
    const res = await api.get(`/albums/${id}`);
    return res.data?.data?.album;
  },

  async createAlbum(data) {
    const res = await api.post('/albums', data);
    return res.data;
  },

  async updateAlbum(id, data) {
    const res = await api.put(`/albums/${id}`, data);
    return res.data;
  },

  async deleteAlbum(id) {
    const res = await api.delete(`/albums/${id}`);
    return res.data;
  },

  async addPhoto(data) {
    const res = await api.post('/photos', data);
    return res.data;
  },

  async addPhotosBatch(data) {
    const res = await api.post('/photos/batch', data);
    return res.data;
  },

  async getMyPhotos(params = {}) {
    const res = await api.get('/photos/my/photos', { params });
    return res.data?.data;
  },

  async getFeaturedPhotos(limit = 8) {
    const res = await api.get('/photos/featured', { params: { limit } });
    return res.data?.data?.photos;
  },

  async deletePhoto(id) {
    const res = await api.delete(`/photos/${id}`);
    return res.data;
  },

  async addPhotoComment(photoId, content) {
    const res = await api.post('/comments', { photoId, content });
    return res.data?.data?.comment;
  },
};
