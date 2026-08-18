const bcrypt = require('bcryptjs');

async function runAutoSeed(prisma) {
  try {
    console.log('🌾 Đang đồng bộ toàn diện dữ liệu mẫu Làng Giao Tác (TDP 9 Thuận Lộc)...');

    const passwordHash = await bcrypt.hash('123456', 10);

    // 1. Đảm bảo tài khoản Admin (Nguyễn Trọng Long) luôn tồn tại
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@langgiaotac.vn' },
      update: {
        fullName: 'Nguyễn Trọng Long',
        passwordHash,
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
        passwordHash,
        role: 'admin',
        hometownGroup: 'TDP 9 Thuận Lộc (Làng Giao Tác)',
        currentLocation: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh',
        bio: 'Quản trị viên Cổng thông tin Làng Giao Tác — Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh. SĐT: 0832991002',
        avatarUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
        isVerified: true,
      },
    });

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
          ancestorName: 'Tiên tổ Nguyễn Trọng Đại Lang',
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

        // Tạo cây phả hệ mẫu 3 đời cho Họ Nguyễn Trọng
        if (clan.slug === 'ho-nguyen-trong') {
          // Đời 1: Cụ Thủy tổ
          const doi1 = await prisma.genealogyMember.create({
            data: {
              clanId: clan.id,
              fullName: 'Nguyễn Trọng Đại Lang (Cụ Thủy Tổ)',
              gender: 'male',
              generation: 1,
              branchName: 'Thủy Tổ Chi Bộ',
              birthYear: '1660',
              deathYear: '1735',
              spouseName: 'Bà Lê Thị Phúc',
              tombLocation: 'Gò Đống Mả Cả, Núi Hồng Lĩnh',
              careerHonor: 'Tiền khai canh lập ấp Làng Giao Tác',
              biography: 'Khai khẩn đất hoang, dựng ấp và lập nên chi họ Nguyễn Trọng đầu tiên tại làng.',
              orderIndex: 1,
            },
          });

          // Đời 2: Các cụ chi trưởng và chi thứ
          const doi2_1 = await prisma.genealogyMember.create({
            data: {
              clanId: clan.id,
              parentId: doi1.id,
              fullName: 'Nguyễn Trọng Văn (Cụ Đời 2 - Chi Trưởng)',
              gender: 'male',
              generation: 2,
              branchName: 'Chi Trưởng',
              birthYear: '1695',
              deathYear: '1768',
              spouseName: 'Bà Trần Thị Hiền',
              tombLocation: 'Khu nghĩa trang dòng họ',
              careerHonor: 'Hương sư giảng dạy chữ Nho',
              orderIndex: 1,
            },
          });

          const doi2_2 = await prisma.genealogyMember.create({
            data: {
              clanId: clan.id,
              parentId: doi1.id,
              fullName: 'Nguyễn Trọng Võ (Cụ Đời 2 - Chi Thứ)',
              gender: 'male',
              generation: 2,
              branchName: 'Chi Thứ Hai',
              birthYear: '1702',
              deathYear: '1775',
              spouseName: 'Bà Phan Thị Lan',
              careerHonor: 'Đội trưởng tuần tra bảo vệ đê làng',
              orderIndex: 2,
            },
          });

          // Đời 3
          await prisma.genealogyMember.create({
            data: {
              clanId: clan.id,
              parentId: doi2_1.id,
              fullName: 'Nguyễn Trọng Phúc (Đời 3 - Chi Trưởng)',
              gender: 'male',
              generation: 3,
              branchName: 'Chi Trưởng',
              birthYear: '1730',
              deathYear: '1802',
              spouseName: 'Bà Nguyễn Thị Dung',
              careerHonor: 'Thủ từ trông coi Nhà thờ họ',
              orderIndex: 1,
            },
          });

          await prisma.genealogyMember.create({
            data: {
              clanId: clan.id,
              parentId: doi2_2.id,
              fullName: 'Nguyễn Trọng Lộc (Đời 3 - Chi Thứ)',
              gender: 'male',
              generation: 3,
              branchName: 'Chi Thứ Hai',
              birthYear: '1738',
              deathYear: '1810',
              spouseName: 'Bà Hoàng Thị Mai',
              orderIndex: 1,
            },
          });
        }
      }
    }

    // 8. Khởi tạo Chiến dịch Quỹ Quê Hương & Khuyến Học
    const fundCount = await prisma.fundCampaign.count();
    if (fundCount === 0) {
      const fund1 = await prisma.fundCampaign.create({
        data: {
          title: 'Quỹ Khuyến Học & Tiếp Sức Tài Năng Làng Giao Tác 2026-2027',
          slug: 'quy-khuyen-hoc-2026',
          description: 'Trao học bổng cho các em học sinh đỗ Đại học, học sinh giỏi cấp Tỉnh/Quốc gia và tiếp sức cho các hoàn cảnh khó khăn vươn lên trong học tập.',
          targetAmount: 50000000,
          raisedAmount: 18500000,
          bankName: 'MBBANK',
          bankAccount: '0912345678',
          bankAccountName: 'BAN CAN SU TDP 9 THUAN LOC',
          qrCodePrefix: 'GIAOTAC KHUYENHOC',
          coverImageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
        },
      });

      // Tạo một số khoản công đức mẫu minh bạch
      await prisma.fundDonation.createMany({
        data: [
          {
            campaignId: fund1.id,
            donorName: 'Gia đình ông Nguyễn Trọng Hùng',
            donorClan: 'Họ Nguyễn Trọng — Hà Nội',
            amount: 5000000,
            message: 'Chúc các cháu con em Làng Giao Tác học giỏi, thành tài làm rạng danh quê hương!',
            isVerified: true,
          },
          {
            campaignId: fund1.id,
            donorName: 'Bà Phan Thị Mai',
            donorClan: 'Họ Phan Sỹ — TP. Hồ Chí Minh',
            amount: 3000000,
            message: 'Ủng hộ các cháu hiếu học vượt khó.',
            isVerified: true,
          },
          {
            campaignId: fund1.id,
            donorName: 'Hội đồng hương Giao Tác tại Đà Nẵng',
            donorClan: 'Con em xa quê',
            amount: 10000000,
            message: 'Tiếp sức tài năng trẻ quê nhà Thuận Lộc.',
            isVerified: true,
          },
          {
            campaignId: fund1.id,
            donorName: 'Bác Lê Văn Dũng',
            donorClan: 'Họ Lê — TDP 9 Thuận Lộc',
            amount: 500000,
            message: 'Góp chút tấm lòng cho phong trào khuyến học.',
            isVerified: true,
          },
        ],
      });

      await prisma.fundCampaign.create({
        data: {
          title: 'Quỹ Tôn Tạo Cảnh Quan Đình Làng & Khu Thể Thao TDP 9',
          slug: 'quy-ton-tao-dinh-lang',
          description: 'Sửa sang sân đình, lắp đặt hệ thống đèn chiếu sáng năng lượng mặt trời và ghế đá quanh giếng cổ cho bà con sinh hoạt cộng đồng.',
          targetAmount: 80000000,
          raisedAmount: 32000000,
          bankName: 'MBBANK',
          bankAccount: '0912345678',
          bankAccountName: 'BAN CAN SU TDP 9 THUAN LOC',
          qrCodePrefix: 'GIAOTAC DINHLANG',
          coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
        },
      });
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

    // 10. Khởi tạo Sổ Tang & Cáo Phó Mẫu
    const obitCount = await prisma.obituary.count();
    if (obitCount === 0) {
      const obit1 = await prisma.obituary.create({
        data: {
          deceasedName: 'Cụ Bà Nguyễn Thị Lương',
          aliasName: 'Cụ Cố Lương (Thân mẫu ông Nguyễn Trọng Thành)',
          age: 92,
          clanName: 'Họ Nguyễn Trọng',
          diedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 ngày trước
          funeralTime: '07h00 ngày 15 tháng 07 năm 2026',
          burialTime: '14h30 cùng ngày',
          cemeteryPlace: 'Nghĩa trang xứ Đồng Làng Giao Tác — TDP 9 Thuận Lộc',
          biography: 'Cụ bà Nguyễn Thị Lương trọn đời tận tụy vì gia đình, làng xóm, sống đức độ, hiền hậu, nuôi dạy con cháu thành đạt.',
          coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
        },
      });

      await prisma.condolence.createMany({
        data: [
          {
            obituaryId: obit1.id,
            senderName: 'Hội đồng hương Giao Tác tại Hà Nội',
            senderFrom: 'Hà Nội',
            message: 'Xin thành kính dâng nén tâm nhang tiễn biệt Cụ về cõi vĩnh hằng và gửi lời chia buồn sâu sắc tới toàn thể tang quyến.',
            incenseCount: 3,
          },
          {
            obituaryId: obit1.id,
            senderName: 'Gia đình cháu Phan Sỹ Đức',
            senderFrom: 'TP. Hồ Chí Minh',
            message: 'Vô cùng thương tiếc Cụ. Cầu mong linh hồn Cụ an nghỉ ngàn thu nơi cõi Phật.',
            incenseCount: 1,
          },
        ],
      });
    }

    console.log('🎉 Hoàn tất đồng bộ toàn bộ dữ liệu mẫu 8 Dòng họ, Quỹ, Chợ Quê và Sổ Tang!');
    return { seeded: true, message: 'Đã đồng bộ toàn bộ dữ liệu hệ thống thành công.' };
  } catch (err) {
    console.error('❌ Lỗi khi tự động khởi tạo dữ liệu:', err.message);
    return { seeded: false, error: err.message };
  }
}

module.exports = { runAutoSeed };

