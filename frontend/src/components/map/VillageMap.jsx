import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Landmark,
  ExternalLink,
  Store,
  GraduationCap,
  HeartPulse,
  Building,
  Church,
  Trees,
  Search,
} from 'lucide-react';

// Tọa độ trung tâm chuẩn xác: Tổ dân phố 9 (Làng Giao Tác xưa), Thuận Lộc, Phường Nam Hồng Lĩnh, Tỉnh Hà Tĩnh
export const VILLAGE_CENTER = [18.508554, 105.6881];

export const MAP_CATEGORIES = [
  { id: 'all', name: 'Tất cả địa điểm' },
  { id: 'dantric_tienich', name: 'Tiện ích & Dân sinh (Tạp hóa...)' },
  { id: 'ditich_lichsu', name: 'Di tích & Lịch sử' },
  { id: 'dongho_giapha', name: 'Nhà thờ Dòng họ' },
  { id: 'giaoduc_yte', name: 'Trường học & Y tế' },
  { id: 'canhquan_thethao', name: 'Cảnh quan & Thể thao' },
];

export const VILLAGE_LANDMARKS = [
  {
    id: 'tap-hoa-van-thien',
    name: 'Tạp Hóa Vân Thiên — Tiện Ích TDP 9',
    categoryGroup: 'dantric_tienich',
    category: 'Tiện ích Dân sinh & Mua sắm',
    coords: [18.508128, 105.687127],
    plusCode: 'GM5P+7VF Nam Hồng Lĩnh, Hà Tĩnh',
    iconType: 'store',
    imageUrl: '/images/village/487122810_9667039056688974_8593141678606100657_n.jpg',
    description:
      'Cửa hàng tạp hóa Vân Thiên (Mã vị trí Google Maps: GM5P+7VF) quen thuộc của bà con Làng Giao Tác (TDP 9 Thuận Lộc), cung cấp đầy đủ nhu yếu phẩm, bánh kẹo cu đơ, nước giải khát và hàng tiêu dùng hàng ngày.',
    address: 'Trục đường chính TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, Hà Tĩnh',
    phone: '0988123456',
  },
  {
    id: 'dinh-lang-tdp9',
    name: 'Đình Làng Giao Tác (Di Tích Lịch Sử Cấp Tỉnh)',
    categoryGroup: 'ditich_lichsu',
    category: 'Di tích Lịch sử & Sinh hoạt cộng đồng',
    coords: [18.508554, 105.6881],
    iconType: 'landmark',
    imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
    description:
      'Đình làng cổ khởi dựng từ năm 1875 (thời Tự Đức). Nơi thành lập Chi bộ Đảng đầu tiên năm 1930 và là trung tâm tín ngưỡng, văn hóa thiêng liêng của Làng Giao Tác.',
    address: 'Khu trung tâm Làng Giao Tác — TDP 9 Thuận Lộc, Hà Tĩnh',
  },
  {
    id: 'nha-van-hoa-tdp9',
    name: 'Nhà Văn Hóa Tổ Dân Phố 9 (Thuận Lộc)',
    categoryGroup: 'dantric_tienich',
    category: 'Cơ quan & Sinh hoạt cộng đồng',
    coords: [18.5086, 105.68822],
    iconType: 'building',
    imageUrl: '/images/village/486669654_9667039090022304_8533644671297434351_n.jpg',
    description:
      'Địa điểm hội họp, tiếp xúc cử tri, giao lưu văn nghệ và triển khai các phong trào xây dựng Đô thị văn minh của bà con nhân dân TDP 9.',
    address: 'Khuôn viên trung tâm TDP 9 Thuận Lộc',
  },
  {
    id: 'gieng-co-tdp9',
    name: 'Giếng Cổ Làng Giao Tác (Giếng Đá Ong)',
    categoryGroup: 'ditich_lichsu',
    category: 'Di sản Ký ức Làng quê',
    coords: [18.50915, 105.6876],
    iconType: 'landmark',
    imageUrl: '/images/village/474096867_1006185811543793_8014259646970075430_n.jpg',
    description:
      'Giếng đá ong cổ trăm năm với mạch nước ngầm ngọt lành mát rượi, biểu tượng cho nguồn cội và ký ức ấu thơ của bao thế hệ con em làng.',
    address: 'Xóm Giếng Cổ, TDP 9 Thuận Lộc',
  },
  {
    id: 'cong-lang-thuan-loc',
    name: 'Cổng Làng Giao Tác & Tuyến Đường Cờ Hoa',
    categoryGroup: 'canhquan_thethao',
    category: 'Cảnh quan Nông thôn mới & Văn minh',
    coords: [18.50975, 105.6869],
    iconType: 'trees',
    imageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
    description:
      'Cổng làng uy nghiêm và trục đường hoa mẫu Sáng - Xanh - Sạch - Đẹp kết nối giao thương giữa làng với các trục lộ huyết mạch của thị xã Hồng Lĩnh.',
    address: 'Đầu đường liên thôn TDP 9 Thuận Lộc',
  },
  {
    id: 'nha-tho-ho-nguyen-trong',
    name: 'Từ Đường Dòng Họ Nguyễn Trọng',
    categoryGroup: 'dongho_giapha',
    category: 'Di tích Dòng họ - Gia phả',
    coords: [18.50785, 105.6889],
    iconType: 'church',
    imageUrl: '/images/village/476749176_1020706276758413_2501765006516753118_n.jpg',
    description:
      'Nơi phụng thờ Cụ Thủy Tổ Nguyễn Trọng và các bậc tiền hiền khai khẩn đất làng, lưu truyền đạo lý hiếu học và gia phong dòng tộc.',
    address: 'Xóm Trung, TDP 9 Thuận Lộc',
  },
  {
    id: 'nha-tho-cac-dong-toc',
    name: 'Nhà Thờ Các Dòng Tộc (Nguyễn Duy, Nguyễn Huy, Phan Sỹ...)',
    categoryGroup: 'dongho_giapha',
    category: 'Di tích Dòng họ - Gia phả',
    coords: [18.5074, 105.6893],
    iconType: 'church',
    imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
    description:
      'Cụm từ đường thờ phụng của 8 dòng họ lớn: Nguyễn Duy, Nguyễn Huy, Phan Sỹ, Nguyễn Văn, Phạm Hữu, Trần Đình, Họ Lê tại Làng Giao Tác.',
    address: 'Khu quần thể Từ đường TDP 9 Thuận Lộc',
  },
  {
    id: 'khu-the-thao-tdp9',
    name: 'Sân Thể Thao & Nhà Thi Đấu TDP 9',
    categoryGroup: 'canhquan_thethao',
    category: 'Thể thao & Sinh hoạt ngoài trời',
    coords: [18.50945, 105.68915],
    iconType: 'trees',
    imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
    description:
      'Sân bóng đá cỏ tự nhiên, sân bóng chuyền hơi và khu dụng cụ tập luyện thể thao ngoài trời của thanh thiếu niên và hội người cao tuổi.',
    address: 'Khu thể thao TDP 9, Thuận Lộc',
  },
  {
    id: 'truong-mam-non-thuan-loc',
    name: 'Trường Mầm Non Thuận Lộc (Điểm Trường TDP 9)',
    categoryGroup: 'giaoduc_yte',
    category: 'Giáo dục & Trường học',
    coords: [18.5099, 105.6887],
    iconType: 'school',
    imageUrl: '/images/village/486669654_9667039090022304_8533644671297434351_n.jpg',
    description:
      'Điểm trường mầm non khang trang, sạch đẹp ươm mầm thế hệ măng non tương lai của làng Giao Tác.',
    address: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
  },
  {
    id: 'truong-tieu-hoc-thuan-loc',
    name: 'Trường Tiểu Học Thuận Lộc',
    categoryGroup: 'giaoduc_yte',
    category: 'Giáo dục & Trường học',
    coords: [18.5112, 105.6854],
    iconType: 'school',
    imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
    description:
      'Trường Tiểu học đạt chuẩn Quốc gia, nơi chắp cánh ước mơ tri thức cho con em nhân dân trong xã và làng Giao Tác.',
    address: 'Trung tâm Thuận Lộc, Phường Nam Hồng Lĩnh',
  },
  {
    id: 'tram-y-te-thuan-loc',
    name: 'Trạm Y Tế Thuận Lộc',
    categoryGroup: 'giaoduc_yte',
    category: 'Y tế & Chăm sóc sức khỏe',
    coords: [18.5118, 105.6848],
    iconType: 'health',
    imageUrl: '/images/village/474096867_1006185811543793_8014259646970075430_n.jpg',
    description:
      'Cơ sở y tế ban đầu khám chữa bệnh, tiêm chủng và chăm sóc sức khỏe toàn diện cho bà con nhân dân địa phương.',
    address: 'Trục đường chính Thuận Lộc',
  },
  {
    id: 'ubnd-xa-thuan-loc',
    name: 'Trụ Sở UBND Xã Thuận Lộc (Nam Hồng Lĩnh)',
    categoryGroup: 'dantric_tienich',
    category: 'Cơ quan Hành chính Nhà nước',
    coords: [18.5125, 105.6842],
    iconType: 'building',
    imageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
    description:
      'Trụ sở làm việc của Đảng ủy, HĐND, UBND, Ủy ban MTTQ và bộ phận Một cửa giải quyết thủ tục hành chính cho nhân dân.',
    address: 'Khu trung tâm hành chính Thuận Lộc',
  },
  {
    id: 'chua-phuc-lam',
    name: 'Chùa Phúc Lâm — Chân Núi Hồng Lĩnh',
    categoryGroup: 'ditich_lichsu',
    category: 'Tâm linh & Di tích',
    coords: [18.5063, 105.6898],
    iconType: 'landmark',
    imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
    description:
      'Ngôi chùa thanh tịnh tọa lạc dưới chân ngọn núi Hồng Lĩnh 99 đỉnh, nơi bà con nhân dân chiêm bái, cầu an và sinh hoạt Phật pháp.',
    address: 'Chân núi Hồng Lĩnh, Thuận Lộc',
  },
  {
    id: 'canh-dong-mau-lon',
    name: 'Kênh Tưới Tiêu & Cánh Đồng Mẫu Lớn Giao Tác',
    categoryGroup: 'canhquan_thethao',
    category: 'Cảnh sắc Làng quê & Nông nghiệp',
    coords: [18.5071, 105.6862],
    iconType: 'trees',
    imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
    description:
      'Vùng đồng lúa cò bay thẳng cánh ứng dụng cơ giới hóa đồng bộ, tạo nên cảnh sắc trù phú và thanh bình đặc trưng của quê hương.',
    address: 'Khu đồng nội TDP 9 Thuận Lộc',
  },
];

// Tạo Custom Pin Icon trên bản đồ Leaflet theo từng nhóm
const createCustomMarkerIcon = (landmark, isSelected = false) => {
  let bgColor = 'bg-primary';
  let badgeColor = 'bg-red-700';

  if (landmark.categoryGroup === 'dantric_tienich') {
    bgColor = 'bg-amber-600';
    badgeColor = 'bg-amber-800';
  } else if (landmark.categoryGroup === 'dongho_giapha') {
    bgColor = 'bg-purple-700';
    badgeColor = 'bg-purple-900';
  } else if (landmark.categoryGroup === 'giaoduc_yte') {
    bgColor = 'bg-blue-600';
    badgeColor = 'bg-blue-800';
  } else if (landmark.categoryGroup === 'canhquan_thethao') {
    bgColor = 'bg-emerald-600';
    badgeColor = 'bg-emerald-800';
  }

  return L.divIcon({
    className: 'custom-village-pin',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full ${
          isSelected ? 'bg-yellow-400 animate-ping opacity-75' : 'bg-primary/30 animate-warm-pulse'
        }"></div>
        <div class="relative w-8 h-8 rounded-full ${
          isSelected ? 'bg-yellow-500 text-stone-950 scale-110 ring-2 ring-white' : `${bgColor} text-white`
        } flex items-center justify-center shadow-lg border-2 border-white font-bold text-xs">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Điều khiển FlyTo
const MapController = ({ selectedLandmark, initialFlyToDone, setInitialFlyToDone }) => {
  const map = useMap();

  useEffect(() => {
    if (!initialFlyToDone) {
      map.setView([16.047079, 108.20623], 6); // Toàn cảnh Việt Nam

      const timer1 = setTimeout(() => {
        map.flyTo([18.535, 105.7], 11, { duration: 1.8 }); // Thị xã Hồng Lĩnh, Hà Tĩnh
      }, 800);

      const timer2 = setTimeout(() => {
        map.flyTo(VILLAGE_CENTER, 16.5, { duration: 2.2 }); // TDP 9 Thuận Lộc
        setInitialFlyToDone(true);
      }, 2800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [map, initialFlyToDone, setInitialFlyToDone]);

  useEffect(() => {
    if (selectedLandmark && initialFlyToDone) {
      map.flyTo(selectedLandmark.coords, 17.5, { duration: 1.2 });
    }
  }, [map, selectedLandmark, initialFlyToDone]);

  return null;
};

export const VillageMap = ({ onSelectLandmark, selectedId, filteredLandmarks = VILLAGE_LANDMARKS }) => {
  const [initialFlyToDone, setInitialFlyToDone] = useState(false);
  const [activeLandmark, setActiveLandmark] = useState(null);

  const handleMarkerClick = (landmark) => {
    setActiveLandmark(landmark);
    if (onSelectLandmark) {
      onSelectLandmark(landmark);
    }
  };

  return (
    <div className="relative w-full h-[520px] md:h-[650px] rounded-3xl overflow-hidden border-2 border-warmBorder shadow-warm">
      <MapContainer
        center={[16.047079, 108.20623]}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors • TDP 9 Thuận Lộc'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          selectedLandmark={activeLandmark}
          initialFlyToDone={initialFlyToDone}
          setInitialFlyToDone={setInitialFlyToDone}
        />

        {filteredLandmarks.map((landmark) => {
          const isSelected = selectedId === landmark.id || activeLandmark?.id === landmark.id;
          const googleMapsDirectionUrl = `https://www.google.com/maps/dir/?api=1&destination=${landmark.coords[0]},${landmark.coords[1]}`;

          return (
            <Marker
              key={landmark.id}
              position={landmark.coords}
              icon={createCustomMarkerIcon(landmark, isSelected)}
              eventHandlers={{
                click: () => handleMarkerClick(landmark),
              }}
            >
              <Popup className="village-custom-popup">
                <div className="w-72 p-1.5 space-y-2 select-none font-sans">
                  {landmark.imageUrl && (
                    <img
                      src={landmark.imageUrl}
                      alt={landmark.name}
                      className="w-full h-32 object-cover rounded-xl shadow-xs"
                    />
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
                      {landmark.category}
                    </span>
                    <h4 className="font-bold text-sm text-primary-dark leading-tight mt-0.5">
                      {landmark.name}
                    </h4>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                    {landmark.description}
                  </p>
                  
                  <div className="flex items-center text-[11px] text-ink-light pt-1 border-t border-warmBorder">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mr-1" />
                    <span className="truncate">{landmark.address}</span>
                  </div>

                  {landmark.plusCode && (
                    <div className="text-[10px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">
                      Mã vị trí Google: <strong>{landmark.plusCode}</strong>
                    </div>
                  )}

                  {/* Nút chỉ đường qua Google Maps */}
                  <div className="pt-1">
                    <a
                      href={googleMapsDirectionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 px-3 rounded-lg bg-primary hover:bg-primary-dark text-white text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Chỉ đường trên Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Fly-to Notification Overlay */}
      {!initialFlyToDone && (
        <div className="absolute top-4 right-4 z-20 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-warmBorder shadow-md flex items-center space-x-2 text-xs font-bold text-primary-dark animate-pulse">
          <Navigation className="w-4 h-4 text-primary animate-spin" />
          <span>Đang định vị vào TDP 9 Thuận Lộc (Làng Giao Tác)...</span>
        </div>
      )}

      {/* Reset Map View Button */}
      <button
        onClick={() => {
          setActiveLandmark({ coords: VILLAGE_CENTER });
        }}
        className="absolute bottom-6 right-6 z-20 px-4 py-2.5 rounded-2xl bg-surface/95 hover:bg-surface text-primary-dark text-xs font-bold backdrop-blur-md border border-warmBorder shadow-lg transition-all flex items-center space-x-2"
      >
        <Landmark className="w-4 h-4 text-primary" />
        <span>Về trung tâm Làng Giao Tác (TDP 9)</span>
      </button>
    </div>
  );
};
