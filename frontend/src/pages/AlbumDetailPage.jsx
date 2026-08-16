import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Image as ImageIcon,
  Calendar,
  User,
  ArrowLeft,
  UploadCloud,
  PlusCircle,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react';
import { photoService } from '../services/photoService';
import { useAuth } from '../context/AuthContext';
import { LightboxModal } from '../components/common/LightboxModal';
import { StatusBadge } from '../components/common/StatusBadge';

export const AlbumDetailPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [takenYear, setTakenYear] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAlbum = async () => {
    setLoading(true);
    try {
      const data = await photoService.getAlbumById(albumId);
      if (data) {
        setAlbum(data);
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết album:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, [albumId]);

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    setUploading(true);
    setMessage('');
    try {
      const res = await photoService.addPhoto({
        albumId,
        imageUrl: imageUrl.trim(),
        caption: caption.trim() || undefined,
        takenYear: takenYear ? parseInt(takenYear, 10) : undefined,
      });

      setMessage(res.message);
      setTimeout(() => {
        setShowUploadModal(false);
        setImageUrl('');
        setCaption('');
        setTakenYear('');
        setMessage('');
        fetchAlbum();
      }, 1500);
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi gửi ảnh.');
    } finally {
      setUploading(false);
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-ink-muted">
        Đang tải Album ảnh...
      </div>
    );
  }

  if (!album) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-surface rounded-2xl border border-warmBorder text-center space-y-4 shadow-warm">
        <h2 className="text-xl font-bold text-ink">Album không tồn tại</h2>
        <Link
          to="/thu-vien-anh"
          className="inline-block px-5 py-2.5 rounded-xl bg-primary text-surface font-medium text-sm"
        >
          Quay lại Thư viện ảnh
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-sm font-medium text-ink-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách Album</span>
        </button>

        {user ? (
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-primary text-surface font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Đóng góp ảnh cho Album</span>
          </button>
        ) : (
          <Link
            to="/dang-nhap"
            className="inline-flex items-center space-x-1.5 text-xs text-primary font-semibold hover:underline"
          >
            <span>Đăng nhập để đóng góp ảnh</span>
          </Link>
        )}
      </div>

      {/* Album Header Info */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {album.eventDate && (
            <span className="flex items-center space-x-1 text-accent font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Sự kiện: {new Date(album.eventDate).toLocaleDateString('vi-VN')}</span>
            </span>
          )}
          <span className="text-ink-light">•</span>
          <span className="text-ink-muted font-medium">
            {album.photos?.length || 0} bức ảnh
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-primary-dark tracking-tight leading-snug">
          {album.title}
        </h1>

        {album.description && (
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-3xl">
            {album.description}
          </p>
        )}
      </div>

      {/* Photos Grid */}
      {album.photos && album.photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {album.photos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-warm transition-all duration-300 bg-paper"
            >
              <img
                src={photo.imageUrl}
                alt={photo.caption || 'Ảnh làng Giao Tác'}
                className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Status Badge overlay if not approved (visible for admin/mod) */}
              {photo.status !== 'approved' && (
                <div className="absolute top-2 left-2 z-10">
                  <StatusBadge status={photo.status} />
                </div>
              )}

              {/* Overlay hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-surface text-xs space-y-1">
                {photo.caption && (
                  <p className="font-medium line-clamp-2 text-xs">{photo.caption}</p>
                )}
                <div className="flex items-center justify-between text-[10px] text-paper/80 pt-1">
                  <span>{photo.takenYear ? `Năm ${photo.takenYear}` : 'Lưu trữ'}</span>
                  <span>{photo.uploader?.fullName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-2xl border border-warmBorder text-ink-muted text-sm space-y-3">
          <p>Album này chưa có bức ảnh nào.</p>
          {user && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-block px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold"
            >
              Tải lên bức ảnh đầu tiên
            </button>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        photos={album.photos || []}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(idx) => setLightboxIndex(idx)}
      />

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface rounded-3xl border border-warmBorder max-w-md w-full p-6 sm:p-8 space-y-4 shadow-warmHover">
            <h3 className="text-xl font-bold text-ink">Đóng Góp Ảnh Vào Album</h3>
            <p className="text-xs text-ink-muted">
              Dán liên kết ảnh từ Cloudinary hoặc các dịch vụ lưu trữ ảnh trực tuyến.
            </p>

            {user?.role === 'member' && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>Ảnh của bạn sẽ được gửi tới Ban Quản trị phê duyệt trước khi hiển thị.</span>
              </div>
            )}

            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleUploadPhoto} className="space-y-4 pt-1">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Đường dẫn ảnh (URL Cloudinary) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full input-warm text-sm"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Chú thích bức ảnh
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Ví dụ: Rước kiệu ngày hội rằm tháng Giêng..."
                  className="w-full input-warm text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Năm chụp
                </label>
                <input
                  type="number"
                  min="1900"
                  max="2099"
                  value={takenYear}
                  onChange={(e) => setTakenYear(e.target.value)}
                  placeholder="Ví dụ: 2024"
                  className="w-full input-warm text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-warmBorder text-sm font-medium text-ink hover:bg-paper"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl bg-primary text-surface text-sm font-semibold hover:bg-primary-dark shadow-sm disabled:opacity-50"
                >
                  {uploading ? 'Đang gửi...' : 'Gửi ảnh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
