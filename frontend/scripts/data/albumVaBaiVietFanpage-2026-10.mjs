/**
 * ẢNH & BÀI VIẾT TƯ LIỆU TỪ FANPAGE "XÃ THUẬN LỘC - THỊ XÃ HỒNG LĨNH - HÀ TĨNH"
 * (facebook.com/profile.php?id=100064571506521) — đã xin phép quản trị viên trang.
 *
 * Phạm vi: chỉ lấy ảnh liên quan Đình Giao Tác, trường học và làng Giao Tác.
 * Loại bỏ: ảnh có watermark của nhiếp ảnh gia riêng ("Copyright Manh69"), ảnh trùng.
 * Ảnh nằm trong frontend/public/images/album-fanpage/ (cần deploy Firebase Hosting để hiện).
 * Bài viết: viết lại bằng lời văn Ban biên tập, ghi rõ nguồn và tác giả gốc.
 */

const IMG = (f) => `/images/album-fanpage/${f}`;
const NGUON_ANH = 'Ảnh: Fanpage Xã Thuận Lộc - Thị Xã Hồng Lĩnh - Hà Tĩnh';
const FANPAGE = 'https://www.facebook.com/profile.php?id=100064571506521';

export const albums = [
  {
    key: 'dinh',
    title: 'Đình Giao Tác qua ống kính',
    description:
      'Đình làng Giao Tác qua các năm 2015–2023: sau đợt trùng tu năm 2014, toàn cảnh từ trên cao và những hoạt động văn hóa dưới mái đình. ' +
      NGUON_ANH + '.',
    eventDate: '2023-08-01',
    photos: [
      { file: 'giao-tac-a1.jpg', caption: 'Đình Giao Tác giữa xóm làng và cánh đồng, nhìn từ trên cao', takenYear: 2019 },
      { file: 'giao-tac-a2.jpg', caption: 'Cổng trụ, sân gạch đỏ và tòa đình gỗ lim', takenYear: 2019 },
      { file: 'giao-tac-a8.jpg', caption: 'Đình và tường bao vừa được khôi phục sau đợt trùng tu 2014', takenYear: 2015 },
      { file: 'giao-tac-a4.jpg', caption: 'Chị em phụ nữ Thuận Lộc trong tà áo dài trước Đình Giao Tác', takenYear: 2023 },
      { file: 'giao-tac-a5.jpg', caption: 'Áo dài vàng trên bậc thềm đình làng', takenYear: 2023 },
      { file: 'giao-tac-a6.jpg', caption: 'Phụ nữ Thuận Lộc chào đón ngày 8/3 tại sân đình', takenYear: 2023 },
      { file: 'giao-tac-a7.jpg', caption: 'Lễ ra mắt CLB Hát Sắc Bùa xã Thuận Lộc tại Đình Giao Tác, tối 01/8/2023', takenYear: 2023 },
    ],
  },
  {
    key: 'truong',
    title: 'Mái trường & con đường đến lớp',
    description:
      'Trường cấp 2 (THCS) Thuận Lộc và con đường đi học của bao thế hệ học trò làng Giao Tác. ' +
      'Hai ảnh có ghi chú "phục chế AI" là ảnh cũ được phục chế màu bằng AI, không phải ảnh gốc. ' + NGUON_ANH + '.',
    eventDate: '2017-10-02',
    photos: [
      { file: 'giao-tac-b5.jpg', caption: '"Bao nhiêu con người, bao nhiêu thế hệ đã từng qua đây" — dãy lớp học trường cấp 2', takenYear: 2015 },
      { file: 'giao-tac-b4.jpg', caption: 'Khuôn viên trường cấp 2 Thuận Lộc nhìn từ trên cao', takenYear: 2017 },
      { file: 'giao-tac-b1.jpg', caption: 'Dãy nhà hai tầng trường cấp 2 Thuận Lộc (ảnh cũ phục chế AI)' },
      { file: 'giao-tac-b3.jpg', caption: 'Sân trường và hàng cây trước dãy lớp học (ảnh cũ phục chế AI)' },
      { file: 'giao-tac-c1.jpg', caption: 'Con đường đi học "huyền thoại" của học trò làng Giao Tác' },
    ],
  },
];

const nguon = (items) => `
<blockquote>
  <p><strong>Nguồn tư liệu:</strong></p>
  <ul>${items.map((s) => `<li>${s}</li>`).join('')}</ul>
  <p><em>Ban biên tập Cổng TT Làng Giao Tác tổng hợp và biên tập lại, đã được quản trị viên fanpage đồng ý sử dụng.</em></p>
</blockquote>`;

const hinh = (file, cap) =>
  `<p><img src="${IMG(file)}" alt="${cap}"></p><p><em>${cap}. ${NGUON_ANH}.</em></p>`;

export const posts = [
  {
    key: 'lich-su-dinh',
    title: 'Chuyện dựng Đình Giao Tác và gần 150 năm thăng trầm của mái đình làng',
    category: 'Đổi thay của làng',
    coverImageUrl: IMG('giao-tac-a2.jpg'),
    contentHtml: `
<p><strong>Đình Giao Tác được dựng từ năm Tự Đức thứ 28 (1875), là nơi chi bộ Đảng đầu tiên của Thuận Lộc ra đời năm 1930. Mái đình đã qua bốn lần di dời trước khi được trùng tu và đặt về chỗ cũ năm 2014.</strong></p>

<h2>Ngôi nhà đẹp nhất làng thành đình làng</h2>
<p>Theo lời kể các cụ cao niên, năm 1875 cụ Chánh Do, một người giàu có của làng Giao Tác, mời thợ giỏi về dựng nhà riêng, chạm trổ "rồng chầu phượng múa". Nhà đẹp nổi tiếng một vùng, nhưng sau đó gia đình cụ gặp nhiều chuyện không may. Dân làng cho rằng cụ bị "bề trên" quở trách.</p>
<p>Để tạ lỗi, cụ vận động hào cựu, chức sắc và phú ông trong làng lên tận Ngàn Phố, Ngàn Sâu mua gỗ lim, dựng một ngôi nhà đẹp hơn nhiều lần để cúng làng làm đình. Phần lớn kinh phí do gia đình cụ đóng góp.</p>
<p>Cụ mời hai tổ thợ chạm của làng Mật và làng Thái Yên. Mỗi tổ làm một nửa ngôi đình, làm riêng và không được xem bên kia làm. Sau gần hai năm, khi ghép lại, hai nửa khớp nhau và giống nhau như đúc. Vì vậy đình hoàn thành khoảng năm 1877–1878, khớp với mốc 1878 mà Báo Hà Tĩnh ghi nhận.</p>

${hinh('giao-tac-a1.jpg', 'Đình Giao Tác giữa xóm làng và cánh đồng')}

<h2>Thế đất và con đường Lụy</h2>
<p>Đình được đặt trên khu đất cao gọi là Nhà Sảng. Trước mặt là dãy ruộng mạ, phía sau là ruộng bàu (về sau gọi là ruộng Đình), phía Tây Bắc là dãy Ao Phe. Các cụ xem đây là thế đất "long hồi thủy tụ". Nơi này nay thuộc thôn Thuận Giang.</p>
<p>Dựng đình xong, cụ Chánh Do huy động dân làng đắp đường Lụy, nối từ đền Long Mạch (thôn Thuận Trung) đến múi Nương Đông. Phía Tây đường trồng hàng lộc vừng để chắn gió và lũ, đến nay vẫn còn.</p>
<p>Làng đặt hương ước cấm trâu bò đi trên đường lũy. Để làm gương, cụ cho người nhà cưỡi con trâu đực lớn nhất trong chuồng đi lại trên đường, rồi tự phạt chính mình: mổ trâu tại sân đình chia cho dân làng. Từ đó hương ước được cả làng nghiêm chỉnh làm theo.</p>

<h2>Kiến trúc và lễ tế</h2>
<ul>
  <li>Đình làm theo kiểu nhà rường: bốn vì tứ trụ, ba gian, hai đầu bát vận.</li>
  <li>Mười hai chiếc kẻ quanh bốn phía chạm "long, ly, quy, phượng", quan văn, quan võ, con nghê.</li>
  <li>Mỗi năm làng tế thần hai lần, vào tháng Hai và tháng Sáu âm lịch. Đội tế rước thần từ đền về bằng kiệu có lọng che, đàn tế đặt giữa sân đình.</li>
</ul>

<h2>Dưới mái đình, một chặng lịch sử cách mạng</h2>
<ul>
  <li><strong>20/02/1930:</strong> Chi bộ Đảng làng Giao Tác (Chi bộ Giao), tiền thân của Đảng bộ xã Thuận Lộc, được thành lập tại đình. Các tổ chức Tự vệ đỏ, Nông hội đỏ, Phụ nữ cứu quốc, Thanh niên cứu quốc cũng lần lượt ra đời ở đây.</li>
  <li><strong>1930–1931:</strong> Đình là nơi diễn ra nhiều cuộc đấu tranh chống sưu cao thuế nặng. Khi phong trào Xô viết Nghệ Tĩnh thoái trào, sân đình lại thành nơi địch bắt bớ, tra tấn.</li>
  <li><strong>1945:</strong> Chính quyền cách mạng xã ra đời dưới mái đình, đình trở thành trụ sở hành chính đầu tiên của xã. Đây cũng là nơi tiễn nhiều thanh niên Thuận Lộc lên đường kháng chiến chống Pháp.</li>
</ul>

<h2>Bốn lần di dời và ngày trở về</h2>
<ul>
  <li><strong>1954:</strong> Lễ tế chấm dứt. Nhiều họa tiết chạm trổ bị bẻ mang đi và thất lạc.</li>
  <li><strong>1960:</strong> HTX nông nghiệp Đại Đồng (gồm xóm Trung, Giang, Sơn) dời đình về khu đất công có cây đa Đại hoàng, làm nhà hội quán.</li>
  <li><strong>1973:</strong> Đình chuyển về trụ sở UBND xã, làm nhà lưu niệm Bác Hồ và nhà truyền thống. Bà con quen gọi là "Nhà thờ Bác".</li>
  <li><strong>1989:</strong> Xã xây hội trường lớn, đình được chuyển sang vị trí khác trong khuôn viên. Lâu năm không tu bổ nên đình xuống cấp nhiều.</li>
  <li><strong>2012–2014:</strong> Đảng bộ xã ra nghị quyết trùng tu. Nhờ đóng góp của nhân dân và con em Thuận Lộc khắp mọi miền, năm 2014 đình được trùng tu và đặt về vị trí cũ tại thôn Thuận Giang.</li>
</ul>

${hinh('giao-tac-a8.jpg', 'Đình và tường bao vừa được khôi phục, ảnh đăng tháng 3/2015')}

<p>Ngày 19/02/2019, fanpage xã đưa tin Đình làng Giao được xếp hạng di tích lịch sử – văn hóa. Năm 2022, đình là một trong những điểm di tích của thị xã được Thị đoàn Hồng Lĩnh gắn mã QR để người dân và du khách tra cứu thông tin.</p>

${hinh('giao-tac-a2.jpg', 'Cổng trụ và tòa đình gỗ lim sau trùng tu')}

<p><em>Ban biên tập chưa tìm thấy văn bản gốc về quyết định xếp hạng di tích (số quyết định, cấp xếp hạng). Gia đình nào còn giữ tư liệu, kính mong gửi về Ban cán sự TDP 9 để bổ sung.</em></p>
${nguon([
  `Bài "Di tích Đình làng Giao Tác" của tác giả Đồng Thanh Liễu, viết theo lời kể các cụ cao niên xã Thuận Lộc, đăng trên <a href="${FANPAGE}" target="_blank" rel="noopener noreferrer">fanpage Xã Thuận Lộc</a> ngày 08/8/2019`,
  'Fanpage Xã Thuận Lộc, các bài ngày 19/02/2019 (xếp hạng di tích) và bài chia sẻ từ Tuổi Trẻ Hồng Lĩnh về gắn mã QR di tích (2022)',
  'Báo Hà Tĩnh, 03/07/2024: <a href="https://baohatinh.vn/dinh-giao-tac-noi-luu-giu-hon-que-thuan-loc-post269421.html" target="_blank" rel="noopener noreferrer">Đình Giao Tác – nơi lưu giữ hồn quê Thuận Lộc</a>',
])}`,
  },

  {
    key: 'dinh-hom-nay',
    title: 'Sân Đình Giao Tác hôm nay: áo dài, câu hát Sắc Bùa và mã QR di tích',
    category: 'Đổi thay của làng',
    coverImageUrl: IMG('giao-tac-a4.jpg'),
    contentHtml: `
<p><strong>Sau đợt trùng tu năm 2014, Đình Giao Tác không chỉ là nơi thờ tự. Sân đình trở thành không gian sinh hoạt văn hóa chung của bà con Thuận Lộc.</strong></p>

<h2>Câu lạc bộ Hát Sắc Bùa ra mắt dưới mái đình</h2>
<p>Tối 01/8/2023, lúc 19h30, UBND xã Thuận Lộc tổ chức lễ ra mắt Câu lạc bộ Hát Sắc Bùa tại Đình Giao Tác. Trời mưa nhỏ, nhưng buổi lễ vẫn diễn ra trang trọng, đông đủ cán bộ, đảng viên, đoàn viên, hội viên và bà con.</p>
<p>Hát Sắc Bùa là lối hát chúc phúc đầu xuân của vùng Nghệ Tĩnh. Đội hát đi từng nhà, chúc gia chủ năm mới an khang, làm ăn phát đạt. Câu lạc bộ ra đời ngay tại đình làng là cách giữ lại lối hát này cho lớp con cháu.</p>
${hinh('giao-tac-a7.jpg', 'Lễ ra mắt CLB Hát Sắc Bùa xã Thuận Lộc, tối 01/8/2023')}

<h2>Áo dài vàng trước sân đình</h2>
<p>Đầu năm 2023, chị em Hội Phụ nữ Thuận Lộc chụp bộ ảnh áo dài vàng, quần xanh trước Đình Giao Tác để chào mừng ngày 8/3. Mái ngói, cột gỗ lim và bậc thềm đỏ của đình làm nền cho những tà áo thướt tha.</p>
${hinh('giao-tac-a4.jpg', 'Chị em phụ nữ Thuận Lộc trước Đình Giao Tác')}
${hinh('giao-tac-a5.jpg', 'Áo dài vàng trên bậc thềm đình làng')}
${hinh('giao-tac-a6.jpg', 'Phụ nữ Thuận Lộc chào đón ngày 8/3 tại sân đình')}

<h2>Quét mã QR để đọc chuyện đình</h2>
<p>Năm 2022, Thị đoàn Hồng Lĩnh gắn mã QR tại Đình Giao Tác cùng một số di tích khác trên địa bàn thị xã. Hoạt động này chào mừng 190 năm thành lập, 30 năm tái lập tỉnh Hà Tĩnh và 30 năm thành lập thị xã Hồng Lĩnh (2/3/1992 – 2/3/2022). Ai đến đình chỉ cần dùng điện thoại quét mã là đọc được thông tin về di tích.</p>
<p>Bà con và con em xa quê có ảnh, video các buổi sinh hoạt ở đình xin gửi lên mục <a href="/thu-vien-anh">Thư viện ảnh</a> để cùng lưu giữ.</p>
${nguon([
  `<a href="${FANPAGE}" target="_blank" rel="noopener noreferrer">Fanpage Xã Thuận Lộc</a>: thư mời và tin tường thuật lễ ra mắt CLB Hát Sắc Bùa (31/7 và 01/8/2023)`,
  'Fanpage Xã Thuận Lộc: bộ ảnh "Hình ảnh đẹp về Phụ nữ Thuận Lộc qua tà áo dài" (21/2/2023), nguồn Phụ nữ Thuận Lộc',
  'Fanpage Xã Thuận Lộc chia sẻ từ Tuổi Trẻ Hồng Lĩnh: Đình làng Giao Tác được gắn mã QR (2022)',
])}`,
  },

  {
    key: 'truong-cap-2',
    title: 'Trường cấp 2 Thuận Lộc và con đường đến lớp của học trò làng Giao Tác',
    category: 'Ký ức tuổi thơ',
    coverImageUrl: IMG('giao-tac-b4.jpg'),
    contentHtml: `
<p><strong>Dãy lớp hai tầng sơn vàng, hàng cây trước sân và con đường đất men cánh đồng là ký ức chung của nhiều thế hệ học trò làng Giao Tác.</strong></p>

<h2>Ngôi trường của bao thế hệ</h2>
<p>Năm 2015, fanpage xã đăng ảnh dãy lớp học trường cấp 2 với dòng chú thích "Bao nhiêu con người, bao nhiêu thế hệ đã từng qua đây". Tấm biển trước cổng ghi tên Trường Trung học cơ sở Thuận Lộc. Nay trường là Trường TH&amp;THCS Thuận Lộc.</p>
${hinh('giao-tac-b5.jpg', 'Dãy lớp học trường cấp 2 Thuận Lộc, ảnh đăng năm 2015')}
<p>Ảnh chụp từ trên cao năm 2017 cho thấy toàn cảnh khuôn viên: hai dãy nhà vuông góc, sân trường rộng với những gốc cây lớn và vườn trường phía sau.</p>
${hinh('giao-tac-b4.jpg', 'Khuôn viên trường cấp 2 Thuận Lộc nhìn từ trên cao, năm 2017')}
<p>Tháng 4/2026, fanpage đăng lại bộ ảnh cũ về trường với lời nhắn "Trường cấp 2 Thuận Lộc, kỷ niệm bao thế hệ". Các ảnh này được phục chế màu bằng AI nên chỉ có giá trị gợi nhớ, không phải ảnh gốc.</p>
${hinh('giao-tac-b1.jpg', 'Dãy nhà hai tầng trường cấp 2 Thuận Lộc (ảnh cũ phục chế AI)')}
${hinh('giao-tac-b3.jpg', 'Sân trường và hàng cây (ảnh cũ phục chế AI)')}

<h2>Con đường "huyền thoại"</h2>
<p>Fanpage xã từng nhắc về con đường đi học "huyền thoại" của làng Giao Tác. Có lẽ chỉ thế hệ 9x trở về trước mới còn nhớ: đường đất nhỏ men giữa cánh đồng, mùa mưa bão đi học rất vất vả. Nay làng đã có đường mới, học trò đến trường bằng xe đạp điện.</p>
${hinh('giao-tac-c1.jpg', 'Con đường đi học "huyền thoại" của học trò làng Giao Tác')}

<h2>Mời bà con góp chuyện</h2>
<p>Ban biên tập mong các thầy cô, cựu học sinh và con em xa quê chia sẻ thêm:</p>
<ul>
  <li>Trường được xây dựng năm nào, qua những lần đổi tên, sáp nhập ra sao?</li>
  <li>Ảnh lớp, ảnh lễ khai giảng, lễ ra trường những năm 1980–2000.</li>
  <li>Kỷ niệm trên con đường đi học qua cánh đồng mùa nước.</li>
</ul>
<p>Bà con có thể viết bài trong mục <a href="/bai-viet">Bài viết cộng đồng</a> hoặc gửi ảnh vào <a href="/thu-vien-anh">Thư viện ảnh</a>, album "Mái trường &amp; con đường đến lớp".</p>
${nguon([
  `<a href="${FANPAGE}" target="_blank" rel="noopener noreferrer">Fanpage Xã Thuận Lộc</a>: ảnh trường cấp 2 (19/8/2015), "Khuôn viên trường Cấp 2" (02/10/2017), "Trường cấp 2 Thuận Lộc, kỷ niệm bao thế hệ" (04/2026)`,
  'Fanpage Xã Thuận Lộc: bài "Con đường huyền thoại của làng Giao Tác"',
])}`,
  },
];

export default { albums, posts };
