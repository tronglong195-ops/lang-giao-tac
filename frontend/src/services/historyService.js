import api from './api';
import { firestoreDb } from './firestoreDb';

const DEFAULT_TIMELINES = [
  {
    id: 'timeline-1685',
    yearLabel: 'Năm 1685',
    title: 'Khai hoang lập ấp Làng Giao Tác dưới chân núi Hồng Lĩnh',
    description: 'Các bậc tiền nhân khai khẩn vùng đất bãi bồi trù phú dưới chân núi Hồng Lĩnh, đặt nền móng dựng ấp, lập làng mang tên Giao Tác.',
    imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
    orderIndex: 1,
  },
  {
    id: 'timeline-1875',
    yearLabel: 'Năm 1875',
    title: 'Khởi dựng Đình Làng Giao Tác (Đời vua Tự Đức thứ 28)',
    description: 'Nhờ sự đóng góp tâm huyết của cụ Chánh Do và nhân dân trong vùng, ngôi Đình làng Giao Tác uy nghiêm được khởi dựng tại thôn Thuận Giang.',
    imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
    orderIndex: 2,
  },
  {
    id: 'timeline-1930',
    yearLabel: 'Năm 1930',
    title: 'Thành lập Chi bộ Đảng làng Giao Tác (20/2/1930)',
    description: 'Dưới mái đình cổ kính, Chi bộ Đảng làng Giao Tác – tiền thân của Đảng bộ xã Thuận Lộc – chính thức ra đời ngày 20/2/1930.',
    imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
    orderIndex: 3,
  },
  {
    id: 'timeline-2014',
    yearLabel: 'Năm 1960 - 2014',
    title: 'Quá trình di dời, bảo tồn và phục dựng đình làng',
    description: 'Đến năm 2014, đình làng được trùng tu, phục dựng và đưa trở về đúng vị trí khởi thủy tại thôn Thuận Giang (TDP 9).',
    imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
    orderIndex: 4,
  },
  {
    id: 'timeline-2018',
    yearLabel: 'Năm 2018',
    title: 'Đón nhận Bằng Di tích Lịch sử - Văn hóa cấp Tỉnh',
    description: 'Đình làng Giao Tác vinh dự được UBND tỉnh Hà Tĩnh xếp hạng Di tích Lịch sử - Văn hóa cấp Tỉnh (Quyết định số 299/QĐ-UBND).',
    imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
    orderIndex: 5,
  },
  {
    id: 'timeline-present',
    yearLabel: 'Hiện nay',
    title: 'Phát huy giá trị di sản trong thời kỳ đổi mới',
    description: 'Đình làng là nơi sinh hoạt văn hóa tâm linh thiêng liêng, nơi tổ chức các lễ hội truyền thống, khuyến học và gắn kết cộng đồng bà con trong và ngoài nước.',
    imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
    orderIndex: 6,
  },
];

export const historyService = {
  async getTimelines() {
    if (firestoreDb.isAvailable()) {
      try {
        const timelines = await firestoreDb.getAll('history_timelines', {
          orderField: 'orderIndex',
          orderDir: 'asc',
        });
        if (timelines.length > 0) return timelines;
      } catch (err) {
        console.warn('Lỗi Firestore getTimelines:', err.message);
      }
    }

    try {
      const res = await api.get('/history');
      const data = res.data?.data?.timelines;
      if (data && data.length > 0) return data;
    } catch (e) {
      // Fallback
    }

    return DEFAULT_TIMELINES;
  },

  async createTimeline(data) {
    if (firestoreDb.isAvailable()) {
      const created = await firestoreDb.create('history_timelines', data);
      return { status: 'success', data: { timeline: created } };
    }

    const res = await api.post('/history', data);
    return res.data;
  },

  async updateTimeline(id, data) {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('history_timelines', id, data);
      return { status: 'success', data: { timeline: updated } };
    }

    const res = await api.put(`/history/${id}`, data);
    return res.data;
  },

  async deleteTimeline(id) {
    if (firestoreDb.isAvailable()) {
      await firestoreDb.delete('history_timelines', id);
      return { status: 'success', message: 'Đã xóa mốc lịch sử' };
    }

    const res = await api.delete(`/history/${id}`);
    return res.data;
  },
};
