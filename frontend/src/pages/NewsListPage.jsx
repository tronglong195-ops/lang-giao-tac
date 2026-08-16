import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, Calendar, User, ChevronRight, PlusCircle } from 'lucide-react';
import { newsService } from '../services/newsService';
import { useAuth } from '../context/AuthContext';

export const NewsListPage = () => {
  const { isAdminOrMod } = useAuth();
  const [newsList, setNewsList] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNews = async (page = 1, searchQuery = search) => {
    setLoading(true);
    try {
      const data = await newsService.getNews({ page, limit: 8, search: searchQuery });
      if (data) {
        setNewsList(data.news);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Lỗi khi tải tin tức:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(1, search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-warmBorder">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-secondary/15 text-accent text-xs font-bold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Thông báo chính quyền & Ban quản lý</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark tracking-tight">
            Tin Tức & Thông Báo Làng Giao Tác
          </h1>
        </div>

        {isAdminOrMod && (
          <Link
            to="/quan-tri?tab=news"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-primary text-surface font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Quản lý & Đăng tin</span>
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm thông báo, tin tức..."
            className="w-full input-warm pl-10 text-sm"
          />
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-primary text-surface font-medium text-sm hover:bg-primary-dark transition-colors"
        >
          Tìm
        </button>
      </form>

      {/* News List */}
      {loading ? (
        <div className="text-center py-20 text-ink-muted">Đang tải danh sách tin tức...</div>
      ) : newsList.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-warmBorder text-ink-muted text-sm">
          Không tìm thấy tin tức hoặc thông báo nào phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsList.map((item) => (
            <article
              key={item.id}
              className="bg-surface rounded-2xl border border-warmBorder p-6 sm:p-7 shadow-warm hover:shadow-warmHover transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-ink-light">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary font-semibold">
                    {item.source || 'Thông báo chính thức'}
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.publishedAt).toLocaleDateString('vi-VN')}</span>
                  </span>
                </div>

                <h2 className="text-xl font-bold text-ink group-hover:text-primary transition-colors leading-snug">
                  <Link to={`/tin-tuc/${item.slug}`}>{item.title}</Link>
                </h2>

                <div
                  className="text-xs sm:text-sm text-ink-muted line-clamp-3 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: item.contentHtml.replace(/<[^>]*>?/gm, ''),
                  }}
                />
              </div>

              <div className="pt-5 mt-4 border-t border-warmBorder flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-ink-light">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>{item.author?.fullName || 'Ban Quản trị'}</span>
                </div>

                <Link
                  to={`/tin-tuc/${item.slug}`}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-primary group-hover:underline"
                >
                  <span>Đọc toàn văn</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
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
