import api from './api';

export const villagerService = {
  async getVillagers(params = {}) {
    const res = await api.get('/villagers', { params });
    return res.data?.data;
  },

  async getStats() {
    const res = await api.get('/villagers/stats');
    return res.data?.data?.stats;
  },

  async createVillager(data) {
    const res = await api.post('/villagers', data);
    return res.data;
  },

  async updateVillager(id, data) {
    const res = await api.put(`/villagers/${id}`, data);
    return res.data;
  },

  async deleteVillager(id) {
    const res = await api.delete(`/villagers/${id}`);
    return res.data;
  },
};
