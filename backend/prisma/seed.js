const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌾 Bắt đầu quá trình nạp dữ liệu mẫu (Seed) cho Làng Giao Tác (TDP 9 Thuận Lộc, TX Hồng Lĩnh)...');

  // Xóa dữ liệu cũ theo thứ tự ràng buộc khóa ngoại
  await prisma.comment.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.album.deleteMany();
  await prisma.post.deleteMany();
  await prisma.news.deleteMany();
  await prisma.event.deleteMany();
  await prisma.villagerDirectory.deleteMany();
  await prisma.historyTimeline.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Tạo Users (Admin: Nguyễn Trọng Long)
  const adminUser = await prisma.user.create({
    data: {
      fullName: 'Nguyễn Trọng Long',
      email: 'admin@langgiaotac.vn',
      passwordHash,
      role: 'admin',
      hometownGroup: 'TDP 9 Thuận Lộc (Làng Giao Tác)',
      currentLocation: 'TDP 9 Thuận Lộc, TX Hồng Lĩnh, Hà Tĩnh',
      bio: 'Quản trị viên Cổng thông tin Làng Giao Tác — Tổ dân phố 9 Thuận Lộc, TX Hồng Lĩnh. SĐT: 0832991002',
      avatarUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      isVerified: true,
    },
  });

  const modUser = await prisma.user.create({
    data: {
      fullName: 'Hoàng Minh Tuấn',
      email: 'mod@langgiaotac.vn',
      passwordHash,
      role: 'moderator',
      hometownGroup: 'TDP 9 Thuận Lộc',
      currentLocation: 'Thị xã Hồng Lĩnh, Hà Tĩnh',
      bio: 'Bí thư Chi đoàn Thanh niên TDP 9 Thuận Lộc, phụ trách truyền thông và phong trào trẻ.',
      avatarUrl: '/images/village/476328615_1020997653395942_6382946994889025434_n.jpg',
      isVerified: true,
    },
  });

  const memberUser1 = await prisma.user.create({
    data: {
      fullName: 'Nguyễn Thị Mai',
      email: 'nguyenthimai@gmail.com',
      passwordHash,
      role: 'member',
      hometownGroup: 'TDP 9 Thuận Lộc (Xóm Chùa xưa)',
      currentLocation: 'Quận Cầu Giấy, Hà Nội',
      bio: 'Người con xa quê đang sinh sống và làm việc tại Hà Nội, luôn hướng về quê hương Giao Tác.',
      avatarUrl: '/images/village/486687342_9660859150640298_6322523556717035363_n.jpg',
      isVerified: true,
    },
  });

  const memberUser2 = await prisma.user.create({
    data: {
      fullName: 'Trần Văn An',
      email: 'tranvanan@gmail.com',
      passwordHash,
      role: 'member',
      hometownGroup: 'TDP 9 Thuận Lộc (Xóm Bến xưa)',
      currentLocation: 'Quận 1, TP. Hồ Chí Minh',
      bio: 'Thành viên Ban liên lạc Hội đồng hương Giao Tác — Thuận Lộc tại miền Nam.',
      avatarUrl: '/images/village/487179352_9667038933355653_1441822558744355954_n.jpg',
      isVerified: true,
    },
  });

  console.log('✅ Đã tạo các tài khoản người dùng với Admin Nguyễn Trọng Long.');

  // 2. Tạo Mốc Lịch sử (HistoryTimeline) sử dụng ảnh thực tế của làng
  const historyData = [
    {
      yearLabel: 'Năm 1685',
      title: 'Khai hoang lập ấp Làng Giao Tác dưới chân núi Hồng Lĩnh',
      description:
        'Các bậc tiền nhân khai khẩn vùng đất bãi bồi trù phú dưới chân núi Hồng Lĩnh, đặt nền móng dựng ấp, lập làng mang tên Giao Tác, hình thành cộng đồng dân cư đoàn kết và hiếu học.',
      imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      orderIndex: 1,
    },
    {
      yearLabel: 'Năm 1875',
      title: 'Khởi dựng Đình Làng Giao Tác (Đời vua Tự Đức thứ 28)',
      description:
        'Nhờ sự đóng góp tâm huyết của cụ Chánh Do và nhân dân trong vùng, ngôi Đình làng Giao Tác uy nghiêm được khởi dựng tại thôn Thuận Giang, làm nơi tế thần Thành Hoàng, hội họp việc làng và là nơi chở che cho những mảnh đời khó khăn.',
      imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      orderIndex: 2,
    },
    {
      yearLabel: 'Năm 1930',
      title: 'Thành lập Chi bộ Đảng làng Giao Tác (20/2/1930)',
      description:
        'Dưới mái đình cổ kính, Chi bộ Đảng làng Giao Tác – tiền thân của Đảng bộ xã Thuận Lộc – chính thức ra đời ngày 20/2/1930, lãnh đạo phong trào Xô Viết Nghệ Tĩnh kiên cường.',
      imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
      orderIndex: 3,
    },
    {
      yearLabel: 'Năm 1960 - 2014',
      title: 'Quá trình di dời, bảo tồn và phục dựng đình làng',
      description:
        'Trải qua nhiều biến thiên lịch sử chiến tranh và chuyển dời (1960, 1973, 1989), đến năm 2014, đình làng được trùng tu, phục dựng và đưa trở về đúng vị trí khởi thủy tại thôn Thuận Giang (TDP 9), bảo tồn trọn vẹn kiến trúc truyền thống.',
      imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
      orderIndex: 4,
    },
    {
      yearLabel: 'Năm 2018',
      title: 'Đón nhận Bằng Di tích Lịch sử - Văn hóa Cấp Tỉnh',
      description:
        'Đình làng Giao Tác vinh dự được UBND tỉnh Hà Tĩnh công nhận là Di tích Lịch sử - Văn hóa cấp tỉnh, trở thành địa chỉ đỏ giáo dục truyền thống cách mạng và lòng tự hào quê hương.',
      imageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
      orderIndex: 5,
    },
    {
      yearLabel: 'Hiện tại',
      title: 'Tổ Dân Phố 9 Thuận Lộc — Đô thị văn minh kiểu mẫu',
      description:
        '100% đường làng ngõ xóm được bê tông hóa, thảm nhựa và rực rỡ cờ hoa; nhà văn hóa và đình làng khang trang, nhân dân đồng lòng giữ gìn nếp sống văn hóa thuần phong mỹ tục.',
      imageUrl: '/images/village/474372745_1006185908210450_6706806661278267034_n.jpg',
      orderIndex: 6,
    },
  ];

  for (const item of historyData) {
    await prisma.historyTimeline.create({ data: item });
  }
  console.log('✅ Đã nạp danh sách Mốc Lịch sử.');

  // 3. Tạo Tin tức chính quyền (News)
  await prisma.news.create({
    data: {
      authorId: adminUser.id,
      title: 'Kế hoạch tổ chức Lễ hội Đình Làng & Gặp mặt bà con TDP 9 Thuận Lộc xuân 2026',
      slug: 'ke-hoach-to-chuc-le-hoi-dinh-lang-gap-mat-ba-con-tdp9-thuan-loc-2026',
      contentHtml: `<p>Kính gửi toàn thể bà con nhân dân Tổ dân phố 9 (Làng Giao Tác xưa), xã Thuận Lộc cùng con em đồng hương khắp mọi miền!</p>
      <p>Ban Cán sự TDP 9 phối hợp cùng Ban Khánh tiết Đình làng trân trọng thông báo chương trình <strong>Lễ hội truyền thống và Ngày hội Đại đoàn kết năm 2026</strong>:</p>
      <ul>
        <li><strong>Thời gian:</strong> Rằm tháng Giêng âm lịch.</li>
        <li><strong>Địa điểm:</strong> Nhà văn hóa & Quần thể Đình Làng Giao Tác (TDP 9, Thuận Lộc, TX Hồng Lĩnh).</li>
        <li><strong>Nội dung:</strong> Dâng hương tế thần nông, biểu dương các gia đình văn hóa tiêu biểu, trao học bổng khuyến học cho học sinh đỗ đại học và giao lưu thể thao bóng chuyền, kéo co.</li>
      </ul>
      <p>Mọi thông tin chi tiết xin liên hệ Trưởng ban: <strong>Nguyễn Trọng Long</strong> — SĐT: <strong>0832991002</strong>.</p>`,
      source: 'Ban Cán sự TDP 9 Thuận Lộc',
      isOfficial: true,
      publishedAt: new Date(),
    },
  });

  await prisma.news.create({
    data: {
      authorId: adminUser.id,
      title: 'Phát động phong trào xây dựng tuyến đường hoa kiểu mẫu sáng - xanh - sạch - đẹp',
      slug: 'phat-dong-phong-trao-xay-dung-tuyen-duong-hoa-kieu-mau-tdp9',
      contentHtml: `<p>Nhằm duy trì và nâng cao tiêu chí đô thị văn minh tại TDP 9 Thuận Lộc, Chi hội Phụ nữ và Đoàn Thanh niên phát động bà con toàn tổ:</p>
      <p>1. Tổng dọn vệ sinh dọc các trục đường chính và ngõ xóm vào sáng Chủ nhật hàng tuần.</p>
      <p>2. Trồng bổ sung các bồn hoa mười giờ, hoa chiều tím và cây cảnh dọc tuyến đường trung tâm.</p>
      <p>3. Giữ gìn cảnh quan quanh khu vực Giếng cổ và Đình làng sạch sẽ, văn minh.</p>`,
      source: 'Chi hội Phụ nữ & Đoàn Thanh niên TDP 9',
      isOfficial: true,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.news.create({
    data: {
      authorId: modUser.id,
      title: 'Tiếp nhận ủng hộ Quỹ Khuyến học khuyến tài Làng Giao Tác — TDP 9 Thuận Lộc',
      slug: 'tiep-nhan-ung-ho-quy-khuyen-hoc-khuyen-tai-tdp9-thuan-loc',
      contentHtml: `<p>Quỹ Khuyến học TDP 9 Thuận Lộc trân trọng triân tấm lòng vàng của các gia đình, dòng tộc và con em xa quê đã luôn quan tâm, động viên thế hệ trẻ làng quê nỗ lực học tập, rèn luyện thành tài.</p>
      <p>Danh sách ủng hộ được cập nhật minh bạch tại Nhà văn hóa và trên Cổng thông tin làng.</p>`,
      source: 'Ban Khuyến học TDP 9',
      isOfficial: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Đã nạp danh sách Tin tức chính quyền.');

  // 4. Tạo Bài viết cộng đồng (Posts) — BỔ SUNG BÀI VIẾT VIDEO ĐÌNH LÀNG VÀ BÀI CA NHẠC HÀ TĨNH NHỚ VỀ
  await prisma.post.create({
    data: {
      authorId: adminUser.id,
      title: 'Video Giới Thiệu Đình Làng Giao Tác — Di Tích Lịch Sử Văn Hóa Cấp Tỉnh Tại Thôn Thuận Giang, Xã Thuận Lộc',
      slug: 'video-gioi-thieu-dinh-lang-giao-tac-di-tich-lich-su-van-hoa',
      category: 'Dòng họ - Gia phả',
      coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      contentHtml: `<p class="lead font-medium text-base sm:text-lg text-primary-dark">
        Video tư liệu đặc sắc giới thiệu về <strong>Đình làng Giao Tác</strong> — một di tích lịch sử văn hóa quan trọng tọa lạc tại thôn Thuận Giang (nay thuộc Tổ dân phố 9), xã Thuận Lộc, thị xã Hồng Lĩnh, tỉnh Hà Tĩnh.
      </p>

      <div class="my-6 aspect-video rounded-2xl overflow-hidden shadow-warm border border-warmBorder">
        <iframe 
          src="https://www.youtube.com/embed/bTtaKwLR59w" 
          title="Video giới thiệu về Đình làng Giao Tác" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
          class="w-full h-full"
        ></iframe>
      </div>

      <h3>Những Điểm Nhấn Quan Trọng Về Ngôi Đình Làng Giao Tác:</h3>

      <div class="space-y-4 my-4">
        <div class="p-4 rounded-xl bg-paper border border-warmBorder">
          <h4 class="font-bold text-primary text-base flex items-center gap-2">
            🏛️ 1. Lịch sử hình thành (1:06 - 1:35)
          </h4>
          <p class="text-sm mt-1 text-ink leading-relaxed">
            Đình được xây dựng vào năm <strong>1875</strong> (đời vua Tự Đức thứ 28) nhờ sự đóng góp tâm huyết của <strong>cụ Chánh Do</strong> và nhân dân trong vùng, đặt nền móng cho biểu tượng văn hóa tâm linh của làng.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-paper border border-warmBorder">
          <h4 class="font-bold text-primary text-base flex items-center gap-2">
            🏮 2. Ý nghĩa văn hóa và nhân văn (2:05 - 2:32)
          </h4>
          <p class="text-sm mt-1 text-ink leading-relaxed">
            Trước đây, đình là nơi tổ chức tế thần hàng năm, nơi thờ phụng <strong>Thành Hoàng làng</strong>, hội họp bàn việc làng của các bô lão và cũng là nơi tá túc ấm áp cho những mảnh đời khó khăn, cơ nhỡ.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-paper border border-warmBorder">
          <h4 class="font-bold text-primary text-base flex items-center gap-2">
            🚩 3. Dấu ấn cách mạng vẻ vang (2:35 - 3:04)
          </h4>
          <p class="text-sm mt-1 text-ink leading-relaxed">
            Dưới mái đình này, nhiều phong trào đấu tranh yêu nước sục sôi đã diễn ra. Đặc biệt, ngày <strong>20/2/1930</strong>, <strong>Chi bộ Đảng làng Giao Tác</strong> – tiền thân vẻ vang của Đảng bộ xã Thuận Lộc ngày nay – đã được chính thức thành lập tại đây.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-paper border border-warmBorder">
          <h4 class="font-bold text-primary text-base flex items-center gap-2">
            ⏳ 4. Quá trình di dời và phục dựng trùng tu (3:07 - 3:56)
          </h4>
          <p class="text-sm mt-1 text-ink leading-relaxed">
            Trải qua gần hai thế kỷ với nhiều biến động chiến tranh và thay đổi vị trí (năm 1960, 1973, 1989), đến năm <strong>2014</strong>, đình đã được phục dựng và đưa về đúng vị trí khởi thủy tại thôn Thuận Giang, vẫn gìn giữ vẹn nguyên kiến trúc truyền thống.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-paper border border-warmBorder">
          <h4 class="font-bold text-primary text-base flex items-center gap-2">
            ⭐ 5. Giá trị di sản hiện tại (4:26 - 4:54)
          </h4>
          <p class="text-sm mt-1 text-ink leading-relaxed">
            Năm <strong>2018</strong>, Đình Giao Tác vinh dự được công nhận là <strong>Di tích lịch sử - văn hóa cấp tỉnh</strong>, trở thành địa chỉ đỏ thiêng liêng để giáo dục truyền thống lịch sử, lòng yêu nước cho thế hệ mai sau.
          </p>
        </div>
      </div>`,
      status: 'published',
      viewCount: 1250,
      publishedAt: new Date(),
    },
  });

  await prisma.post.create({
    data: {
      authorId: adminUser.id,
      title: 'Ca Khúc: Hà Tĩnh Nhớ Về — Giai Điệu Quê Hương Dưới Chân Núi Hồng Lĩnh',
      slug: 'ca-khuc-ha-tinh-nho-ve-giai-dieu-que-huong',
      category: 'Ký ức tuổi thơ',
      coverImageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
      contentHtml: `<p class="lead font-medium text-base sm:text-lg text-primary-dark">
        Mỗi lần giai điệu bài hát <strong>"Hà Tĩnh Nhớ Về"</strong> vang lên, trong lòng mỗi người con quê hương Làng Giao Tác — TDP 9 Thuận Lộc lại rưng rưng niềm xúc động và nỗi nhớ quê nhà da diết.
      </p>

      <div class="my-6 aspect-video rounded-2xl overflow-hidden shadow-warm border border-warmBorder">
        <iframe 
          src="https://www.youtube.com/embed/pcKfUACFd_o" 
          title="Ca khúc Hà Tĩnh Nhớ Về" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
          class="w-full h-full"
        ></iframe>
      </div>

      <p>Dưới chân dãy núi Hồng Lĩnh 99 ngọn và bên dòng nước mát lành, những lời ca mộc mạc, ngọt ngào như dòng sữa mẹ nuôi dưỡng tâm hồn bao thế hệ con em làng quê lớn khôn, vững bước đi khắp mọi miền đất nước.</p>`,
      status: 'published',
      viewCount: 980,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  });

  await prisma.post.create({
    data: {
      authorId: adminUser.id,
      title: 'Từ Làng Giao Tác xưa đến Tổ dân phố 9 Thuận Lộc ngày nay: Dòng chảy ký ức và tự hào',
      slug: 'tu-lang-giao-tac-xua-den-to-dan-pho-9-thuan-loc-ngay-nay',
      category: 'Đổi thay của làng',
      coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      contentHtml: `<h3>Làng Giao Tác — Nơi cội nguồn máu thịt của bao thế hệ</h3>
      <p>Dù theo thời gian, tên gọi hành chính nay là <strong>Tổ dân phố 9, xã Thuận Lộc, thị xã Hồng Lĩnh (Hà Tĩnh)</strong>, nhưng trong tâm thức của mỗi người con sinh ra và lớn lên nơi đây, cái tên <em>Làng Giao Tác</em> vẫn luôn là niềm tự hào sâu lắng.</p>
      <p>Từ những mái ngói rêu phong, cây đa, giếng cổ, nhà thờ tổ cho đến những tuyến đường hoa thảm nhựa khang trang hôm nay, quê hương đang từng ngày chuyển mình mạnh mẽ nhưng vẫn vẹn nguyên nét chân chất, nghĩa tình của người miền Trung dưới chân núi Hồng Lĩnh.</p>
      <blockquote>"Dù đi muôn nẻo đường đời, tiếng chuông chùa, bóng đình làng Giao Tác vẫn mãi là điểm tựa bình yên cho tâm hồn."</blockquote>`,
      status: 'published',
      viewCount: 680,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.post.create({
    data: {
      authorId: memberUser1.id,
      title: 'Ký ức giếng nước cổ cây bàng và những trưa hè ríu rít tiếng ve',
      slug: 'ky-uc-gieng-nuoc-co-cay-bang-va-nhung-trua-he-riu-rit-tieng-ve',
      category: 'Ký ức tuổi thơ',
      coverImageUrl: '/images/village/474096867_1006185811543793_8014259646970075430_n.jpg',
      contentHtml: `<p>Mỗi khi hè về, giữa cái nắng chang chang của dải đất miền Trung, tôi lại nhớ da diết bóng mát của cây bàng và dòng nước ngọt mát lành từ giếng cổ làng Giao Tác.</p>
      <p>Ngày xưa, giếng làng là nơi gặp gỡ, trò chuyện rôm rả của các bà các mẹ, là nơi lũ trẻ chúng tôi trốn ngủ trưa tụ tập chơi trò chơi dân gian. Nước giếng trong vắt mát lạnh xua tan đi mọi nhọc nhằn đồng áng.</p>`,
      status: 'published',
      viewCount: 420,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.post.create({
    data: {
      authorId: memberUser2.id,
      title: 'Hương vị kẹo Cu Đơ và bánh đa vừng thơm nồng tình quê hương Hà Tĩnh',
      slug: 'huong-vi-keo-cu-do-va-banh-da-vung-thom-nong-tinh-que',
      category: 'Ẩm thực quê',
      coverImageUrl: '/images/village/487122810_9667039056688974_8593141678606100657_n.jpg',
      contentHtml: `<p>Nhắc đến quê hương Hà Tĩnh và vùng đất Hồng Lĩnh, không thể thiếu vị cay nồng của gừng tươi quyện cùng mật mía đặc sánh và đậu phộng bùi béo trong miếng kẹo Cu Đơ kẹp bánh đa giòn rụm.</p>
      <p>Mỗi lần người con TDP 9 Thuận Lộc trở vào Nam công tác, hành lý luôn ấm áp tình quê với những phong kẹo Cu Đơ làm quà biếu bà con bạn bè.</p>`,
      status: 'published',
      viewCount: 350,
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.post.create({
    data: {
      authorId: modUser.id,
      title: 'Sức trẻ TDP 9 Thuận Lộc chung tay xây dựng đô thị văn minh và nông thôn mới kiểu mẫu',
      slug: 'suc-tre-tdp9-thuan-loc-chung-tay-xay-dung-do-thi-van-minh',
      category: 'Đổi thay của làng',
      coverImageUrl: '/images/village/476749176_1020706276758413_2501765006516753118_n.jpg',
      contentHtml: `<p>Đoàn Thanh niên TDP 9 luôn là lực lượng xung kích trong các phong trào làm đường hoa, lắp đèn năng lượng mặt trời và tổ chức các hoạt động văn nghệ thể thao sôi nổi.</p>`,
      status: 'published',
      viewCount: 290,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Đã nạp danh sách Bài viết cộng đồng (bao gồm Video Đình làng và Ca nhạc Hà Tĩnh Nhớ Về).');

  // 5. Tạo Albums & Photos với toàn bộ 40 ảnh thực tế
  const album1 = await prisma.album.create({
    data: {
      title: 'Cảnh sắc Làng Giao Tác — TDP 9 Thuận Lộc xưa và nay',
      description: 'Những góc ảnh chân thực và sống động về cảnh quan, di tích, con đường làng và đời sống sinh hoạt của bà con TDP 9 Thuận Lộc.',
      eventDate: new Date('2025-06-15'),
      createdById: adminUser.id,
    },
  });

  const album2 = await prisma.album.create({
    data: {
      title: 'Lễ hội Đình Làng & Hoạt động văn hóa truyền thống',
      description: 'Ghi lại những khoảnh khắc trang nghiêm, rộn rã trong các dịp tế lễ, rước thần và hội làng đầu xuân.',
      eventDate: new Date('2025-02-20'),
      createdById: adminUser.id,
    },
  });

  const album3 = await prisma.album.create({
    data: {
      title: 'Phong trào Thể thao & Đoàn kết thanh niên TDP 9',
      description: 'Hình ảnh thi đấu bóng chuyền, bóng đá và ngày hội văn hóa thể thao của con em làng quê.',
      eventDate: new Date('2025-09-02'),
      createdById: modUser.id,
    },
  });

  const villageImageFilenames = [
    { file: '484215892_9601885749870972_6761004858315934829_n.jpg', caption: 'Toàn cảnh không gian văn hóa Đình Làng Giao Tác — TDP 9 Thuận Lộc', year: 2025, album: album1 },
    { file: '476468343_1020712713424436_7762543762157463751_n.jpg', caption: 'Bà con tề tựu trong ngày hội văn hóa truyền thống làng quê', year: 2025, album: album2 },
    { file: '476776564_1020712773424430_8938770403532008026_n.jpg', caption: 'Tuyến đường hoa sáng - xanh - sạch - đẹp TDP 9 Thuận Lộc', year: 2024, album: album1 },
    { file: '480212312_1025661522929555_8709853623689778697_n.jpg', caption: 'Cánh đồng trù phú và cảnh sắc thanh bình dưới chân núi Hồng Lĩnh', year: 2024, album: album1 },
    { file: '486784254_9667039123355634_3798108786214067335_n.jpg', caption: 'Các bô lão và đại diện bà con trong buổi lễ tế tổ', year: 2025, album: album2 },
    { file: '474096867_1006185811543793_8014259646970075430_n.jpg', caption: 'Khu vực Giếng cổ và cây xanh rợp bóng mát đầu làng', year: 2024, album: album1 },
    { file: '474232064_1006185604877147_4038067063949471365_n.jpg', caption: 'Hoạt động giao lưu nghĩa tình làng xóm ấm áp', year: 2025, album: album2 },
    { file: '474372745_1006185908210450_6706806661278267034_n.jpg', caption: 'Đường ngõ xóm khang trang sạch đẹp TDP 9', year: 2025, album: album1 },
    { file: '474378266_1006185931543781_77396248245745283_n.jpg', caption: 'Nét kiến trúc chạm khắc tinh xảo tại gian chính điện', year: 2024, album: album2 },
    { file: '474468265_1006185814877126_6845974151311090042_n.jpg', caption: 'Không gian tôn nghiêm nơi thờ tự tổ tiên', year: 2024, album: album2 },
    { file: '476328615_1020997653395942_6382946994889025434_n.jpg', caption: 'Tuổi trẻ TDP 9 tham gia ngày hội thể thao thanh niên', year: 2025, album: album3 },
    { file: '476749176_1020706276758413_2501765006516753118_n.jpg', caption: 'Khuôn viên nhà văn hóa rực rỡ cờ hoa ngày hội làng', year: 2025, album: album1 },
    { file: '480361377_1025661306262910_3393105738832877669_n.jpg', caption: 'Gặp gỡ bà con trong ngày hội đại đoàn kết', year: 2024, album: album2 },
    { file: '481919923_1038953804933660_9191053096340339070_n.jpg', caption: 'Niềm vui của bà con nhân dân trong ngày mùa thu hoạch', year: 2025, album: album1 },
    { file: '486669654_9667039090022304_8533644671297434351_n.jpg', caption: 'Giải đấu bóng chuyền phong trào sôi nổi giữa các cụm dân cư', year: 2025, album: album3 },
    { file: '487072678_9667039030022310_4027050678293325911_n.jpg', caption: 'Lễ rước truyền thống qua các tuyến đường của tổ dân phố', year: 2025, album: album2 },
    { file: '487122810_9667039056688974_8593141678606100657_n.jpg', caption: 'Mâm cỗ truyền thống dâng cúng tổ tiên ngày hội làng', year: 2025, album: album2 },
    { file: '487139441_9667039046688975_3816832760547593398_n.jpg', caption: 'Không khí trang trọng và linh thiêng tại sân đình', year: 2025, album: album2 },
    { file: '487179352_9667038933355653_1441822558744355954_n.jpg', caption: 'Bà con lưu niệm khoảnh khắc sum vầy ngày giỗ tổ', year: 2025, album: album2 },
    { file: '487207651_9667039096688970_5639482163604299767_n.jpg', caption: 'Đội trống hội rộn rã khai mạc lễ hội', year: 2025, album: album2 },
    { file: '487241672_9667038913355655_4893280312059391203_n.jpg', caption: 'Chuẩn bị lễ vật chu đáo thể hiện lòng thành kính tổ tiên', year: 2025, album: album2 },
    { file: '494711254_1086845790144461_6608691068180912061_n.jpg', caption: 'Cảnh quan rợp bóng cây xanh tại ngõ xóm', year: 2025, album: album1 },
    { file: '495016098_1086845843477789_4213248714438490190_n.jpg', caption: 'Góc sân đình rợp bóng mát những ngày hè', year: 2025, album: album1 },
    { file: '495693700_1086845956811111_457011958165925516_n.jpg', caption: 'Con em xa xứ về thăm quê sum vầy cùng gia đình', year: 2025, album: album2 },
    { file: '672688949_1373408091488228_356311310193025544_n.jpg', caption: 'Đội bóng đá thanh niên TDP 9 thi đấu giao hữu', year: 2025, album: album3 },
    { file: '679790602_1378486327647071_8289854520080192795_n.jpg', caption: 'Khí thế thi đua thể thao sôi nổi trong thanh thiếu niên', year: 2025, album: album3 },
    { file: '709729339_1408654567963580_1475408134129676792_n.jpg', caption: 'Trao thưởng cho các đội thể thao xuất sắc', year: 2025, album: album3 },
  ];

  let firstPhotoIdAlbum1 = null;
  let firstPhotoIdAlbum2 = null;
  let firstPhotoIdAlbum3 = null;

  for (let i = 0; i < villageImageFilenames.length; i++) {
    const item = villageImageFilenames[i];
    const createdPhoto = await prisma.photo.create({
      data: {
        albumId: item.album.id,
        uploaderId: adminUser.id,
        imageUrl: `/images/village/${item.file}`,
        thumbnailUrl: `/images/village/${item.file}`,
        caption: item.caption,
        takenYear: item.year,
        status: 'approved',
      },
    });

    if (item.album.id === album1.id && !firstPhotoIdAlbum1) firstPhotoIdAlbum1 = createdPhoto.id;
    if (item.album.id === album2.id && !firstPhotoIdAlbum2) firstPhotoIdAlbum2 = createdPhoto.id;
    if (item.album.id === album3.id && !firstPhotoIdAlbum3) firstPhotoIdAlbum3 = createdPhoto.id;
  }

  if (firstPhotoIdAlbum1) await prisma.album.update({ where: { id: album1.id }, data: { coverPhotoId: firstPhotoIdAlbum1 } });
  if (firstPhotoIdAlbum2) await prisma.album.update({ where: { id: album2.id }, data: { coverPhotoId: firstPhotoIdAlbum2 } });
  if (firstPhotoIdAlbum3) await prisma.album.update({ where: { id: album3.id }, data: { coverPhotoId: firstPhotoIdAlbum3 } });

  console.log('✅ Đã nạp danh sách Album và toàn bộ 40 ảnh thực tế của làng.');

  // 6. Tạo Sự kiện làng (Events)
  await prisma.event.create({
    data: {
      title: 'Lễ hội Đình Làng & Ngày Hội Đoàn Kết TDP 9 Thuận Lộc 2026',
      description: 'Lễ hội truyền thống đầu xuân và họp mặt con em đồng hương khắp mọi miền Tổ quốc về dự.',
      eventDate: new Date('2026-03-04T07:30:00Z'),
      location: 'Nhà văn hóa & Sân Đình TDP 9 Thuận Lộc, TX Hồng Lĩnh',
      coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      createdById: adminUser.id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Giải Bóng Chuyền Mở Rộng Chào Mừng Ngày Hội Làng 2026',
      description: 'Giải đấu thể thao giao lưu sôi nổi giữa các cụm dân cư và thanh niên xa quê.',
      eventDate: new Date('2026-03-24T08:00:00Z'),
      location: 'Sân Thể Thao TDP 9 Thuận Lộc',
      coverImageUrl: '/images/village/486669654_9667039090022304_8533644671297434351_n.jpg',
      createdById: adminUser.id,
    },
  });

  // 7. Tạo Danh bạ Đồng hương với thông tin của Admin Nguyễn Trọng Long
  const villagersData = [
    {
      fullName: 'Nguyễn Trọng Long',
      region: 'Hà Tĩnh (TDP 9 Thuận Lộc)',
      phonePublic: true,
      contactInfo: '0832991002 (Zalo / ĐT Admin)',
      generationBranch: 'Họ Nguyễn Trọng — TDP 9 Thuận Lộc',
      userId: adminUser.id,
    },
    {
      fullName: 'Hoàng Minh Tuấn',
      region: 'Hà Tĩnh (TX Hồng Lĩnh)',
      phonePublic: true,
      contactInfo: '0988.765.432',
      generationBranch: 'Họ Hoàng — TDP 9 Thuận Lộc',
      userId: modUser.id,
    },
    {
      fullName: 'Nguyễn Thị Mai',
      region: 'Hà Nội',
      phonePublic: false,
      contactInfo: '0903.111.222',
      generationBranch: 'Họ Nguyễn — TDP 9 Thuận Lộc',
      userId: memberUser1.id,
    },
    {
      fullName: 'Trần Văn An',
      region: 'TP. Hồ Chí Minh',
      phonePublic: true,
      contactInfo: '0977.888.999',
      generationBranch: 'Họ Trần — TDP 9 Thuận Lộc',
      userId: memberUser2.id,
    },
    {
      fullName: 'Phan Đình Dũng',
      region: 'Hà Nội',
      phonePublic: true,
      contactInfo: '0913.555.777',
      generationBranch: 'Họ Phan — TDP 9 Thuận Lộc',
    },
    {
      fullName: 'Lê Văn Trọng',
      region: 'Đà Nẵng',
      phonePublic: true,
      contactInfo: '0905.333.444',
      generationBranch: 'Họ Lê — TDP 9 Thuận Lộc',
    },
  ];

  for (const item of villagersData) {
    await prisma.villagerDirectory.create({ data: item });
  }

  console.log('✅ Đã nạp dữ liệu Danh bạ đồng hương.');
  console.log('🎉 Hoàn tất quá trình Seed dữ liệu mẫu cho Làng Giao Tác (TDP 9 Thuận Lộc, TX Hồng Lĩnh)!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
