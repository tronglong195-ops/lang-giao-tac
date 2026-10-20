/**
 * ĐỢT BÀI TIN TỨC THÁNG 10/2026 — CỔNG THÔNG TIN LÀNG GIAO TÁC (TDP 9 THUẬN LỘC)
 *
 * Nguyên tắc biên tập:
 *  - Chỉ đưa sự kiện đã được báo chí / cổng thông tin chính thống công bố.
 *  - Viết lại bằng lời văn của Ban biên tập, không chép nguyên văn; mỗi bài đều dẫn nguồn + link bài gốc.
 *  - Không dùng ảnh của báo (bản quyền) và không gắn ảnh làng sai ngữ cảnh.
 *    Ban quản trị bổ sung ảnh thật qua trang Quản trị → Quản lý Tin tức (trường imageUrl).
 *  - publishedAt = ngày đăng lên cổng làng; timeStr = ngày sự kiện / ngày báo gốc đăng.
 *
 * Nạp lên Firestore: xem scripts/seedTinTucBaiViet.mjs
 */

const BAN_BIEN_TAP = 'Ban biên tập Cổng TT Làng Giao Tác';

// Ngày đăng lên cổng làng: 20/10/2026, mỗi bài cách nhau 10 phút để giữ đúng thứ tự hiển thị
const POST_BASE = new Date('2026-10-20T14:30:00+07:00').getTime();
const postedAt = (i) => new Date(POST_BASE - i * 10 * 60 * 1000).toISOString();

const sourceBox = (sources) => `
<blockquote>
  <p><strong>Nguồn tham khảo:</strong></p>
  <ul>
    ${sources
      .map(
        (s) =>
          `<li>${s.name}, ${s.date}: <a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title}</a></li>`
      )
      .join('\n    ')}
  </ul>
  <p><em>Bài viết do ${BAN_BIEN_TAP} tổng hợp, biên tập lại để bà con trong làng và con em xa quê tiện theo dõi.</em></p>
</blockquote>`;

const article = ({ i, id, slug, title, category, tags, timeStr, summary, body, sources }) => ({
  id,
  slug,
  title,
  category,
  tags,
  summary,
  contentHtml: `<p><strong>${summary}</strong></p>\n${body.trim()}\n${sourceBox(sources)}`,
  source: BAN_BIEN_TAP,
  sourceName: sources[0].name,
  sourceUrl: sources[0].url,
  isOfficial: true,
  author: { fullName: BAN_BIEN_TAP },
  timeStr,
  publishedAt: postedAt(i),
  createdAt: postedAt(i),
});

export const tinTucBaiViet = [
  // 1. Tin trực tiếp về TDP 9 Thuận Lộc
  article({
    i: 0,
    id: 'tt-2026-an-sinh-nha-o-tdp9',
    slug: 'phuong-ho-tro-lam-nha-moi-cho-ho-kho-khan-tdp-9-thuan-loc',
    title: 'Phường hỗ trợ 70 triệu đồng làm nhà mới cho hộ khó khăn ở TDP 9 Thuận Lộc',
    category: 'An sinh xã hội',
    tags: ['TDP 9', 'Thuận Lộc', 'Vì người nghèo', 'an sinh'],
    timeStr: '27/09/2026',
    summary:
      'Từ Quỹ "Vì người nghèo" của phường, bà Cao Thị Sơn (70 tuổi, TDP 9 Thuận Lộc) được hỗ trợ 70 triệu đồng để dựng lại nhà ở. Công trình khởi công giữa tháng 9/2026, dự kiến hoàn thành sau khoảng 3 tháng.',
    body: `
<h2>Ngôi nhà mới cho bà Sơn</h2>
<p>Bà Cao Thị Sơn năm nay 70 tuổi, chồng đã mất, hiện sống một mình tại TDP 9 Thuận Lộc. Năm 2026, bà được Quỹ "Vì người nghèo" phường Nam Hồng Lĩnh hỗ trợ <strong>70 triệu đồng</strong> để làm nhà mới.</p>
<ul>
  <li><strong>Diện tích:</strong> khoảng 70 m².</li>
  <li><strong>Tổng kinh phí:</strong> trên 250 triệu đồng. Ngoài khoản hỗ trợ, phần còn lại do gia đình tự lo.</li>
  <li><strong>Tiến độ:</strong> khởi công giữa tháng 9/2026, dự kiến xong trong khoảng 3 tháng.</li>
</ul>
<p>Cũng trong đợt này, phường trao hỗ trợ cho gia đình ông Đinh Văn Hoằng ở TDP 10 Thuận Lộc.</p>

<h2>Bức tranh an sinh chung của phường</h2>
<p>Theo Ủy ban MTTQ phường, từ khi vận hành chính quyền địa phương hai cấp (1/7/2025) đến nay, phường đã:</p>
<ul>
  <li>Hỗ trợ <strong>21 nhà ở</strong>, gồm 18 nhà xây mới và 3 nhà sửa chữa, tổng kinh phí khoảng <strong>1,245 tỷ đồng</strong>. Nguồn tiền lấy từ Quỹ "Vì người nghèo" và vận động xã hội hóa.</li>
  <li>Huy động hơn <strong>500 ngày công</strong> giúp các hộ dựng nhà.</li>
  <li>Trao <strong>120 mô hình sinh kế</strong> nuôi gà cho hộ nghèo, cận nghèo, hộ có hoàn cảnh khó khăn và hộ có người khuyết tật.</li>
</ul>

<h2>Bà con TDP 9 chung tay</h2>
<p>Nhà bà Sơn đang thi công. Bà con trong tổ, nhất là các gia đình có thanh niên, có thể góp ngày công lúc đổ mái, vận chuyển vật liệu hay dọn dẹp mặt bằng. Đó là cách thiết thực để giữ nếp "lá lành đùm lá rách" của làng Giao Tác. Bà con muốn tham gia xin liên hệ Ban cán sự TDP 9.</p>`,
    sources: [
      {
        name: 'Báo Hà Tĩnh',
        date: '27/09/2026',
        title: 'Chăm lo an sinh, tiếp sức người dân phường Nam Hồng Lĩnh',
        url: 'https://baohatinh.vn/cham-lo-an-sinh-tiep-suc-nguoi-dan-phuong-nam-hong-linh-post317840.html',
      },
    ],
  }),

  // 2. Văn hóa – lịch sử làng
  article({
    i: 1,
    id: 'tt-2026-dinh-giao-tac-1878',
    slug: 'dinh-giao-tac-mai-dinh-tu-nam-1878-va-chi-bo-dang-dau-tien-cua-thuan-loc',
    title: 'Đình Giao Tác: mái đình dựng năm 1878 và cái nôi chi bộ Đảng đầu tiên của Thuận Lộc',
    category: 'Văn hóa – Lịch sử',
    tags: ['Đình Giao Tác', 'lịch sử', 'di tích', 'Thuận Lộc'],
    timeStr: '03/07/2024',
    summary:
      'Đình Giao Tác được dựng năm 1878, đến nay đã gần 150 năm. Đây là nơi ra đời và sinh hoạt của chi bộ Đảng làng Giao Tác, tiền thân của Đảng bộ xã Thuận Lộc.',
    body: `
<h2>Gần 150 năm một mái đình</h2>
<p>Theo Báo Hà Tĩnh, đình Giao Tác được xây dựng năm <strong>1878</strong>, dưới triều Nguyễn. Đến năm 2026, ngôi đình đã đứng cùng làng 148 năm, qua nhiều lần đổi tên đơn vị hành chính: làng Giao Tác, xã Thuận Lộc, thị xã Hồng Lĩnh, nay là TDP 9 Thuận Lộc, phường Nam Hồng Lĩnh.</p>

<h2>Nơi chi bộ Đảng làng ra đời</h2>
<p>Đình không chỉ là nơi thờ tự và hội họp của dân làng. Đây còn là <strong>nơi thành lập và sinh hoạt của chi bộ Đảng làng Giao Tác</strong>, tiền thân của Đảng bộ xã Thuận Lộc sau này. Với người Giao Tác, mái đình vì thế gắn với cả đời sống tâm linh lẫn truyền thống cách mạng của quê hương.</p>

<h2>Chung tay gìn giữ tư liệu về đình</h2>
<p>Hiện tư liệu công khai về đình còn ít: chưa rõ các vị thần được phụng thờ, các đợt trùng tu, sắc phong hay hoành phi, câu đối. Ban biên tập kính mong các cụ cao niên, các dòng họ và con em xa quê còn giữ ảnh cũ, gia phả, sắc phong hay lời kể về đình gửi về Ban cán sự TDP 9, hoặc đăng trong mục <a href="/bai-viet">Bài viết cộng đồng</a>. Tư liệu sẽ được biên tập thành chuyên mục riêng, lưu lại cho con cháu.</p>`,
    sources: [
      {
        name: 'Báo Hà Tĩnh',
        date: '03/07/2024',
        title: 'Đình Giao Tác – nơi lưu giữ hồn quê Thuận Lộc',
        url: 'https://baohatinh.vn/dinh-giao-tac-noi-luu-giu-hon-que-thuan-loc-post269421.html',
      },
    ],
  }),

  // 3. Tổng quan phường mới
  article({
    i: 2,
    id: 'tt-2026-phuong-nam-hong-linh-tong-quan',
    slug: 'phuong-nam-hong-linh-tu-ba-dia-danh-nam-hong-dau-lieu-thuan-loc',
    title: 'Phường Nam Hồng Lĩnh: ghép ba vùng đất Nam Hồng, Đậu Liêu, Thuận Lộc và mục tiêu đến 2030',
    category: 'Chính quyền – Địa phương',
    tags: ['Nam Hồng Lĩnh', 'sáp nhập', 'Đại hội Đảng bộ', '2025-2030'],
    timeStr: '07/08/2025',
    summary:
      'Phường Nam Hồng Lĩnh hình thành từ phường Nam Hồng, phường Đậu Liêu và xã Thuận Lộc cũ. Đại hội Đảng bộ phường lần thứ nhất (2025–2030) đặt mục tiêu thu nhập bình quân trên 92,5 triệu đồng/người/năm vào năm 2030.',
    body: `
<h2>Từ xã Thuận Lộc đến TDP 9 Thuận Lộc</h2>
<p>Trong đợt sắp xếp đơn vị hành chính năm 2025, phường Nam Hồng (cũ), phường Đậu Liêu (cũ) và xã Thuận Lộc (cũ) được hợp nhất thành <strong>phường Nam Hồng Lĩnh</strong>, tỉnh Hà Tĩnh. Làng Giao Tác xưa nay mang tên Tổ dân phố 9 Thuận Lộc. Chữ "Thuận Lộc" vẫn được giữ trong tên các tổ dân phố để bà con nhận ra gốc gác của mình.</p>
<p>Vùng đất mới có Khu di tích lịch sử – văn hóa Đại Hùng và đền Đô thờ danh nhân Bùi Cầm Hổ, cùng truyền thống hiếu học và đóng góp hậu cần trong các cuộc kháng chiến.</p>

<h2>Một số chỉ tiêu đến năm 2030</h2>
<p>Đại hội Đảng bộ phường lần thứ nhất, nhiệm kỳ 2025–2030, do đồng chí Nguyễn Hữu Khiếu làm Bí thư, đề ra các mục tiêu chính:</p>
<ul>
  <li>Tăng trưởng giá trị sản xuất bình quân trên <strong>12,5%/năm</strong>.</li>
  <li>Cơ cấu kinh tế năm 2030: công nghiệp – xây dựng trên 76%, thương mại – dịch vụ trên 20%, nông – lâm – thủy sản dưới 4%.</li>
  <li>Thu ngân sách đạt <strong>460 tỷ đồng</strong> vào năm 2030.</li>
  <li>Thu nhập bình quân đầu người trên <strong>92,5 triệu đồng/năm</strong>; không còn hộ nghèo.</li>
  <li>100% dân cư dùng nước sạch tập trung; thu gom, xử lý 99% rác thải sinh hoạt.</li>
  <li>100% thủ tục hành chính giải quyết trực tuyến; đạt chuẩn phường văn minh đô thị.</li>
</ul>
<p>Các cụm công nghiệp Nam Hồng, Cổng Khánh 1 và 2 là động lực chính của phường. Với bà con Thuận Lộc vốn quen nghề nông, cơ cấu dưới 4% nông nghiệp cho thấy rõ hướng chuyển đổi: đất ruộng thu hẹp dần, việc làm trong nhà máy và dịch vụ tăng lên.</p>`,
    sources: [
      {
        name: 'Báo Hà Tĩnh',
        date: '07/08/2025',
        title: 'Phường Nam Hồng Lĩnh – mạch đất thiêng bừng tươi khát vọng',
        url: 'https://baohatinh.vn/phuong-nam-hong-linh-mach-dat-thieng-bung-tuoi-khat-vong-post293177.html',
      },
    ],
  }),

  // 4. Gặp mặt doanh nghiệp
  article({
    i: 3,
    id: 'tt-2026-gap-mat-doanh-nghiep',
    slug: 'phuong-nam-hong-linh-gap-mat-doanh-nghiep-ngay-doanh-nhan-2026',
    title: 'Phường gặp mặt doanh nghiệp dịp Ngày Doanh nhân: 9 tháng thu ngân sách đạt gần 2,5 lần kế hoạch',
    category: 'Kinh tế',
    tags: ['doanh nghiệp', 'Ngày Doanh nhân 13/10', 'kinh tế', 'Nam Hồng Lĩnh'],
    timeStr: '12/10/2026',
    summary:
      'Nhân kỷ niệm 22 năm Ngày Doanh nhân Việt Nam, phường Nam Hồng Lĩnh gặp mặt, đối thoại với doanh nghiệp. Thu ngân sách 9 tháng năm 2026 đạt 174,5 tỷ đồng, bằng gần 248% kế hoạch.',
    body: `
<h2>Một số con số nổi bật</h2>
<ul>
  <li>Trên địa bàn có hơn <strong>250 doanh nghiệp</strong>, chi nhánh và văn phòng đại diện; <strong>8 hợp tác xã</strong> và hơn <strong>1.360 hộ kinh doanh</strong>.</li>
  <li>Từ khi vận hành chính quyền hai cấp, phường thu hút <strong>12 dự án</strong> với tổng vốn đăng ký trên <strong>1.300 tỷ đồng</strong>.</li>
  <li>Công ty CP Sợi Nghệ Tĩnh đầu tư gần <strong>600 tỷ đồng</strong> cho dây chuyền sản xuất hiện đại tại Cụm công nghiệp Nam Hồng.</li>
  <li>Thu ngân sách 9 tháng năm 2026 đạt <strong>174,5 tỷ đồng</strong>, bằng 247,99% kế hoạch. Tổng giá trị sản phẩm ước đạt 2.265 tỷ đồng, bằng 76,6% kế hoạch năm.</li>
  <li>Một dự án <strong>nhà ở xã hội</strong> với vốn dự kiến trên 818 tỷ đồng đang hoàn tất thủ tục để khởi công.</li>
</ul>

<h2>Cam kết của chính quyền phường</h2>
<p>Chủ tịch UBND phường Tôn Quang Ngọc cho biết phường sẽ:</p>
<ul>
  <li>Tiếp tục cải cách thủ tục hành chính và nâng chất lượng phục vụ tại Trung tâm Phục vụ hành chính công.</li>
  <li>Tăng đối thoại với doanh nghiệp, tháo gỡ kịp thời vướng mắc trong thẩm quyền.</li>
  <li>Hỗ trợ xây dựng thương hiệu, xúc tiến thương mại, kết nối vùng.</li>
</ul>
<p>Tham dự buổi gặp mặt có đại diện Công ty CP Sợi Nghệ Tĩnh, Công ty CP Vinatex Hồng Lĩnh và Hội Doanh nghiệp phường.</p>

<h2>Ý nghĩa với bà con trong làng</h2>
<p>Nhà máy mở rộng đồng nghĩa với thêm việc làm gần nhà cho lớp trẻ Thuận Lộc, không phải đi xa. Dự án nhà ở xã hội cũng là thông tin đáng chú ý cho các gia đình trẻ. Bà con nên theo dõi thông báo chính thức của phường để biết điều kiện đăng ký khi dự án mở bán.</p>`,
    sources: [
      {
        name: 'Báo Hà Tĩnh',
        date: '12/10/2026',
        title: 'Phường Nam Hồng Lĩnh đồng hành cùng doanh nghiệp, kiến tạo tương lai',
        url: 'https://baohatinh.vn/phuong-nam-hong-linh-dong-hanh-cung-doanh-nghiep-kien-tao-tuong-lai-post318641.html',
      },
    ],
  }),

  // 5. Đề cử doanh nghiệp tiêu biểu
  article({
    i: 4,
    id: 'tt-2026-de-cu-doanh-nghiep-tieu-bieu',
    slug: 'phuong-de-cu-doanh-nghiep-doanh-nhan-tieu-bieu-tinh-ha-tinh-2026',
    title: 'Phường đề cử doanh nghiệp, doanh nhân tiêu biểu tỉnh Hà Tĩnh năm 2026',
    category: 'Kinh tế',
    tags: ['doanh nghiệp tiêu biểu', 'doanh nhân', 'Nam Hồng Lĩnh'],
    timeStr: '26/08/2026',
    summary:
      'UBND phường Nam Hồng Lĩnh đề cử Công ty TNHH Anh Ánh Hồng Lĩnh xét danh hiệu "Doanh nghiệp tiêu biểu" và ông Lê Văn Thông xét danh hiệu "Doanh nhân tiêu biểu" tỉnh Hà Tĩnh năm 2026.',
    body: `
<p>Ngày 26/8/2026, UBND phường Nam Hồng Lĩnh ban hành Tờ trình số 80/TTr-UBND, đề cử các gương mặt sau xét tôn vinh cấp tỉnh năm 2026:</p>
<h2>Doanh nghiệp tiêu biểu</h2>
<ul>
  <li><strong>Công ty TNHH Anh Ánh Hồng Lĩnh</strong>, địa chỉ 295 Quang Trung, TDP 7 Đậu Liêu.</li>
  <li>Lĩnh vực chính: sản xuất cấu kiện kim loại, gia công tôn, thép.</li>
</ul>
<h2>Doanh nhân tiêu biểu</h2>
<ul>
  <li><strong>Ông Lê Văn Thông</strong>, Giám đốc Công ty TNHH Hoàng Linh Logistics, Chủ tịch Hội Doanh nghiệp phường.</li>
  <li>Lĩnh vực: vận tải container; sản xuất ngói màu không nung và gạch terrazzo. Trụ sở tại TDP 8 Đậu Liêu.</li>
</ul>
<p>Cả hai đều là doanh nghiệp xây dựng – vật liệu ngay trên địa bàn phường. Bà con có nhu cầu làm nhà, lợp mái, lát sân có thể tìm hiểu thêm sản phẩm của doanh nghiệp quê mình.</p>`,
    sources: [
      {
        name: 'Cổng TTĐT phường Nam Hồng Lĩnh',
        date: '26/08/2026',
        title: 'Phường Nam Hồng Lĩnh đề cử doanh nghiệp, doanh nhân xét tôn vinh năm 2026',
        url: 'https://namhonglinh.hatinh.gov.vn/vi/bai-viet/phuong-nam-hong-linh-de-cu-doanh-nghiep-doanh-nhan-tren-dia-ban-phuong-xet-ton-vinh-danh-hieu-doanh-nghiep-tieu-bieu-va-doanh-nhan-tieu-bieu-tinh-ha-tinh-nam-2026',
      },
    ],
  }),

  // 6. Diễn tập phòng thủ
  article({
    i: 5,
    id: 'tt-2026-dien-tap-khu-vuc-phong-thu',
    slug: 'phuong-nam-hong-linh-hoan-thanh-dien-tap-chien-dau-khu-vuc-phong-thu-2026',
    title: 'Phường Nam Hồng Lĩnh hoàn thành xuất sắc diễn tập chiến đấu trong khu vực phòng thủ năm 2026',
    category: 'Quốc phòng – An ninh',
    tags: ['diễn tập', 'dân quân', 'quốc phòng', 'Nam Hồng Lĩnh'],
    timeStr: '25/08/2026',
    summary:
      'Cuộc diễn tập kéo dài 2 ngày đêm (24–25/8/2026), kết thúc bằng phần thực binh dân quân phối hợp các lực lượng đánh địch đổ bộ đường không. Ban Tổ chức được đánh giá hoàn thành xuất sắc nhiệm vụ.',
    body: `
<h2>Diễn biến chính</h2>
<ul>
  <li><strong>24/8/2026:</strong> khai mạc. Các lực lượng chuyển trạng thái sẵn sàng chiến đấu, hoạt động của địa phương chuyển sang trạng thái quốc phòng.</li>
  <li><strong>Chiều 25/8/2026:</strong> thực binh nội dung dân quân phường phối hợp các lực lượng tiến công địch đổ bộ đường không, sau đó bế mạc.</li>
</ul>
<h2>Kết quả</h2>
<p>Thượng tá Trần Nam Long, Phó Tham mưu trưởng Bộ Chỉ huy Quân sự tỉnh, Trưởng đoàn chỉ đạo, ghi nhận tinh thần trách nhiệm và tính chủ động của phường, đồng thời chỉ ra một số hạn chế cần khắc phục. Ban Tổ chức được đánh giá <strong>hoàn thành xuất sắc nhiệm vụ</strong>. Bí thư Đảng ủy phường Nguyễn Hữu Khiếu kết luận cuộc diễn tập diễn ra đúng kế hoạch, an toàn và thành công.</p>
<p>Dịp này, phường khen thưởng <strong>3 tập thể và 15 cá nhân</strong> có thành tích xuất sắc.</p>
<p>Gia đình có con em trong lực lượng dân quân tham gia đợt diễn tập có thể gửi ảnh, kỷ niệm về Ban biên tập để đăng bổ sung.</p>`,
    sources: [
      {
        name: 'Cổng TTĐT phường Nam Hồng Lĩnh',
        date: '25/08/2026',
        title: 'Phường Nam Hồng Lĩnh hoàn thành diễn tập chiến đấu trong khu vực phòng thủ năm 2026',
        url: 'https://namhonglinh.hatinh.gov.vn/vi/bai-viet/phuong-nam-hong-linh-hoan-thanh-dien-tap-chien-dau-trong-khu-vuc-phong-thu-nam-2026',
      },
      {
        name: 'Báo Hà Tĩnh',
        date: '24/08/2026',
        title: 'Phường Nam Hồng Lĩnh khai mạc diễn tập chiến đấu phòng thủ',
        url: 'https://baohatinh.vn/phuong-nam-hong-linh-khai-mac-dien-tap-chien-dau-phong-thu-post316065.html',
      },
    ],
  }),

  // 7. Khám bệnh người có công
  article({
    i: 6,
    id: 'tt-2026-kham-thuoc-nguoi-co-cong',
    slug: 'kham-cap-thuoc-mien-phi-cho-300-nguoi-co-cong-hong-linh-2026',
    title: 'Khám bệnh, cấp thuốc miễn phí trị giá 300 triệu đồng cho 300 người có công',
    category: 'Y tế – Tri ân',
    tags: ['27/7', 'người có công', 'khám bệnh miễn phí'],
    timeStr: '26/07/2026',
    summary:
      'Sáng 26/7/2026, CLB Thầy thuốc Hà Tĩnh tại Hà Nội phối hợp Trung tâm Y tế Hồng Lĩnh khám, cấp thuốc miễn phí cho 300 thương binh, bệnh binh và người có công tại hai phường Bắc và Nam Hồng Lĩnh.',
    body: `
<h2>Nội dung chương trình</h2>
<p>Hoạt động diễn ra dịp kỷ niệm Ngày Thương binh – Liệt sĩ 27/7. Người có công được:</p>
<ul>
  <li>Khám tổng quát: đo huyết áp, khám nội khoa.</li>
  <li>Xét nghiệm đường huyết; siêu âm, chụp X-quang.</li>
  <li>Khám răng hàm mặt, khám mắt và được tư vấn sức khỏe.</li>
  <li>Cấp thuốc miễn phí, tổng trị giá <strong>300 triệu đồng</strong>.</li>
</ul>
<h2>Lưu ý sức khỏe cho các cụ</h2>
<p>Qua đợt khám, các bác sĩ thấy nhiều cụ mắc tăng huyết áp, bệnh tim mạch, dạ dày, hô hấp và các bệnh về mắt. Con cháu trong làng nên nhắc ông bà, cha mẹ, nhất là các gia đình thương binh, bệnh binh, uống thuốc đều và tái khám đúng hẹn tại Trung tâm Y tế Hồng Lĩnh.</p>`,
    sources: [
      {
        name: 'Báo Hà Tĩnh',
        date: '26/07/2026',
        title: 'Khám, cấp phát thuốc miễn phí cho 300 người có công với cách mạng',
        url: 'https://baohatinh.vn/kham-cap-phat-thuoc-mien-phi-cho-300-nguoi-co-cong-voi-cach-mang-post314574.html',
      },
    ],
  }),

  // 8. Đóng cửa mỏ đá Mồng Gà
  article({
    i: 7,
    id: 'tt-2026-dong-cua-mo-da-mong-ga',
    slug: 'dong-cua-mo-da-mong-ga-ban-giao-cho-dia-phuong-quan-ly',
    title: 'Mỏ đá Mồng Gà hoàn tất các hạng mục đóng cửa, chuẩn bị bàn giao cho địa phương',
    category: 'Môi trường – Đất đai',
    tags: ['mỏ đá Mồng Gà', 'môi trường', 'đóng cửa mỏ'],
    timeStr: '24/07/2026',
    summary:
      'Mỏ đá Mồng Gà (phường Nam Hồng Lĩnh), được cấp phép khai thác từ năm 1997, có quyết định đóng cửa ngày 22/7/2026. Các hạng mục cải tạo môi trường đã nghiệm thu xong 100%.',
    body: `
<h2>Thông tin chính</h2>
<ul>
  <li><strong>Đơn vị khai thác:</strong> Công ty CP Phát triển công nghiệp xây lắp và thương mại Hà Tĩnh, được UBND tỉnh cấp phép từ năm 1997.</li>
  <li><strong>Diện tích:</strong> 9,68 ha, gồm 8 ha khu mỏ và 1,68 ha bãi chế biến.</li>
  <li><strong>Quyết định đóng cửa mỏ:</strong> số 1872/QĐ-UBND ngày 22/7/2026 của UBND tỉnh.</li>
</ul>
<h2>Các hạng mục đã thực hiện</h2>
<p>Theo hồ sơ nghiệm thu, đơn vị khai thác đã hoàn thành 100% khối lượng, trong đó có:</p>
<ul>
  <li>Xử lý đá treo, dọn đá thải.</li>
  <li>Tháo dỡ công trình phụ trợ.</li>
  <li>Đào rãnh thoát nước, làm hàng rào và biển cảnh báo.</li>
  <li>Cải tạo, phục hồi môi trường.</li>
</ul>
<p>Sau khi hoàn tất thủ tục, khu vực mỏ sẽ được giao cho chính quyền địa phương quản lý. Các hạng mục cải tạo tiếp tục được theo dõi, duy tu theo quy định.</p>
<h2>Lưu ý an toàn</h2>
<p>Mỏ đã dừng khai thác nhưng vách đá cũ vẫn còn nguy hiểm. Phụ huynh nên nhắc các cháu không vào khu vực moong, vách mỏ để chơi hay tắm, nhất là mùa mưa bão.</p>`,
    sources: [
      {
        name: 'Báo Hà Tĩnh',
        date: '24/07/2026',
        title: '"Soi" tiến độ hoàn thiện các hạng mục để đóng cửa mỏ đá Mồng Gà',
        url: 'https://baohatinh.vn/soi-tien-do-hoan-thien-cac-hang-muc-de-dong-cua-mo-da-mong-ga-post314495.html',
      },
    ],
  }),

  // 9. Đại hội TDTT
  article({
    i: 8,
    id: 'tt-2026-dai-hoi-tdtt-lan-thu-nhat',
    slug: 'gan-600-vdv-tranh-tai-dai-hoi-tdtt-phuong-nam-hong-linh-lan-thu-nhat',
    title: 'Gần 600 vận động viên tranh tài tại Đại hội TDTT phường Nam Hồng Lĩnh lần thứ nhất',
    category: 'Thể thao – Phong trào',
    tags: ['Đại hội TDTT', 'bóng chuyền', 'kéo co', 'pickleball'],
    timeStr: '27/02/2026',
    summary:
      'Sáng 27/2/2026, phường Nam Hồng Lĩnh khai mạc Đại hội Thể dục thể thao lần thứ nhất với gần 600 vận động viên của 12 đoàn, thi đấu 6 môn đến ngày 15/3/2026.',
    body: `
<h2>Quy mô giải</h2>
<ul>
  <li><strong>Đơn vị tổ chức:</strong> UBND phường Nam Hồng Lĩnh.</li>
  <li><strong>Lực lượng tham gia:</strong> gần 600 vận động viên thuộc 12 đoàn, đến từ các tổ dân phố, cơ quan, đơn vị trên địa bàn.</li>
  <li><strong>6 môn thi đấu:</strong> bóng chuyền, kéo co (nam, nữ), bóng đá thanh niên nam, pickleball, chạy việt dã và bóng đá thiếu niên.</li>
  <li><strong>Thời gian:</strong> từ 27/2 đến 15/3/2026.</li>
</ul>
<h2>Mục đích</h2>
<p>Đại hội nhằm đánh giá phong trào thể thao quần chúng và phát động cuộc vận động "Toàn dân rèn luyện thân thể theo gương Bác Hồ vĩ đại" giai đoạn 2026–2030. Đây cũng là dịp chọn vận động viên dự Đại hội TDTT cấp tỉnh.</p>
<p>Tại lễ khai mạc, Phó Chủ tịch UBND phường Võ Thanh Định phát biểu khai mạc, Phó Bí thư Thường trực Đảng ủy Hoàng Bá Khang châm đuốc và Chủ tịch UBND phường Tôn Quang Ngọc đánh trống khai hội.</p>
<p>Ban biên tập mong nhận ảnh và kết quả thi đấu của các đội Thuận Lộc để đăng bổ sung.</p>`,
    sources: [
      {
        name: 'Báo Hà Tĩnh',
        date: '27/02/2026',
        title: 'Gần 600 VĐV tranh tài Đại hội TDTT phường Nam Hồng Lĩnh',
        url: 'https://baohatinh.vn/gan-600-vdv-tranh-tai-dai-hoi-tdtt-phuong-nam-hong-linh-post306494.html',
      },
    ],
  }),
];

export default tinTucBaiViet;
