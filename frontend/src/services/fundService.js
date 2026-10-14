import api from './api';
import { firestoreDb } from './firestoreDb';

export const fundService = {
  // Lấy danh sách các chiến dịch Quỹ Quê Hương
  getAllCampaigns: async () => {
    if (firestoreDb.isAvailable()) {
      try {
        const campaigns = await firestoreDb.getAll('fund_campaigns', {
          orderField: 'createdAt',
          orderDir: 'desc',
        });
        if (campaigns.length > 0) return campaigns;
      } catch (err) {
        console.warn('Lỗi Firestore getAllCampaigns:', err.message);
      }
    }

    try {
      const res = await api.get('/funds');
      return res.data?.data?.campaigns || [];
    } catch (e) {
      return [];
    }
  },

  // Lấy chi tiết chiến dịch và danh sách ủng hộ minh bạch
  getCampaignBySlug: async (slug) => {
    if (firestoreDb.isAvailable()) {
      try {
        const campaign = await firestoreDb.getOneByField('fund_campaigns', 'slug', slug);
        if (campaign) {
          const donations = await firestoreDb.getAll('fund_donations', {
            conditions: [['campaignId', '==', campaign.id]],
            orderField: 'donatedAt',
            orderDir: 'desc',
          });
          return { ...campaign, donations };
        }
      } catch (err) {
        console.warn('Lỗi Firestore getCampaignBySlug:', err.message);
      }
    }

    const res = await api.get(`/funds/${slug}`);
    return res.data?.data?.campaign || null;
  },

  // Sinh mã VietQR URL
  getVietQRUrl: async ({ bankName = 'MBBANK', bankAccount = '0912345678', bankAccountName = 'BAN CAN SU TDP 9 THUAN LOC', amount = 0, note = 'GIAOTAC' }) => {
    const encodedAccountName = encodeURIComponent(bankAccountName);
    const encodedNote = encodeURIComponent(note);
    return `https://img.vietqr.io/image/${bankName}-${bankAccount}-compact2.png?amount=${amount}&addInfo=${encodedNote}&accountName=${encodedAccountName}`;
  },

  // Gửi thông tin đóng góp ủng hộ
  donate: async (donationData) => {
    if (firestoreDb.isAvailable()) {
      const donation = await firestoreDb.create('fund_donations', {
        ...donationData,
        donatedAt: new Date(),
        isVerified: true,
      });
      return { status: 'success', data: { donation } };
    }

    const res = await api.post('/funds/donate', donationData);
    return res.data;
  },

  // Tạo chiến dịch mới (Admin)
  createCampaign: async (campaignData) => {
    if (firestoreDb.isAvailable()) {
      const created = await firestoreDb.create('fund_campaigns', campaignData);
      return { status: 'success', data: { campaign: created } };
    }

    const res = await api.post('/funds', campaignData);
    return res.data;
  },
};
