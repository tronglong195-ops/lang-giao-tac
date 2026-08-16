import React, { useState } from 'react';
import {
  Smartphone,
  RotateCw,
  RefreshCw,
  Home,
  ExternalLink,
  Sparkles,
  Camera,
  Share2,
  BookOpen,
  Users,
  Landmark,
} from 'lucide-react';

export const MobileSimulatorPage = () => {
  const [device, setDevice] = useState('iphone15'); // 'iphone15' | 'galaxy' | 'compact'
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' | 'landscape'
  const [currentUrl, setCurrentUrl] = useState('/');
  const [iframeKey, setIframeKey] = useState(0);

  // Device dimensions
  const deviceSpecs = {
    iphone15: {
      name: 'iPhone 15 Pro (iOS)',
      width: 393,
      height: 852,
      bezelRadius: 'rounded-[50px]',
      screenRadius: 'rounded-[40px]',
      hasIsland: true,
    },
    galaxy: {
      name: 'Samsung Galaxy S24 (Android)',
      width: 412,
      height: 915,
      bezelRadius: 'rounded-[44px]',
      screenRadius: 'rounded-[36px]',
      hasHole: true,
    },
    compact: {
      name: 'Màn hình nhỏ (375x667)',
      width: 375,
      height: 667,
      bezelRadius: 'rounded-[36px]',
      screenRadius: 'rounded-[28px]',
    },
  };

  const currentSpec = deviceSpecs[device];
  const screenWidth = orientation === 'portrait' ? currentSpec.width : currentSpec.height;
  const screenHeight = orientation === 'portrait' ? currentSpec.height : currentSpec.width;

  const appBaseUrl = window.location.origin;

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleNavigate = (path) => {
    setCurrentUrl(path);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 flex flex-col items-center">
      {/* Header Controls Bar */}
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-primary text-white shadow-md">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Trình Giả Lập Ứng Dụng Di Động
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                Live Simulator
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Trải nghiệm ứng dụng Làng Giao Tác như trên điện thoại thật
            </p>
          </div>
        </div>

        {/* Device Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Device Selector */}
          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setDevice('iphone15')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                device === 'iphone15'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              iPhone (iOS)
            </button>
            <button
              onClick={() => setDevice('galaxy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                device === 'galaxy'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Galaxy (Android)
            </button>
            <button
              onClick={() => setDevice('compact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                device === 'compact'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Compact
            </button>
          </div>

          {/* Rotate Button */}
          <button
            onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
            className="p-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
            title="Xoay màn hình"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Reload Button */}
          <button
            onClick={handleReload}
            className="p-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
            title="Tải lại ứng dụng"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Showcase Layout */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-center">
        {/* Left Side: Quick Feature Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Lối Tắt Mở Nhanh Màn Hình
            </h2>
            <p className="text-xs text-slate-400">
              Nhấp vào từng tính năng dưới đây để điện thoại giả lập chuyển trang ngay lập tức:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleNavigate('/')}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-left transition-colors"
              >
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">1. Trang Chủ & Dòng Sự Kiện</p>
                  <p className="text-[11px] text-slate-400">Chào mừng, thông báo, mốc lịch sử</p>
                </div>
              </button>

              <button
                onClick={() => handleNavigate('/lich-su')}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-left transition-colors"
              >
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">2. 6 Mốc Lịch Sử & Video Đình</p>
                  <p className="text-[11px] text-slate-400">Tư liệu đình làng 1685 đến nay</p>
                </div>
              </button>

              <button
                onClick={() => handleNavigate('/thu-vien-anh')}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-left transition-colors"
              >
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">3. Album Ảnh & Tải Ảnh ĐT</p>
                  <p className="text-[11px] text-slate-400">Tải nhiều ảnh từ máy, xem phóng to</p>
                </div>
              </button>

              <button
                onClick={() => handleNavigate('/bai-viet')}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-left transition-colors"
              >
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">4. Ký Ức & Bài Viết Quê Nhà</p>
                  <p className="text-[11px] text-slate-400">Soạn bài viết và chia sẻ tâm tình</p>
                </div>
              </button>

              <button
                onClick={() => handleNavigate('/dong-huong')}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 text-left transition-colors"
              >
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">5. Danh Bạ Đồng Hương</p>
                  <p className="text-[11px] text-slate-400">Tìm kiếm và kết nối con em xa quê</p>
                </div>
              </button>
            </div>
          </div>

          {/* Usage Tip */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-3xl p-4 text-xs text-emerald-200 leading-relaxed">
            <p className="font-bold flex items-center gap-1.5 mb-1 text-emerald-400">
              💡 Thao tác cảm ứng mượt mà:
            </p>
            Bạn có thể dùng chuột bấm, vuốt cuộn trang, mở menu và thử nghiệm tất cả tính năng tải ảnh, đăng nhập Google ngay trong khung điện thoại bên cạnh!
          </div>
        </div>

        {/* Center/Right: Realistic Smartphone Mockup Frame */}
        <div className="lg:col-span-8 flex justify-center items-center py-4">
          <div
            className={`relative bg-slate-950 p-3.5 shadow-2xl border-[4px] border-slate-800/90 ${currentSpec.bezelRadius} transition-all duration-300`}
            style={{
              boxShadow:
                '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Speaker / Camera Notch (Dynamic Island) */}
            {orientation === 'portrait' && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-center">
                {currentSpec.hasIsland ? (
                  <div className="w-28 h-7 bg-black rounded-full flex items-center justify-between px-3 shadow-inner">
                    <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-950"></div>
                  </div>
                ) : currentSpec.hasHole ? (
                  <div className="w-4 h-4 rounded-full bg-black border border-slate-800"></div>
                ) : null}
              </div>
            )}

            {/* Screen Inner Viewport */}
            <div
              className={`bg-white overflow-hidden ${currentSpec.screenRadius} relative`}
              style={{
                width: `${screenWidth}px`,
                height: `${screenHeight}px`,
                maxWidth: '90vw',
              }}
            >
              <iframe
                key={iframeKey}
                src={`${appBaseUrl}${currentUrl}`}
                title="Làng Giao Tác Mobile Preview"
                className="w-full h-full border-0"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>

            {/* Bottom Home Indicator Bar (iOS style) */}
            {orientation === 'portrait' && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-600 rounded-full z-30 pointer-events-none opacity-80"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
