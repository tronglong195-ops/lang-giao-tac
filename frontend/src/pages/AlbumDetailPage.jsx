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
  Share2,
  Trash2,
  FileImage,
  Sparkles,
  Link2,
} from 'lucide-react';
import { photoService } from '../services/photoService';
import { useAuth } from '../context/AuthContext';
import { LightboxModal } from '../components/common/LightboxModal';
import { StatusBadge } from '../components/common/StatusBadge';
import { ShareModal } from '../components/common/ShareModal';

export const AlbumDetailPage = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Share Modal
  const [showShareModal, setShowShareModal] = useState(false);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState('device'); // 'device' | 'url'
  const [selectedFiles, setSelectedFiles] = useState([]); // [{ file, previewUrl, caption, takenYear }]
  const [urlImageUrl, setUrlImageUrl] = useState('');
  const [urlCaption, setUrlCaption] = useState('');
  const [urlTakenYear, setUrlTakenYear] = useState('');
  const [batchYear, setBatchYear] = useState('');
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

  // Xử lý chọn nhiều ảnh từ thiết bị
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFiles((prev) => [
          ...prev,
          {
            previewUrl: reader.result,
            fileName: file.name,
            fileSize: (file.size / 1024 / 1024).toFixed(2),
            caption: '',
            takenYear: batchYear || new Date().getFullYear().toString(),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateFileCaption = (index, val) => {
    setSelectedFiles((prev) =>
      prev.map((item, i) => (i === index ? { ...item, caption: val } : item))
    );
  };

  const handleUpdateFileYear = (index, val) => {
    setSelectedFiles((prev) =>
      prev.map((item, i) => (i === index ? { ...item, takenYear: val } : item))
    );
  };

  const handleApplyBatchYear = (year) => {
    setBatchYear(year);
    setSelectedFiles((prev) => prev.map((item) => ({ ...item, takenYear: year })));
  };

  // Thực hiện tải ảnh lên
  const handleUploadPhotos = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      if (uploadMode === 'device') {
        if (selectedFiles.length === 0) {
          alert('Vui lòng chọn ít nhất 1 bức ảnh từ thiết bị.');
          setUploading(false);
          return;
        }

        const photosData = selectedFiles.map((f) => ({
          imageUrl: f.previewUrl,
          caption: f.caption.trim() || undefined,
          takenYear: f.takenYear ? parseInt(f.takenYear, 10) : undefined,
        }));

        const res = await photoService.addPhotosBatch({
          albumId,
          photos: photosData,
        });

        setMessage(res.message);
        setTimeout(() => {
          setShowUploadModal(false);
          setSelectedFiles([]);
          setMessage('');
          fetchAlbum();
        }, 1500);
      } else {
        // Upload bằng URL
        if (!urlImageUrl.trim()) return;

        const res = await photoService.addPhoto({
          albumId,
          imageUrl: urlImageUrl.trim(),
          caption: urlCaption.trim() || undefined,
          takenYear: urlTakenYear ? parseInt(urlTakenYear, 10) : undefined,
        });

        setMessage(res.message);
        setTimeout(() => {
          setShowUploadModal(false);
          setUrlImageUrl('');
          setUrlCaption('');
          setUrlTakenYear('');
          setMessage('');
          fetchAlbum();
        }, 1500);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi tải ảnh lên.');
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate('/thu-vien-anh')}
          className="inline-flex items-center space-x-1.5 text-sm font-medium text-ink-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách Album</span>
        </button>

        <div className="flex items-center space-x-3">
          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-secondary/15 hover:bg-secondary/25 text-accent font-semibold text-xs sm:text-sm transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Chia sẻ Album</span>
          </button>

          {/* Upload Button */}
          {user ? (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-primary text-surface font-semibold text-xs sm:text-sm hover:bg-primary-dark transition-colors shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Đóng góp ảnh từ máy</span>
            </button>
          ) : (
            <Link
              to="/dang-nhap"
              className="inline-flex items-center space-x-1.5 text-xs text-primary font-semibold hover:underline"
            >
              <span>Đăng nhập để tải ảnh lên</span>
            </Link>
          )}
        </div>
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
            {album.photos?.length || 0} bức ảnh tư liệu
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
              className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-warm transition-all duration-300 bg-paper aspect-square sm:aspect-[4/3]"
            >
              <img
                src={photo.imageUrl}
                alt={photo.caption || 'Ảnh làng Giao Tác'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Status Badge overlay if not approved (visible for admin/mod) */}
              {photo.status !== 'approved' && (
                <div className="absolute top-2 left-2 z-10">
                  <StatusBadge status={photo.status} />
                </div>
              )}

              {/* Overlay hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-surface text-xs space-y-1">
                {photo.caption && (
                  <p className="font-medium line-clamp-2 text-xs text-white">{photo.caption}</p>
                )}
                <div className="flex items-center justify-between text-[10px] text-paper/80 pt-1 border-t border-white/20">
                  <span>{photo.takenYear ? `Năm ${photo.takenYear}` : 'Lưu trữ'}</span>
                  <span className="truncate max-w-[100px]">{photo.uploader?.fullName || 'Ẩn danh'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface rounded-2xl border border-warmBorder text-ink-muted text-sm space-y-4">
          <FileImage className="w-12 h-12 mx-auto text-ink-light" />
          <p className="font-medium">Album này chưa có bức ảnh nào.</p>
          {user && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark transition-colors shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Tải ảnh từ điện thoại/máy tính lên ngay</span>
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

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={album.title}
        url={`/thu-vien-anh/${album.id}`}
        description={album.description}
      />

      {/* Upload Photo Modal (Multi-Photo & Device Support) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-surface rounded-3xl border border-warmBorder max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-warmHover my-8 max-h-[90vh] flex flex-col">
            <div>
              <h3 className="text-xl font-bold text-primary-dark">Tải Ảnh Lên Album</h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Album: <strong className="text-ink">{album.title}</strong>
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-warmBorder text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUploadMode('device')}
                className={`flex-1 py-2.5 text-center border-b-2 flex items-center justify-center space-x-1.5 transition-colors ${
                  uploadMode === 'device'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                <FileImage className="w-4 h-4" />
                <span>📁 Tải từ thiết bị (Điện thoại / Máy tính)</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`flex-1 py-2.5 text-center border-b-2 flex items-center justify-center space-x-1.5 transition-colors ${
                  uploadMode === 'url'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                <Link2 className="w-4 h-4" />
                <span>🔗 Dán liên kết ảnh (URL)</span>
              </button>
            </div>

            {user?.role === 'member' && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>Ảnh của bạn sẽ được gửi tới Ban Quản trị kiểm duyệt trước khi hiển thị rộng rãi.</span>
              </div>
            )}

            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleUploadPhotos} className="space-y-4 flex-1 overflow-y-auto pr-1">
              {uploadMode === 'device' ? (
                /* DEVICE MULTI-UPLOAD */
                <div className="space-y-4">
                  {/* File Picker Box */}
                  <label className="border-2 border-dashed border-warmBorder hover:border-primary/50 bg-paper/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center space-y-2 group">
                    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-primary">Nhấn để chọn ảnh từ máy</span>
                      <p className="text-[11px] text-ink-muted">
                        Hỗ trợ định dạng JPG, PNG, WEBP (Có thể chọn nhiều ảnh cùng lúc)
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>

                  {/* Batch Year setting */}
                  {selectedFiles.length > 1 && (
                    <div className="flex items-center space-x-2 p-3 bg-secondary/10 rounded-xl text-xs">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span className="font-semibold text-accent">Năm chụp cho tất cả:</span>
                      <input
                        type="number"
                        min="1900"
                        max="2099"
                        placeholder="VD: 2024"
                        value={batchYear}
                        onChange={(e) => handleApplyBatchYear(e.target.value)}
                        className="w-24 px-2 py-1 bg-surface border border-warmBorder rounded-lg text-xs"
                      />
                    </div>
                  )}

                  {/* Selected Photos Preview List */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-ink">
                        <span>Đã chọn ({selectedFiles.length} bức ảnh)</span>
                        <button
                          type="button"
                          onClick={() => setSelectedFiles([])}
                          className="text-red-500 hover:underline"
                        >
                          Xóa tất cả
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                        {selectedFiles.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-paper rounded-2xl border border-warmBorder flex gap-3 relative group"
                          >
                            <img
                              src={item.previewUrl}
                              alt={item.fileName}
                              className="w-20 h-20 object-cover rounded-xl shrink-0 border border-warmBorder"
                            />
                            <div className="flex-1 space-y-1.5 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-[11px] font-bold text-ink truncate max-w-[120px]">
                                  {item.fileName}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSelectedFile(idx)}
                                  className="text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <input
                                type="text"
                                placeholder="Chú thích ảnh..."
                                value={item.caption}
                                onChange={(e) => handleUpdateFileCaption(idx, e.target.value)}
                                className="w-full px-2 py-1 bg-surface border border-warmBorder rounded-lg text-[11px] placeholder:text-ink-light"
                              />

                              <div className="flex items-center space-x-1.5 text-[10px]">
                                <span className="text-ink-muted">Năm:</span>
                                <input
                                  type="number"
                                  placeholder="2024"
                                  value={item.takenYear}
                                  onChange={(e) => handleUpdateFileYear(idx, e.target.value)}
                                  className="w-16 px-1.5 py-0.5 bg-surface border border-warmBorder rounded text-[10px]"
                                />
                                <span className="text-ink-light ml-auto">{item.fileSize} MB</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* URL UPLOAD */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Đường dẫn ảnh (URL) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={urlImageUrl}
                      onChange={(e) => setUrlImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full input-warm text-sm"
                      required
                      autoFocus
                    />
                  </div>

                  {urlImageUrl && (
                    <div className="p-2 bg-paper rounded-2xl border border-warmBorder text-center">
                      <img
                        src={urlImageUrl}
                        alt="Xem trước"
                        className="max-h-40 mx-auto rounded-xl object-contain"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Chú thích bức ảnh
                    </label>
                    <input
                      type="text"
                      value={urlCaption}
                      onChange={(e) => setUrlCaption(e.target.value)}
                      placeholder="Ví dụ: Lễ tế thần Đình làng Giao Tác..."
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
                      value={urlTakenYear}
                      onChange={(e) => setUrlTakenYear(e.target.value)}
                      placeholder="Ví dụ: 2024"
                      className="w-full input-warm text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-warmBorder">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-warmBorder text-sm font-medium text-ink hover:bg-paper"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploading || (uploadMode === 'device' && selectedFiles.length === 0)}
                  className="px-5 py-2 rounded-xl bg-primary text-surface text-sm font-semibold hover:bg-primary-dark shadow-sm disabled:opacity-50 inline-flex items-center space-x-2"
                >
                  {uploading ? (
                    <span>Đang tải lên ({selectedFiles.length} ảnh)...</span>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>
                        {uploadMode === 'device'
                          ? `Tải lên ${selectedFiles.length ? `(${selectedFiles.length} ảnh)` : ''}`
                          : 'Lưu ảnh'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
