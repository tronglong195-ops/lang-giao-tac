import api from './api';
import {
  nguyenTrongClanInfo,
  nguyenTrongTree,
  nguyenTrongFlatList,
} from '../data/clanGenealogyData';

export const genealogyService = {
  // Lấy danh sách 8 dòng họ
  getAllClans: async () => {
    try {
      const res = await api.get('/clans');
      const apiClans = res.data?.data?.clans || [];
      if (apiClans.length > 0) {
        return apiClans.map((c) => {
          if (c.slug === 'ho-nguyen-trong') {
            return {
              ...c,
              ancestorName: nguyenTrongClanInfo.ancestorName,
              originStory: nguyenTrongClanInfo.originStory,
              templeAddress: nguyenTrongClanInfo.templeAddress,
              leaderName: nguyenTrongClanInfo.leaderName,
              _count: { members: nguyenTrongFlatList.length },
            };
          }
          return c;
        });
      }
    } catch (e) {
      console.warn('API clans không khả dụng, sử dụng dữ liệu tĩnh:', e.message);
    }
    return [
      {
        ...nguyenTrongClanInfo,
        _count: { members: nguyenTrongFlatList.length },
      },
      {
        id: 'clan_ho_nguyen_duy',
        name: 'Họ Nguyễn Duy',
        slug: 'ho-nguyen-duy',
        ancestorName: 'Cụ Thủy Tổ: Nguyễn Duy Trinh',
        templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
        deathAnniversary: '10 tháng Giêng (Âm lịch)',
        _count: { members: 8 },
      },
      {
        id: 'clan_ho_nguyen_huy',
        name: 'Họ Nguyễn Huy',
        slug: 'ho-nguyen-huy',
        ancestorName: 'Cụ Thủy Tổ: Nguyễn Huy Quýnh',
        templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
        deathAnniversary: '12 tháng Hai (Âm lịch)',
        _count: { members: 7 },
      },
      {
        id: 'clan_ho_phan_sy',
        name: 'Họ Phan Sỹ',
        slug: 'ho-phan-sy',
        ancestorName: 'Cụ Thủy Tổ: Phan Sỹ Thục',
        templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
        deathAnniversary: '15 tháng Giêng (Âm lịch)',
        _count: { members: 9 },
      },
      {
        id: 'clan_ho_nguyen_van',
        name: 'Họ Nguyễn Văn',
        slug: 'ho-nguyen-van',
        ancestorName: 'Cụ Thủy Tổ: Nguyễn Văn Giai',
        templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
        deathAnniversary: '18 tháng Hai (Âm lịch)',
        _count: { members: 6 },
      },
      {
        id: 'clan_ho_pham_huu',
        name: 'Họ Phạm Hữu',
        slug: 'ho-pham-huu',
        ancestorName: 'Cụ Thủy Tổ: Phạm Hữu Kính',
        templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
        deathAnniversary: '20 tháng Giêng (Âm lịch)',
        _count: { members: 5 },
      },
      {
        id: 'clan_ho_tran_dinh',
        name: 'Họ Trần Đình',
        slug: 'ho-tran-dinh',
        ancestorName: 'Cụ Thủy Tổ: Trần Đình Túc',
        templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
        deathAnniversary: '14 tháng Ba (Âm lịch)',
        _count: { members: 6 },
      },
      {
        id: 'clan_ho_le',
        name: 'Họ Lê',
        slug: 'ho-le',
        ancestorName: 'Cụ Thủy Tổ: Lê Bá Cảnh',
        templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
        deathAnniversary: '18 tháng Giêng (Âm lịch)',
        _count: { members: 5 },
      },
    ];
  },

  // Lấy chi tiết dòng họ và cây phả hệ
  getClanBySlug: async (slug) => {
    if (slug === 'ho-nguyen-trong') {
      try {
        const res = await api.get(`/clans/${slug}`);
        const apiClan = res.data?.data?.clan;
        if (apiClan && apiClan.members && apiClan.members.length >= 100) {
          return apiClan;
        }
      } catch (e) {
        // Fallback to rich dataset
      }
      return {
        ...nguyenTrongClanInfo,
        tree: nguyenTrongTree,
        members: nguyenTrongFlatList,
      };
    }

    try {
      const res = await api.get(`/clans/${slug}`);
      return res.data?.data?.clan || null;
    } catch (err) {
      console.warn('Lỗi tải chi tiết dòng họ:', err.message);
      return null;
    }
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
