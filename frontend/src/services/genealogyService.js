import api from './api';

export const genealogyService = {
  // Lấy danh sách 8 dòng họ
  getAllClans: async () => {
    const res = await api.get('/clans');
    return res.data?.data?.clans || [];
  },

  // Lấy chi tiết dòng họ và cây phả hệ
  getClanBySlug: async (slug) => {
    const res = await api.get(`/clans/${slug}`);
    return res.data?.data?.clan || null;
  },

  // Thêm thành viên vào gia phả
  addMember: async (clanId, memberData) => {
    const res = await api.post(`/clans/${clanId}/members`, memberData);
    return res.data;
  },

  // Cập nhật thành viên
  updateMember: async (memberId, memberData) => {
    const res = await api.put(`/clans/members/${memberId}`, memberData);
    return res.data;
  },

  // Xóa thành viên
  deleteMember: async (memberId) => {
    const res = await api.delete(`/clans/members/${memberId}`);
    return res.data;
  },

  // Cập nhật thông tin dòng họ
  updateClanInfo: async (clanId, data) => {
    const res = await api.put(`/clans/${clanId}`, data);
    return res.data;
  },
};
