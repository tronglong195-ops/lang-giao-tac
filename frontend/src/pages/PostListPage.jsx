import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Search, PenSquare, Eye, MessageSquare, Calendar, User, ArrowRight } from 'lucide-react';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';

export const CATEGORIES = [
  'Tất cả',
  'Ký ức tuổi thơ',
  'Dòng họ - Gia phả',
  'Ẩm thực quê',
  'Đổi thay của làng',
  'Người con xa quê',
];

export const PostListPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'Tất cả';

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async (page = 1, cat = activeCategory, searchQuery = search) => {
    setLoading(true);
    try {
      const data = await postService.getPosts({
        page,
        limit: 9,
        category: cat === 'Tất cả' ? undefined : cat,
        search: searchQuery || undefined,
        status: 'published',
      });
      if (data) {
        setPosts(data.posts);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, activeCategory, search);
  }, [activeCategory]);

  const handleCategoryChange = (cat) => {
    if (cat === 'Tất cả') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(1, activeCategory, search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-warmBorder">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-accent/15 text-accent-dark text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tiếng Lòng Dân Làng</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark tracking-tight">
            Bài Viết & Kỷ Niệm Làng Quê
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Nơi bà con và con em khắp mọi miền gửi gắm tình yêu, ký ức và câu chuyện về Làng Giao Tác.
          </p>
        </div>

        <Link
          to="/bai-viet/viet-bai"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-primary text-surface font-semibold text-sm hover:bg-primary-dark transition-colors shadow-md self-start md:self-auto"
        >
          <PenSquare className="w-4 h-4" />
          <span>Gửi bài viết mới</span>
        </Link>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-surface shadow-sm'
                  : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, nội dung bài viết..."
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
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="text-center py-20 text-ink-muted">Đang tải danh sách bài viết...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-warmBorder text-ink-muted text-sm space-y-3">
          <p>Chưa có bài viết nào trong chuyên mục này.</p>
          <Link
            to="/bai-viet/viet-bai"
            className="inline-block px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold"
          >
            Hãy là người đầu tiên chia sẻ!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-surface rounded-2xl border border-warmBorder overflow-hidden shadow-warm hover:shadow-warmHover transition-all duration-300 flex flex-col justify-between group"
            >
              {post.coverImageUrl ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-surface/90 text-primary-dark backdrop-blur-md shadow-sm">
                    {post.category}
                  </span>
                </div>
              ) : (
                <div className="p-6 pb-0">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary-subtle text-primary-dark">
                    {post.category}
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h2 className="font-bold text-lg text-ink group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    <Link to={`/bai-viet/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <div
                    className="text-xs text-ink-muted line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: post.contentHtml.replace(/<[^>]*>?/gm, ''),
                    }}
                  />
                </div>

                <div className="pt-4 border-t border-warmBorder space-y-2">
                  <div className="flex items-center justify-between text-xs text-ink-light">
                    <div className="flex items-center space-x-2">
                      {post.author.avatarUrl ? (
                        <img
                          src={post.author.avatarUrl}
                          alt={post.author.fullName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary text-surface flex items-center justify-center font-bold text-[10px]">
                          {post.author.fullName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-ink truncate max-w-[120px]">
                          {post.author.fullName}
                        </p>
                        {post.author.hometownGroup && (
                          <p className="text-[10px] text-accent truncate">
                            {post.author.hometownGroup}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-[11px]">
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{post.viewCount}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post._count?.comments || 0}</span>
                      </span>
                    </div>
                  </div>
                </div>
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
              onClick={() => fetchPosts(p, activeCategory, search)}
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
