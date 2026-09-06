const bcrypt = require('bcryptjs');

async function runAutoSeed(prisma) {
  try {
    console.log('🌾 Đang đồng bộ toàn diện dữ liệu mẫu Làng Giao Tác (TDP 9 Thuận Lộc)...');

    const isProduction = process.env.NODE_ENV === 'production';
    let adminUser = null;

    if (isProduction) {
      // TRÊN MÔI TRƯỜNG PRODUCTION:
      // 1. Kiểm tra xem đã có tài khoản Admin nào trong hệ thống chưa
      adminUser = await prisma.user.findFirst({
        where: { role: 'admin' },
      });

      if (!adminUser) {
        const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
        if (!initialPassword || initialPassword.trim().length < 6) {
          console.warn('⚠️ [PRODUCTION SECURITY WARNING] Chưa có tài khoản Admin trong hệ thống và chưa cấu hình biến môi trường ADMIN_INITIAL_PASSWORD (hoặc mật khẩu quá ngắn)!');
          console.warn('👉 Hãy thiết lập ADMIN_INITIAL_PASSWORD trong Render Environment Variables để khởi tạo tài khoản Admin an toàn.');
        } else {
          const prodPasswordHash = await bcrypt.hash(initialPassword.trim(), 10);
          adminUser = await prisma.user.create({
            data: {
              fullName: 'Nguyễn Trọng Long',
              email: 'admin@langgiaotac.vn',
              passwordHash: prodPasswordHash,
              role: 'admin',
              hometownGroup: 'TDP 9 Thuận Lộc (Làng Giao Tác)',
              currentLocation: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh',
              bio: 'Quản trị viên Cổng thông tin Làng Giao Tác — Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh. SĐT: 0832991002',
              avatarUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
              isVerified: true,
            },
          });
          console.log('✅ [PRODUCTION] Đã khởi tạo tài khoản Admin an toàn từ biến môi trường ADMIN_INITIAL_PASSWORD.');
        }
      } else {
        console.log('🔒 [PRODUCTION] Đã tìm thấy tài khoản Admin hiện có. Giữ nguyên mật khẩu và dữ liệu.');
      }
    } else {
      // TRÊN MÔI TRƯỜNG LOCAL DEV:
      const devPasswordHash = await bcrypt.hash('123456', 10);
      adminUser = await prisma.user.upsert({
        where: { email: 'admin@langgiaotac.vn' },
        update: {
          fullName: 'Nguyễn Trọng Long',
          role: 'admin',
          hometownGroup: 'TDP 9 Thuận Lộc (Làng Giao Tác)',
          currentLocation: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh',
          bio: 'Quản trị viên Cổng thông tin Làng Giao Tác — Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh. SĐT: 0832991002',
          avatarUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
          isVerified: true,
        },
        create: {
          fullName: 'Nguyễn Trọng Long',
          email: 'admin@langgiaotac.vn',
          passwordHash: devPasswordHash,
          role: 'admin',
          hometownGroup: 'TDP 9 Thuận Lộc (Làng Giao Tác)',
          currentLocation: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh',
          bio: 'Quản trị viên Cổng thông tin Làng Giao Tác — Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh. SĐT: 0832991002',
          avatarUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
          isVerified: true,
        },
      });
    }

    // 2. Mốc Lịch sử (HistoryTimeline)
    const historyCount = await prisma.historyTimeline.count();
    if (historyCount === 0) {
      const historyData = [
        {
          yearLabel: 'Năm 1685',
          title: 'Khai hoang lập ấp Làng Giao Tác dưới chân núi Hồng Lĩnh',
          description: 'Các bậc tiền nhân khai khẩn vùng đất bãi bồi trù phú dưới chân núi Hồng Lĩnh, đặt nền móng dựng ấp, lập làng mang tên Giao Tác.',
          imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
          orderIndex: 1,
        },
        {
          yearLabel: 'Năm 1875',
          title: 'Khởi dựng Đình Làng Giao Tác (Đời vua Tự Đức thứ 28)',
          description: 'Nhờ sự đóng góp tâm huyết của cụ Chánh Do và nhân dân trong vùng, ngôi Đình làng Giao Tác uy nghiêm được khởi dựng tại thôn Thuận Giang.',
          imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
          orderIndex: 2,
        },
        {
          yearLabel: 'Năm 1930',
          title: 'Thành lập Chi bộ Đảng làng Giao Tác (20/2/1930)',
          description: 'Dưới mái đình cổ kính, Chi bộ Đảng làng Giao Tác – tiền thân của Đảng bộ xã Thuận Lộc – chính thức ra đời ngày 20/2/1930.',
          imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
          orderIndex: 3,
        },
        {
          yearLabel: 'Năm 1960 - 2014',
          title: 'Quá trình di dời, bảo tồn và phục dựng đình làng',
          description: 'Đến năm 2014, đình làng được trùng tu, phục dựng và đưa trở về đúng vị trí khởi thủy tại thôn Thuận Giang (TDP 9).',
          imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
          orderIndex: 4,
        },
        {
          yearLabel: 'Năm 2018',
          title: 'Đón nhận Bằng Di tích Lịch sử - Văn hóa Cấp Tỉnh',
          description: 'Đình làng Giao Tác vinh dự được UBND tỉnh Hà Tĩnh công nhận là Di tích Lịch sử - Văn hóa cấp tỉnh.',
          imageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
          orderIndex: 5,
        },
        {
          yearLabel: 'Hiện tại',
          title: 'Tổ Dân Phố 9 Thuận Lộc — Đô thị văn minh kiểu mẫu',
          description: '100% đường làng ngõ xóm được bê tông hóa, thảm nhựa và rực rỡ cờ hoa; nhân dân đồng lòng giữ gìn nếp sống văn hóa thuần phong mỹ tục.',
          imageUrl: '/images/village/474372745_1006185908210450_6706806661278267034_n.jpg',
          orderIndex: 6,
        },
      ];

      for (const item of historyData) {
        await prisma.historyTimeline.create({ data: item });
      }
    }

    // 3. Tin tức chính quyền (News)
    await prisma.news.upsert({
      where: { slug: 'ke-hoach-to-chuc-le-hoi-dinh-lang-gap-mat-ba-con-tdp9-thuan-loc-2026' },
      update: {},
      create: {
        authorId: adminUser.id,
        title: 'Kế hoạch tổ chức Lễ hội Đình Làng & Gặp mặt bà con TDP 9 Thuận Lộc xuân 2026',
        slug: 'ke-hoach-to-chuc-le-hoi-dinh-lang-gap-mat-ba-con-tdp9-thuan-loc-2026',
        contentHtml: `<p>Ban Cán sự TDP 9 trân trọng thông báo chương trình Lễ hội truyền thống và Ngày hội Đại đoàn kết năm 2026.</p>
        <p>Mọi thông tin chi tiết xin liên hệ Trưởng ban: <strong>Nguyễn Trọng Long</strong> — SĐT: <strong>0832991002</strong>.</p>`,
        source: 'Ban Cán sự TDP 9 Thuận Lộc',
        isOfficial: true,
        publishedAt: new Date(),
      },
    });

    await prisma.news.upsert({
      where: { slug: 'phat-dong-phong-trao-xay-dung-tuyen-duong-hoa-kieu-mau-tdp9' },
      update: {},
      create: {
        authorId: adminUser.id,
        title: 'Phát động phong trào xây dựng tuyến đường hoa kiểu mẫu sáng - xanh - sạch - đẹp',
        slug: 'phat-dong-phong-trao-xay-dung-tuyen-duong-hoa-kieu-mau-tdp9',
        contentHtml: `<p>Nhằm duy trì và nâng cao tiêu chí đô thị văn minh tại TDP 9 Thuận Lộc, phát động phong trào giữ gìn ngõ xóm và cảnh quan quanh giếng cổ.</p>`,
        source: 'Chi hội Phụ nữ & Đoàn Thanh niên TDP 9',
        isOfficial: true,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    });

    // Các tin tức sự kiện tháng 8 từ Cổng TTĐT Phường Nam Hồng Lĩnh
    const wardNewsSeedData = [
      {
        slug: 'khai-mac-dien-tap-chien-dau-phuong-nam-hong-linh-trong-khu-vuc-phong-thu-nam-2026',
        title: 'Khai mạc diễn tập chiến đấu Phường Nam Hồng Lĩnh trong khu vực phòng thủ năm 2026',
        contentHtml: `<p class="lead">Sáng nay 24/8, Ban Tổ chức diễn tập phường Nam Hồng Lĩnh đã tổ chức khai mạc diễn tập chiến đấu phường trong khu vực phòng thủ năm 2026.</p>
        <p>Cuộc diễn tập nhằm nâng cao năng lực lãnh đạo, chỉ đạo điều hành của cấp ủy, chính quyền địa phương, trình độ tổ chức chỉ huy, hiệp đồng tác chiến của các lực lượng trong trạng thái sẵn sàng chiến đấu và các tình huống khẩn cấp.</p>
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs"><strong>Nguồn chính thức:</strong> Cổng Thông Tin Điện Tử Phường Nam Hồng Lĩnh</div>`,
        source: 'Cổng TTĐT Phường Nam Hồng Lĩnh',
        publishedAt: new Date('2026-08-24T08:00:00Z'),
      },
      {
        slug: 'phuong-nam-hong-linh-to-chuc-kham-sang-loc-mien-phi-cho-nguoi-dan',
        title: 'Phường Nam Hồng Lĩnh tổ chức khám sàng lọc miễn phí cho người dân',
        contentHtml: `<p class="lead">Phường Nam Hồng Lĩnh phối hợp với các đơn vị y tế tổ chức chương trình khám sàng lọc sức khỏe tổng quát, tư vấn và cấp phát thuốc miễn phí cho bà con nhân dân và người cao tuổi.</p>
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs"><strong>Nguồn chính thức:</strong> Cổng Thông Tin Điện Tử Phường Nam Hồng Lĩnh</div>`,
        source: 'Cổng TTĐT Phường Nam Hồng Lĩnh',
        publishedAt: new Date('2026-08-22T08:00:00Z'),
      },
      {
        slug: 'gian-hang-phuong-nam-hong-linh-quang-ba-ruou-phuc-hoi-tai-hoi-cho-trien-lam-san-pham-cnnt-tieu-bieu-khu-vuc-mien-trung---tay-nguyen-nam-2026',
        title: 'Gian hàng phường Nam Hồng Lĩnh quảng bá rượu Phúc hồi tại hội chợ triển lãm sản phẩm CNNT tiêu biểu khu vực miền Trung - Tây Nguyên năm 2026',
        contentHtml: `<p class="lead">Gian hàng trưng bày, giới thiệu sản phẩm rượu Phúc Hồi truyền thống và các đặc sản OCOP tiêu biểu của Phường Nam Hồng Lĩnh thu hút đông đảo du khách và đối tác tham quan, kết nối tiêu thụ.</p>
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs"><strong>Nguồn chính thức:</strong> Cổng Thông Tin Điện Tử Phường Nam Hồng Lĩnh</div>`,
        source: 'Cổng TTĐT Phường Nam Hồng Lĩnh',
        publishedAt: new Date('2026-08-21T09:00:00Z'),
      },
      {
        slug: 'hdnd-phuong-nam-hong-linh-tang-cuong-giam-sat-don-doc-giai-quyet-kien-nghi-cu-tri',
        title: 'HĐND phường Nam Hồng Lĩnh: tăng cường giám sát, đôn đốc giải quyết kiến nghị cử tri',
        contentHtml: `<p class="lead">Sáng nay 20/8, Thường trực HĐND phường Nam Hồng Lĩnh tổ chức phiên họp thường kỳ tháng 8, đánh giá kết quả hoạt động tháng 8, triển khai nhiệm vụ trọng tâm tháng 9/2026 và giải quyết thấu đáo các kiến nghị của cử tri.</p>
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs"><strong>Nguồn chính thức:</strong> Cổng Thông Tin Điện Tử Phường Nam Hồng Lĩnh</div>`,
        source: 'Cổng TTĐT Phường Nam Hồng Lĩnh',
        publishedAt: new Date('2026-08-20T08:00:00Z'),
      },
      {
        slug: 'thong-bao-ve-viec-dieu-tiet-xa-nuoc-qua-tran-ho-chua-nuoc-da-bac-030011277',
        title: 'Thông báo về việc điều tiết xả nước qua tràn Hồ chứa nước Đá bạc',
        contentHtml: `<p class="lead">Do ảnh hưởng của mưa lớn, UBND Phường Nam Hồng Lĩnh thông báo phương án điều tiết xả nước qua tràn Hồ chứa nước Đá Bạc để đảm bảo an toàn công trình và vùng hạ du.</p>
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs"><strong>Nguồn chính thức:</strong> Cổng Thông Tin Điện Tử Phường Nam Hồng Lĩnh</div>`,
        source: 'Cổng TTĐT Phường Nam Hồng Lĩnh',
        publishedAt: new Date('2026-08-20T07:00:00Z'),
      },
      {
        slug: 'ubnd-phuong-nam-hong-thong-bao-thoi-gian-nghi-le-quoc-khanh-nam-2026',
        title: 'UBND phường Nam Hồng Lĩnh thông báo thời gian nghỉ lễ Quốc khánh năm 2026',
        contentHtml: `<p class="lead">UBND phường Nam Hồng Lĩnh thông báo lịch nghỉ Lễ Quốc khánh 2/9 năm 2026 đối với cán bộ, công chức, viên chức và người lao động, đồng thời phân công lịch trực đảm bảo an ninh trật tự trên địa bàn.</p>
        <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs"><strong>Nguồn chính thức:</strong> Cổng Thông Tin Điện Tử Phường Nam Hồng Lĩnh</div>`,
        source: 'Cổng TTĐT Phường Nam Hồng Lĩnh',
        publishedAt: new Date('2026-08-18T08:00:00Z'),
      },
    ];

    for (const item of wardNewsSeedData) {
      await prisma.news.upsert({
        where: { slug: item.slug },
        update: {
          title: item.title,
          contentHtml: item.contentHtml,
          source: item.source,
          publishedAt: item.publishedAt,
        },
        create: {
          authorId: adminUser.id,
          title: item.title,
          slug: item.slug,
          contentHtml: item.contentHtml,
          source: item.source,
          isOfficial: true,
          publishedAt: item.publishedAt,
        },
      });
    }

    // 4. Bài viết cộng đồng (Posts) — Dùng UPSERT đảm bảo luôn xuất bản
    await prisma.post.upsert({
      where: { slug: 'video-gioi-thieu-dinh-lang-giao-tac-di-tich-lich-su-van-hoa' },
      update: { status: 'published' },
      create: {
        authorId: adminUser.id,
        title: 'Video Giới Thiệu Đình Làng Giao Tác — Di Tích Lịch Sử Văn Hóa Cấp Tỉnh Tại Thôn Thuận Giang, Xã Thuận Lộc',
        slug: 'video-gioi-thieu-dinh-lang-giao-tac-di-tich-lich-su-van-hoa',
        category: 'Dòng họ - Gia phả',
        coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
        contentHtml: `<p class="lead font-medium text-base sm:text-lg text-primary-dark">
          Video tư liệu đặc sắc giới thiệu về <strong>Đình làng Giao Tác</strong> — một di tích lịch sử văn hóa quan trọng tọa lạc tại thôn Thuận Giang (nay thuộc Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh).
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
        <p>1. Lịch sử hình thành: Đình dựng năm 1875 đời vua Tự Đức 28 nhờ cụ Chánh Do và dân làng.</p>
        <p>2. Ngày 20/2/1930: Thành lập Chi bộ Đảng làng Giao Tác.</p>
        <p>3. Năm 2018: Công nhận Di tích Lịch sử - Văn hóa cấp tỉnh.</p>`,
        status: 'published',
        viewCount: 1250,
        publishedAt: new Date(),
      },
    });

    await prisma.post.upsert({
      where: { slug: 'ca-khuc-ha-tinh-nho-ve-giai-dieu-que-huong' },
      update: { status: 'published' },
      create: {
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
        </div>`,
        status: 'published',
        viewCount: 980,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    });

    await prisma.post.upsert({
      where: { slug: 'tu-lang-giao-tac-xua-den-to-dan-pho-9-thuan-loc-ngay-nay' },
      update: { status: 'published' },
      create: {
        authorId: adminUser.id,
        title: 'Từ Làng Giao Tác xưa đến Tổ dân phố 9 Thuận Lộc ngày nay: Dòng chảy ký ức và tự hào',
        slug: 'tu-lang-giao-tac-xua-den-to-dan-pho-9-thuan-loc-ngay-nay',
        category: 'Đổi thay của làng',
        coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
        contentHtml: `<h3>Làng Giao Tác — Nơi cội nguồn máu thịt của bao thế hệ</h3>
        <p>Dù theo thời gian, tên gọi hành chính nay là <strong>Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh</strong>, nhưng trong tâm thức của mỗi người con sinh ra và lớn lên nơi đây, cái tên <em>Làng Giao Tác</em> vẫn luôn là niềm tự hào sâu lắng.</p>`,
        status: 'published',
        viewCount: 680,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });

    // 5. Albums & Photos
    const albumCount = await prisma.album.count();
    if (albumCount === 0) {
      const album1 = await prisma.album.create({
        data: {
          title: 'Cảnh sắc Làng Giao Tác — TDP 9 Thuận Lộc xưa và nay',
          description: 'Cảnh quan, di tích, con đường làng và đời sống sinh hoạt của bà con TDP 9 Thuận Lộc.',
          eventDate: new Date('2025-06-15'),
          createdById: adminUser.id,
        },
      });

      const album2 = await prisma.album.create({
        data: {
          title: 'Lễ hội Đình Làng & Hoạt động văn hóa truyền thống',
          description: 'Các dịp tế lễ, rước thần và hội làng đầu xuân.',
          eventDate: new Date('2025-02-20'),
          createdById: adminUser.id,
        },
      });

      const villageImageFilenames = [
        { file: '484215892_9601885749870972_6761004858315934829_n.jpg', caption: 'Toàn cảnh không gian văn hóa Đình Làng Giao Tác — TDP 9 Thuận Lộc', year: 2025, album: album1 },
        { file: '476468343_1020712713424436_7762543762157463751_n.jpg', caption: 'Bà con tề tựu trong ngày hội văn hóa truyền thống làng quê', year: 2025, album: album2 },
        { file: '476776564_1020712773424430_8938770403532008026_n.jpg', caption: 'Tuyến đường hoa sáng - xanh - sạch - đẹp TDP 9 Thuận Lộc', year: 2024, album: album1 },
        { file: '480212312_1025661522929555_8709853623689778697_n.jpg', caption: 'Cánh đồng trù phú và cảnh sắc thanh bình dưới chân núi Hồng Lĩnh', year: 2024, album: album1 },
        { file: '474096867_1006185811543793_8014259646970075430_n.jpg', caption: 'Khu vực Giếng cổ và cây xanh rợp bóng mát đầu làng', year: 2024, album: album1 },
      ];

      let firstPhotoId = null;
      for (const item of villageImageFilenames) {
        const p = await prisma.photo.create({
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
        if (!firstPhotoId) firstPhotoId = p.id;
      }
      if (firstPhotoId) await prisma.album.update({ where: { id: album1.id }, data: { coverPhotoId: firstPhotoId } });
    }

    // 7. Khởi tạo 8 Dòng họ Làng Giao Tác & Cây Phả Hệ Mẫu
    const clanCount = await prisma.clan.count();
    if (clanCount === 0) {
      const clansData = [
        {
          name: 'Họ Nguyễn Trọng',
          slug: 'ho-nguyen-trong',
          ancestorName: 'Ông Tổ: Nguyễn Trọng',
          originStory: 'Khởi nguồn từ thế kỷ 17, dòng họ Nguyễn Trọng là một trong những dòng họ tiền khai lập ấp tại vùng đất Giao Tác, kế thừa truyền thống hiếu học và cần cù.',
          templeAddress: 'Xóm Trung, TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
          leaderName: 'Cụ Nguyễn Trọng Thắng (Trưởng tộc)',
          leaderPhone: '0912345678',
          deathAnniversary: '16 tháng Giêng (Âm lịch)',
          coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
        },
        {
          name: 'Họ Nguyễn Duy',
          slug: 'ho-nguyen-duy',
          ancestorName: 'Tiên tổ Nguyễn Duy Công',
          originStory: 'Dòng họ Nguyễn Duy có bề dày truyền thống yêu nước, hiếu nghĩa, đóng góp nhiều công sức xây dựng làng xóm.',
          templeAddress: 'Xóm Đông, TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
          leaderName: 'Ông Nguyễn Duy Hùng (Trưởng ban khánh tiết)',
          leaderPhone: '0987654321',
          deathAnniversary: '10 tháng Hai (Âm lịch)',
          coverImageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
        },
        {
          name: 'Họ Nguyễn Huy',
          slug: 'ho-nguyen-huy',
          ancestorName: 'Tiên tổ Nguyễn Huy Tự',
          originStory: 'Dòng họ Nguyễn Huy rạng danh khoa bảng, con cháu nhiều đời đỗ đạt phụng sự quê hương đất nước.',
          templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
          leaderName: 'Ông Nguyễn Huy Hoàng',
          deathAnniversary: '15 tháng Tám (Âm lịch)',
          coverImageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
        },
        {
          name: 'Họ Phan Sỹ',
          slug: 'ho-phan-sy',
          ancestorName: 'Tiên tổ Phan Sỹ Bá',
          originStory: 'Dòng họ Phan Sỹ nổi tiếng với tinh thần trượng nghĩa, đoàn kết và giữ gìn gia phong dòng tộc vững bền.',
          templeAddress: 'Xóm Đoài, TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
          leaderName: 'Ông Phan Sỹ Minh',
          deathAnniversary: '08 tháng Giêng (Âm lịch)',
          coverImageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
        },
        {
          name: 'Họ Nguyễn Văn',
          slug: 'ho-nguyen-van',
          ancestorName: 'Tiên tổ Nguyễn Văn Đức',
          originStory: 'Dòng họ Nguyễn Văn gắn liền với đồng ruộng trù phú và sự phát triển nông nghiệp hưng thịnh của làng Giao Tác.',
          templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
          leaderName: 'Ông Nguyễn Văn Thành',
          deathAnniversary: '20 tháng Mười Một (Âm lịch)',
          coverImageUrl: '/images/village/474096867_1006185811543793_8014259646970075430_n.jpg',
        },
        {
          name: 'Họ Phạm Hữu',
          slug: 'ho-pham-huu',
          ancestorName: 'Tiên tổ Phạm Hữu Cương',
          originStory: 'Dòng họ Phạm Hữu có truyền thống gìn giữ nề nếp gia phong, tương thân tương ái, con cháu muôn phương luôn hướng về nguồn cội.',
          templeAddress: 'Xóm Giếng, TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
          leaderName: 'Ông Phạm Hữu Nghị',
          deathAnniversary: '12 tháng Chạp (Âm lịch)',
          coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
        },
        {
          name: 'Họ Trần Đình',
          slug: 'ho-tran-dinh',
          ancestorName: 'Tiên tổ Trần Đình Phúc',
          originStory: 'Dòng họ Trần Đình mang hào khí kiên trung, nhiều thế hệ con cháu tham gia bảo vệ và xây dựng Tổ quốc.',
          templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
          leaderName: 'Ông Trần Đình Quý',
          deathAnniversary: '25 tháng Hai (Âm lịch)',
          coverImageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
        },
        {
          name: 'Họ Lê',
          slug: 'ho-le',
          ancestorName: 'Tiên tổ Lê Văn Chính',
          originStory: 'Dòng họ Lê sinh sống lâu đời bên dòng sông mát lành, đoàn kết gắn bó keo sơn cùng bà con làng Giao Tác.',
          templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
          leaderName: 'Ông Lê Văn Tuấn',
          deathAnniversary: '18 tháng Giêng (Âm lịch)',
          coverImageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
        },
      ];

      for (const item of clansData) {
        const clan = await prisma.clan.create({ data: item });

        // Tạo cây phả hệ ban đầu: Chỉ để lại duy nhất một mình Ông Tổ: Nguyễn Trọng
        if (clan.slug === 'ho-nguyen-trong') {
          await prisma.genealogyMember.create({
            data: {
              clanId: clan.id,
              fullName: 'Ông Tổ: Nguyễn Trọng',
              gender: 'male',
              generation: 1,
              branchName: 'Thủy Tổ / Khởi Tổ',
              birthYear: '1660',
              deathYear: '',
              spouseName: '',
              tombLocation: 'Núi Hồng Lĩnh, TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
              careerHonor: 'Cụ Thủy Tổ Tiền Khai Khẩn Dòng Họ Nguyễn Trọng',
              biography: 'Cụ Thủy Tổ tiền khai canh lập nghiệp, khởi dựng cơ đồ dòng họ Nguyễn Trọng tại Làng Giao Tác.',
              orderIndex: 1,
            },
          });
        }
      }
    }

    // Đảm bảo Họ Nguyễn Trọng có đầy đủ 153 thành viên 11 đời theo bản đồ gia phả tháng 6/2022
    try {
      const nguyenTrongClan = await prisma.clan.findUnique({ where: { slug: 'ho-nguyen-trong' } });
      if (nguyenTrongClan) {
        await prisma.clan.update({
          where: { id: nguyenTrongClan.id },
          data: {
            ancestorName: 'Cụ Thủy Tổ: Nguyễn Trọng Chất (Chánh thất: Vũ Thị Mai)',
            originStory:
              'Dòng họ Nguyễn Trọng — Chi họ Nguyễn Trọng Chất là một trong những cội nguồn lâu đời tại Làng Giao Tác (nay là Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh). Trải qua 11 đời hưng thịnh với 153 đinh nam, con cháu đời đời phát huy truyền thống hiếu học, đoàn kết, trung hiếu và phụng sự quê hương đất nước.',
            leaderName: 'Ông Nguyễn Trọng Long & Ban Khánh Tiết Dòng Họ',
            leaderPhone: '0832991002',
            coverImageUrl: '/images/genealogy/gia-pha-ho-nguyen-trong-chat.png',
          },
        });

        const currentMemberCount = await prisma.genealogyMember.count({
          where: { clanId: nguyenTrongClan.id },
        });

        if (currentMemberCount < 100) {
          await prisma.genealogyMember.deleteMany({ where: { clanId: nguyenTrongClan.id } });
          const seedMembers = require('./nguyenTrongSeed.json');
          const idToDbId = {};

          for (const item of seedMembers) {
            const created = await prisma.genealogyMember.create({
              data: {
                clanId: nguyenTrongClan.id,
                parentId: item.parentId ? idToDbId[item.parentId] || null : null,
                fullName: item.fullName,
                gender: item.gender || 'male',
                generation: item.generation,
                branchName: item.branchName,
                birthYear: item.birthYear || null,
                deathYear: item.deathYear || null,
                spouseName: item.spouseName || null,
                tombLocation: item.tombLocation || null,
                careerHonor: item.careerHonor || null,
                biography: item.biography || null,
                orderIndex: item.orderIndex || 0,
              },
            });
            idToDbId[item.id] = created.id;
          }
          console.log(`✅ Đã nạp thành công toàn bộ ${seedMembers.length} thành viên 11 đời Chi Họ Nguyễn Trọng Chất!`);
        }
      }
    } catch (e) {
      console.warn('Lỗi kiểm tra cập nhật dòng họ Nguyễn Trọng:', e.message);
    }

    // 8. Khởi tạo Chiến dịch Quỹ Quê Hương & Khuyến Học (Reset về 0đ và không có đóng góp ảo)
    const fundCount = await prisma.fundCampaign.count();
    if (fundCount === 0) {
      await prisma.fundCampaign.create({
        data: {
          title: 'Quỹ Khuyến Học & Tiếp Sức Tài Năng Làng Giao Tác 2026-2027',
          slug: 'quy-khuyen-hoc-2026',
          description: 'Trao học bổng cho các em học sinh đỗ Đại học, học sinh giỏi cấp Tỉnh/Quốc gia và tiếp sức cho các hoàn cảnh khó khăn vươn lên trong học tập.',
          targetAmount: 50000000,
          raisedAmount: 0,
          bankName: 'MBBANK',
          bankAccount: '0912345678',
          bankAccountName: 'BAN CAN SU TDP 9 THUAN LOC',
          qrCodePrefix: 'GIAOTAC KHUYENHOC',
          coverImageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
        },
      });

      await prisma.fundCampaign.create({
        data: {
          title: 'Quỹ Tôn Tạo Cảnh Quan Đình Làng & Khu Thể Thao TDP 9',
          slug: 'quy-ton-tao-dinh-lang',
          description: 'Sửa sang sân đình, lắp đặt hệ thống đèn chiếu sáng năng lượng mặt trời và ghế đá quanh giếng cổ cho bà con sinh hoạt cộng đồng.',
          targetAmount: 80000000,
          raisedAmount: 0,
          bankName: 'MBBANK',
          bankAccount: '0912345678',
          bankAccountName: 'BAN CAN SU TDP 9 THUAN LOC',
          qrCodePrefix: 'GIAOTAC DINHLANG',
          coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
        },
      });
    }

    // Xóa sạch các khoản đóng góp mẫu cũ và reset raisedAmount về 0
    try {
      await prisma.fundDonation.deleteMany({});
      await prisma.fundCampaign.updateMany({
        data: { raisedAmount: 0 },
      });
      console.log('✅ Đã reset toàn bộ Quỹ quê hương về 0đ và xóa sạch các khoản đóng mẫu.');
    } catch (err) {
      console.warn('Lỗi reset Quỹ:', err.message);
    }

    // 9. Khởi tạo Sản phẩm Chợ Quê & Đặc Sản OCOP Làng Giao Tác
    const marketCount = await prisma.marketProduct.count();
    if (marketCount === 0) {
      await prisma.marketProduct.createMany({
        data: [
          {
            title: 'Kẹo Cu Đơ Hà Tĩnh Truyền Thống (Đậm Vị Mật Mía & Gừng Tươi)',
            category: 'DacSan',
            price: '45.000đ / hộp 5 chiếc',
            description: 'Kẹo Cu Đơ giòn rụm, mật mía nguyên chất quyện gừng cay nồng và lạc thơm bùi nướng thủ công.',
            imageUrl: '/images/village/486669654_9667039090022304_8533644671297434351_n.jpg',
            sellerName: 'Hộ Bác Nguyễn Trọng An',
            sellerPhone: '0988123456',
            sellerZalo: '0988123456',
            address: 'Xóm Trung, TDP 9 Thuận Lộc',
          },
          {
            title: 'Cam Bù Núi Hồng Lĩnh (Trái Mọng Nước, Vị Ngọt Thanh)',
            category: 'NongSan',
            price: '60.000đ / kg',
            description: 'Cam bù trồng theo tiêu chuẩn VietGAP, thu hoạch chính vụ tại vùng đồi chân núi Hồng Lĩnh.',
            imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
            sellerName: 'Nhà Vườn Phan Sỹ Hùng',
            sellerPhone: '0977234567',
            sellerZalo: '0977234567',
            address: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
          },
          {
            title: 'Rượu Nếp Quê Lên Men Lá Cổ Truyền Làng Giao Tác',
            category: 'DacSan',
            price: '70.000đ / lít',
            description: 'Rượu nếp cái hoa vàng nấu thủ công bằng nồi đồng truyền thống, êm say, thơm nồng đượm vị quê hương.',
            imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
            sellerName: 'Cơ Sở Rượu Quê Nguyễn Duy',
            sellerPhone: '0915345678',
            sellerZalo: '0915345678',
            address: 'Xóm Đông, TDP 9 Thuận Lộc',
          },
          {
            title: 'Mật Mía Nấu Thủ Công Nguyên Chất (Thơm Dẻo Tự Nhiên)',
            category: 'AmThuc',
            price: '50.000đ / chai 1 lít',
            description: 'Mật mía đỏ sánh đậm đà, không chất bảo quản, chuyên dùng kho cá, làm bánh ngào, chè sen quê.',
            imageUrl: '/images/village/474096867_1006185811543793_8014259646970075430_n.jpg',
            sellerName: 'Hộ Cô Trần Thị Mai',
            sellerPhone: '0944567890',
            sellerZalo: '0944567890',
            address: 'TDP 9 Thuận Lộc',
          },
        ],
      });
    }

    // 10. Dọn sạch toàn bộ dữ liệu mẫu phần Sổ Tang & Cáo Phó (chờ thông tin thực tế từ bà con/Ban cán sự)
    try {
      await prisma.condolence.deleteMany({});
      await prisma.obituary.deleteMany({});
      console.log('✅ Đã xóa toàn bộ dữ liệu Sổ tang mẫu theo yêu cầu.');
    } catch (err) {
      console.warn('Lỗi xóa Sổ tang:', err.message);
    }

    console.log('🎉 Hoàn tất đồng bộ toàn bộ dữ liệu hệ thống!');
    return { seeded: true, message: 'Đã đồng bộ toàn bộ dữ liệu hệ thống thành công.' };
  } catch (err) {
    console.error('❌ Lỗi khi tự động khởi tạo dữ liệu:', err.message);
    return { seeded: false, error: err.message };
  }
}

module.exports = { runAutoSeed };

