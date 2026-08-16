import api from './api';

export const historyService = {
  async getTimelines() {
    const res = await api.get('/history');
    return res.data?.data?.timelines;
  },

  async createTimeline(data) {
    const res = await api.post('/history', data);
    return res.data;
  },

  async updateTimeline(id, data) {
    const res = await api.put(`/history/${id}`, data);
    return res.data;
  },

  async deleteTimeline(id) {
    const res = await api.delete(`/history/${id}`);
    return res.data;
  },
};
