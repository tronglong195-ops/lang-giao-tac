import api from './api';

export const adminService = {
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data?.data?.stats;
  },

  async getPendingPosts(params = {}) {
    const res = await api.get('/admin/pending-posts', { params });
    return res.data?.data;
  },

  async reviewPost(id, status) {
    const res = await api.patch(`/admin/posts/${id}/status`, { status });
    return res.data;
  },

  async getPendingPhotos(params = {}) {
    const res = await api.get('/admin/pending-photos', { params });
    return res.data?.data;
  },

  async reviewPhoto(id, status) {
    const res = await api.patch(`/admin/photos/${id}/status`, { status });
    return res.data;
  },

  async getUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data?.data;
  },

  async updateUserRole(id, role) {
    const res = await api.patch(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  async toggleVerifyUser(id) {
    const res = await api.patch(`/admin/users/${id}/verify`);
    return res.data;
  },
};
