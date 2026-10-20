import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

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

async function cleanAndFix() {
  console.log('🧹 Bắt đầu dọn dẹp và khắc phục lỗi vỡ nét cho toàn bộ Album ảnh...');

  // 1. XÓA 2 ALBUM TRÙNG LẶP (Jw4u6InX8BwoMypgKumV & 2HwlJ8gHRcuSQE4Jo0eg)
  console.log('\n🗑️ 1. Xóa các album trùng lặp và ảnh thuộc album trùng lặp...');
  const duplicateAlbumIds = ['Jw4u6InX8BwoMypgKumV', '2HwlJ8gHRcuSQE4Jo0eg'];
  for (const albId of duplicateAlbumIds) {
    try {
      await deleteDoc(doc(db, 'albums', albId));
      console.log(`  ✓ Đã xóa album trùng lặp: ${albId}`);
    } catch (e) {
      console.warn(`  ⚠️ Không thể xóa album ${albId}:`, e.message);
    }
  }

  // 2. XÓA CÁC ẢNH GẮN VỚI ALBUM TRÙNG LẶP HOẶC CÓ FILE BỊ THIẾU (404)
  console.log('\n🔍 2. Quét và loại bỏ tất cả ảnh lỗi / thiếu file (404)...');
  const photosSnap = await getDocs(collection(db, 'photos'));
  let deletedCount = 0;

  for (const docSnap of photosSnap.docs) {
    const p = docSnap.data();
    const docId = docSnap.id;
    let shouldDelete = false;

    // Xóa nếu thuộc album trùng lặp
    if (duplicateAlbumIds.includes(p.albumId)) {
      shouldDelete = true;
    }

    // Xóa các bản ghi photo_village_* (được sinh ra từ script cũ với tên file không tồn tại hoặc bị trùng)
    if (docId.startsWith('photo_village_')) {
      shouldDelete = true;
    }

    // Kiểm tra xem file có thực sự tồn tại trong thư mục public hay không
    let url = p.imageUrl || '';
    let localPath = url.replace('https://lang-giao-tac-tdp9.web.app', '').replace(/^\//, '');
    let fullPath = path.resolve('frontend/public', localPath);
    if (!fs.existsSync(fullPath)) {
      shouldDelete = true;
    }

    if (shouldDelete) {
      await deleteDoc(doc(db, 'photos', docId));
      deletedCount++;
      console.log(`  ✓ Đã xóa ảnh lỗi/trùng: ${docId} (${p.imageUrl})`);
    }
  }
  console.log(`✅ Đã dọn dẹp ${deletedCount} bản ghi ảnh lỗi/trùng lặp.`);

  // 3. THIẾT LẬP LẠI 5 ALBUM CHUẨN VỚI ẢNH BÌA SẮC NÉT (CHẤT LƯỢNG CAO 2K)
  console.log('\n🖼️ 3. Cập nhật ảnh bìa chất lượng cao cho 5 Album chính thức...');
  const masterAlbums = [
    {
      id: 'album_canh_sac',
      title: 'Cảnh sắc Làng Giao Tác — TDP 9 Thuận Lộc xưa và nay',
      description: 'Những góc ảnh chân thực và sống động về cảnh quan, di tích, con đường làng và đời sống sinh hoạt của bà con TDP 9 Thuận Lộc.',
      eventDate: '2025-06-15',
      coverPhotoUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg', // 2048x1536
    },
    {
      id: 'album_le_hoi',
      title: 'Lễ hội Đình Làng & Hoạt động văn hóa truyền thống',
      description: 'Ghi lại những khoảnh khắc trang nghiêm, rộn rã trong các dịp tế lễ, rước thần và hội làng đầu xuân.',
      eventDate: '2025-02-20',
      coverPhotoUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg', // 2048x1318
    },
    {
      id: 'album_the_thao',
      title: 'Phong trào Thể thao & Đoàn kết thanh niên TDP 9',
      description: 'Hình ảnh thi đấu bóng chuyền, bóng đá và ngày hội văn hóa thể thao của con em làng quê.',
      eventDate: '2025-09-02',
      coverPhotoUrl: '/images/village/476328615_1020997653395942_6382946994889025434_n.jpg', // 2048x1242
    },
    {
      id: 'album_fanpage_dinh_giao_tac',
      title: 'Đình Giao Tác qua ống kính',
      description: 'Đình làng Giao Tác qua các năm 2015–2023: sau đợt trùng tu năm 2014, toàn cảnh từ trên cao và những hoạt động văn hóa dưới mái đình. Ảnh: Fanpage Xã Thuận Lộc.',
      eventDate: '2023-08-01',
      coverPhotoUrl: '/images/album-fanpage/giao-tac-a2.jpg', // 2048x1365 Siêu nét
    },
    {
      id: 'album_fanpage_mai_truong',
      title: 'Mái trường & con đường đến lớp',
      description: 'Trường cấp 2 (THCS) Thuận Lộc và con đường đi học của bao thế hệ học trò làng Giao Tác. Ảnh: Fanpage Xã Thuận Lộc.',
      eventDate: '2017-10-02',
      coverPhotoUrl: '/images/album-fanpage/giao-tac-b4.jpg', // 2048x1150 Siêu nét flycam
    },
  ];

  for (const alb of masterAlbums) {
    const docRef = doc(db, 'albums', alb.id);
    await setDoc(docRef, {
      ...alb,
      updatedAt: new Date().toISOString(),
      createdAt: alb.eventDate,
    }, { merge: true });
    console.log(`  ✓ [Cập nhật bìa nét] ${alb.title} -> ${alb.coverPhotoUrl}`);
  }

  // 4. BỔ SUNG CÁC ẢNH CHƯA GÁN VÀO CÁC ALBUM PHÙ HỢP
  console.log('\n📸 4. Bổ sung các bức ảnh sắc nét thực tế vào các album...');
  const additionalPhotos = [
    { file: '472928170_997127435782964_7006946500455527756_n.jpg', caption: 'Khung cảnh làng quê thanh bình buổi sớm', albumId: 'album_canh_sac', year: 2024 },
    { file: '474278410_1006185628210478_5871547063121134519_n.jpg', caption: 'Con đường hoa nông thôn mới rực rỡ', albumId: 'album_canh_sac', year: 2024 },
    { file: '475543629_1012490690913305_5006385233278289512_n.jpg', caption: 'Cánh đồng lúa vàng trù phú Thuận Lộc', albumId: 'album_canh_sac', year: 2025 },
    { file: '480779848_9427190680673814_8483054160483283579_n.jpg', caption: 'Bà con hội tụ tham gia phong trào làng', albumId: 'album_le_hoi', year: 2024 },
    { file: '486459179_9660859147306965_7121422367718996031_n.jpg', caption: 'Khí thế thi đấu thể thao sôi nổi của thanh niên', albumId: 'album_the_thao', year: 2025 },
    { file: '486558059_9660859293973617_4860847667983793577_n.jpg', caption: 'Đoàn kết tình làng nghĩa xóm trong ngày hội thể thao', albumId: 'album_the_thao', year: 2025 },
    { file: '486687342_9660859150640298_6322523556717035363_n.jpg', caption: 'Trao giải phong trào thể thao văn hóa TDP 9', albumId: 'album_the_thao', year: 2025 },
    { file: '713204707_1409486577880379_6360931562200918726_n.jpg', caption: 'Nét sinh hoạt truyền thống bà con TDP 9', albumId: 'album_canh_sac', year: 2024 },
    { file: '715951282_1414459497383087_6946203524891956832_n.jpg', caption: 'Toàn cảnh xóm làng yên bình dưới chân núi', albumId: 'album_canh_sac', year: 2024 },
  ];

  for (let i = 0; i < additionalPhotos.length; i++) {
    const ap = additionalPhotos[i];
    const photoId = `photo_add_${i + 1}`;
    const docRef = doc(db, 'photos', photoId);
    await setDoc(docRef, {
      id: photoId,
      albumId: ap.albumId,
      imageUrl: `/images/village/${ap.file}`,
      caption: ap.caption,
      year: ap.year,
      takenYear: ap.year,
      status: 'approved',
      uploaderId: 'admin_seed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log(`  ✓ Đã nạp ảnh mới chất lượng cao: ${ap.file} -> ${ap.caption}`);
  }

  console.log('\n🎉 ĐÃ KHẮC PHỤC HOÀN TOÀN TẤT CẢ CÁC ALBUM ẢNH TRÊN CLOUD FIRESTORE!');
  process.exit(0);
}

cleanAndFix().catch((err) => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});
