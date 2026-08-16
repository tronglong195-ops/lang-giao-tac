import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Landmark, Info, ArrowRight } from 'lucide-react';
import { VillageMap, VILLAGE_LANDMARKS } from '../components/map/VillageMap';

export const MapPage = () => {
  const [selectedLandmark, setSelectedLandmark] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-primary-subtle text-primary-dark text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Địa Lý & Không Gian Văn Hóa</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-primary-dark tracking-tight">
            Bản Đồ Địa Danh Làng Giao Tác (Hà Tĩnh)
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-2xl">
            Bản đồ tương tác OpenStreetMap hiển thị trực quan các di tích lịch sử, đình làng cổ, giếng nước, nhà thờ các dòng tộc và danh lam thắng cảnh dọc sông Ngàn Sâu.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-paper p-3.5 rounded-2xl border border-warmBorder self-start md:self-auto text-xs text-ink-muted">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>Nhấp vào biểu tượng hoặc danh sách bên dưới để xem chi tiết địa danh.</span>
        </div>
      </div>

      {/* Map + Landmarks Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Map Container (8 cols) */}
        <div className="lg:col-span-8">
          <VillageMap
            selectedId={selectedLandmark?.id}
            onSelectLandmark={(landmark) => setSelectedLandmark(landmark)}
          />
        </div>

        {/* Landmarks Sidebar List (4 cols) */}
        <div className="lg:col-span-4 space-y-4 max-h-[620px] overflow-y-auto pr-1">
          <h3 className="font-bold text-base text-ink sticky top-0 bg-paper py-2 z-10 flex items-center justify-between border-b border-warmBorder">
            <span>Danh sách địa danh ({VILLAGE_LANDMARKS.length})</span>
            <span className="text-xs font-normal text-ink-muted">Hà Tĩnh</span>
          </h3>

          <div className="space-y-3">
            {VILLAGE_LANDMARKS.map((landmark) => {
              const isSelected = selectedLandmark?.id === landmark.id;

              return (
                <div
                  key={landmark.id}
                  onClick={() => setSelectedLandmark(landmark)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex space-x-3 ${
                    isSelected
                      ? 'bg-primary-subtle border-primary shadow-md'
                      : 'bg-surface border-warmBorder hover:border-primary/50 shadow-sm'
                  }`}
                >
                  <img
                    src={landmark.imageUrl}
                    alt={landmark.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm"
                  />
                  <div className="space-y-1 overflow-hidden">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider block truncate">
                      {landmark.category}
                    </span>
                    <h4 className="font-bold text-sm text-ink leading-tight truncate">
                      {landmark.name}
                    </h4>
                    <p className="text-[11px] text-ink-muted line-clamp-2 leading-relaxed">
                      {landmark.description}
                    </p>
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
