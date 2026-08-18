const prisma = require('../../config/db');

class HeroSlideController {
  async getHeroSlides(req, res) {
    try {
      const defaultSlides = [
        {
          id: 'slide-1',
          title: 'Làng Giao Tác — TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh',
          subtitle: 'Mảnh đất địa linh nhân kiệt dưới chân dãy Hồng Lĩnh hùng vĩ, tỉnh Hà Tĩnh',
          imageUrl: '/images/slides/511172985_24099702059662767_4278271189762169126_n.jpg',
          link: '/lich-su',
          linkText: 'Tìm hiểu lịch sử làng',
          tag: 'Lịch sử & Cội nguồn',
        },
        {
          id: 'slide-2',
          title: 'Giữ Gìn Bản Sắc Văn Hóa & Cội Nguồn 8 Dòng Họ',
          subtitle: 'Nơi kết nối các thế hệ con em Giao Tác — TDP 9 Thuận Lộc từ khắp mọi miền',
          imageUrl: '/images/slides/510951373_24089617560671217_3796393457457589971_n.jpg',
          link: '/gia-pha',
          linkText: 'Tra cứu gia phả 8 dòng họ',
          tag: 'Phả hệ số',
        },
        {
          id: 'slide-3',
          title: 'Tổ Dân Phố 9 Thuận Lộc Ngày Càng Khởi Sắc & Đổi Thay',
          subtitle: 'Đường hoa rực rỡ, nông thôn mới kiểu mẫu và đô thị văn minh',
          imageUrl: '/images/slides/512743796_24094666106833029_6389885907881319181_n.jpg',
          link: '/bai-viet',
          linkText: 'Đọc bài viết cộng đồng',
          tag: 'Đổi thay quê hương',
        },
        {
          id: 'slide-4',
          title: 'Chung Tay Xây Dựng Quỹ Quê Hương & Khuyến Học',
          subtitle: 'Ủng hộ tài năng trẻ quê nhà minh bạch 100% qua mã VietQR',
          imageUrl: '/images/slides/511517556_24084686424497664_1047762682259530364_n.jpg',
          link: '/quy-que-huong',
          linkText: 'Xem quỹ khuyến học',
          tag: 'Quỹ quê hương',
        },
        {
          id: 'slide-5',
          title: 'Trải Nghiệm Toàn Cảnh Làng Giao Tác Qua Tour 360° VR',
          subtitle: 'Dành tặng những người con xa quê ngắm nhìn mái đình rêu phong và giếng nước ngọt lành',
          imageUrl: '/images/slides/512670991_24083940757905564_6375359891226265532_n.jpg',
          link: '/tham-quan-360',
          linkText: 'Khám phá Tour 360°',
          tag: 'Thực tế ảo 360°',
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
