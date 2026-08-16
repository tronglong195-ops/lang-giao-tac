import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PenSquare, Image as ImageIcon, Send, ArrowLeft, Info, CheckCircle2 } from 'lucide-react';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { TiptapEditor } from '../components/common/TiptapEditor';
import { CATEGORIES } from './PostListPage';

const PRESET_IMAGES = [
  {
    name: 'Đình làng cổ',
    url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Giếng nước cây bàng',
    url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cánh đồng lúa chín',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Đường hoa làng',
    url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Gặp mặt đồng hương',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
  },
];

export const PostEditorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]); // Mặc định: Ký ức tuổi thơ
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !contentHtml.trim() || !category) {
      setErrorMessage('Vui lòng nhập đầy đủ tiêu đề, chuyên mục và nội dung bài viết.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      const res = await postService.createPost({
        title: title.trim(),
        category,
        coverImageUrl: coverImageUrl.trim() || undefined,
        contentHtml,
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          if (user?.role === 'admin' || user?.role === 'moderator') {
            navigate(`/bai-viet/${res.data.post.slug}`);
          } else {
            navigate('/tai-khoan');
          }
        }, 1800);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Có lỗi xảy ra khi gửi bài viết.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back & Breadcrumbs */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-sm font-medium text-ink-muted hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại</span>
      </button>

      {/* Header */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-bold uppercase tracking-wider">
          <PenSquare className="w-3.5 h-3.5" />
          <span>Gửi bài viết cho Làng Quê</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
          Soạn Bài Viết Cộng Đồng
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          Chia sẻ ký ức tuổi thơ, dòng họ - gia phả, công thức món ngon quê nhà hoặc câu chuyện của những người con xa xứ.
        </p>

        {user?.role === 'member' && (
          <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Lưu ý:</strong> Bài viết do thành viên gửi sẽ ở trạng thái <em>Chờ duyệt</em> và được Ban Quản trị phê duyệt trước khi xuất bản công khai.
            </span>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm space-y-6">
        {/* Title Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-ink uppercase tracking-wider">
            Tiêu đề bài viết <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Ký ức những trưa hè tắm giếng cổ và câu chuyện mẹ kể..."
            className="w-full input-warm text-base font-semibold"
            required
          />
        </div>

        {/* Category & Cover Image URL Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Chuyên mục <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full input-warm text-sm bg-surface"
              required
            >
              {CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Ảnh bìa bài viết (URL Cloudinary / Link ảnh)
            </label>
            <input
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/... hoặc chọn gợi ý bên dưới"
              className="w-full input-warm text-sm"
            />
          </div>
        </div>

        {/* Preset Cover Photo Suggestions */}
        <div className="space-y-2 pt-1">
          <span className="text-xs text-ink-muted">Gợi ý ảnh bìa phong cảnh làng quê:</span>
          <div className="flex flex-wrap gap-2">
            {PRESET_IMAGES.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCoverImageUrl(img.url)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  coverImageUrl === img.url
                    ? 'bg-primary text-surface border-primary'
                    : 'bg-paper text-ink-muted border-warmBorder hover:bg-surface'
                }`}
              >
                {img.name}
              </button>
            ))}
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="space-y-1.5 pt-2">
          <label className="block text-xs font-bold text-ink uppercase tracking-wider">
            Nội dung bài viết <span className="text-red-500">*</span>
          </label>
          <TiptapEditor
            content={contentHtml}
            onChange={(html) => setContentHtml(html)}
            placeholder="Kể lại câu chuyện, ký ức tuổi thơ hoặc tâm sự của bạn về Làng Giao Tác..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-warmBorder">
          <Link
            to="/bai-viet"
            className="px-5 py-2.5 rounded-xl border border-warmBorder text-sm font-medium text-ink hover:bg-paper"
          >
            Hủy bỏ
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary text-surface font-semibold text-sm hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Đang gửi bài viết...' : 'Gửi bài viết'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
