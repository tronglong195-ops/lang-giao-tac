import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  FolderSync,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Eye,
  Sparkles,
  HelpCircle,
  Save,
} from 'lucide-react';
import { googleSheetsService } from '../../services/googleSheetsService';
import { googleDriveService } from '../../services/googleDriveService';

export const GoogleSyncSettings = () => {
  const [enabled, setEnabled] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [driveFolderUrl, setDriveFolderUrl] = useState('');
  const [syncNews, setSyncNews] = useState(true);
  const [syncFund, setSyncFund] = useState(true);
  const [syncDirectory, setSyncDirectory] = useState(true);

  // Testing & Preview States
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [previewNews, setPreviewNews] = useState([]);
  const [previewDonations, setPreviewDonations] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load saved settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('giaotac_google_sync_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setEnabled(parsed.enabled ?? false);
        setSheetUrl(parsed.sheetUrl || '');
        setDriveFolderUrl(parsed.driveFolderUrl || '');
        setSyncNews(parsed.syncNews ?? true);
        setSyncFund(parsed.syncFund ?? true);
        setSyncDirectory(parsed.syncDirectory ?? true);
      }
    } catch (e) {
      console.error('Lỗi đọc cài đặt Google Sync:', e);
    }
  }, []);

  const handleSaveSettings = () => {
    const config = {
      enabled,
      sheetUrl: sheetUrl.trim(),
      driveFolderUrl: driveFolderUrl.trim(),
      syncNews,
      syncFund,
      syncDirectory,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('giaotac_google_sync_settings', JSON.stringify(config));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    if (!sheetUrl.trim()) {
      alert('Vui lòng nhập đường dẫn hoặc ID file Google Sheets trước khi kiểm tra.');
      return;
    }

    setTesting(true);
    setTestResult(null);
    try {
      const cleanId = googleSheetsService.extractSheetId(sheetUrl);
      const [newsData, fundData] = await Promise.all([
        googleSheetsService.fetchNews(cleanId),
        googleSheetsService.fetchDonations(cleanId),
      ]);

      setPreviewNews(newsData);
      setPreviewDonations(fundData);
      setTestResult({
        success: true,
        message: `Kết nối thành công! Đọc được ${newsData.length} bài tin tức và ${fundData.length} lượt ủng hộ từ Google Sheets.`,
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Không thể kết nối tới Google Sheets. Hãy chắc chắn file đã được chia sẻ ở chế độ "Bất kỳ ai có đường liên kết đều có thể xem".',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-emerald-100 border border-emerald-700 shadow-xl space-y-3">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Đồng Bộ Dữ Liệu Tự Động Từ Google Sheets & Google Drive
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-3xl">
          Tính năng giúp bạn nhập Tin tức, Sự kiện, Bảng vàng Quỹ khuyến học và Thư viện ảnh 
          trực tiếp trên Google Drive hoặc Google Sheets từ điện thoại. Website sẽ tự động lấy dữ liệu về hiển thị 
          mà không cần đăng nhập trang quản trị hay phụ thuộc vào máy chủ cơ sở dữ liệu.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="p-6 sm:p-8 bg-surface rounded-3xl border border-warmBorder shadow-warm space-y-6">
        {/* Toggle Master Switch */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-paper border border-warmBorder">
          <div className="space-y-0.5">
            <span className="font-bold text-sm sm:text-base text-ink block">
              Kích hoạt chế độ Đồng bộ Google Sheets / Drive
            </span>
            <span className="text-xs text-ink-muted block">
              Khi bật, website sẽ ưu tiên đọc dữ liệu trực tiếp từ file Google Sheets của bạn.
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Configuration Inputs */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-ink uppercase">
                1. Đường dẫn hoặc ID File Google Sheets
              </label>
              <a
                href="https://docs.google.com/spreadsheets/create"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline font-semibold flex items-center space-x-1"
              >
                <span>Tạo file Google Sheets mới</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="text"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="Ví dụ: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
              className="w-full input-warm text-sm font-mono"
            />
            <p className="text-[11px] text-ink-muted">
              💡 Lưu ý quan trọng: Mở file Google Sheets ➔ Bấm <strong>Chia sẻ (Share)</strong> ➔ Đổi thành <strong>"Bất kỳ ai có liên kết đều xem được"</strong>.
            </p>
          </div>

          {/* Sync Targets Checkboxes */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-ink uppercase">
              2. Các chuyên mục tự động đồng bộ từ các Tab Sheets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-paper border border-warmBorder cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncNews}
                  onChange={(e) => setSyncNews(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-ink block">Tab 'TinTuc'</span>
                  <span className="text-ink-muted">Tin tức & Thông báo</span>
                </div>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-paper border border-warmBorder cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncFund}
                  onChange={(e) => setSyncFund(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-ink block">Tab 'QuyQueHuong'</span>
                  <span className="text-ink-muted">Sao kê Quỹ khuyến học</span>
                </div>
              </label>

              <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-paper border border-warmBorder cursor-pointer">
                <input
                  type="checkbox"
                  checked={syncDirectory}
                  onChange={(e) => setSyncDirectory(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                <div className="text-xs">
                  <span className="font-bold text-ink block">Tab 'DanhBa'</span>
                  <span className="text-ink-muted">Hội đồng hương</span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-warmBorder">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Đang kiểm tra...' : 'Kiểm Tra Kết Nối & Đọc Dữ Liệu'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-surface font-bold text-xs flex items-center space-x-2 shadow-warm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu Cấu Hình</span>
            </button>

            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã lưu cài đặt thành công!</span>
              </span>
            )}
          </div>
        </div>

        {/* Test Connection Results Box */}
        {testResult && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center space-x-2 font-bold">
              {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              <span>{testResult.message}</span>
            </div>

            {testResult.success && previewNews.length > 0 && (
              <div className="pt-2 border-t border-emerald-200/60 space-y-1">
                <span className="font-semibold block">Xem trước 2 bài tin đầu tiên đọc được:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {previewNews.slice(0, 2).map((n, idx) => (
                    <li key={idx}><strong>{n.title}</strong> — Tác giả: {n.author} ({n.publishedAt})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guide & Instructions Card */}
      <div className="p-6 bg-paper rounded-3xl border border-warmBorder space-y-3 text-xs text-ink leading-relaxed">
        <h4 className="font-bold text-sm text-primary-dark flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4 text-primary" />
          <span>Hướng Dẫn Cấu Trúc Các Cột Trong Google Sheets</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-3 bg-surface rounded-2xl border border-warmBorder space-y-1">
            <span className="font-bold text-primary block">1. Tab 'TinTuc' (Cột dòng 1):</span>
            <p className="text-ink-muted text-[11px] font-mono">
              TieuDe | TomTat | NoiDung | AnhBia | TacGia | NgayDang
            </p>
          </div>
          <div className="p-3 bg-surface rounded-2xl border border-warmBorder space-y-1">
            <span className="font-bold text-rose-700 block">2. Tab 'QuyQueHuong' (Cột dòng 1):</span>
            <p className="text-ink-muted text-[11px] font-mono">
              NguoiUngHo | DongHo | SoTien | LoiChuc | NgayUngHo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
