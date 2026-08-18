const prisma = require('../../config/db');

class HeroSlideController {
  async getHeroSlides(req, res) {
    try {
      const defaultSlides = [
        {
          id: 'slide-1',
          title: 'Làng Giao Tác — TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh',
          subtitle: 'Mảnh đất địa linh nhân kiệt dưới chân dãy Hồng Lĩnh hùng vĩ, tỉnh Hà Tĩnh',
          imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
          link: '/lich-su',
          linkText: 'Tìm hiểu lịch sử làng',
          tag: 'Lịch sử & Cội nguồn',
        },
        {
          id: 'slide-2',
          title: 'Giữ Gìn Bản Sắc Văn Hóa & Cội Nguồn 8 Dòng Họ',
          subtitle: 'Nơi kết nối các thế hệ con em Giao Tác — TDP 9 Thuận Lộc từ khắp mọi miền',
          imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
          link: '/gia-pha',
          linkText: 'Tra cứu gia phả 8 dòng họ',
          tag: 'Phả hệ số',
        },
        {
          id: 'slide-3',
          title: 'Nghĩa Tình Làng Xóm & Ký Ức Quê Mẹ Thân Thương',
          subtitle: 'Hình bóng những người mẹ, người bà tảo tần gánh gồng nuôi con khôn lớn',
          imageUrl: '/images/slides/510549257_24089605820672391_5370825757036481783_n.jpg',
          link: '/bai-viet',
          linkText: 'Đọc bài viết quê hương',
          tag: 'Tình làng nghĩa xóm',
        },
        {
          id: 'slide-4',
          title: 'Mái Trường Quê Hương & Truyền Thống Hiếu Học',
          subtitle: 'Tiếp sức cho các thế hệ học sinh Làng Giao Tác vươn xa dựng xây đất nước',
          imageUrl: '/images/slides/511005646_24100312999601673_1414372149750585342_n.jpg',
          link: '/quy-que-huong',
          linkText: 'Quỹ khuyến học quê hương',
          tag: 'Khuyến học khuyến tài',
        },
        {
          id: 'slide-5',
          title: 'Tổ Dân Phố 9 Thuận Lộc Ngày Càng Đổi Thay',
          subtitle: 'Đường hoa rực rỡ, nông thôn mới kiểu mẫu và đô thị văn minh',
          imageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
          link: '/dong-huong',
          linkText: 'Danh bạ đồng hương',
          tag: 'Đổi thay quê hương',
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
