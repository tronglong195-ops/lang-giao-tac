import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  PenSquare,
  Image as ImageIcon,
  Send,
  ArrowLeft,
  Info,
  CheckCircle2,
  Upload,
  X,
  Link as LinkIcon,
  Sparkles,
  Edit,
} from 'lucide-react';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { TiptapEditor } from '../components/common/TiptapEditor';
import { CATEGORIES } from './PostListPage';

const PRESET_IMAGES = [
  {
    name: 'Đình làng Giao Tác',
    url: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
  },
  {
    name: 'Đường hoa nông thôn mới',
    url: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
  },
  {
    name: 'Cánh đồng Hồng Lĩnh',
    url: '/images/village/480212312_1025661522929555_8709853623689778697_n.jpg',
  },
  {
    name: 'Giếng nước cổ đầu làng',
    url: '/images/village/474096867_1006185811543793_8014259646970075430_n.jpg',
  },
  {
    name: 'Hội làng & Tế lễ',
    url: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
  },
  {
    name: 'Bóng chuyền thanh niên',
    url: '/images/village/486669654_9667039090022304_8533644671297434351_n.jpg',
  },
];

export const PostEditorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();
  const isEditing = Boolean(slug);
  const fileInputRef = useRef(null);

  const [editingPostId, setEditingPostId] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]); // Mặc định: Ký ức tuổi thơ
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [uploadMode, setUploadMode] = useState('device'); // 'device' | 'url' | 'presets'
  const [imageFileName, setImageFileName] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Nạp dữ liệu bài viết cũ khi ở chế độ Sửa (isEditing)
  useEffect(() => {
    if (!slug) return;

    const fetchPostToEdit = async () => {
      setLoadingPost(true);
      try {
        const post = await postService.getPostBySlug(slug);
        if (post) {
          // Kiểm tra quyền: tác giả hoặc admin/moderator
          if (
            user &&
            post.authorId !== user.id &&
            user.role !== 'admin' &&
            user.role !== 'moderator'
          ) {
            alert('Bạn không có quyền chỉnh sửa bài viết này.');
            navigate('/bai-viet');
            return;
          }

          setEditingPostId(post.id);
          setTitle(post.title);
          if (post.category) setCategory(post.category);
          if (post.coverImageUrl) setCoverImageUrl(post.coverImageUrl);
          if (post.contentHtml) setContentHtml(post.contentHtml);
        }
      } catch (err) {
        setErrorMessage('Không thể tải thông tin bài viết để chỉnh sửa.');
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPostToEdit();
  }, [slug, user]);

  // Xử lý upload ảnh từ thiết bị (máy tính / điện thoại)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Dung lượng ảnh tối đa là 10MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImageUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCoverImageUrl('');
    setImageFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !contentHtml.trim() || !category) {
      setErrorMessage('Vui lòng nhập đầy đủ tiêu đề, chuyên mục và nội dung bài viết.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    try {
      if (isEditing && editingPostId) {
        // Cập nhật bài viết
        const res = await postService.updatePost(editingPostId, {
          title: title.trim(),
          category,
          coverImageUrl: coverImageUrl.trim() || undefined,
          contentHtml,
        });

        setSuccessMessage('Đã cập nhật bài viết thành công!');
        setTimeout(() => {
          navigate(`/bai-viet/${res.data?.post?.slug || slug}`);
        }, 1500);
      } else {
        // Tạo mới bài viết
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
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-ink-muted">
        Đang nạp thông tin bài viết...
      </div>
    );
  }

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
          {isEditing ? <Edit className="w-3.5 h-3.5" /> : <PenSquare className="w-3.5 h-3.5" />}
          <span>{isEditing ? 'Chỉnh Sửa Bài Viết' : 'Gửi bài viết cho Làng Quê'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
          {isEditing ? 'Chỉnh Sửa Bài Viết Đã Đăng' : 'Soạn Bài Viết Cộng Đồng'}
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          {isEditing
            ? 'Cập nhật lại tiêu đề, hình ảnh bìa và nội dung bài viết của bạn.'
            : 'Chia sẻ ký ức tuổi thơ, dòng họ - gia phả, công thức món ngon quê nhà hoặc câu chuyện của những người con xa xứ.'}
        </p>

        {!isEditing && user?.role === 'member' && (
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

        {/* Category */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-ink uppercase tracking-wider">
            Chuyên mục bài viết <span className="text-red-500">*</span>
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

        {/* Cover Image Upload Section */}
        <div className="space-y-3 pt-1 border-t border-warmBorder">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Ảnh bìa bài viết
            </label>
            {/* Mode selector tabs */}
            <div className="flex items-center space-x-1 bg-paper p-1 rounded-xl border border-warmBorder text-xs">
              <button
                type="button"
                onClick={() => setUploadMode('device')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                  uploadMode === 'device' ? 'bg-surface text-primary font-bold shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Từ thiết bị</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('presets')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                  uploadMode === 'presets' ? 'bg-surface text-primary font-bold shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ảnh mẫu làng</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                  uploadMode === 'url' ? 'bg-surface text-primary font-bold shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Nhập URL</span>
              </button>
            </div>
          </div>

          {/* 1. Mode: Upload From Device */}
          {uploadMode === 'device' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="post-cover-upload"
              />
              <label
                htmlFor="post-cover-upload"
                className="cursor-pointer border-2 border-dashed border-warmBorder hover:border-primary/60 bg-paper/50 hover:bg-paper rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-primary-dark">
                  Nhấp vào đây để chọn ảnh từ máy tính hoặc điện thoại
                </span>
                <span className="text-xs text-ink-muted mt-1">
                  Hỗ trợ định dạng JPG, PNG, WEBP (Dung lượng tối đa 10MB)
                </span>
              </label>
            </div>
          )}

          {/* 2. Mode: Preset Images */}
          {uploadMode === 'presets' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCoverImageUrl(img.url);
                      setImageFileName(img.name);
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 text-left group transition-all ${
                      coverImageUrl === img.url ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-warmBorder opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-20 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                      <span className="text-white text-[11px] font-semibold leading-tight line-clamp-1">
                        {img.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Mode: Input URL */}
          {uploadMode === 'url' && (
            <div>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => {
                  setCoverImageUrl(e.target.value);
                  setImageFileName('');
                }}
                placeholder="https://images.unsplash.com/... hoặc link ảnh Cloudinary"
                className="w-full input-warm text-sm"
              />
            </div>
          )}

          {/* Image Preview */}
          {coverImageUrl && (
            <div className="relative mt-3 rounded-2xl overflow-hidden border border-warmBorder max-h-56 shadow-sm group">
              <img
                src={coverImageUrl}
                alt="Xem trước ảnh bìa"
                className="w-full h-52 object-cover"
              />
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors shadow-md backdrop-blur-sm"
                  title="Xóa ảnh này"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {imageFileName && (
                <div className="absolute bottom-2 left-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs backdrop-blur-sm">
                  {imageFileName}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rich Text Editor */}
        <div className="space-y-1.5 pt-2 border-t border-warmBorder">
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
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-primary text-surface font-bold text-sm hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Đang gửi bài...' : 'Gửi bài viết'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
