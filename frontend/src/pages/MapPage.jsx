import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Landmark,
  Info,
  ExternalLink,
  Search,
  Store,
  GraduationCap,
  HeartPulse,
  Church,
  Trees,
} from 'lucide-react';
import { VillageMap, VILLAGE_LANDMARKS, MAP_CATEGORIES } from '../components/map/VillageMap';
import { Helmet } from 'react-helmet-async';

export const MapPage = () => {
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLandmarks = VILLAGE_LANDMARKS.filter((landmark) => {
    const matchesCategory = activeCategory === 'all' || landmark.categoryGroup === activeCategory;
    const matchesSearch =
      landmark.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      landmark.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      landmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      landmark.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Helmet>
        <title>Bản Đồ Địa Danh Làng Giao Tác — TDP 9 Thuận Lộc, Hà Tĩnh</title>
        <meta
          name="description"
          content="Bản đồ tương tác và chỉ đường các địa danh, di tích lịch sử, Tạp hóa Vân Thiên, Đình Làng, Giếng Cổ, Từ đường dòng họ tại TDP 9 Thuận Lộc, Hà Tĩnh."
        />
        <meta property="og:title" content="Bản Đồ Địa Danh Làng Giao Tác — TDP 9 Thuận Lộc, Hà Tĩnh" />
        <meta
          property="og:description"
          content="Bản đồ tương tác và chỉ đường các địa danh, di tích lịch sử, Tạp hóa Vân Thiên, Đình Làng, Giếng Cổ tại TDP 9 Thuận Lộc."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Header Banner */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-primary-subtle text-primary-dark text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Địa Lý & Bản Đồ Số Làng Quê</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-primary-dark tracking-tight">
            Bản Đồ Địa Danh Làng Giao Tác (Hà Tĩnh)
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-2xl">
            Bản đồ tương tác định vị chuẩn xác các địa điểm trên thực tế (Google Maps & OpenStreetMap): Đình Làng Giao Tác, Tạp hóa Vân Thiên, Giếng Cổ, Từ đường các dòng tộc, Trường học và Trụ sở hành chính tại TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-paper p-3.5 rounded-2xl border border-warmBorder self-start md:self-auto text-xs text-ink-muted">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>Bấm vào ghim hoặc danh sách để xem chi tiết & chỉ đường trực tiếp trên Google Maps.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {MAP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-surface shadow-xs font-bold'
                  : 'bg-surface hover:bg-paper text-ink border border-warmBorder'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm Tạp hóa Vân Thiên, Đình Làng..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-warmBorder bg-surface text-xs outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Map + Landmarks Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Map Container (8 cols) */}
        <div className="lg:col-span-8">
          <VillageMap
            selectedId={selectedLandmark?.id}
            onSelectLandmark={(landmark) => setSelectedLandmark(landmark)}
            filteredLandmarks={filteredLandmarks}
          />
        </div>

        {/* Landmarks Sidebar List (4 cols) */}
        <div className="lg:col-span-4 space-y-4 max-h-[650px] overflow-y-auto pr-1">
          <h3 className="font-bold text-base text-ink sticky top-0 bg-paper/95 backdrop-blur-xs py-2 z-10 flex items-center justify-between border-b border-warmBorder">
            <span>Danh sách địa danh ({filteredLandmarks.length})</span>
            <span className="text-xs font-normal text-ink-muted">TDP 9 Thuận Lộc</span>
          </h3>

          <div className="space-y-3">
            {filteredLandmarks.map((landmark) => {
              const isSelected = selectedLandmark?.id === landmark.id;
              const googleMapsDirectionUrl = `https://www.google.com/maps/dir/?api=1&destination=${landmark.coords[0]},${landmark.coords[1]}`;

              return (
                <div
                  key={landmark.id}
                  onClick={() => setSelectedLandmark(landmark)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-primary-subtle border-primary shadow-md scale-101'
                      : 'bg-surface border-warmBorder hover:border-primary/50 shadow-xs hover:shadow-warm'
                  }`}
                >
                  <div className="flex space-x-3">
                    <img
                      src={landmark.imageUrl}
                      alt={landmark.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs"
                    />
                    <div className="space-y-1 overflow-hidden flex-1">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wider block truncate">
                        {landmark.category}
                      </span>
                      <h4 className="font-bold text-sm text-ink leading-tight line-clamp-2">
                        {landmark.name}
                      </h4>
                      <div className="flex items-center text-[11px] text-ink-light truncate">
                        <MapPin className="w-3 h-3 text-primary shrink-0 mr-1" />
                        <span className="truncate">{landmark.address}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-ink-muted line-clamp-2 leading-relaxed">
                    {landmark.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-primary font-bold">
                      Tọa độ: {landmark.coords[0]}, {landmark.coords[1]}
                    </span>
                    <a
                      href={googleMapsDirectionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-dark text-white text-[10px] font-bold shadow-xs transition-colors"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Chỉ đường</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
