import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAWH81komGJI2PZyN__thKkNZYV7GUFDY8",
  authDomain: "lang-giao-tac-tdp9.firebaseapp.com",
  projectId: "lang-giao-tac-tdp9",
  storageBucket: "lang-giao-tac-tdp9.firebasestorage.app",
  messagingSenderId: "549706105377",
  appId: "1:549706105377:web:9f34d4a0de95da3f639960",
  measurementId: "G-XG8WRKDW3N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function decodeHtmlEntities(text) {
  if (!text) return '';
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function scrapeWardNewsPage(page = 1) {
  const targetUrl =
    page > 1
      ? `https://namhonglinh.hatinh.gov.vn/vi/chuyen-muc/tin-tuc---su-kien?page=${page}`
      : `https://namhonglinh.hatinh.gov.vn/vi/chuyen-muc/tin-tuc---su-kien`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) return [];
    const html = await response.text();
    const articles = [];
    const itemBlocks = html.split(/class=["'](?:post-item|item|post-show)/i);

    for (let i = 1; i < itemBlocks.length; i++) {
      const block = itemBlocks[i];
      const linkMatch = block.match(/href=["'](\/vi\/bai-viet\/[^"']+)["']/i);
      const imgMatch = block.match(/src=["'](\/namhonglinh\/Others\/[^"']+)["']/i);
      const titleMatch =
        block.match(/<h4[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h4>/i) ||
        block.match(/alt=["']([^"']+)["']/i);
      const contentMatch = block.match(/<p\s+class=["']content[^"']*["']>([\s\S]*?)<\/p>/i);
      const timeMatch = block.match(/<span\s+class=["']info-post-times["'][^>]*>([\s\S]*?)<\/span>/i);

      if (linkMatch && titleMatch) {
        const relativeUrl = linkMatch[1];
        const originalUrl = `https://namhonglinh.hatinh.gov.vn${relativeUrl}`;
        const rawTitle = titleMatch[1].replace(/<[^>]*>?/gm, '');
        const title = decodeHtmlEntities(rawTitle);

        if (!title || title.length < 5) continue;
        if (articles.some((a) => a.originalUrl === originalUrl || a.title === title)) continue;

        const rawImg = imgMatch ? imgMatch[1] : '';
        const imageUrl = rawImg
          ? `https://namhonglinh.hatinh.gov.vn${rawImg}`
          : '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg';
        const summary = contentMatch
          ? decodeHtmlEntities(contentMatch[1].replace(/<[^>]*>?/gm, ''))
          : 'Tin tức sự kiện chính thức công bố tại Phường Nam Hồng Lĩnh, thị xã Hồng Lĩnh, tỉnh Hà Tĩnh.';
        const timeStr = timeMatch
          ? decodeHtmlEntities(timeMatch[1].replace(/<[^>]*>?/gm, ''))
          : 'Tháng 8/2026';

        articles.push({
          title,
          originalUrl,
          imageUrl,
          summary,
          timeStr,
          source: 'Cổng TTĐT Phường Nam Hồng Lĩnh',
        });
      }
    }

    return articles;
  } catch (error) {
    console.error(`[Scraper] Lỗi cào trang ${page}:`, error.message);
    return [];
  }
}

async function runSeed() {
  console.log('🌾 Bắt đầu nạp toàn bộ Tin tức, Sự kiện, Bài viết và Dữ liệu lên Cloud Firestore...');

  console.log('📡 Đang cào các bài viết mới nhất từ https://namhonglinh.hatinh.gov.vn...');
  const crawledArticles = [];
  for (let p = 1; p <= 4; p++) {
    const list = await scrapeWardNewsPage(p);
    console.log(`  -> Trang ${p}: tìm thấy ${list.length} bài viết.`);
    for (const art of list) {
      if (!crawledArticles.some((x) => x.originalUrl === art.originalUrl || x.title === art.title)) {
        crawledArticles.push(art);
      }
    }
  }
  console.log(`✅ Tổng cộng cào được ${crawledArticles.length} bài viết từ Cổng TTĐT Phường.`);

  const villageAnnouncements = [
    {
      id: 'news-le-hoi-2026',
      slug: 'ke-hoach-to-chuc-le-hoi-dinh-lang-gap-mat-ba-con-tdp9-thuan-loc-2026',
      title: 'Kế hoạch tổ chức Lễ hội Đình Làng & Gặp mặt bà con TDP 9 Thuận Lộc xuân 2026',
      isOfficial: true,
      source: 'Ban Cán sự TDP 9 Thuận Lộc',
      publishedAt: new Date().toISOString(),
      imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      contentHtml: `
        <div class="space-y-4">
          <p class="lead font-medium text-stone-900">Kính gửi toàn thể bà con nhân dân Tổ dân phố 9 (Làng Giao Tác xưa), xã Thuận Lộc cùng con em đồng hương khắp mọi miền!</p>
          <p>Ban Cán sự TDP 9 phối hợp cùng Ban Khánh tiết Đình làng trân trọng thông báo chương trình <strong>Lễ hội truyền thống và Ngày hội Đại đoàn kết năm 2026</strong>:</p>
          <ul class="list-disc pl-6 space-y-1.5">
            <li><strong>Thời gian:</strong> Rằm tháng Giêng âm lịch.</li>
            <li><strong>Địa điểm:</strong> Nhà văn hóa & Quần thể Đình Làng Giao Tác (TDP 9, Thuận Lộc, TX Hồng Lĩnh).</li>
            <li><strong>Nội dung:</strong> Dâng hương tế thần nông, biểu dương các gia đình văn hóa tiêu biểu, trao học bổng khuyến học cho học sinh đỗ đại học và giao lưu thể thao bóng chuyền, kéo co.</li>
          </ul>
          <p class="p-3 bg-amber-50 rounded-xl border border-amber-200">Mọi thông tin chi tiết xin liên hệ Trưởng ban: <strong>Nguyễn Trọng Long</strong> — SĐT: <strong>0832991002</strong>.</p>
        </div>
      `,
    },
    {
      id: 'news-tuyen-duong-hoa',
      slug: 'phat-dong-phong-trao-xay-dung-tuyen-duong-hoa-kieu-mau-tdp9',
      title: 'Phát động phong trào xây dựng tuyến đường hoa kiểu mẫu sáng - xanh - sạch - đẹp',
      isOfficial: true,
      source: 'Chi hội Phụ nữ & Đoàn Thanh niên TDP 9',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
      contentHtml: `
        <div class="space-y-4">
          <p class="lead font-medium text-stone-900">Nhằm duy trì và nâng cao tiêu chí đô thị văn minh tại TDP 9 Thuận Lộc, Chi hội Phụ nữ và Đoàn Thanh niên phát động bà con toàn tổ:</p>
          <ol class="list-decimal pl-6 space-y-1.5">
            <li>Tổng dọn vệ sinh dọc các trục đường chính và ngõ xóm vào sáng Chủ nhật hàng tuần.</li>
            <li>Trồng bổ sung các bồn hoa mười giờ, hoa chiều tím và cây cảnh dọc tuyến đường trung tâm.</li>
            <li>Giữ gìn cảnh quan quanh khu vực Giếng cổ và Đình làng sạch sẽ, văn minh.</li>
          </ol>
        </div>
      `,
    },
    {
      id: 'news-quy-khuyen-hoc',
      slug: 'tiep-nhan-ung-ho-quy-khuyen-hoc-khuyen-tai-tdp9-thuan-loc',
      title: 'Tiếp nhận ủng hộ Quỹ Khuyến học khuyến tài Làng Giao Tác — TDP 9 Thuận Lộc',
      isOfficial: true,
      source: 'Ban Khuyến học TDP 9',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
      contentHtml: `
        <div class="space-y-4">
          <p class="lead font-medium text-stone-900">Quỹ Khuyến học TDP 9 Thuận Lộc trân trọng tri ân tấm lòng vàng của các gia đình, dòng tộc và con em xa quê đã luôn quan tâm, động viên thế hệ trẻ làng quê nỗ lực học tập, rèn luyện thành tài.</p>
          <p>Danh sách ủng hộ được cập nhật minh bạch tại Nhà văn hóa và trên Cổng thông tin làng.</p>
        </div>
      `,
    },
  ];

  console.log('📝 Đang nạp dữ liệu bài viết vào Firestore...');
  let wardCount = 0;
  for (const item of crawledArticles) {
    const slug = slugify(item.title);
    const docId = `ward_${slug.substring(0, 80)}`;
    const articlePayload = {
      id: docId,
      title: item.title,
      slug,
      originalUrl: item.originalUrl,
      imageUrl: item.imageUrl,
      summary: item.summary,
      timeStr: item.timeStr,
      source: item.source,
      isOfficial: true,
      publishedAt: new Date().toISOString(),
      contentHtml: `
        <div class="ward-news-article space-y-6">
          <div class="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-xs text-red-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div class="space-y-0.5">
              <div class="font-bold text-red-900">🏛️ NGUỒN CHÍNH THỐNG: CỔNG THÔNG TIN ĐIỆN TỬ PHƯỜNG NAM HỒNG LĨNH</div>
              <p class="text-stone-600 text-[11px]">Thời gian công bố: <strong>${item.timeStr || 'Tháng 8/2026'}</strong> | Thị xã Hồng Lĩnh, Hà Tĩnh</p>
            </div>
            <a href="${item.originalUrl}" target="_blank" rel="noopener noreferrer" class="shrink-0 px-3.5 py-1.5 rounded-xl bg-red-900 hover:bg-red-800 text-yellow-200 font-bold text-xs shadow-xs transition-colors flex items-center space-x-1">
              <span>Xem Bài Gốc ↗</span>
            </a>
          </div>
          ${item.imageUrl ? `<div class="rounded-2xl overflow-hidden shadow-warm border border-stone-200 max-h-[460px] bg-stone-100"><img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover" /></div>` : ''}
          <div class="lead p-4 bg-amber-50/60 rounded-xl border-l-4 border-red-800 text-stone-800 font-medium text-sm sm:text-base leading-relaxed">
            ${item.summary}
          </div>
          <div class="text-stone-700 leading-relaxed space-y-4 text-sm sm:text-base">
            <p>Bản tin chính thức được phát hành và thông tin rộng rãi đến toàn thể bà con nhân dân tại các Tổ dân phố trên địa bàn Phường Nam Hồng Lĩnh và Làng Giao Tác (TDP 9).</p>
            <p>Để tra cứu văn bản gốc, các quyết định chỉ đạo và hồ sơ liên quan, bà con có thể truy cập trực tiếp bài viết gốc trên Cổng thông tin điện tử Phường Nam Hồng Lĩnh tại địa chỉ: <a href="${item.originalUrl}" target="_blank" rel="noopener noreferrer" class="text-red-900 font-bold underline break-all">${item.originalUrl}</a>.</p>
          </div>
        </div>
      `,
    };

    await setDoc(doc(db, 'ward_articles', docId), articlePayload, { merge: true });
    await setDoc(doc(db, 'news', docId), articlePayload, { merge: true });
    wardCount++;
  }
  console.log(`✅ Đã lưu ${wardCount} bài viết Phường vào cả 2 collection 'ward_articles' & 'news'!`);

  for (const n of villageAnnouncements) {
    await setDoc(doc(db, 'news', n.id), n, { merge: true });
  }
  console.log(`✅ Đã lưu ${villageAnnouncements.length} thông báo làng vào collection 'news'!`);

  console.log('🎬 Đang nạp Bài viết cộng đồng & Video tư liệu...');
  const posts = [
    {
      id: 'post-dinh-lang-video',
      title: 'Video Giới Thiệu Đình Làng Giao Tác — Di Tích Lịch Sử Văn Hóa Cấp Tỉnh Tại Thôn Thuận Giang, Xã Thuận Lộc',
      slug: 'video-gioi-thieu-dinh-lang-giao-tac-di-tich-lich-su-van-hoa',
      category: 'Dòng họ - Gia phả',
      coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      contentHtml: `
        <p class="lead font-medium text-base sm:text-lg text-primary-dark">
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
        <p>3. Năm 2018: Công nhận Di tích Lịch sử - Văn hóa cấp tỉnh.</p>
      `,
      status: 'published',
      viewCount: 1250,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'post-ha-tinh-nho-ve',
      title: 'Ca Khúc: Hà Tĩnh Nhớ Về — Giai Điệu Quê Hương Dưới Chân Núi Hồng Lĩnh',
      slug: 'ca-khuc-ha-tinh-nho-ve-giai-dieu-que-huong',
      category: 'Ký ức tuổi thơ',
      coverImageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
      contentHtml: `
        <p class="lead font-medium text-base sm:text-lg text-primary-dark">
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
        <p>Dưới chân dãy núi Hồng Lĩnh 99 ngọn và bên dòng nước mát lành, những lời ca mộc mạc nuôi dưỡng tâm hồn bao thế hệ con em quê hương vững bước đi khắp muôn nơi.</p>
      `,
      status: 'published',
      viewCount: 980,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: 'post-tu-lang-giao-tac-den-tdp9',
      title: 'Từ Làng Giao Tác xưa đến Tổ dân phố 9 Thuận Lộc ngày nay: Dòng chảy ký ức và tự hào',
      slug: 'tu-lang-giao-tac-xua-den-to-dan-pho-9-thuan-loc-ngay-nay',
      category: 'Đổi thay của làng',
      coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      contentHtml: `
        <h3>Làng Giao Tác — Nơi cội nguồn máu thịt của bao thế hệ</h3>
        <p>Dù theo thời gian, tên gọi hành chính nay là <strong>Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh</strong>, nhưng trong tâm thức của mỗi người con sinh ra và lớn lên nơi đây, cái tên <em>Làng Giao Tác</em> vẫn luôn là niềm tự hào sâu lắng.</p>
        <p>Từ những mái ngói rêu phong, cây đa, giếng cổ cho đến những con đường bê tông thảm nhựa khang trang hôm nay, quê hương đang từng ngày chuyển mình mạnh mẽ nhưng vẫn vẹn nguyên nghĩa tình người miền Trung.</p>
      `,
      status: 'published',
      viewCount: 680,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'post-ky-uc-gieng-nuoc-cay-bang',
      title: 'Ký ức giếng nước cổ cây bàng và những trưa hè ríu rít tiếng ve',
      slug: 'ky-uc-gieng-nuoc-co-cay-bang-va-nhung-trua-he-riu-rit-tieng-ve',
      category: 'Ký ức tuổi thơ',
      coverImageUrl: '/images/village/474096867_1006185811543793_8014259646970075430_n.jpg',
      contentHtml: `
        <p>Mỗi khi hè về, tôi lại nhớ da diết bóng mát của cây bàng và dòng nước mát lành từ giếng cổ làng Giao Tác.</p>
        <p>Ngày xưa, giếng làng là nơi gặp gỡ chuyện trò rôm rả của các bà các mẹ, là nơi lũ trẻ con chúng tôi tụ tập trốn ngủ trưa chơi đùa.</p>
      `,
      status: 'published',
      viewCount: 420,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  for (const p of posts) {
    await setDoc(doc(db, 'posts', p.id), p, { merge: true });
  }
  console.log(`✅ Đã nạp ${posts.length} bài viết cộng đồng vào collection 'posts'!`);

  console.log('📅 Đang nạp Sự kiện làng...');
  const events = [
    {
      id: 'event-le-hoi-dinh-lang-2026',
      title: 'Lễ hội Đình Làng & Ngày Hội Đoàn Kết TDP 9 Thuận Lộc 2026',
      description: 'Lễ hội truyền thống đầu xuân và họp mặt con em đồng hương khắp mọi miền Tổ quốc về dự.',
      eventDate: '2026-03-04T07:30:00Z',
      location: 'Nhà văn hóa & Sân Đình TDP 9 Thuận Lộc, TX Hồng Lĩnh',
      coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'event-giai-bong-chuyen-2026',
      title: 'Giải Bóng Chuyền Mở Rộng Chào Mừng Ngày Hội Làng 2026',
      description: 'Giải đấu thể thao giao lưu sôi nổi giữa các cụm dân cư và thanh niên xa quê.',
      eventDate: '2026-03-24T08:00:00Z',
      location: 'Sân Thể Thao TDP 9 Thuận Lộc',
      coverImageUrl: '/images/village/486669654_9667039090022304_8533644671297434351_n.jpg',
      createdAt: new Date().toISOString(),
    },
  ];

  for (const e of events) {
    await setDoc(doc(db, 'events', e.id), e, { merge: true });
  }
  console.log(`✅ Đã nạp ${events.length} sự kiện vào collection 'events'!`);

  console.log('👥 Đang nạp Danh bạ đồng hương & Ban cán sự...');
  const villagers = [
    {
      id: 'villager-nguyen-trong-long',
      fullName: 'Nguyễn Trọng Long',
      region: 'Hà Tĩnh (TDP 9 Thuận Lộc)',
      phonePublic: true,
      contactInfo: '0832991002 (Zalo / ĐT Admin)',
      generationBranch: 'Họ Nguyễn Trọng — TDP 9 Thuận Lộc',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'villager-hoang-minh-tuan',
      fullName: 'Hoàng Minh Tuấn',
      region: 'Hà Tĩnh (TX Hồng Lĩnh)',
      phonePublic: true,
      contactInfo: '0988.765.432',
      generationBranch: 'Họ Hoàng — TDP 9 Thuận Lộc',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'villager-nguyen-thi-mai',
      fullName: 'Nguyễn Thị Mai',
      region: 'Hà Nội',
      phonePublic: false,
      contactInfo: '0903.111.222',
      generationBranch: 'Họ Nguyễn — TDP 9 Thuận Lộc',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'villager-tran-van-an',
      fullName: 'Trần Văn An',
      region: 'TP. Hồ Chí Minh',
      phonePublic: true,
      contactInfo: '0977.888.999',
      generationBranch: 'Họ Trần — TDP 9 Thuận Lộc',
      createdAt: new Date().toISOString(),
    },
  ];

  for (const v of villagers) {
    await setDoc(doc(db, 'villagers', v.id), v, { merge: true });
  }
  console.log(`✅ Đã nạp ${villagers.length} người vào collection 'villagers'!`);

  console.log('🛍️ Đang nạp Sản phẩm Chợ Quê & Đặc sản...');
  const products = [
    {
      id: 'prod-cu-do',
      title: 'Kẹo Cu Đơ Hà Tĩnh Truyền Thống (Đậm Vị Mật Mía & Gừng Tươi)',
      category: 'DacSan',
      price: '45.000đ / hộp 5 chiếc',
      description: 'Kẹo Cu Đơ giòn rụm, mật mía nguyên chất quyện gừng cay nồng và lạc thơm bùi nướng thủ công.',
      imageUrl: '/images/village/486669654_9667039090022304_8533644671297434351_n.jpg',
      sellerName: 'Hộ Bác Nguyễn Trọng An',
      sellerPhone: '0988123456',
      sellerZalo: '0988123456',
      address: 'Xóm Trung, TDP 9 Thuận Lộc',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-cam-bu',
      title: 'Cam Bù Núi Hồng Lĩnh (Trái Mọng Nước, Vị Ngọt Thanh)',
      category: 'NongSan',
      price: '60.000đ / kg',
      description: 'Cam bù trồng theo tiêu chuẩn VietGAP, thu hoạch chính vụ tại vùng đồi chân núi Hồng Lĩnh.',
      imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
      sellerName: 'Nhà Vườn Phan Sỹ Hùng',
      sellerPhone: '0977234567',
      sellerZalo: '0977234567',
      address: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-ruou-nep',
      title: 'Rượu Nếp Quê Lên Men Lá Cổ Truyền Làng Giao Tác',
      category: 'DacSan',
      price: '70.000đ / lít',
      description: 'Rượu nếp cái hoa vàng nấu thủ công bằng nồi đồng truyền thống, êm say, thơm nồng đượm vị quê hương.',
      imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
      sellerName: 'Cơ Sở Rượu Quê Nguyễn Duy',
      sellerPhone: '0915345678',
      sellerZalo: '0915345678',
      address: 'Xóm Đông, TDP 9 Thuận Lộc',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod-mat-mia',
      title: 'Mật Mía Nấu Thủ Công Nguyên Chất (Thơm Dẻo Tự Nhiên)',
      category: 'AmThuc',
      price: '50.000đ / chai 1 lít',
      description: 'Mật mía đỏ sánh đậm đà, không chất bảo quản, chuyên dùng kho cá, làm bánh ngào, chè sen quê.',
      imageUrl: '/images/village/474096867_1006185811543793_8014259646970075430_n.jpg',
      sellerName: 'Hộ Cô Trần Thị Mai',
      sellerPhone: '0944567890',
      sellerZalo: '0944567890',
      address: 'TDP 9 Thuận Lộc',
      createdAt: new Date().toISOString(),
    },
  ];

  for (const pr of products) {
    await setDoc(doc(db, 'market_products', pr.id), pr, { merge: true });
  }
  console.log(`✅ Đã nạp ${products.length} sản phẩm chợ quê vào collection 'market_products'!`);

  console.log('💰 Đang nạp Quỹ quê hương...');
  const funds = [
    {
      id: 'fund-khuyen-hoc',
      title: 'Quỹ Khuyến Học & Tiếp Sức Tài Năng Làng Giao Tác 2026-2027',
      slug: 'quy-khuyen-hoc-2026',
      description: 'Trao học bổng cho các em học sinh đỗ Đại học, học sinh giỏi cấp Tỉnh/Quốc gia và tiếp sức cho các hoàn cảnh khó khăn.',
      targetAmount: 50000000,
      raisedAmount: 0,
      bankName: 'MBBANK',
      bankAccount: '0832991002',
      bankAccountName: 'NGUYEN TRONG LONG',
      qrCodePrefix: 'GIAOTAC KHUYENHOC',
      coverImageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'fund-ton-tao-dinh-lang',
      title: 'Quỹ Tôn Tạo Cảnh Quan Đình Làng & Khu Thể Thao TDP 9',
      slug: 'quy-ton-tao-dinh-lang',
      description: 'Sửa sang sân đình, lắp đặt hệ thống đèn chiếu sáng năng lượng mặt trời và ghế đá quanh giếng cổ cho bà con sinh hoạt cộng đồng.',
      targetAmount: 80000000,
      raisedAmount: 0,
      bankName: 'MBBANK',
      bankAccount: '0832991002',
      bankAccountName: 'NGUYEN TRONG LONG',
      qrCodePrefix: 'GIAOTAC DINHLANG',
      coverImageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
      createdAt: new Date().toISOString(),
    },
  ];

  for (const f of funds) {
    await setDoc(doc(db, 'fund_campaigns', f.id), f, { merge: true });
  }
  console.log(`✅ Đã nạp ${funds.length} chiến dịch quỹ vào collection 'fund_campaigns'!`);

  console.log('\n🎉🎉🎉 HOÀN TẤT ĐỒNG BỘ TOÀN BỘ DỮ LIỆU LÊN CLOUD FIRESTORE!');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Lỗi khi đồng bộ Firestore:', err);
  process.exit(1);
});
