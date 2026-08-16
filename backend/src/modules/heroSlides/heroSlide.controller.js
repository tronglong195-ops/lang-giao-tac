const prisma = require('../../config/db');

class HeroSlideController {
  async getHeroSlides(req, res) {
    try {
      const defaultSlides = [
        {
          id: 'slide-1',
          title: 'Làng Giao Tác — TDP 9 Thuận Lộc (Hồng Lĩnh)',
          subtitle: 'Mảnh đất địa linh nhân kiệt dưới chân dãy Hồng Lĩnh hùng vĩ, tỉnh Hà Tĩnh',
          imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
          link: '/lich-su',
          linkText: 'Tìm hiểu lịch sử làng',
          tag: 'Lịch sử & Cội nguồn',
        },
        {
          id: 'slide-2',
          title: 'Giữ Gìn Bản Sắc Văn Hóa & Lễ Hội Cổ Truyền',
          subtitle: 'Nơi kết nối các thế hệ con em Giao Tác — TDP 9 Thuận Lộc từ khắp mọi miền',
          imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
          link: '/thu-vien-anh',
          linkText: 'Xem thư viện ảnh làng',
          tag: 'Lễ hội & Văn hóa',
        },
        {
          id: 'slide-3',
          title: 'Tổ Dân Phố 9 Thuận Lộc Ngày Càng Đổi Thay',
          subtitle: 'Đường hoa rực rỡ, nông thôn mới kiểu mẫu và đô thị văn minh',
          imageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
          link: '/bai-viet',
          linkText: 'Đọc bài viết cộng đồng',
          tag: 'Đổi thay quê hương',
        },
        {
          id: 'slide-4',
          title: 'Tình Làng Nghĩa Xóm & Nghĩa Tình Đồng Hương',
          subtitle: 'Con em Giao Tác — Thuận Lộc luôn đoàn kết, hướng về mái ấm quê nhà',
          imageUrl: '/images/village/486784254_9667039123355634_3798108786214067335_n.jpg',
          link: '/dong-huong',
          linkText: 'Danh bạ đồng hương',
          tag: 'Kết nối đồng hương',
        },
      ];

      return res.status(200).json({
        success: true,
        data: { slides: defaultSlides },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi tải dữ liệu trình chiếu trang chủ.',
      });
    }
  }
}

module.exports = new HeroSlideController();
