import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Eye,
  Info,
  Maximize2,
  Sparkles,
  Volume2,
  VolumeX,
  Layers,
} from 'lucide-react';

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
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
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
        <div className="relative w-full h-[400px] sm:h-[550px] rounded-2xl overflow-hidden bg-black group">
          <img
            src={selectedLoc.imageUrl}
            alt={selectedLoc.name}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isRotating ? 'scale-105' : 'scale-100'
            }`}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Location Title on Viewer */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="space-y-0.5">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/90 text-surface text-[10px] font-bold uppercase tracking-wider">
                {selectedLoc.category}
              </span>
              <h3 className="font-bold text-base sm:text-xl drop-shadow-md">{selectedLoc.name}</h3>
            </div>

            <button
              onClick={() => setIsRotating(!isRotating)}
              className="p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/80 text-xs flex items-center space-x-1 border border-white/20"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">{isRotating ? 'Dừng góc nhìn' : 'Tự động xoay'}</span>
            </button>
          </div>

          {/* Hotspots Info on Bottom */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
            <p className="text-xs sm:text-sm text-paper/90 max-w-2xl drop-shadow-sm leading-relaxed">
              {selectedLoc.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {selectedLoc.hotspots.map((hs, i) => (
                <div
                  key={i}
                  className="px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-medium text-paper flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                  <span><strong>{hs.title}:</strong> {hs.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location Selector Carousel */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-ink uppercase tracking-wider block">
            Chọn Điểm Tham Quan (5 Địa Điểm Nổi Bật)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PANORAMA_LOCATIONS.map((loc) => {
              const isSelected = selectedLoc.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLoc(loc)}
                  className={`p-2.5 rounded-2xl border text-left transition-all space-y-1.5 ${
                    isSelected
                      ? 'bg-primary text-surface border-primary shadow-warm scale-102 ring-2 ring-primary/40'
                      : 'bg-paper hover:bg-surface text-ink border-warmBorder'
                  }`}
                >
                  <img
                    src={loc.imageUrl}
                    alt={loc.name}
                    className="w-full h-20 sm:h-24 object-cover rounded-xl"
                  />
                  <p className="font-bold text-xs line-clamp-1">{loc.name}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
