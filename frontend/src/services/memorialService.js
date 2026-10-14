import api from './api';
import { firestoreDb } from './firestoreDb';

export const memorialService = {
  // Lấy danh sách cáo phó
  getAllObituaries: async () => {
    if (firestoreDb.isAvailable()) {
      try {
        const obituaries = await firestoreDb.getAll('obituaries', {
          orderField: 'createdAt',
          orderDir: 'desc',
        });
        return obituaries;
      } catch (err) {
        console.warn('Lỗi Firestore getAllObituaries:', err.message);
      }
    }

    try {
      const res = await api.get('/memorial');
      return res.data?.data?.obituaries || [];
    } catch (e) {
      return [];
    }
  },

  // Lấy chi tiết cáo phó & danh sách lời chia buồn
  getObituaryDetail: async (id) => {
    if (firestoreDb.isAvailable()) {
      const obituary = await firestoreDb.getById('obituaries', id);
      if (obituary) {
        const condolences = await firestoreDb.getAll('condolences', {
          conditions: [['obituaryId', '==', id]],
          orderField: 'createdAt',
          orderDir: 'desc',
        });
        return { ...obituary, condolences };
      }
    }

    const res = await api.get(`/memorial/${id}`);
    return res.data?.data?.obituary || null;
  },

  // Gửi lời chia buồn & thắp nén tâm nhang
  sendCondolence: async (obituaryId, condolenceData) => {
    if (firestoreDb.isAvailable()) {
      const created = await firestoreDb.create('condolences', {
        ...condolenceData,
        obituaryId,
        createdAt: new Date(),
      });
      return { status: 'success', data: { condolence: created } };
    }

    const res = await api.post(`/memorial/${obituaryId}/condolences`, condolenceData);
    return res.data;
  },

  // Tạo cáo phó mới (Admin)
  createObituary: async (obituaryData) => {
    if (firestoreDb.isAvailable()) {
      const created = await firestoreDb.create('obituaries', obituaryData);
      return { status: 'success', data: { obituary: created } };
    }

    const res = await api.post('/memorial', obituaryData);
    return res.data;
  },

  // Xóa cáo phó
  deleteObituary: async (id) => {
    if (firestoreDb.isAvailable()) {
      await firestoreDb.delete('obituaries', id);
      return { status: 'success', message: 'Đã xóa cáo phó' };
    }

    const res = await api.delete(`/memorial/${id}`);
    return res.data;
  },
};
