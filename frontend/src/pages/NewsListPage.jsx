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
  X,
  Share2,
  BookOpen,
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

  // Article Reader Modal State
  const [readingArticle, setReadingArticle] = useState(null);
  const [readingDetail, setReadingDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  // 2. Tải trực tiếp toàn bộ danh sách bài viết từ Cổng TTĐT Phường Nam Hồng Lĩnh
  const fetchWardFeed = async (force = false) => {
    try {
      const articles = await newsService.getWardNewsFeed(undefined, force);
      if (articles && articles.length > 0) {
        setWardNewsList(articles);
      }
    } catch (err) {
      console.warn('Lỗi khi tải live feed từ trang phường:', err.message);
    }
  };

  useEffect(() => {
    fetchNews(1);
    fetchWardFeed(false);
  }, []);

  // 3. Tự động đồng bộ toàn bộ bài viết qua các trang từ Cổng TTĐT Phường
  const handleSyncWardNews = async () => {
    setSyncing(true);
    setSyncMessage('');
    try {
      const res = await newsService.syncWardNews(4);
      setSyncMessage(res.message || 'Đã đồng bộ thành công các bài viết mới nhất từ Cổng TTĐT Phường!');
      await fetchNews(1);
      await fetchWardFeed(true);
      setTimeout(() => setSyncMessage(''), 6000);
    } catch (err) {
      console.error('Lỗi khi đồng bộ tin tức phường:', err);
      await fetchWardFeed(true);
      setSyncMessage('Đã làm mới dữ liệu bài viết trực tiếp từ Cổng TTĐT Phường Nam Hồng Lĩnh.');
      setTimeout(() => setSyncMessage(''), 6000);
    } finally {
      setSyncing(false);
    }
  };

  // 4. Mở đọc toàn văn bài viết Phường
  const handleOpenWardArticle = async (item) => {
    setReadingArticle(item);
    setReadingDetail(null);
    if (item.originalUrl) {
      setDetailLoading(true);
      try {
        const detail = await newsService.getWardArticleDetail(item.originalUrl);
        if (detail) {
          setReadingDetail(detail);
        }
      } catch (e) {
        console.warn('Không thể tải bài viết chi tiết:', e);
      } finally {
        setDetailLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(1, search);
  };

  // Lọc theo Tabs
  const getDisplayNews = () => {
    if (activeTab === 'ward') {
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

    // Tab All: Gộp các bài viết live phường và bài viết làng
    if (wardNewsList.length > 0) {
      const liveItems = wardNewsList.map((item) => ({
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

      // Lọc bỏ bài làng bị trùng tiêu đề
      const villageItems = newsList.filter(
        (n) => !liveItems.some((w) => w.title === n.title)
      );

      return [...liveItems, ...villageItems];
    }

    return newsList;
  };

  const displayList = getDisplayNews().filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.source?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Helmet>
        <title>Tin Tức & Sự Kiện Phường Nam Hồng Lĩnh — Làng Giao Tác</title>
        <meta
          name="description"
          content="Tổng hợp đầy đủ bài viết, hình ảnh, thông báo và sự kiện mới nhất từ Cổng thông tin điện tử Phường Nam Hồng Lĩnh và Làng Giao Tác."
        />
        <meta property="og:title" content="Tin Tức & Sự Kiện Phường Nam Hồng Lĩnh — Làng Giao Tác" />
        <meta
          property="og:description"
          content="Tổng hợp đầy đủ bài viết, hình ảnh, thông báo và sự kiện mới nhất từ Cổng thông tin điện tử Phường Nam Hồng Lĩnh và Làng Giao Tác."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Header & Title Banner */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-10 shadow-warm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-900 text-xs font-bold uppercase tracking-wider">
          <Landmark className="w-3.5 h-3.5 text-red-700" />
          <span>Thông Tin Chính Thống & Bài Viết Sự Kiện Địa Phương</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-red-950 tracking-tight leading-snug">
              Tin Tức & Sự Kiện Phường Nam Hồng Lĩnh
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl pt-1">
              Thu thập tự động và cập nhật đầy đủ toàn bộ các bài viết, hình ảnh, thông báo và chỉ đạo điều hành 
              từ <strong>Cổng thông tin điện tử Phường Nam Hồng Lĩnh</strong> (Thị xã Hồng Lĩnh, Hà Tĩnh) và Ban cán sự TDP 9 (Làng Giao Tác).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Nút Tự động Cập nhật Tin tức mới nhất trong tháng */}
            <button
              onClick={handleSyncWardNews}
              disabled={syncing}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-yellow-200 text-xs sm:text-sm font-bold shadow-md transition-all border border-amber-400 disabled:opacity-50"
              title="Tự động thu thập tất cả bài viết mới nhất từ Cổng TTĐT Phường"
            >
              <RefreshCw className={`w-4 h-4 text-yellow-300 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Đang Thu Thập...' : '🔄 Cập Nhật Tất Cả Bài Viết'}</span>
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
                ? 'bg-red-900 text-yellow-200 border border-amber-400 shadow-md font-bold'
                : 'bg-surface hover:bg-paper text-ink border border-warmBorder'
            }`}
          >
            Tất Cả Bài Viết ({displayList.length})
          </button>
          <button
            onClick={() => setActiveTab('ward')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeTab === 'ward'
                ? 'bg-red-900 text-yellow-200 border border-amber-400 shadow-md font-bold'
                : 'bg-surface hover:bg-paper text-ink border border-warmBorder'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-amber-500" />
            <span>🏛️ Tin Phường Nam Hồng Lĩnh ({wardNewsList.length || '40+'})</span>
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
              placeholder="Tìm kiếm bài viết, khám sàng lọc, diễn tập..."
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
        <div className="text-center py-20 text-ink-muted">Đang tải danh sách bài viết & sự kiện...</div>
      ) : displayList.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-3xl border border-warmBorder text-ink-muted text-sm space-y-3">
          <Bell className="w-12 h-12 mx-auto text-ink-light" />
          <p className="font-medium">Không tìm thấy bài viết hoặc thông báo nào phù hợp.</p>
          <button
            onClick={handleSyncWardNews}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary text-surface text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Cập nhật bài viết từ Cổng TTĐT Phường</span>
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
                {/* Thumbnail Image */}
                {item.imageUrl && (
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg';
                      }}
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
                      <button
                        onClick={() => handleOpenWardArticle(item)}
                        className="text-left font-bold hover:underline"
                      >
                        {item.title}
                      </button>
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
                      {item.originalUrl && (
                        <a
                          href={item.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-red-900 hover:bg-red-800 text-yellow-200 text-[11px] font-bold shadow-xs transition-colors"
                          title="Xem bài viết gốc trên Cổng TTĐT Phường"
                        >
                          <span>Xem Bài Gốc</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        onClick={() => handleOpenWardArticle(item)}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-primary group-hover:underline"
                      >
                        <span>Đọc toàn văn</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Article Reader Modal (Đọc Toàn Văn Bài Viết Kèm Ảnh & Dẫn Nguồn) */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface w-full max-w-4xl max-h-[90vh] rounded-3xl border border-warmBorder shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-warmBorder bg-paper flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-red-900 text-yellow-200 text-xs font-bold">
                  🏛️ Cổng TTĐT Phường Nam Hồng Lĩnh
                </span>
                <span className="text-xs text-ink-muted hidden sm:inline">
                  {readingArticle.timeStr || 'Tháng 8/2026'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {readingArticle.originalUrl && (
                  <a
                    href={readingArticle.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-red-900 hover:bg-red-800 text-yellow-200 text-xs font-bold flex items-center space-x-1"
                  >
                    <span>Mở Trên Cổng TTĐT</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => setReadingArticle(null)}
                  className="w-8 h-8 rounded-full bg-warmBorder/50 hover:bg-warmBorder flex items-center justify-center text-ink transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-ink">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-primary-dark leading-snug">
                {readingArticle.title}
              </h1>

              {/* Nguồn bài viết chính thống */}
              <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-xs text-red-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-red-900">
                    🏛️ NGUỒN CHÍNH THỐNG: CỔNG THÔNG TIN ĐIỆN TỬ PHƯỜNG NAM HỒNG LĨNH
                  </p>
                  <p className="text-stone-600 text-[11px]">
                    Địa chỉ: Thị xã Hồng Lĩnh, Tỉnh Hà Tĩnh | Dẫn nguồn trực tiếp từ Cổng thông tin chính quyền
                  </p>
                </div>
                {readingArticle.originalUrl && (
                  <a
                    href={readingArticle.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-red-900 text-yellow-200 font-bold text-xs hover:bg-red-800"
                  >
                    Đến Bài Viết Gốc ↗
                  </a>
                )}
              </div>

              {detailLoading ? (
                <div className="py-12 text-center text-ink-muted space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
                  <p className="text-xs">Đang tải toàn văn bài viết và hình ảnh từ Cổng TTĐT Phường...</p>
                </div>
              ) : readingDetail?.contentHtml ? (
                <div
                  className="tiptap-content text-sm sm:text-base leading-relaxed space-y-4 text-stone-800"
                  dangerouslySetInnerHTML={{ __html: readingDetail.contentHtml }}
                />
              ) : (
                <div className="space-y-4 text-sm sm:text-base text-stone-800">
                  {readingArticle.imageUrl && (
                    <div className="rounded-2xl overflow-hidden shadow-warm border border-warmBorder max-h-96">
                      <img
                        src={readingArticle.imageUrl}
                        alt={readingArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="lead font-medium text-stone-900 italic bg-amber-50 p-4 rounded-xl border-l-4 border-red-800">
                    {readingArticle.summary}
                  </p>
                  <p className="text-stone-700 leading-relaxed">
                    Bản tin chính thức được phát hành và thông tin rộng rãi đến toàn thể bà con nhân dân tại các Tổ dân phố trên địa bàn Phường Nam Hồng Lĩnh và Làng Giao Tác (TDP 9).
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-warmBorder bg-paper flex items-center justify-between text-xs text-ink-muted">
              <span>Cổng thông tin Làng Giao Tác — Phường Nam Hồng Lĩnh, Hà Tĩnh</span>
              <button
                onClick={() => setReadingArticle(null)}
                className="px-4 py-2 rounded-xl bg-primary text-surface font-semibold hover:bg-primary-dark"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
