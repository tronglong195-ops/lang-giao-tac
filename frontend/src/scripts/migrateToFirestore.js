import { doc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import nguyenTrongMembers from '../data/nguyenTrongGenealogy.json';
import { nguyenTrongClanInfo } from '../data/clanGenealogyData';

export const initialClans = [
  {
    id: 'clan_ho_nguyen_trong',
    name: 'Họ Nguyễn Trọng',
    slug: 'ho-nguyen-trong',
    ancestorName: 'Cụ Thủy Tổ: Nguyễn Trọng Chất (Chánh thất: Vũ Thị Mai)',
    originStory: 'Dòng họ Nguyễn Trọng (Chi họ Nguyễn Trọng Chất) định cư và khai hoang tại Làng Giao Tác (nay là TDP 9 Thuận Lộc) trải qua 11 đời hưng thịnh.',
    templeAddress: 'Nhà thờ Chi họ Nguyễn Trọng, TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
    deathAnniversary: '16 tháng Giêng (Âm lịch)',
    leaderName: 'Nguyễn Trọng Long',
    leaderPhone: '0832991002',
  },
  {
    id: 'clan_ho_nguyen_duy',
    name: 'Họ Nguyễn Duy',
    slug: 'ho-nguyen-duy',
    ancestorName: 'Cụ Thủy Tổ: Nguyễn Duy Trinh',
    templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
    deathAnniversary: '10 tháng Giêng (Âm lịch)',
  },
  {
    id: 'clan_ho_nguyen_huy',
    name: 'Họ Nguyễn Huy',
    slug: 'ho-nguyen-huy',
    ancestorName: 'Cụ Thủy Tổ: Nguyễn Huy Quýnh',
    templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
    deathAnniversary: '12 tháng Hai (Âm lịch)',
  },
  {
    id: 'clan_ho_phan_sy',
    name: 'Họ Phan Sỹ',
    slug: 'ho-phan-sy',
    ancestorName: 'Cụ Thủy Tổ: Phan Sỹ Thục',
    templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
    deathAnniversary: '15 tháng Giêng (Âm lịch)',
  },
  {
    id: 'clan_ho_nguyen_van',
    name: 'Họ Nguyễn Văn',
    slug: 'ho-nguyen-van',
    ancestorName: 'Cụ Thủy Tổ: Nguyễn Văn Giai',
    templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
    deathAnniversary: '18 tháng Hai (Âm lịch)',
  },
  {
    id: 'clan_ho_pham_huu',
    name: 'Họ Phạm Hữu',
    slug: 'ho-pham-huu',
    ancestorName: 'Cụ Thủy Tổ: Phạm Hữu Kính',
    templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
    deathAnniversary: '20 tháng Giêng (Âm lịch)',
  },
  {
    id: 'clan_ho_tran_dinh',
    name: 'Họ Trần Đình',
    slug: 'ho-tran-dinh',
    ancestorName: 'Cụ Thủy Tổ: Trần Đình Túc',
    templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
    deathAnniversary: '14 tháng Ba (Âm lịch)',
  },
  {
    id: 'clan_ho_le',
    name: 'Họ Lê',
    slug: 'ho-le',
    ancestorName: 'Cụ Thủy Tổ: Lê Bá Cảnh',
    templeAddress: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
    deathAnniversary: '18 tháng Giêng (Âm lịch)',
  },
];

export const initialTimelines = [
  {
    id: 'timeline-1685',
    yearLabel: 'Năm 1685',
    title: 'Khai hoang lập ấp Làng Giao Tác dưới chân núi Hồng Lĩnh',
    description: 'Các bậc tiền nhân khai khẩn vùng đất bãi bồi trù phú dưới chân núi Hồng Lĩnh, đặt nền móng dựng ấp, lập làng mang tên Giao Tác.',
    imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
    orderIndex: 1,
  },
  {
    id: 'timeline-1875',
    yearLabel: 'Năm 1875',
    title: 'Khởi dựng Đình Làng Giao Tác (Đời vua Tự Đức thứ 28)',
    description: 'Nhờ sự đóng góp tâm huyết của cụ Chánh Do và nhân dân trong vùng, ngôi Đình làng Giao Tác uy nghiêm được khởi dựng tại thôn Thuận Giang.',
    imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
    orderIndex: 2,
  },
  {
    id: 'timeline-1930',
    yearLabel: 'Năm 1930',
    title: 'Thành lập Chi bộ Đảng làng Giao Tác (20/2/1930)',
    description: 'Dưới mái đình cổ kính, Chi bộ Đảng làng Giao Tác – tiền thân của Đảng bộ xã Thuận Lộc – chính thức ra đời ngày 20/2/1930.',
    imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
    orderIndex: 3,
  },
  {
    id: 'timeline-2014',
    yearLabel: 'Năm 1960 - 2014',
    title: 'Quá trình di dời, bảo tồn và phục dựng đình làng',
    description: 'Đến năm 2014, đình làng được trùng tu, phục dựng và đưa trở về đúng vị trí khởi thủy tại thôn Thuận Giang (TDP 9).',
    imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
    orderIndex: 4,
  },
  {
    id: 'timeline-2018',
    yearLabel: 'Năm 2018',
    title: 'Đón nhận Bằng Di tích Lịch sử - Văn hóa cấp Tỉnh',
    description: 'Đình làng Giao Tác vinh dự được UBND tỉnh Hà Tĩnh xếp hạng Di tích Lịch sử - Văn hóa cấp Tỉnh (Quyết định số 299/QĐ-UBND).',
    imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
    orderIndex: 5,
  },
  {
    id: 'timeline-present',
    yearLabel: 'Hiện nay',
    title: 'Phát huy giá trị di sản trong thời kỳ đổi mới',
    description: 'Đình làng là nơi sinh hoạt văn hóa tâm linh thiêng liêng, nơi tổ chức các lễ hội truyền thống, khuyến học và gắn kết cộng đồng bà con trong và ngoài nước.',
    imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
    orderIndex: 6,
  },
];

export const initialNews = [
  {
    id: 'news-le-hoi-2026',
    title: 'Kế hoạch tổ chức Lễ hội Đình Làng & Gặp mặt bà con TDP 9 Thuận Lộc xuân 2026',
    slug: 'ke-hoach-to-chuc-le-hoi-dinh-lang-gap-mat-ba-con-tdp9-thuan-loc-2026',
    contentHtml: `<p>Ban Cán sự TDP 9 trân trọng thông báo chương trình Lễ hội truyền thống và Ngày hội Đại đoàn kết năm 2026.</p>
    <p>Mọi thông tin chi tiết xin liên hệ Trưởng ban: <strong>Nguyễn Trọng Long</strong> — SĐT: <strong>0832991002</strong>.</p>`,
    source: 'Ban Cán sự TDP 9 Thuận Lộc',
    isOfficial: true,
    publishedAt: new Date(),
  },
  {
    id: 'news-tuyen-duong-hoa',
    title: 'Phát động phong trào xây dựng tuyến đường hoa kiểu mẫu sáng - xanh - sạch - đẹp',
    slug: 'phat-dong-phong-trao-xay-dung-tuyen-duong-hoa-kieu-mau-tdp9',
    contentHtml: `<p>Nhằm duy trì và nâng cao tiêu chí đô thị văn minh tại TDP 9 Thuận Lộc, phát động phong trào giữ gìn ngõ xóm và cảnh quan quanh giếng cổ.</p>`,
    source: 'Chi hội Phụ nữ & Đoàn Thanh niên TDP 9',
    isOfficial: true,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export const initialPosts = [
  {
    id: 'post-dinh-lang-video',
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
  },
  {
    id: 'post-ha-tinh-nho-ve',
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
  },
];

/**
 * Hàm nạp toàn diện dữ liệu Làng Giao Tác vào Cloud Firestore
 * @param {Function} onProgress Hàm callback cập nhật tiến trình (nếu có)
 */
export async function seedAllToFirestore(onProgress = console.log) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Chưa cấu hình Firebase! Vui lòng điền thông tin trong tệp .env trước.');
  }

  onProgress('Bắt đầu đồng bộ dữ liệu vào Cloud Firestore...');

  // 1. Nạp danh sách 8 dòng họ (clans)
  onProgress('Đang nạp danh sách 8 dòng họ...');
  for (const clan of initialClans) {
    const clanRef = doc(db, 'clans', clan.id);
    await setDoc(clanRef, {
      ...clan,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  // 2. Nạp toàn bộ 153 thành viên phả hệ họ Nguyễn Trọng
  onProgress('Đang nạp 153 thành viên gia phả dòng họ Nguyễn Trọng...');
  // Firestore batch cho phép tối đa 500 operations mỗi batch
  let batch = writeBatch(db);
  let count = 0;

  for (const m of nguyenTrongMembers) {
    const memberRef = doc(db, 'genealogy_members', m.id);
    batch.set(memberRef, {
      ...m,
      clanId: 'clan_ho_nguyen_trong',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    count++;
    if (count % 400 === 0) {
      await batch.commit();
      batch = writeBatch(db);
    }
  }
  await batch.commit();
  onProgress(`Đã nạp thành công ${count} thành viên gia phả.`);

  // 3. Nạp các mốc lịch sử
  onProgress('Đang nạp mốc lịch sử Làng Giao Tác từ năm 1685...');
  for (const t of initialTimelines) {
    const tRef = doc(db, 'history_timelines', t.id);
    await setDoc(tRef, {
      ...t,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  // 4. Nạp tin tức
  onProgress('Đang nạp tin tức chính quyền...');
  for (const n of initialNews) {
    const nRef = doc(db, 'news', n.id);
    await setDoc(nRef, {
      ...n,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  // 5. Nạp bài viết cộng đồng
  onProgress('Đang nạp bài viết và video tư liệu...');
  for (const p of initialPosts) {
    const pRef = doc(db, 'posts', p.id);
    await setDoc(pRef, {
      ...p,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  // 6. Tạo tài khoản Admin mặc định
  onProgress('Đang thiết lập quyền Quản trị viên...');
  const adminRef = doc(db, 'users', 'admin_default');
  await setDoc(adminRef, {
    id: 'admin_default',
    fullName: 'Nguyễn Trọng Long',
    email: 'admin@langgiaotac.vn',
    role: 'admin',
    hometownGroup: 'TDP 9 Thuận Lộc (Làng Giao Tác)',
    currentLocation: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh',
    bio: 'Quản trị viên Cổng thông tin Làng Giao Tác — Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh. SĐT: 0832991002',
    avatarUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
    isVerified: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  onProgress('🎉 ĐỒNG BỘ TOÀN DIỆN THÀNH CÔNG LÊN CLOUD FIRESTORE!');
  return { success: true };
}
