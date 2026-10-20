import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';
import { tinTucBaiViet } from './data/tinTucBaiViet-2026-10.mjs';
import { albums as fanpageAlbums, posts as fanpagePosts } from './data/albumVaBaiVietFanpage-2026-10.mjs';

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

const existingAlbums = [
  {
    id: 'album_canh_sac',
    title: 'Cảnh sắc Làng Giao Tác — TDP 9 Thuận Lộc xưa và nay',
    description: 'Những góc ảnh chân thực và sống động về cảnh quan, di tích, con đường làng và đời sống sinh hoạt của bà con TDP 9 Thuận Lộc.',
    eventDate: '2025-06-15',
    coverPhotoUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
  },
  {
    id: 'album_le_hoi',
    title: 'Lễ hội Đình Làng & Hoạt động văn hóa truyền thống',
    description: 'Ghi lại những khoảnh khắc trang nghiêm, rộn rã trong các dịp tế lễ, rước thần và hội làng đầu xuân.',
    eventDate: '2025-02-20',
    coverPhotoUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
  },
  {
    id: 'album_the_thao',
    title: 'Phong trào Thể thao & Đoàn kết thanh niên TDP 9',
    description: 'Hình ảnh thi đấu bóng chuyền, bóng đá và ngày hội văn hóa thể thao của con em làng quê.',
    eventDate: '2025-09-02',
    coverPhotoUrl: '/images/village/476328615_1020997653395942_6382946994889025434_n.jpg',
  },
];

const existingPhotos = [
  { file: '484215892_9601885749870972_6761004858315934829_n.jpg', caption: 'Toàn cảnh không gian văn hóa Đình Làng Giao Tác — TDP 9 Thuận Lộc', year: 2025, albumId: 'album_canh_sac' },
  { file: '476468343_1020712713424436_7762543762157463751_n.jpg', caption: 'Bà con tề tựu trong ngày hội văn hóa truyền thống làng quê', year: 2025, albumId: 'album_le_hoi' },
  { file: '476776564_1020712773424430_8938770403532008026_n.jpg', caption: 'Tuyến đường hoa sáng - xanh - sạch - đẹp TDP 9 Thuận Lộc', year: 2024, albumId: 'album_canh_sac' },
  { file: '480212312_1025661522929555_8709853623689778697_n.jpg', caption: 'Cánh đồng trù phú và cảnh sắc thanh bình dưới chân núi Hồng Lĩnh', year: 2024, albumId: 'album_canh_sac' },
  { file: '486784254_9667039123355634_3798108786214067335_n.jpg', caption: 'Các bô lão và đại diện bà con trong buổi lễ tế tổ', year: 2025, albumId: 'album_le_hoi' },
  { file: '474096867_1006185811543793_8014259646970075430_n.jpg', caption: 'Khu vực Giếng cổ và cây xanh rợp bóng mát đầu làng', year: 2024, albumId: 'album_canh_sac' },
  { file: '474232064_1006185604877147_4038067063949471365_n.jpg', caption: 'Hoạt động giao lưu nghĩa tình làng xóm ấm áp', year: 2025, albumId: 'album_le_hoi' },
  { file: '474372745_1006185908210450_6706806661278267034_n.jpg', caption: 'Đường ngõ xóm khang trang sạch đẹp TDP 9', year: 2025, albumId: 'album_canh_sac' },
  { file: '474378266_1006185931543781_77396248245745283_n.jpg', caption: 'Nét kiến trúc chạm khắc tinh xảo tại gian chính điện', year: 2024, albumId: 'album_le_hoi' },
  { file: '474421111_1006186008210440_5033783777592471649_n.jpg', caption: 'Sân bóng chuyền hơi sôi nổi của các cụ cao tuổi TDP 9', year: 2025, albumId: 'album_the_thao' },
  { file: '474431521_1006185794877128_6477157648358525042_n.jpg', caption: 'Đường làng phong quang trong nắng sớm', year: 2024, albumId: 'album_canh_sac' },
  { file: '474618256_1006185671543807_592398539229971510_n.jpg', caption: 'Nhà văn hóa TDP 9 — Điểm hẹn sinh hoạt cộng đồng ấm cúng', year: 2024, albumId: 'album_canh_sac' },
  { file: '474640192_1006185708210470_2161748245763566144_n.jpg', caption: 'Bia đá ghi danh di tích lịch sử văn hóa Làng Giao Tác', year: 2024, albumId: 'album_le_hoi' },
  { file: '474653835_1006185854877122_6062772596489379659_n.jpg', caption: 'Mái ngói rêu phong cổ kính lưu dấu thời gian', year: 2024, albumId: 'album_canh_sac' },
  { file: '474751430_1006185994877108_689360875955685797_n.jpg', caption: 'Trận bóng chuyền giao hữu thanh niên đón chào năm mới', year: 2025, albumId: 'album_the_thao' },
  { file: '474768378_1006185871543787_1197775456003295240_n.jpg', caption: 'Không gian tĩnh lặng, thanh bình nơi góc sân đình', year: 2024, albumId: 'album_canh_sac' },
  { file: '474797040_1006185641543810_1348128362870428514_n.jpg', caption: 'Con em xa xứ về thăm lại mái đình xưa', year: 2025, albumId: 'album_le_hoi' },
  { file: '474932064_1006185764877131_826725838421060677_n.jpg', caption: 'Đoàn rước lễ tiến vào sân đình trong tiếng trống giục', year: 2025, albumId: 'album_le_hoi' },
  { file: '474944889_1006185628210478_5145550262699863261_n.jpg', caption: 'Gặp mặt đầu xuân ấm áp nghĩa tình con em đồng hương', year: 2025, albumId: 'album_le_hoi' },
  { file: '475027591_1006185741543799_4499158087968516087_n.jpg', caption: 'Cổng Đình Làng Giao Tác — Biểu tượng trường tồn của quê hương', year: 2025, albumId: 'album_canh_sac' },
  { file: '475043811_1006185948210446_4600645605423851084_n.jpg', caption: 'Hàng cau vươn cao bên hiên nhà truyền thống', year: 2024, albumId: 'album_canh_sac' },
  { file: '475143398_1006185974877110_7965004144177439328_n.jpg', caption: 'Những nụ cười rạng rỡ của thanh niên trong ngày hội thể thao', year: 2025, albumId: 'album_the_thao' },
  { file: '476212170_1020712613424446_8913952771899120614_n.jpg', caption: 'Lễ dâng hương tri ân tiền nhân khai khẩn lập làng', year: 2025, albumId: 'album_le_hoi' },
  { file: '476229986_1020712653424442_1109156637847395029_n.jpg', caption: 'Khói hương trầm mặc tỏa ngát nơi ban thờ thánh', year: 2025, albumId: 'album_le_hoi' },
  { file: '476263595_1020712630091111_6336582539958739522_n.jpg', caption: 'Đại diện các dòng họ dâng lễ cầu quốc thái dân an', year: 2025, albumId: 'album_le_hoi' },
  { file: '476274646_1020712740091103_6891630125741569421_n.jpg', caption: 'Đường làng rực rỡ cờ hoa mừng ngày hội quê hương', year: 2025, albumId: 'album_canh_sac' },
  { file: '476315510_1020997703395937_3345474320295828456_n.jpg', caption: 'Pha bóng đẹp mắt trên sân thể thao TDP 9', year: 2025, albumId: 'album_the_thao' },
  { file: '476328615_1020997653395942_6382946994889025434_n.jpg', caption: 'Tinh thần thể thao đoàn kết, sôi nổi của các vận động viên', year: 2025, albumId: 'album_the_thao' },
  { file: '476402484_1020997673395940_1874213799638428800_n.jpg', caption: 'Cổ động viên nhiệt tình reo hò cổ vũ các trận cầu kịch tính', year: 2025, albumId: 'album_the_thao' },
  { file: '476442686_1020997746729266_5557761014389033324_n.jpg', caption: 'Trao cờ lưu niệm và giải thưởng phong trào thể thao TDP 9', year: 2025, albumId: 'album_the_thao' },
];

async function seedEverything() {
  console.log('🚀 Bắt đầu nạp toàn bộ Tin tức, Albums ảnh Fanpage & Bài viết lên Firestore...');

  // 1. NẠP 9 BÀI TIN TỨC MỚI (TỪ tinTucBaiViet-2026-10.mjs)
  console.log('\n📰 1. Đang nạp 9 bài tin tức mới...');
  let newsCount = 0;
  for (const n of tinTucBaiViet) {
    const docRef = doc(db, 'news', n.id);
    await setDoc(docRef, { ...n, updatedAt: new Date().toISOString() }, { merge: true });
    newsCount++;
    console.log(`  ✓ [Tin tức] ${n.title}`);
  }

  // 2. NẠP TẤT CẢ ALBUMS (CŨ + MỚI TỪ FANPAGE)
  console.log('\n📸 2. Đang nạp Album ảnh...');
  for (const alb of existingAlbums) {
    const docRef = doc(db, 'albums', alb.id);
    await setDoc(docRef, {
      ...alb,
      updatedAt: new Date().toISOString(),
      createdAt: alb.eventDate || new Date().toISOString(),
    }, { merge: true });
    console.log(`  ✓ [Album cũ] ${alb.title}`);
  }

  const fanpageAlbumMappings = [
    {
      id: 'album_fanpage_dinh_giao_tac',
      title: 'Đình Giao Tác qua ống kính',
      description: fanpageAlbums[0].description,
      eventDate: fanpageAlbums[0].eventDate || '2023-08-01',
      coverPhotoUrl: '/images/album-fanpage/giao-tac-a1.jpg',
      key: 'dinh'
    },
    {
      id: 'album_fanpage_mai_truong',
      title: 'Mái trường & con đường đến lớp',
      description: fanpageAlbums[1].description,
      eventDate: fanpageAlbums[1].eventDate || '2017-10-02',
      coverPhotoUrl: '/images/album-fanpage/giao-tac-b4.jpg',
      key: 'truong'
    }
  ];

  for (const alb of fanpageAlbumMappings) {
    const docRef = doc(db, 'albums', alb.id);
    await setDoc(docRef, {
      id: alb.id,
      title: alb.title,
      description: alb.description,
      eventDate: alb.eventDate,
      coverPhotoUrl: alb.coverPhotoUrl,
      updatedAt: new Date().toISOString(),
      createdAt: alb.eventDate,
    }, { merge: true });
    console.log(`  ✓ [Album Fanpage mới] ${alb.title}`);
  }

  // 3. NẠP TẤT CẢ ẢNH (30 ẢNH CŨ + 12 ẢNH MỚI TỪ FANPAGE)
  console.log('\n🖼️ 3. Đang nạp 42 ảnh tư liệu làng...');
  let photoCount = 0;
  for (let i = 0; i < existingPhotos.length; i++) {
    const p = existingPhotos[i];
    const photoId = `photo_village_${i + 1}`;
    const docRef = doc(db, 'photos', photoId);
    await setDoc(docRef, {
      id: photoId,
      albumId: p.albumId,
      imageUrl: `/images/village/${p.file}`,
      caption: p.caption,
      year: p.year,
      takenYear: p.year,
      status: 'approved',
      uploaderId: 'admin_seed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    photoCount++;
  }

  // 12 ảnh fanpage
  for (const alb of fanpageAlbums) {
    const targetAlbumId = alb.key === 'dinh' ? 'album_fanpage_dinh_giao_tac' : 'album_fanpage_mai_truong';
    for (const ph of alb.photos) {
      const photoId = `photo_fp_${ph.file.replace('.jpg', '')}`;
      const docRef = doc(db, 'photos', photoId);
      await setDoc(docRef, {
        id: photoId,
        albumId: targetAlbumId,
        imageUrl: `/images/album-fanpage/${ph.file}`,
        caption: ph.caption,
        year: ph.takenYear || 2023,
        takenYear: ph.takenYear || 2023,
        status: 'approved',
        uploaderId: 'admin_seed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      photoCount++;
      console.log(`  ✓ [Ảnh Fanpage] ${ph.file} -> ${ph.caption.slice(0, 50)}...`);
    }
  }
  console.log(`✅ Đã nạp thành công ${photoCount} hình ảnh sắc nét.`);

  // 4. NẠP 3 BÀI VIẾT CỘNG ĐỒNG FANPAGE
  console.log('\n📝 4. Đang nạp 3 bài viết cộng đồng tư liệu lịch sử...');
  for (const p of fanpagePosts) {
    const postId = `post_${p.key}`;
    const docRef = doc(db, 'posts', postId);
    await setDoc(docRef, {
      id: postId,
      slug: p.key,
      title: p.title,
      category: p.category || 'Đổi thay của làng',
      coverImageUrl: p.coverImageUrl,
      contentHtml: p.contentHtml,
      status: 'published',
      author: {
        id: 'admin_default',
        fullName: 'Ban biên tập Cổng TT Làng Giao Tác',
        avatarUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
        hometownGroup: 'TDP 9 Thuận Lộc',
        currentLocation: 'Hà Tĩnh',
        bio: 'Ban Cán sự TDP 9 Thuận Lộc'
      },
      authorName: 'Ban biên tập Cổng TT Làng Giao Tác',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log(`  ✓ [Bài viết] ${p.title}`);
  }

  console.log('\n🎉 TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC ĐỒNG BỘ THÀNH CÔNG VÀO CLOUD FIRESTORE!');
  process.exit(0);
}

seedEverything().catch((err) => {
  console.error('❌ Lỗi khi nạp dữ liệu:', err);
  process.exit(1);
});
