import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';

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

const albums = [
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

const photos = [
  { file: '484215892_9601885749870972_6761004858315934829_n.jpg', caption: 'Toàn cảnh không gian văn hóa Đình Làng Giao Tác — TDP 9 Thuận Lộc', year: 2025, albumId: 'album_canh_sac' },
  { file: '476468343_1020712713424436_7762543762157463751_n.jpg', caption: 'Bà con tề tựu trong ngày hội văn hóa truyền thống làng quê', year: 2025, albumId: 'album_le_hoi' },
  { file: '476776564_1020712773424430_8938770403532008026_n.jpg', caption: 'Tuyến đường hoa sáng - xanh - sạch - đẹp TDP 9 Thuận Lộc', year: 2024, albumId: 'album_canh_sac' },
  { file: '480212312_1025661522929555_8709853623689778697_n.jpg', caption: 'Cánh đồng trù phú và cảnh sắc thanh bình dưới chân núi Hồng Lĩnh', year: 2024, albumId: 'album_canh_sac' },
  { file: '486784254_9667039123355634_3798108786214067335_n.jpg', caption: 'Các bô lão và đại diện bà con trong buổi lễ tế tổ', year: 2025, albumId: 'album_le_hoi' },
  { file: '474096867_1006185811543793_8014259646970075430_n.jpg', caption: 'Khu vực Giếng cổ và cây xanh rợp bóng mát đầu làng', year: 2024, albumId: 'album_canh_sac' },
  { file: '474232064_1006185604877147_4038067063949471365_n.jpg', caption: 'Hoạt động giao lưu nghĩa tình làng xóm ấm áp', year: 2025, albumId: 'album_le_hoi' },
  { file: '474372745_1006185908210450_6706806661278267034_n.jpg', caption: 'Đường ngõ xóm khang trang sạch đẹp TDP 9', year: 2025, albumId: 'album_canh_sac' },
  { file: '474378266_1006185931543781_77396248245745283_n.jpg', caption: 'Nét kiến trúc chạm khắc tinh xảo tại gian chính điện', year: 2024, albumId: 'album_le_hoi' },
  { file: '474468265_1006185814877126_6845974151311090042_n.jpg', caption: 'Không gian tôn nghiêm nơi thờ tự tổ tiên', year: 2024, albumId: 'album_le_hoi' },
  { file: '476328615_1020997653395942_6382946994889025434_n.jpg', caption: 'Tuổi trẻ TDP 9 tham gia ngày hội thể thao thanh niên', year: 2025, albumId: 'album_the_thao' },
  { file: '476749176_1020706276758413_2501765006516753118_n.jpg', caption: 'Khuôn viên nhà văn hóa rực rỡ cờ hoa ngày hội làng', year: 2025, albumId: 'album_canh_sac' },
  { file: '480361377_1025661306262910_3393105738832877669_n.jpg', caption: 'Gặp gỡ bà con trong ngày hội đại đoàn kết', year: 2024, albumId: 'album_le_hoi' },
  { file: '481919923_1038953804933660_9191053096340339070_n.jpg', caption: 'Niềm vui của bà con nhân dân trong ngày mùa thu hoạch', year: 2025, albumId: 'album_canh_sac' },
  { file: '486669654_9667039090022304_8533644671297434351_n.jpg', caption: 'Giải đấu bóng chuyền phong trào sôi nổi giữa các cụm dân cư', year: 2025, albumId: 'album_the_thao' },
  { file: '487072678_9667039030022310_4027050678293325911_n.jpg', caption: 'Lễ rước truyền thống qua các tuyến đường của tổ dân phố', year: 2025, albumId: 'album_le_hoi' },
  { file: '487122810_9667039056688974_8593141678606100657_n.jpg', caption: 'Mâm cỗ truyền thống dâng cúng tổ tiên ngày hội làng', year: 2025, albumId: 'album_le_hoi' },
  { file: '487139441_9667039046688975_3816832760547593398_n.jpg', caption: 'Không khí trang trọng và linh thiêng tại sân đình', year: 2025, albumId: 'album_le_hoi' },
  { file: '487179352_9667038933355653_1441822558744355954_n.jpg', caption: 'Bà con lưu niệm khoảnh khắc sum vầy ngày giỗ tổ', year: 2025, albumId: 'album_le_hoi' },
  { file: '487207651_9667039096688970_5639482163604299767_n.jpg', caption: 'Đội trống hội rộn rã khai mạc lễ hội', year: 2025, albumId: 'album_le_hoi' },
  { file: '487241672_9667038913355655_4893280312059391203_n.jpg', caption: 'Chuẩn bị lễ vật chu đáo thể hiện lòng thành kính tổ tiên', year: 2025, albumId: 'album_le_hoi' },
  { file: '494711254_1086845790144461_6608691068180912061_n.jpg', caption: 'Cảnh quan rợp bóng cây xanh tại ngõ xóm', year: 2025, albumId: 'album_canh_sac' },
  { file: '495016098_1086845843477789_4213248714438490190_n.jpg', caption: 'Góc sân đình rợp bóng mát những ngày hè', year: 2025, albumId: 'album_canh_sac' },
  { file: '495693700_1086845956811111_457011958165925516_n.jpg', caption: 'Con em xa xứ về thăm quê sum vầy cùng gia đình', year: 2025, albumId: 'album_le_hoi' },
  { file: '672688949_1373408091488228_356311310193025544_n.jpg', caption: 'Đội bóng đá thanh niên TDP 9 thi đấu giao hữu', year: 2025, albumId: 'album_the_thao' },
  { file: '679790602_1378486327647071_8289854520080192795_n.jpg', caption: 'Khí thế thi đua thể thao sôi nổi trong thanh thiếu niên', year: 2025, albumId: 'album_the_thao' },
  { file: '709729339_1408654567963580_1475408134129676792_n.jpg', caption: 'Trao thưởng cho các đội thể thao xuất sắc', year: 2025, albumId: 'album_the_thao' },
  { file: '281839383_5262472423812348_1569149716459367035_n.jpg', caption: 'Ảnh tư liệu đình làng qua các thời kỳ', year: 2023, albumId: 'album_canh_sac' },
  { file: '326697869_578141983838106_426592280380391650_n.jpg', caption: 'Hoạt động gắn kết xóm giềng thôn Thuận Giang', year: 2023, albumId: 'album_canh_sac' },
  { file: '471821748_9139885522737666_5308212636235905338_n.jpg', caption: 'Khung cảnh làng quê yên bình buổi sớm mai', year: 2024, albumId: 'album_canh_sac' },
];

async function seed() {
  console.log('🌾 Đang nạp toàn bộ Albums và Hình ảnh vào Cloud Firestore...');

  // 1. Nạp Albums
  for (const album of albums) {
    const albumRef = doc(db, 'albums', album.id);
    await setDoc(albumRef, {
      ...album,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log(`✅ Đã nạp Album: ${album.title}`);
  }

  // 2. Nạp Photos
  let batch = writeBatch(db);
  let count = 0;

  for (let i = 0; i < photos.length; i++) {
    const item = photos[i];
    const photoId = `photo_${item.albumId}_${i + 1}`;
    const photoRef = doc(db, 'photos', photoId);

    batch.set(photoRef, {
      id: photoId,
      albumId: item.albumId,
      imageUrl: `/images/village/${item.file}`,
      thumbnailUrl: `/images/village/${item.file}`,
      caption: item.caption,
      takenYear: item.year,
      status: 'approved',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    count++;
  }

  await batch.commit();
  console.log(`🎉 ĐÃ NẠP THÀNH CÔNG ${count} ẢNH VÀ 3 ALBUM LÊN CLOUD FIRESTORE!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});
