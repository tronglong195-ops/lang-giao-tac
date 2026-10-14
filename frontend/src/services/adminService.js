import api from './api';
import { firestoreDb } from './firestoreDb';

export const adminService = {
  async getStats() {
    if (firestoreDb.isAvailable()) {
      try {
        const [posts, photos, users, news] = await Promise.all([
          firestoreDb.getAll('posts'),
          firestoreDb.getAll('photos'),
          firestoreDb.getAll('users'),
          firestoreDb.getAll('news'),
        ]);

        const pendingPosts = posts.filter((p) => p.status === 'pending').length;
        const pendingPhotos = photos.filter((p) => p.status === 'pending').length;

        return {
          totalUsers: users.length,
          totalPosts: posts.length,
          pendingPosts,
          totalPhotos: photos.length,
          pendingPhotos,
          totalNews: news.length,
        };
      } catch (err) {
        console.warn('Lỗi Firestore getStats:', err.message);
      }
    }

    const res = await api.get('/admin/stats');
    return res.data?.data?.stats;
  },

  async getPendingPosts(params = {}) {
    if (firestoreDb.isAvailable()) {
      const posts = await firestoreDb.getAll('posts', {
        conditions: [['status', '==', 'pending']],
        orderField: 'createdAt',
        orderDir: 'desc',
      });
      return { posts, pagination: { total: posts.length } };
    }

    const res = await api.get('/admin/pending-posts', { params });
    return res.data?.data;
  },

  async reviewPost(id, status) {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('posts', id, { status });
      return { status: 'success', data: { post: updated } };
    }

    const res = await api.patch(`/admin/posts/${id}/status`, { status });
    return res.data;
  },

  async getPendingPhotos(params = {}) {
    if (firestoreDb.isAvailable()) {
      const photos = await firestoreDb.getAll('photos', {
        conditions: [['status', '==', 'pending']],
        orderField: 'createdAt',
        orderDir: 'desc',
      });
      return { photos, pagination: { total: photos.length } };
    }

    const res = await api.get('/admin/pending-photos', { params });
    return res.data?.data;
  },

  async reviewPhoto(id, status) {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('photos', id, { status });
      return { status: 'success', data: { photo: updated } };
    }

    const res = await api.patch(`/admin/photos/${id}/status`, { status });
    return res.data;
  },

  async getUsers(params = {}) {
    if (firestoreDb.isAvailable()) {
      const users = await firestoreDb.getAll('users', {
        orderField: 'createdAt',
        orderDir: 'desc',
      });
      return { users, pagination: { total: users.length } };
    }

    const res = await api.get('/admin/users', { params });
    return res.data?.data;
  },

  async updateUserRole(id, role) {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('users', id, { role });
      return { status: 'success', data: { user: updated } };
    }

    const res = await api.patch(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  async toggleVerifyUser(id) {
    if (firestoreDb.isAvailable()) {
      const user = await firestoreDb.getById('users', id);
      const isVerified = !user?.isVerified;
      const updated = await firestoreDb.update('users', id, { isVerified });
      return { status: 'success', data: { user: updated } };
    }

    const res = await api.patch(`/admin/users/${id}/verify`);
    return res.data;
  },

  async banUser(id, data) {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('users', id, {
        isBanned: data.isBanned !== undefined ? data.isBanned : true,
        banReason: data.banReason || '',
      });
      return { status: 'success', data: { user: updated } };
    }

    const res = await api.patch(`/admin/users/${id}/ban`, data);
    return res.data;
  },

  async rateUser(id, data) {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('users', id, { rating: data.rating });
      return { status: 'success', data: { user: updated } };
    }

    const res = await api.patch(`/admin/users/${id}/rate`, data);
    return res.data;
  },

  async deleteUser(id) {
    if (firestoreDb.isAvailable()) {
      await firestoreDb.delete('users', id);
      return { status: 'success', message: 'Đã xóa người dùng' };
    }

    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
};
