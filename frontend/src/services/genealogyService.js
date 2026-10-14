import api from './api';
import { firestoreDb } from './firestoreDb';
import {
  nguyenTrongClanInfo,
  nguyenTrongTree,
  nguyenTrongFlatList,
} from '../data/clanGenealogyData';

const DEFAULT_CLANS = [
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

export const genealogyService = {
  // Lấy danh sách 8 dòng họ
  getAllClans: async () => {
    // 1. Thử Firestore nếu khả dụng
    if (firestoreDb.isAvailable()) {
      try {
        const firestoreClans = await firestoreDb.getAll('clans', { orderField: 'name', orderDir: 'asc' });
        if (firestoreClans.length > 0) {
          return firestoreClans.map((c) => {
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
      } catch (err) {
        console.warn('[Firestore] Lỗi đọc danh sách dòng họ:', err.message);
      }
    }

    // 2. Thử REST API cũ
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
      // Fallback
    }

    // 3. Fallback danh sách mặc định
    return DEFAULT_CLANS;
  },

  // Lấy chi tiết dòng họ và cây phả hệ
  getClanBySlug: async (slug) => {
    // Riêng dòng họ Nguyễn Trọng luôn ưu tiên bộ dữ liệu 153 người chuẩn hóa
    if (slug === 'ho-nguyen-trong') {
      if (firestoreDb.isAvailable()) {
        try {
          const clan = await firestoreDb.getOneByField('clans', 'slug', slug);
          if (clan) {
            const members = await firestoreDb.getAll('genealogy_members', {
              conditions: [['clanId', '==', clan.id]],
              orderField: 'generation',
              orderDir: 'asc',
            });
            if (members.length >= 100) {
              return {
                ...clan,
                members,
                tree: nguyenTrongTree,
              };
            }
          }
        } catch (e) {
          // Fallback
        }
      }

      return {
        ...nguyenTrongClanInfo,
        tree: nguyenTrongTree,
        members: nguyenTrongFlatList,
      };
    }

    // Các dòng họ khác
    if (firestoreDb.isAvailable()) {
      try {
        const clan = await firestoreDb.getOneByField('clans', 'slug', slug);
        if (clan) {
          const members = await firestoreDb.getAll('genealogy_members', {
            conditions: [['clanId', '==', clan.id]],
          });
          return { ...clan, members };
        }
      } catch (err) {
        console.warn('Lỗi Firestore getClanBySlug:', err.message);
      }
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
    if (firestoreDb.isAvailable()) {
      const created = await firestoreDb.create('genealogy_members', {
        ...memberData,
        clanId,
      });
      return { status: 'success', data: { member: created } };
    }
    const res = await api.post(`/clans/${clanId}/members`, memberData);
    return res.data;
  },

  // Cập nhật thành viên
  updateMember: async (memberId, memberData) => {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('genealogy_members', memberId, memberData);
      return { status: 'success', data: { member: updated } };
    }
    const res = await api.put(`/clans/members/${memberId}`, memberData);
    return res.data;
  },

  // Xóa thành viên
  deleteMember: async (memberId) => {
    if (firestoreDb.isAvailable()) {
      await firestoreDb.delete('genealogy_members', memberId);
      return { status: 'success', message: 'Đã xóa thành viên' };
    }
    const res = await api.delete(`/clans/members/${memberId}`);
    return res.data;
  },

  // Cập nhật thông tin dòng họ
  updateClanInfo: async (clanId, data) => {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('clans', clanId, data);
      return { status: 'success', data: { clan: updated } };
    }
    const res = await api.put(`/clans/${clanId}`, data);
    return res.data;
  },
};
