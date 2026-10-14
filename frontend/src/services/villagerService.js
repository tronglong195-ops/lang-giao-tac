import api from './api';
import { firestoreDb } from './firestoreDb';

export const villagerService = {
  async getVillagers(params = {}) {
    if (firestoreDb.isAvailable()) {
      try {
        const conditions = [];
        if (params.region && params.region !== 'all') {
          conditions.push(['region', '==', params.region]);
        }
        if (params.generationBranch && params.generationBranch !== 'all') {
          conditions.push(['generationBranch', '==', params.generationBranch]);
        }

        let villagers = await firestoreDb.getAll('villagers', {
          conditions,
          orderField: 'createdAt',
          orderDir: 'desc',
        });

        if (params.search) {
          const q = params.search.toLowerCase();
          villagers = villagers.filter(
            (v) =>
              v.fullName?.toLowerCase().includes(q) ||
              v.contactInfo?.toLowerCase().includes(q) ||
              v.region?.toLowerCase().includes(q)
          );
        }

        return { villagers, pagination: { total: villagers.length } };
      } catch (err) {
        console.warn('Lỗi Firestore getVillagers:', err.message);
      }
    }

    const res = await api.get('/villagers', { params });
    return res.data?.data;
  },

  async getStats() {
    if (firestoreDb.isAvailable()) {
      try {
        const villagers = await firestoreDb.getAll('villagers');
        const byRegion = {};
        villagers.forEach((v) => {
          const r = v.region || 'Khác';
          byRegion[r] = (byRegion[r] || 0) + 1;
        });
        return {
          total: villagers.length,
          byRegion: Object.entries(byRegion).map(([region, count]) => ({ region, count })),
        };
      } catch (e) {
        // Fallback
      }
    }

    const res = await api.get('/villagers/stats');
    return res.data?.data?.stats;
  },

  async createVillager(data) {
    if (firestoreDb.isAvailable()) {
      const created = await firestoreDb.create('villagers', data);
      return { status: 'success', data: { villager: created } };
    }

    const res = await api.post('/villagers', data);
    return res.data;
  },

  async updateVillager(id, data) {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('villagers', id, data);
      return { status: 'success', data: { villager: updated } };
    }

    const res = await api.put(`/villagers/${id}`, data);
    return res.data;
  },

  async deleteVillager(id) {
    if (firestoreDb.isAvailable()) {
      await firestoreDb.delete('villagers', id);
      return { status: 'success', message: 'Đã xóa thông tin người dân' };
    }

    const res = await api.delete(`/villagers/${id}`);
    return res.data;
  },
};
