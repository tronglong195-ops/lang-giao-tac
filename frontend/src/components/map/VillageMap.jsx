import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Landmark } from 'lucide-react';

// Tọa độ chuẩn xác từ liên kết Google Maps: https://maps.app.goo.gl/1VcKoJkDQq5Gf1d79
// Vị trí: Tổ dân phố 9 (Làng Giao Tác xưa), Thuận Lộc, Phường Nam Hồng / Thị xã Hồng Lĩnh, Tỉnh Hà Tĩnh
export const VILLAGE_CENTER = [18.508554, 105.6881];

export const VILLAGE_LANDMARKS = [
  {
    id: 'dinh-lang-tdp9',
    name: 'Đình Làng Giao Tác & Nhà Văn Hóa TDP 9',
    category: 'Di tích Lịch sử & Sinh hoạt cộng đồng',
    coords: [18.508554, 105.6881],
    imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
    description:
      'Trung tâm sinh hoạt văn hóa, hội họp và lễ hội cổ truyền của Tổ dân phố 9 (Làng Giao Tác xưa), xã Thuận Lộc, thị xã Hồng Lĩnh.',
    address: 'Khu trung tâm TDP 9, Thuận Lộc, TX Hồng Lĩnh, Hà Tĩnh',
  },
  {
    id: 'gieng-co-tdp9',
    name: 'Giếng Cổ Làng Giao Tác',
    category: 'Di sản Ký ức Làng quê',
    coords: [18.5092, 105.6875],
    imageUrl: '/images/village/474096867_1006185811543793_8014259646970075430_n.jpg',
    description:
      'Giếng đá ong cổ với dòng nước ngầm trong mát ngọt lành, gắn bó với bao thế hệ con em làng qua hàng trăm năm.',
    address: 'Khu dân cư TDP 9, Thuận Lộc',
  },
  {
    id: 'nha-tho-ho-nguyen-trong',
    name: 'Nhà Thờ Dòng Họ Nguyễn Trọng & Các Dòng Tộc',
    category: 'Di tích Dòng họ - Gia phả',
    coords: [18.5078, 105.689],
    imageUrl: '/images/village/476749176_1020706276758413_2501765006516753118_n.jpg',
    description:
      'Nơi phụng thờ tổ tiên của các dòng họ lớn tại làng Giao Tác, lưu giữ gia phả và truyền thống hiếu học qua nhiều thế hệ.',
    address: 'Trục đường chính TDP 9, Thuận Lộc',
  },
  {
    id: 'cong-lang-thuan-loc',
    name: 'Cổng Làng & Tuyến Đường Hoa TDP 9',
    category: 'Cảnh quan Nông thôn mới & Đô thị văn minh',
    coords: [18.5098, 105.6868],
    imageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
    description:
      'Tuyến đường hoa sáng - xanh - sạch - đẹp rực rỡ sắc màu, biểu tượng cho sức sống đổi mới của bà con nhân dân TDP 9.',
    address: 'Đầu đường liên thôn TDP 9',
  },
  {
    id: 'kenh-nuoc-dong-ruong',
    name: 'Kênh Tưới Tiêu & Cánh Đồng Mẫu Lớn',
    category: 'Cảnh sắc Làng quê',
    coords: [18.507, 105.686],
    imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
    description:
      'Cánh đồng lúa trù phú và hệ thống kênh mương nội đồng phục vụ sản xuất mùa màng bội thu của bà con làng.',
    address: 'Vùng nội đồng TDP 9, Thuận Lộc',
  },
  {
    id: 'khu-the-thao-tdp9',
    name: 'Sân Thể Thao & Khu Vui Chơi Thanh Thiếu Niên',
    category: 'Không gian Sinh hoạt',
    coords: [18.5095, 105.6892],
    imageUrl: '/images/village/486669654_9667039090022304_8533644671297434351_n.jpg',
    description:
      'Địa điểm diễn ra các giải bóng đá, bóng chuyền và các hoạt động văn nghệ, hội trại của thanh niên TDP 9.',
    address: 'Khu thể thao TDP 9, Thuận Lộc',
  },
  {
    id: 'chua-phuc-lam-hong-linh',
    name: 'Chùa Phúc Lâm — Không Gian Tâm Linh',
    category: 'Tâm linh & Di tích',
    coords: [18.5065, 105.6895],
    imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
    description:
      'Chốn tâm linh thanh tịnh dưới chân núi Hồng Lĩnh, nơi bà con nhân dân lễ Phật cầu quốc thái dân an, gia đạo bình yên.',
    address: 'Khu vực tâm linh Thuận Lộc',
  },
];

// Tạo Custom Leaflet DivIcon có hiệu ứng pulse ấm áp
const createCustomMarkerIcon = (isSelected = false) => {
  return L.divIcon({
    className: 'custom-village-pin',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full ${
          isSelected ? 'bg-secondary animate-ping opacity-75' : 'bg-primary/40 animate-warm-pulse'
        }"></div>
        <div class="relative w-7 h-7 rounded-full ${
          isSelected ? 'bg-secondary text-ink' : 'bg-primary text-surface'
        } flex items-center justify-center shadow-lg border-2 border-surface font-bold text-xs">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

// Component điều khiển hiệu ứng flyTo từ bản đồ Việt Nam -> Hà Tĩnh -> TDP 9 Thuận Lộc (Làng Giao Tác)
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
      map.flyTo(selectedLandmark.coords, 17, { duration: 1.2 });
    }
  }, [map, selectedLandmark, initialFlyToDone]);

  return null;
};

export const VillageMap = ({ onSelectLandmark, selectedId }) => {
  const [initialFlyToDone, setInitialFlyToDone] = useState(false);
  const [activeLandmark, setActiveLandmark] = useState(null);

  const handleMarkerClick = (landmark) => {
    setActiveLandmark(landmark);
    if (onSelectLandmark) {
      onSelectLandmark(landmark);
    }
  };

  return (
    <div className="relative w-full h-[500px] md:h-[620px] rounded-2xl overflow-hidden border border-warmBorder shadow-warm">
      <MapContainer
        center={[16.047079, 108.20623]}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          selectedLandmark={activeLandmark}
          initialFlyToDone={initialFlyToDone}
          setInitialFlyToDone={setInitialFlyToDone}
        />

        {VILLAGE_LANDMARKS.map((landmark) => {
          const isSelected = selectedId === landmark.id || activeLandmark?.id === landmark.id;
          return (
            <Marker
              key={landmark.id}
              position={landmark.coords}
              icon={createCustomMarkerIcon(isSelected)}
              eventHandlers={{
                click: () => handleMarkerClick(landmark),
              }}
            >
              <Popup className="village-custom-popup">
                <div className="w-64 p-1 space-y-2 select-none">
                  {landmark.imageUrl && (
                    <img
                      src={landmark.imageUrl}
                      alt={landmark.name}
                      className="w-full h-28 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wide">
                      {landmark.category}
                    </span>
                    <h4 className="font-bold text-base text-primary-dark leading-tight mt-0.5">
                      {landmark.name}
                    </h4>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                    {landmark.description}
                  </p>
                  <div className="flex items-center text-[11px] text-ink-light pt-1 border-t border-warmBorder">
                    <MapPin className="w-3 h-3 text-primary mr-1" />
                    <span>{landmark.address}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Fly-to Notification Overlay */}
      {!initialFlyToDone && (
        <div className="absolute top-4 right-4 z-20 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-xl border border-warmBorder shadow-md flex items-center space-x-2 text-xs font-medium text-primary-dark animate-pulse">
          <Navigation className="w-4 h-4 text-primary animate-spin" />
          <span>Đang định vị vào TDP 9 Thuận Lộc (Làng Giao Tác)...</span>
        </div>
      )}

      {/* Reset Map View Button */}
      <button
        onClick={() => {
          setActiveLandmark({ coords: VILLAGE_CENTER });
        }}
        className="absolute bottom-6 right-6 z-20 px-3.5 py-2 rounded-xl bg-surface/95 hover:bg-surface text-primary-dark text-xs font-semibold backdrop-blur-md border border-warmBorder shadow-md transition-all flex items-center space-x-1.5"
      >
        <Landmark className="w-4 h-4 text-primary" />
        <span>Về trung tâm TDP 9 Thuận Lộc</span>
      </button>
    </div>
  );
};
