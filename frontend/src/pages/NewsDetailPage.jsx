import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Bell, Calendar, User, ArrowLeft, Share2, Landmark } from 'lucide-react';
import { newsService } from '../services/newsService';

export const NewsDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await newsService.getNewsBySlug(slug);
        if (data) {
          setNewsItem(data);
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết tin tức:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-ink-muted">
        Đang tải nội dung thông báo...
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-surface rounded-2xl border border-warmBorder text-center space-y-4">
        <h2 className="text-xl font-bold text-ink">Không tìm thấy thông báo</h2>
        <p className="text-sm text-ink-muted">
          Bản tin này có thể đã bị xóa hoặc đường dẫn không còn khả dụng.
        </p>
        <Link
          to="/tin-tuc"
          className="inline-block px-5 py-2.5 rounded-xl bg-primary text-surface font-medium text-sm"
        >
          Quay lại danh sách tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-sm font-medium text-ink-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface border border-warmBorder text-xs font-medium text-ink hover:bg-paper transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Đã sao chép link!' : 'Chia sẻ'}</span>
        </button>
      </div>

      {/* Main Content Article */}
      <article className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-10 shadow-warm space-y-8">
        {/* Header */}
        <div className="space-y-4 border-b border-warmBorder pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-primary-subtle text-primary font-bold">
              {newsItem.source || 'Ban Quản lý Làng Giao Tác'}
            </span>
            <span className="text-ink-light">•</span>
            <span className="flex items-center space-x-1 text-ink-muted font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Ngày đăng: {new Date(newsItem.publishedAt).toLocaleDateString('vi-VN')}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-primary-dark tracking-tight leading-snug">
            {newsItem.title}
          </h1>

          <div className="flex items-center space-x-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-primary-subtle text-primary flex items-center justify-center font-bold text-xs">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-ink">
                Người ký duyệt: {newsItem.author?.fullName || 'Ban Quản trị'}
              </p>
              <p className="text-[11px] text-ink-muted">Cổng thông tin Làng Giao Tác (Hà Tĩnh)</p>
            </div>
          </div>
        </div>

        {/* Content Body (Rich Text) */}
        <div
          className="tiptap-content text-base sm:text-lg leading-relaxed text-ink/90"
          dangerouslySetInnerHTML={{ __html: newsItem.contentHtml }}
        />

        {/* Official Stamp / Footer note */}
        <div className="mt-10 p-5 rounded-2xl bg-paper border border-warmBorder flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-bold text-sm text-ink">BAN QUẢN LÝ LÀNG GIAO TÁC</p>
            <p className="text-xs text-ink-muted">
              Mọi thắc mắc hoặc ý kiến đóng góp, xin liên hệ trực tiếp Trưởng thôn hoặc Nhà văn hóa.
            </p>
          </div>
          <Link
            to="/dong-huong"
            className="shrink-0 px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark"
          >
            Liên hệ BLL
          </Link>
        </div>
      </article>
    </div>
  );
};
