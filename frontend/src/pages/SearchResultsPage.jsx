import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Newspaper,
  Users,
  ShoppingBag,
  ArrowRight,
  Calendar,
  User,
  MapPin,
  Phone,
  Tag,
  Sparkles,
} from 'lucide-react';
import { postService } from '../services/postService';
import { newsService } from '../services/newsService';
import { villagerService } from '../services/villagerService';
import { marketService } from '../services/marketService';
import { SectionDivider } from '../components/layout/SectionDivider';

export const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'posts' | 'news' | 'villagers' | 'market'
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState({
    posts: [],
    news: [],
    villagers: [],
    products: [],
  });

  useEffect(() => {
    setSearchInput(query);
    if (!query.trim()) {
      setResults({ posts: [], news: [], villagers: [], products: [] });
      return;
    }

    const fetchAllSearchResults = async () => {
      setLoading(true);
      try {
        const [postsRes, newsRes, villagersRes, productsRes, wardFeed] = await Promise.all([
          postService.getPosts({ search: query.trim(), limit: 12 }).catch(() => ({ posts: [] })),
          newsService.getNews({ search: query.trim(), limit: 12 }).catch(() => ({ news: [] })),
          villagerService.getVillagers({ search: query.trim(), limit: 12 }).catch(() => ({ villagers: [] })),
          marketService.getAllProducts({ search: query.trim() }).catch(() => []),
          newsService.getWardNewsFeed(1).catch(() => []),
        ]);

        const rawQuery = query.trim().toLowerCase();
        let matchedWardNews = [];
        if (Array.isArray(wardFeed) && wardFeed.length > 0) {
          matchedWardNews = wardFeed
            .filter(
              (item) =>
                item.title?.toLowerCase().includes(rawQuery) ||
                item.summary?.toLowerCase().includes(rawQuery)
            )
            .map((item) => ({
              id: item.originalUrl || item.title,
              title: item.title,
              slug: item.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              summary: item.summary,
              contentHtml: `<p>${item.summary || ''}</p>`,
              source: 'Cổng TTĐT Phường Nam Hồng Lĩnh',
              originalUrl: item.originalUrl,
              imageUrl: item.imageUrl,
              publishedAt: new Date(),
              isWardDirect: true,
            }));
        }

        const existingNews = newsRes?.news || [];
        // Gộp kết quả tin tức và tránh trùng lặp
        const combinedNews = [...existingNews];
        for (const wn of matchedWardNews) {
          if (!combinedNews.some((cn) => cn.title === wn.title || cn.slug === wn.slug)) {
            combinedNews.unshift(wn);
          }
        }

        setResults({
          posts: postsRes?.posts || [],
          news: combinedNews,
          villagers: villagersRes?.villagers || [],
          products: Array.isArray(productsRes) ? productsRes : [],
        });
      } catch (err) {
        console.error('Lỗi khi tìm kiếm dữ liệu toàn site:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSearchResults();
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const totalResults =
    results.posts.length +
    results.news.length +
    results.villagers.length +
    results.products.length;

  return (
    <div className="min-h-screen bg-paper py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header tìm kiếm */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary-subtle border border-primary/20 text-primary-dark text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tra cứu thông tin toàn hệ thống</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-ink">
            Tìm Kiếm Thông Tin Làng Giao Tác
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Tìm kiếm bài viết, tin tức thông báo, danh bạ đồng hương và sản phẩm đặc sản Chợ Quê
          </p>

          {/* Form tìm kiếm lớn */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto mt-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nhập từ khóa tìm kiếm (ví dụ: Đình làng, Họ Nguyễn, Cam bù...)"
              className="w-full pl-11 pr-24 py-3 sm:py-3.5 rounded-2xl bg-surface border border-warmBorder focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base text-ink placeholder-ink-muted/60 shadow-warm"
            />
            <Search className="w-5 h-5 text-ink-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-primary text-surface font-semibold text-xs sm:text-sm hover:bg-primary-dark transition-colors shadow-sm"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Kết quả tìm kiếm */}
        {query.trim() && (
          <div className="space-y-6">
            {/* Thanh Tab phân loại */}
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-warmBorder pb-4">
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
                    activeTab === 'all'
                      ? 'bg-primary text-surface shadow-xs'
                      : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
                  }`}
                >
                  Tất cả ({totalResults})
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
                    activeTab === 'posts'
                      ? 'bg-primary text-surface shadow-xs'
                      : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Bài viết ({results.posts.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('news')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
                    activeTab === 'news'
                      ? 'bg-primary text-surface shadow-xs'
                      : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
                  }`}
                >
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>Tin tức ({results.news.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('villagers')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
                    activeTab === 'villagers'
                      ? 'bg-primary text-surface shadow-xs'
                      : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Đồng hương ({results.villagers.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('market')}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
                    activeTab === 'market'
                      ? 'bg-primary text-surface shadow-xs'
                      : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Chợ Quê ({results.products.length})</span>
                </button>
              </div>

              <span className="text-xs text-ink-muted">
                Kết quả cho: <strong className="text-primary font-bold">"{query}"</strong>
              </span>
            </div>

            {/* Loading Indicator */}
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-ink-muted">Đang quét dữ liệu toàn hệ thống...</p>
              </div>
            ) : totalResults === 0 ? (
              <div className="bg-surface rounded-2xl border border-warmBorder p-8 sm:p-12 text-center max-w-lg mx-auto space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-ink">Không tìm thấy kết quả phù hợp</h3>
                <p className="text-xs sm:text-sm text-ink-muted">
                  Không tìm thấy bài viết, tin tức hoặc đồng hương nào chứa từ khóa "{query}". Hãy thử tìm kiếm bằng từ khóa ngắn gọn hoặc không dấu.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* 1. Nhóm Bài Viết */}
                {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base sm:text-lg font-bold text-ink flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <span>Bài Viết & Ký Ức ({results.posts.length})</span>
                      </h2>
                      {activeTab === 'all' && (
                        <button
                          onClick={() => setActiveTab('posts')}
                          className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
                        >
                          <span>Xem tất cả</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {results.posts.map((post) => (
                        <Link
                          key={post.id}
                          to={`/bai-viet/${post.slug}`}
                          className="group bg-surface rounded-2xl border border-warmBorder hover:border-primary/40 hover:shadow-warm transition-all duration-200 overflow-hidden flex flex-col"
                        >
                          {post.coverImageUrl && (
                            <div className="aspect-video w-full overflow-hidden bg-paper">
                              <img
                                src={post.coverImageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary-dark text-[11px] font-semibold mb-2">
                                {post.category || 'Ký ức quê hương'}
                              </span>
                              <h3 className="text-sm sm:text-base font-bold text-ink group-hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                              </h3>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-ink-muted border-t border-warmBorder/60 pt-2.5">
                              <span className="flex items-center space-x-1">
                                <User className="w-3.5 h-3.5" />
                                <span>{post.author?.fullName || 'Người làng'}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Nhóm Tin Tức & Thông Báo */}
                {(activeTab === 'all' || activeTab === 'news') && results.news.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base sm:text-lg font-bold text-ink flex items-center space-x-2">
                        <Newspaper className="w-5 h-5 text-accent" />
                        <span>Tin Tức & Thông Báo ({results.news.length})</span>
                      </h2>
                      {activeTab === 'all' && (
                        <button
                          onClick={() => setActiveTab('news')}
                          className="text-xs font-semibold text-accent hover:underline flex items-center space-x-1"
                        >
                          <span>Xem tất cả</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {results.news.map((item) => (
                        <div
                          key={item.id}
                          className="group bg-surface rounded-2xl border border-warmBorder hover:border-accent/40 hover:shadow-warm transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-2">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold">
                              🏛️ {item.source || 'Thông báo chính quyền'}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-ink group-hover:text-accent transition-colors line-clamp-2">
                              {item.originalUrl ? (
                                <a href={item.originalUrl} target="_blank" rel="noopener noreferrer">
                                  {item.title}
                                </a>
                              ) : (
                                <Link to={`/tin-tuc/${item.slug}`}>{item.title}</Link>
                              )}
                            </h3>
                            <p className="text-xs text-ink-muted line-clamp-2 font-normal">
                              {item.summary || item.contentHtml?.replace(/<[^>]+>/g, '').slice(0, 100)}
                            </p>
                          </div>
                          <div className="text-[11px] text-ink-muted flex items-center justify-between border-t border-warmBorder/60 pt-2.5">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(item.publishedAt || item.createdAt).toLocaleDateString('vi-VN')}</span>
                            </span>
                            {item.originalUrl && (
                              <a
                                href={item.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-900 hover:underline font-bold text-[11px]"
                              >
                                Xem bài gốc ↗
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Nhóm Danh Bạ Đồng Hương */}
                {(activeTab === 'all' || activeTab === 'villagers') && results.villagers.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base sm:text-lg font-bold text-ink flex items-center space-x-2">
                        <Users className="w-5 h-5 text-teal-600" />
                        <span>Danh Bạ Đồng Hương ({results.villagers.length})</span>
                      </h2>
                      {activeTab === 'all' && (
                        <Link
                          to="/dong-huong"
                          className="text-xs font-semibold text-teal-600 hover:underline flex items-center space-x-1"
                        >
                          <span>Xem danh bạ</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.villagers.map((v) => (
                        <div
                          key={v.id}
                          className="bg-surface rounded-2xl border border-warmBorder p-4 flex items-center space-x-3 shadow-xs"
                        >
                          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center shrink-0 border border-teal-100">
                            {v.fullName ? v.fullName.charAt(0).toUpperCase() : 'N'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-ink truncate">{v.fullName}</p>
                            <p className="text-xs text-ink-muted flex items-center space-x-1 mt-0.5 truncate">
                              <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                              <span className="truncate">{v.region || 'Quê nhà TDP 9'}</span>
                            </p>
                            {v.contactInfo && (
                              <p className="text-xs text-primary font-medium flex items-center space-x-1 mt-0.5">
                                <Phone className="w-3 h-3 shrink-0" />
                                <span>{v.contactInfo}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Nhóm Chợ Quê */}
                {(activeTab === 'all' || activeTab === 'market') && results.products.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base sm:text-lg font-bold text-ink flex items-center space-x-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                        <span>Chợ Quê & Nông Sản ({results.products.length})</span>
                      </h2>
                      {activeTab === 'all' && (
                        <Link
                          to="/cho-que"
                          className="text-xs font-semibold text-emerald-600 hover:underline flex items-center space-x-1"
                        >
                          <span>Ghé Chợ Quê</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.products.map((p) => (
                        <div
                          key={p.id}
                          className="bg-surface rounded-2xl border border-warmBorder p-4 flex space-x-3 overflow-hidden shadow-xs hover:border-emerald-300 transition-colors"
                        >
                          {p.imageUrl && (
                            <img
                              src={p.imageUrl}
                              alt={p.title}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-warmBorder"
                            />
                          )}
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-sm font-bold text-ink line-clamp-1">{p.title}</p>
                            <p className="text-xs font-bold text-accent">{p.price || 'Liên hệ'}</p>
                            <p className="text-[11px] text-ink-muted line-clamp-1">
                              Bán bởi: <strong>{p.sellerName}</strong>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
