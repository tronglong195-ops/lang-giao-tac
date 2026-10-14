import api from './api';
import { firestoreDb } from './firestoreDb';

export const photoService = {
  async getAlbums(params = {}) {
    if (firestoreDb.isAvailable()) {
      try {
        const albums = await firestoreDb.getAll('albums', {
          orderField: 'createdAt',
          orderDir: 'desc',
        });
        return { albums };
      } catch (err) {
        console.warn('Lỗi Firestore getAlbums:', err.message);
      }
    }

    const res = await api.get('/albums', { params });
    return res.data?.data;
  },

  async getAlbumById(id) {
    if (firestoreDb.isAvailable()) {
      const album = await firestoreDb.getById('albums', id);
      if (album) {
        const photos = await firestoreDb.getAll('photos', {
          conditions: [['albumId', '==', id]],
          orderField: 'createdAt',
          orderDir: 'desc',
        });
        return { ...album, photos };
      }
    }

    const res = await api.get(`/albums/${id}`);
    return res.data?.data?.album;
  },

  async createAlbum(data) {
    if (firestoreDb.isAvailable()) {
      const created = await firestoreDb.create('albums', data);
      return { status: 'success', data: { album: created } };
    }

    const res = await api.post('/albums', data);
    return res.data;
  },

  async updateAlbum(id, data) {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('albums', id, data);
      return { status: 'success', data: { album: updated } };
    }

    const res = await api.put(`/albums/${id}`, data);
    return res.data;
  },

  async deleteAlbum(id) {
    if (firestoreDb.isAvailable()) {
      await firestoreDb.delete('albums', id);
      return { status: 'success', message: 'Đã xóa album' };
    }

    const res = await api.delete(`/albums/${id}`);
    return res.data;
  },

  async addPhoto(data) {
    if (firestoreDb.isAvailable()) {
      const created = await firestoreDb.create('photos', {
        ...data,
        status: data.status || 'pending',
      });
      return { status: 'success', data: { photo: created } };
    }

    const res = await api.post('/photos', data);
    return res.data;
  },

  async addPhotosBatch(data) {
    if (firestoreDb.isAvailable()) {
      const { albumId, uploaderId, photos = [] } = data;
      const createdPhotos = [];
      for (const p of photos) {
        const item = await firestoreDb.create('photos', {
          albumId,
          uploaderId,
          imageUrl: p.imageUrl,
          caption: p.caption || '',
          takenYear: p.takenYear || null,
          status: 'pending',
        });
        createdPhotos.push(item);
      }
      return { status: 'success', data: { photos: createdPhotos } };
    }

    const res = await api.post('/photos/batch', data);
    return res.data;
  },

  async getMyPhotos(params = {}) {
    if (firestoreDb.isAvailable() && params.uploaderId) {
      const photos = await firestoreDb.getAll('photos', {
        conditions: [['uploaderId', '==', params.uploaderId]],
        orderField: 'createdAt',
        orderDir: 'desc',
      });
      return { photos };
    }

    const res = await api.get('/photos/my/photos', { params });
    return res.data?.data;
  },

  async getFeaturedPhotos(limitCount = 8) {
    if (firestoreDb.isAvailable()) {
      const photos = await firestoreDb.getAll('photos', {
        conditions: [['status', '==', 'approved']],
        orderField: 'createdAt',
        orderDir: 'desc',
        maxLimit: limitCount,
      });
      if (photos.length > 0) return photos;
    }

    const res = await api.get('/photos/featured', { params: { limit: limitCount } });
    return res.data?.data?.photos;
  },

  async updatePhoto(id, data) {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('photos', id, data);
      return { status: 'success', data: { photo: updated } };
    }

    const res = await api.put(`/photos/${id}`, data);
    return res.data;
  },

  async deletePhoto(id) {
    if (firestoreDb.isAvailable()) {
      await firestoreDb.delete('photos', id);
      return { status: 'success', message: 'Đã xóa ảnh' };
    }

    const res = await api.delete(`/photos/${id}`);
    return res.data;
  },

  async addPhotoComment(photoId, content, user = {}) {
    if (firestoreDb.isAvailable()) {
      const created = await firestoreDb.create('comments', {
        photoId,
        content,
        userId: user.id || 'anonymous',
        userName: user.fullName || 'Bà con Làng Giao Tác',
      });
      return created;
    }

    const res = await api.post('/comments', { photoId, content });
    return res.data?.data?.comment;
  },
};
