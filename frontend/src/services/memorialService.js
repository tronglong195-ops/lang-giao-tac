import api from './api';

export const memorialService = {
  // Lấy danh sách cáo phó
  getAllObituaries: async () => {
    const res = await api.get('/memorial');
    return res.data?.data?.obituaries || [];
  },

  // Lấy chi tiết cáo phó & danh sách lời chia buồn
  getObituaryDetail: async (id) => {
    const res = await api.get(`/memorial/${id}`);
    return res.data?.data?.obituary || null;
  },

  // Gửi lời chia buồn & thắp nén tâm nhang
  sendCondolence: async (obituaryId, condolenceData) => {
    const res = await api.post(`/memorial/${obituaryId}/condolences`, condolenceData);
    return res.data;
  },

  // Tạo cáo phó mới (Admin)
  createObituary: async (obituaryData) => {
    const res = await api.post('/memorial', obituaryData);
    return res.data;
  },

  // Xóa cáo phó
  deleteObituary: async (id) => {
    const res = await api.delete(`/memorial/${id}`);
    return res.data;
  },
};
