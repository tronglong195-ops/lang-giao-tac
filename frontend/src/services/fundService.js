import api from './api';

export const fundService = {
  // Lấy danh sách các chiến dịch Quỹ Quê Hương
  getAllCampaigns: async () => {
    const res = await api.get('/funds');
    return res.data?.data?.campaigns || [];
  },

  // Lấy chi tiết chiến dịch và danh sách ủng hộ minh bạch
  getCampaignBySlug: async (slug) => {
    const res = await api.get(`/funds/${slug}`);
    return res.data?.data?.campaign || null;
  },

  // Sinh mã VietQR URL
  getVietQRUrl: async ({ bankName, bankAccount, bankAccountName, amount, note }) => {
    const res = await api.get('/funds/vietqr', {
      params: { bankName, bankAccount, bankAccountName, amount, note },
    });
    return res.data?.data?.qrUrl;
  },

  // Gửi thông tin đóng góp ủng hộ
  donate: async (donationData) => {
    const res = await api.post('/funds/donate', donationData);
    return res.data;
  },

  // Tạo chiến dịch mới (Admin)
  createCampaign: async (campaignData) => {
    const res = await api.post('/funds', campaignData);
    return res.data;
  },
};
