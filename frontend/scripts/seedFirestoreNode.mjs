import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function runSeed() {
  console.log('🌾 Bắt đầu nạp dữ liệu Làng Giao Tác lên Cloud Firestore (lang-giao-tac-tdp9)...');

  // Đọc danh sách 153 thành viên
  const jsonPath = path.join(__dirname, '../src/data/nguyenTrongGenealogy.json');
  const members = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  console.log(`Đang nạp ${members.length} thành viên dòng họ Nguyễn Trọng...`);
  let batch = writeBatch(db);
  let count = 0;

  for (const m of members) {
    const memberRef = doc(db, 'genealogy_members', m.id);
    batch.set(memberRef, {
      ...m,
      clanId: 'clan_ho_nguyen_trong',
      updatedAt: serverTimestamp(),
    }, { merge: true });

    count++;
    if (count % 400 === 0) {
      await batch.commit();
      batch = writeBatch(db);
    }
  }
  await batch.commit();
  console.log(`✅ Đã nạp thành công ${count} thành viên gia phả lên Firestore!`);

  // Nạp Clan Họ Nguyễn Trọng
  const clanRef = doc(db, 'clans', 'clan_ho_nguyen_trong');
  await setDoc(clanRef, {
    id: 'clan_ho_nguyen_trong',
    name: 'Họ Nguyễn Trọng',
    slug: 'ho-nguyen-trong',
    ancestorName: 'Cụ Thủy Tổ: Nguyễn Trọng Chất (Chánh thất: Vũ Thị Mai)',
    originStory: 'Dòng họ Nguyễn Trọng (Chi họ Nguyễn Trọng Chất) định cư và khai hoang tại Làng Giao Tác (nay là TDP 9 Thuận Lộc) trải qua 11 đời hưng thịnh.',
    templeAddress: 'Nhà thờ Chi họ Nguyễn Trọng, TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
    deathAnniversary: '16 tháng Giêng (Âm lịch)',
    leaderName: 'Nguyễn Trọng Long',
    leaderPhone: '0832991002',
    updatedAt: serverTimestamp(),
  }, { merge: true });
  console.log('✅ Đã nạp thông tin Dòng họ Nguyễn Trọng!');

  // Nạp 6 mốc lịch sử
  const timelines = [
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

  for (const t of timelines) {
    await setDoc(doc(db, 'history_timelines', t.id), {
      ...t,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }
  console.log('✅ Đã nạp 6 mốc lịch sử Làng Giao Tác từ 1685!');

  // Nạp tài khoản Admin
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
    updatedAt: serverTimestamp(),
  }, { merge: true });
  console.log('✅ Đã nạp tài khoản Quản trị viên (Nguyễn Trọng Long)!');

  console.log('\n🎉 HOÀN TẤT ĐỒNG BỘ LÊN CLOUD FIRESTORE!');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Lỗi khi nạp dữ liệu lên Firestore:', err.message);
  if (err.message.includes('NOT_FOUND') || err.message.includes('database')) {
    console.log('\n👉 Lưu ý: Bạn cần vào Firebase Console bấm "Create database" ở mục Firestore Database trước nhé!');
  }
  process.exit(1);
});
