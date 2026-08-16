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
        currentLocation: 'TDP 9 Thuận Lộc, TX Hồng Lĩnh, Hà Tĩnh',
        bio: 'Quản trị viên Cổng thông tin Làng Giao Tác — Tổ dân phố 9 Thuận Lộc, TX Hồng Lĩnh. SĐT: 0832991002',
        avatarUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
        isVerified: true,
      },
      create: {
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
        <p>Dù theo thời gian, tên gọi hành chính nay là <strong>Tổ dân phố 9, xã Thuận Lộc, thị xã Hồng Lĩnh (Hà Tĩnh)</strong>, nhưng trong tâm thức của mỗi người con sinh ra và lớn lên nơi đây, cái tên <em>Làng Giao Tác</em> vẫn luôn là niềm tự hào sâu lắng.</p>`,
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

    // 6. Danh bạ Đồng hương
    const villagerCount = await prisma.villagerDirectory.count();
    if (villagerCount === 0) {
      await prisma.villagerDirectory.create({
        data: {
          fullName: 'Nguyễn Trọng Long',
          region: 'Hà Tĩnh (TDP 9 Thuận Lộc)',
          phonePublic: true,
          contactInfo: '0832991002 (Zalo / ĐT Admin)',
          generationBranch: 'Họ Nguyễn Trọng — TDP 9 Thuận Lộc',
          userId: adminUser.id,
        },
      });
    }

    console.log('🎉 Hoàn tất đồng bộ toàn bộ dữ liệu mẫu!');
    return { seeded: true, message: 'Đã đồng bộ toàn bộ dữ liệu Lịch sử, Bài viết, Ảnh và tài khoản Admin thành công.' };
  } catch (err) {
    console.error('❌ Lỗi khi tự động khởi tạo dữ liệu:', err.message);
    return { seeded: false, error: err.message };
  }
}

module.exports = { runAutoSeed };
