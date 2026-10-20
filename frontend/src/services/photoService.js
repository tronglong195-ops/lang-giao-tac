import api from './api';
import { firestoreDb } from './firestoreDb';
import { emailAlertService } from './emailAlertService';

export const photoService = {
  async getAlbums(params = {}) {
    if (firestoreDb.isAvailable()) {
      try {
        let albums = await firestoreDb.getAll('albums');

        // Tải toàn bộ ảnh để gán đúng ảnh bìa và đếm số lượng cho từng Album
        const allPhotos = await firestoreDb.getAll('photos');

        albums = albums.map((album) => {
          const albumPhotos = allPhotos.filter((p) => p.albumId === album.id);
          const firstImg =
            album.coverPhotoUrl ||
            albumPhotos[0]?.imageUrl ||
            '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg';

          return {
            ...album,
            coverPhotoUrl: firstImg,
            photos: albumPhotos.length > 0 ? albumPhotos : [{ imageUrl: firstImg, caption: album.title }],
            _count: { photos: albumPhotos.length },
          };
        });

        return {
          albums,
          pagination: {
            page: Number(params.page || 1),
            limit: Number(params.limit || 12),
            total: albums.length,
            totalPages: Math.ceil(albums.length / (params.limit || 12)) || 1,
          },
        };
      } catch (err) {
        console.warn('Lỗi Firestore getAlbums:', err.message);
      }
    }

    try {
      const res = await api.get('/albums', { params });
      return res.data?.data;
    } catch (e) {
      console.warn('Lỗi tải albums từ API:', e);
      return { albums: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 1 } };
    }
  },

  async getAlbumById(id) {
    if (firestoreDb.isAvailable()) {
      let album = await firestoreDb.getById('albums', id);
      if (!album) {
        album = await firestoreDb.getOneByField('albums', 'id', id);
      }
      if (album) {
        const allPhotos = await firestoreDb.getAll('photos');
        const photos = allPhotos.filter((p) => p.albumId === id || p.albumId === album.id);
        return {
          ...album,
          photos,
          _count: { photos: photos.length },
        };
      }
    }

    try {
      const res = await api.get(`/albums/${id}`);
      return res.data?.data?.album;
    } catch (e) {
      console.warn('Lỗi tải album từ API:', e);
      return null;
    }
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

      emailAlertService.sendNewPhotoAlert({
        photoCount: 1,
        albumTitle: data.albumTitle || 'Kho Ảnh Quê Hương',
        uploader: { fullName: data.uploaderName || 'Bà con Làng' },
      }).catch((err) => console.warn('Lỗi gửi email alert ảnh mới:', err));

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
          uploaderId: uploaderId || 'admin_default',
          imageUrl: p.imageUrl,
          thumbnailUrl: p.imageUrl,
          caption: p.caption || '',
          takenYear: p.takenYear || null,
          status: 'approved',
        });
        createdPhotos.push(item);
      }

      emailAlertService.sendNewPhotoAlert({
        photoCount: photos.length,
        albumTitle: data.albumTitle || 'Thư Viện Ảnh Làng',
        uploader: { fullName: data.uploaderName || 'Bà con Làng' },
      }).catch((err) => console.warn('Lỗi gửi email alert batch ảnh:', err));

      return { status: 'success', data: { photos: createdPhotos } };
    }

    const res = await api.post('/photos/batch', data);
    return res.data;
  },

  async getMyPhotos(params = {}) {
    if (firestoreDb.isAvailable() && params.uploaderId) {
      const photos = await firestoreDb.getAll('photos', {
        conditions: [['uploaderId', '==', params.uploaderId]],
      });
      return { photos };
    }

    try {
      const res = await api.get('/photos/my/photos', { params });
      return res.data?.data;
    } catch (e) {
      console.warn('Lỗi tải ảnh của tôi từ API:', e);
      return { photos: [] };
    }
  },

  async getFeaturedPhotos(limitCount = 8) {
    if (firestoreDb.isAvailable()) {
      const allPhotos = await firestoreDb.getAll('photos');
      if (allPhotos.length > 0) {
        return allPhotos.slice(0, limitCount);
      }
    }

    try {
      const res = await api.get('/photos/featured', { params: { limit: limitCount } });
      return res.data?.data?.photos || [];
    } catch (e) {
      console.warn('Lỗi tải ảnh nổi bật từ API:', e);
      return [];
    }
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
