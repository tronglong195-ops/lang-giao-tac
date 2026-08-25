import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  MapPin,
  Eye,
  Info,
  Maximize2,
  Sparkles,
  Layers,
  Play,
  Pause,
  RotateCw,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

const PANORAMA_LOCATIONS = [
  {
    id: 'dinh-lang',
    name: 'Đình Làng Giao Tác (Xây dựng năm 1875)',
    category: 'Di tích lịch sử văn hóa',
    imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
    description: 'Di tích lịch sử văn hóa cấp tỉnh, nơi ra đời Chi bộ Đảng làng Giao Tác ngày 20/2/1930 và là trung tâm sinh hoạt tâm linh của toàn thể bà con.',
    hotspots: [
      { title: 'Tòa Đại Đình', desc: 'Kiến trúc gỗ lim cổ truyền với hoa văn rồng phượng tinh xảo.' },
      { title: 'Bia Tưởng Niệm', desc: 'Ghi danh các bậc tiền nhân khai canh và liệt sĩ quê hương.' },
    ],
  },
  {
    id: 'gieng-co',
    name: 'Giếng Nước Cổ & Cây Xanh Đầu Làng',
    category: 'Cảnh quan di sản',
    imageUrl: '/images/village/474096867_1006185811543793_8014259646970075430_n.jpg',
    description: 'Mạch nguồn nước ngọt ngào mát lành nuôi dưỡng bao thế hệ người con Giao Tác khôn lớn, nơi hò hẹn và gắn bó ký ức tuổi thơ.',
    hotspots: [
      { title: 'Thành Giếng Đá Cổ', desc: 'Được xếp từ đá núi tự nhiên vững chãi hàng trăm năm.' },
    ],
  },
  {
    id: 'duong-hoa',
    name: 'Tuyến Đường Hoa Nông Thôn Mới TDP 9',
    category: 'Đổi mới quê hương',
    imageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
    description: 'Tuyến đường kiểu mẫu sáng - xanh - sạch - đẹp được bà con nhân dân chung sức đồng lòng xây dựng.',
    hotspots: [
      { title: 'Hàng Cây Mười Giờ & Chiều Tím', desc: 'Nở hoa rực rỡ quanh năm dọc hai bên đường làng.' },
    ],
  },
  {
    id: 'canh-dong',
    name: 'Cánh Đồng Trù Phú Chân Núi Hồng Lĩnh',
    category: 'Thiên nhiên quê mẹ',
    imageUrl: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
    description: 'Cánh đồng màu mỡ thẳng cánh cò bay dưới bóng núi Hồng Lĩnh 99 ngọn hùng vĩ.',
    hotspots: [
      { title: 'Núi Hồng Lĩnh', desc: 'Dãy núi biểu tượng của xứ Nghệ che chắn cho làng quê thanh bình.' },
    ],
  },
  {
    id: 'hoi-lang',
    name: 'Lễ Hội & Không Gian Sinh Hoạt Dòng Tộc',
    category: 'Văn hóa truyền thống',
    imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
    description: 'Nơi bà con 8 dòng họ gặp gỡ, tế lễ tiên tổ và trao truyền truyền thống hiếu học cho con cháu đời sau.',
    hotspots: [
      { title: 'Đoàn Tế Lễ', desc: 'Nghi thức tế thần và dâng hương tiên tổ trang trọng.' },
    ],
  },
];

export const VirtualTourPage = () => {
  const [selectedLoc, setSelectedLoc] = useState(PANORAMA_LOCATIONS[0]);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const viewerContainerRef = useRef(null);
  const viewerInstanceRef = useRef(null);

  useEffect(() => {
    if (!viewerContainerRef.current) return;

    let viewer;
    try {
      viewer = new Viewer({
        container: viewerContainerRef.current,
        panorama: selectedLoc.imageUrl,
        caption: selectedLoc.name,
        touchmoveTwoFingers: false,
        mousewheelCtrlKey: false,
        defaultZoomLvl: 40,
        navbar: ['autorotate', 'zoom', 'move', 'fullscreen'],
      });

      viewerInstanceRef.current = viewer;

      if (isAutoRotate) {
        viewer.addEventListener('ready', () => {
          try {
            viewer.startAutorotate();
          } catch (e) {
            // Ignore if autorotate plugin not attached
          }
        }, { once: true });
      }
    } catch (err) {
      console.warn('Lỗi khởi tạo PhotoSphereViewer:', err);
    }

    return () => {
      if (viewer) {
        try {
          viewer.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [selectedLoc.imageUrl]);

  const toggleAutoRotate = () => {
    if (viewerInstanceRef.current) {
      try {
        if (isAutoRotate) {
          viewerInstanceRef.current.stopAutorotate();
        } else {
          viewerInstanceRef.current.startAutorotate();
        }
      } catch (e) {
        // ignore
      }
    }
    setIsAutoRotate(!isAutoRotate);
  };

  const handleFullscreen = () => {
    if (viewerInstanceRef.current) {
      try {
        viewerInstanceRef.current.enterFullscreen();
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Helmet>
        <title>Tour Thực Tế Ảo 360° — Làng Giao Tác</title>
        <meta
          name="description"
          content="Trải nghiệm không gian thực tế ảo 360 độ ngắm nhìn Đình làng Giao Tác, Giếng Cổ, Đường hoa và Cánh đồng quê hương dưới chân núi Hồng Lĩnh."
        />
        <meta property="og:title" content="Tour Thực Tế Ảo 360° — Làng Giao Tác" />
        <meta
          property="og:description"
          content="Trải nghiệm không gian thực tế ảo 360 độ ngắm nhìn cảnh sắc Làng Giao Tác — TDP 9 Thuận Lộc."
        />
        <meta property="og:image" content={selectedLoc.imageUrl} />
      </Helmet>

      {/* Hero Header */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-10 shadow-warm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Tour Tham Quan Thực Tế Ảo 360°</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-primary-dark tracking-tight leading-snug">
          Ngắm Nhìn Làng Giao Tác Mọi Lúc, Mọi Nơi
        </h1>

        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-3xl">
          Dành tặng những người con xa xứ ở Hà Nội, TP.HCM, Đà Nẵng hay nước ngoài một không gian trực quan 
          để trở về ngắm nhìn mái đình rêu phong, giếng nước trong lành và đường hoa rực rỡ của quê hương.
        </p>
      </div>

      {/* Panorama Viewer Box */}
      <div className="bg-surface rounded-3xl border border-warmBorder overflow-hidden shadow-warm space-y-4 p-4 sm:p-6">
        <div className="relative w-full h-[420px] sm:h-[580px] rounded-2xl overflow-hidden bg-black group">
          {/* PhotoSphere Container */}
          <div
            ref={viewerContainerRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />

          {/* Quick Overlay Controls */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
            <button
              onClick={toggleAutoRotate}
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md"
              title={isAutoRotate ? 'Tạm dừng xoay' : 'Tự động xoay 360°'}
            >
              {isAutoRotate ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md"
              title="Toàn màn hình"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Location Badge on Top Left */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-black/70 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-semibold flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{selectedLoc.name}</span>
            </div>
          </div>

          {/* Helper Hint at Bottom Center */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md text-white/90 text-[11px] px-3 py-1 rounded-full border border-white/10 flex items-center space-x-1.5 shadow-sm">
              <RotateCw className="w-3 h-3 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Nhấn giữ chuột & kéo để quay góc nhìn 360°</span>
            </div>
          </div>
        </div>

        {/* Location Info & Hotspots */}
        <div className="p-4 sm:p-6 bg-paper rounded-2xl border border-warmBorder space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warmBorder pb-4">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                {selectedLoc.category}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-ink">{selectedLoc.name}</h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            {selectedLoc.description}
          </p>

          {/* Hotspots Highlights */}
          {selectedLoc.hotspots && selectedLoc.hotspots.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Điểm nhấn tiêu biểu</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedLoc.hotspots.map((hs, idx) => (
                  <div
                    key={idx}
                    className="bg-surface p-3 rounded-xl border border-warmBorder space-y-1 shadow-2xs"
                  >
                    <h4 className="text-xs font-bold text-primary">{hs.title}</h4>
                    <p className="text-[11px] text-ink-muted">{hs.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Select Panorama Locations List */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-bold text-ink">Danh Mục Địa Điểm Trải Nghiệm</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PANORAMA_LOCATIONS.map((loc) => {
            const isSelected = selectedLoc.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLoc(loc)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-surface flex flex-col ${
                  isSelected
                    ? 'border-primary ring-4 ring-primary-subtle shadow-md'
                    : 'border-warmBorder hover:border-primary/50 shadow-xs'
                }`}
              >
                <div className="relative h-40 overflow-hidden bg-black/10">
                  <img
                    src={loc.imageUrl}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      {loc.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold line-clamp-1">{loc.name}</h3>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold shadow-xs">
                      Đang xem
                    </div>
                  )}
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <p className="text-[11px] text-ink-muted line-clamp-2">{loc.description}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-primary font-semibold border-t border-warmBorder/60">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>Xem góc nhìn 360°</span>
                    </span>
                    <MapPin className="w-3 h-3 text-ink-light" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
