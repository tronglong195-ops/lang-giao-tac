import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Search,
  Calendar,
  User,
  ChevronRight,
  PlusCircle,
  RefreshCw,
  ExternalLink,
  Landmark,
  Building,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { newsService } from '../services/newsService';
import { googleSheetsService } from '../services/googleSheetsService';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

export const NewsListPage = () => {
  const { isAdminOrMod } = useAuth();
  const [newsList, setNewsList] = useState([]);
  const [wardNewsList, setWardNewsList] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'ward' | 'village'
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // 1. Tải danh sách tin tức từ Database & Google Sheets
  const fetchNews = async (page = 1, searchQuery = search) => {
    setLoading(true);
    try {
      const data = await newsService.getNews({ page, limit: 12, search: searchQuery });
      let currentNews = data?.news || [];

      // Kiểm tra xem có cấu hình Google Sheets Tin tức không
      try {
        const syncConfig = JSON.parse(localStorage.getItem('giaotac_google_sync_settings') || '{}');
        if (syncConfig.enabled && syncConfig.syncNews && syncConfig.sheetUrl) {
          const cleanId = googleSheetsService.extractSheetId(syncConfig.sheetUrl);
          const sheetNews = await googleSheetsService.fetchNews(cleanId);
          if (sheetNews && sheetNews.length > 0) {
            currentNews = [...sheetNews, ...currentNews];
          }
        }
      } catch (e) {
        console.warn('Không thể nạp Google Sheets News:', e);
      }

      setNewsList(currentNews);
      if (data?.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Lỗi khi tải tin tức:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Tải trực tiếp tin tức mới nhất từ Cổng TTĐT Phường Nam Hồng Lĩnh
  const fetchWardFeed = async () => {
    try {
      const articles = await newsService.getWardNewsFeed(1);
      if (articles && articles.length > 0) {
        setWardNewsList(articles);
      }
    } catch (err) {
      console.warn('Lỗi khi tải live feed từ trang phường:', err.message);
    }
  };

  useEffect(() => {
    fetchNews(1);
    fetchWardFeed();
  }, []);

  // 3. Tự động đồng bộ tin tức mới nhất trong tháng từ Cổng TTĐT Phường
  const handleSyncWardNews = async () => {
    setSyncing(true);
    setSyncMessage('');
    try {
      const res = await newsService.syncWardNews(2);
      setSyncMessage(res.message || 'Đã cập nhật thành công các bài viết mới nhất trong tháng!');
      await fetchNews(1);
      await fetchWardFeed();
      setTimeout(() => setSyncMessage(''), 5000);
    } catch (err) {
      console.error('Lỗi khi đồng bộ tin tức phường:', err);
      // Fallback nạp feed trực tiếp nếu cần
      await fetchWardFeed();
      setSyncMessage('Đã làm mới dữ liệu tin tức từ Cổng TTĐT Phường Nam Hồng Lĩnh.');
      setTimeout(() => setSyncMessage(''), 5000);
    } finally {
      setSyncing(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(1, search);
  };

  // Lọc theo Tabs
  const getDisplayNews = () => {
    if (activeTab === 'ward') {
      // Nếu có live ward news
      if (wardNewsList.length > 0) {
        return wardNewsList.map((item) => ({
          id: item.originalUrl || item.title,
          title: item.title,
          slug: item.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          contentHtml: `<p>${item.summary || ''}</p>`,
          source: 'Cổng TTĐT Phường Nam Hồng Lĩnh',
          originalUrl: item.originalUrl,
          imageUrl: item.imageUrl,
          publishedAt: new Date(),
          isWardDirect: true,
          timeStr: item.timeStr,
        }));
      }
      return newsList.filter((item) =>
        item.source?.toLowerCase().includes('phường') || item.source?.toLowerCase().includes('nam hồng')
      );
    }

    if (activeTab === 'village') {
      return newsList.filter(
        (item) =>
          !item.source?.toLowerCase().includes('phường') && !item.source?.toLowerCase().includes('nam hồng')
      );
    }

    return newsList;
  };

  const displayList = getDisplayNews().filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.source?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Helmet>
        <title>Tin Tức & Sự Kiện Phường Nam Hồng Lĩnh — Làng Giao Tác</title>
        <meta
          name="description"
          content="Cập nhật tin tức sự kiện mới nhất trong tháng từ Cổng thông tin điện tử Phường Nam Hồng Lĩnh và Thông báo Làng Giao Tác (TDP 9 Thuận Lộc)."
        />
        <meta property="og:title" content="Tin Tức & Sự Kiện Phường Nam Hồng Lĩnh — Làng Giao Tác" />
        <meta
          property="og:description"
          content="Cập nhật tin tức sự kiện mới nhất trong tháng từ Cổng thông tin điện tử Phường Nam Hồng Lĩnh và Làng Giao Tác."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Header & Title Banner */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-10 shadow-warm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-900 text-xs font-bold uppercase tracking-wider">
          <Landmark className="w-3.5 h-3.5 text-red-700" />
          <span>Thông Tin Chính Thống & Sự Kiện Địa Phương</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-primary-dark tracking-tight leading-snug">
              Tin Tức & Sự Kiện Phường Nam Hồng Lĩnh
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-2xl pt-1">
              Kênh thông tin tổng hợp các chủ trương, chính sách, hoạt động kinh tế - văn hóa - xã hội 
              từ <strong>Cổng thông tin điện tử Phường Nam Hồng Lĩnh</strong> và Ban cán sự Tổ dân phố 9 (Làng Giao Tác).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Nút Tự động Cập nhật Tin tức mới nhất trong tháng */}
            <button
              onClick={handleSyncWardNews}
              disabled={syncing}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-yellow-200 text-xs sm:text-sm font-bold shadow-md transition-all border border-amber-400 disabled:opacity-50"
              title="Tự động thu thập bài viết mới nhất trong tháng từ Cổng TTĐT Phường"
            >
              <RefreshCw className={`w-4 h-4 text-yellow-300 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Đang Cập Nhật...' : 'Cập Nhật Tin Mới Trong Tháng'}</span>
            </button>

            {isAdminOrMod && (
              <Link
                to="/quan-tri?tab=news"
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-primary text-surface font-semibold text-xs sm:text-sm hover:bg-primary-dark transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Đăng Tin Mới</span>
              </Link>
            )}
          </div>
        </div>

        {/* Thông báo cập nhật */}
        {syncMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-primary text-surface shadow-xs font-bold'
                : 'bg-surface hover:bg-paper text-ink border border-warmBorder'
            }`}
          >
            Tất Cả Bản Tin
          </button>
          <button
            onClick={() => setActiveTab('ward')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'ward'
                ? 'bg-red-900 text-yellow-200 border border-amber-400 shadow-md font-bold'
                : 'bg-surface hover:bg-paper text-ink border border-warmBorder'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-amber-600" />
            <span>🏛️ Tin Phường Nam Hồng Lĩnh (Mới nhất)</span>
          </button>
          <button
            onClick={() => setActiveTab('village')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'village'
                ? 'bg-primary text-surface shadow-xs font-bold'
                : 'bg-surface hover:bg-paper text-ink border border-warmBorder'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>📢 Thông Báo Làng Giao Tác (TDP 9)</span>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md w-full flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tin tức, khám sàng lọc, diễn tập..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-warmBorder bg-surface text-xs outline-none focus:border-primary"
            />
            <Search className="w-4 h-4 text-ink-light absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary text-surface font-semibold text-xs hover:bg-primary-dark transition-colors"
          >
            Tìm
          </button>
        </form>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="text-center py-20 text-ink-muted">Đang tải danh sách tin tức & sự kiện...</div>
      ) : displayList.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-3xl border border-warmBorder text-ink-muted text-sm space-y-3">
          <Bell className="w-12 h-12 mx-auto text-ink-light" />
          <p className="font-medium">Không tìm thấy tin tức hoặc thông báo nào phù hợp.</p>
          <button
            onClick={handleSyncWardNews}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary text-surface text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cập nhật tin từ Cổng TTĐT Phường</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((item) => {
            const isWardSource =
              item.source?.includes('Phường') || item.source?.includes('Nam Hồng') || item.isWardDirect;

            return (
              <article
                key={item.id}
                className="bg-surface rounded-3xl border border-warmBorder overflow-hidden shadow-warm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Thumbnail Image if available */}
                {item.imageUrl && (
                  <div className="relative h-48 overflow-hidden bg-paper">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-900/90 backdrop-blur-xs text-yellow-300 font-bold text-[10px] uppercase shadow-xs border border-amber-400/40">
                      Cổng TTĐT Phường
                    </span>
                  </div>
                )}

                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-ink-light">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] truncate max-w-[200px] ${
                          isWardSource
                            ? 'bg-red-50 text-red-900 border border-red-200'
                            : 'bg-primary-subtle text-primary'
                        }`}
                      >
                        🏛️ {item.source || 'Thông báo chính thức'}
                      </span>
                      <span className="flex items-center space-x-1 text-ink-muted text-[11px] font-mono shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>
                          {item.timeStr || new Date(item.publishedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-ink group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {item.originalUrl ? (
                        <a
                          href={item.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <Link to={`/tin-tuc/${item.slug}`}>{item.title}</Link>
                      )}
                    </h2>

                    <div
                      className="text-xs text-ink-muted line-clamp-3 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: item.contentHtml ? item.contentHtml.replace(/<[^>]*>?/gm, '') : '',
                      }}
                    />
                  </div>

                  {/* Footer Bar: Dẫn nguồn & Link đọc bài */}
                  <div className="pt-4 border-t border-warmBorder flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5 text-[11px] text-ink-muted truncate">
                      <User className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{item.author?.fullName || 'UBND Phường Nam Hồng Lĩnh'}</span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {item.originalUrl ? (
                        <a
                          href={item.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-900 hover:bg-red-800 text-yellow-200 text-[11px] font-bold shadow-xs transition-colors"
                        >
                          <span>Xem Bài Gốc</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link
                          to={`/tin-tuc/${item.slug}`}
                          className="inline-flex items-center space-x-1 text-xs font-bold text-primary group-hover:underline"
                        >
                          <span>Đọc toàn văn</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && activeTab === 'all' && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchNews(p)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                p === pagination.page
                  ? 'bg-primary text-surface shadow-sm'
                  : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
