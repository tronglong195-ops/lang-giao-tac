import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  Calendar,
  PlusCircle,
  User,
  ArrowRight,
  Share2,
  UploadCloud,
  FileImage,
  Trash2,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { photoService } from '../services/photoService';
import { useAuth } from '../context/AuthContext';
import { ShareModal } from '../components/common/ShareModal';

export const GalleryPage = () => {
  const { user, isAdminOrMod } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Share Modal
  const [shareAlbum, setShareAlbum] = useState(null);

  // Modal Create Album
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [creating, setCreating] = useState(false);

  // Modal Quick Upload Photo to any Album
  const [showQuickUploadModal, setShowQuickUploadModal] = useState(false);
  const [targetAlbumId, setTargetAlbumId] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [batchYear, setBatchYear] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const fetchAlbums = async (page = 1) => {
    setLoading(true);
    try {
      const data = await photoService.getAlbums({ page, limit: 12 });
      if (data) {
        setAlbums(data.albums);
        setPagination(data.pagination);
        if (data.albums.length > 0 && !targetAlbumId) {
          setTargetAlbumId(data.albums[0].id);
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách Album ảnh:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums(1);
  }, []);

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setCreating(true);
    try {
      await photoService.createAlbum({
        title: title.trim(),
        description: description.trim() || undefined,
        eventDate: eventDate || undefined,
      });
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setEventDate('');
      fetchAlbums(1);
    } catch (error) {
      alert(error.response?.data?.message || 'Không thể tạo album.');
    } finally {
      setCreating(false);
    }
  };

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

  const handleQuickUpload = async (e) => {
    e.preventDefault();
    if (!targetAlbumId) {
      alert('Vui lòng chọn một Album để lưu ảnh.');
      return;
    }
    if (selectedFiles.length === 0) {
      alert('Vui lòng chọn ít nhất 1 bức ảnh từ thiết bị.');
      return;
    }

    setUploading(true);
    setUploadMessage('');
    try {
      const photosData = selectedFiles.map((f) => ({
        imageUrl: f.previewUrl,
        caption: f.caption.trim() || undefined,
        takenYear: f.takenYear ? parseInt(f.takenYear, 10) : undefined,
      }));

      const res = await photoService.addPhotosBatch({
        albumId: targetAlbumId,
        photos: photosData,
      });

      setUploadMessage(res.message);
      setTimeout(() => {
        setShowQuickUploadModal(false);
        setSelectedFiles([]);
        setUploadMessage('');
        fetchAlbums(1);
      }, 1500);
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi tải ảnh lên.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-warmBorder">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-secondary/15 text-accent text-xs font-bold uppercase tracking-wider mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Ký Ức & Cảnh Sắc</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark tracking-tight">
            Thư Viện Album Ảnh Làng Quê
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Tổng hợp những thước ảnh tư liệu quý báu, lễ hội và sinh hoạt đời thường của Làng Giao Tác — TDP 9 Thuận Lộc.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          {/* Quick Upload from Device Button */}
          {user && (
            <button
              onClick={() => setShowQuickUploadModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-accent text-surface font-semibold text-xs sm:text-sm hover:bg-accent-dark transition-colors shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Tải ảnh từ máy lên Album</span>
            </button>
          )}

          {/* Create Album (Admin/Mod) */}
          {isAdminOrMod && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-primary text-surface font-semibold text-xs sm:text-sm hover:bg-primary-dark transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tạo Album mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Albums Grid */}
      {loading ? (
        <div className="text-center py-20 text-ink-muted">Đang tải các Album ảnh...</div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-warmBorder text-ink-muted text-sm">
          Chưa có Album ảnh nào được tạo.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => {
            const firstPhotoUrl =
              album.photos?.[0]?.imageUrl ||
              'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80';

            return (
              <article
                key={album.id}
                className="bg-surface rounded-3xl border border-warmBorder overflow-hidden shadow-warm hover:shadow-warmHover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Cover Image Container */}
                  <div className="relative h-56 overflow-hidden bg-paper">
                    <img
                      src={firstPhotoUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-surface/90 text-primary-dark backdrop-blur-md shadow-sm flex items-center space-x-1">
                      <ImageIcon className="w-3.5 h-3.5 text-primary" />
                      <span>{album._count?.photos || 0} ảnh</span>
                    </div>

                    {/* Quick Share Overlay Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShareAlbum(album);
                      }}
                      title="Chia sẻ album này"
                      className="absolute top-3 left-3 p-2 rounded-full bg-surface/90 text-ink hover:text-accent backdrop-blur-md shadow-sm transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Album Info */}
                  <div className="p-6 space-y-2.5">
                    {album.eventDate && (
                      <div className="flex items-center space-x-1 text-xs text-accent font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Sự kiện: {new Date(album.eventDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}

                    <h2 className="font-bold text-xl text-ink group-hover:text-primary transition-colors leading-snug">
                      <Link to={`/thu-vien-anh/${album.id}`}>{album.title}</Link>
                    </h2>

                    {album.description && (
                      <p className="text-xs sm:text-sm text-ink-muted line-clamp-2 leading-relaxed">
                        {album.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center gap-2">
                  <Link
                    to={`/thu-vien-anh/${album.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-paper hover:bg-primary-subtle text-primary-dark text-xs font-bold transition-colors border border-warmBorder flex items-center justify-center space-x-1"
                  >
                    <span>Mở xem Album</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setShareAlbum(album)}
                    title="Chia sẻ Album"
                    className="p-2.5 rounded-xl bg-paper hover:bg-secondary/15 text-accent border border-warmBorder transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Share Modal */}
      {shareAlbum && (
        <ShareModal
          isOpen={Boolean(shareAlbum)}
          onClose={() => setShareAlbum(null)}
          title={shareAlbum.title}
          url={`/thu-vien-anh/${shareAlbum.id}`}
          description={shareAlbum.description}
        />
      )}

      {/* Quick Upload from Device Modal */}
      {showQuickUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-surface rounded-3xl border border-warmBorder max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-warmHover my-8 max-h-[90vh] flex flex-col">
            <div>
              <h3 className="text-xl font-bold text-primary-dark">Tải Ảnh Từ Thiết Bị Lên Album</h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Chọn album và đăng tải ảnh kỷ niệm của bạn và gia đình
              </p>
            </div>

            {user?.role === 'member' && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>Ảnh của bạn sẽ được gửi tới Ban Quản trị kiểm duyệt trước khi hiển thị rộng rãi.</span>
              </div>
            )}

            {uploadMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadMessage}</span>
              </div>
            )}

            <form onSubmit={handleQuickUpload} className="space-y-4 flex-1 overflow-y-auto pr-1">
              {/* Select Album */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Chọn Album lưu ảnh <span className="text-red-500">*</span>
                </label>
                <select
                  value={targetAlbumId}
                  onChange={(e) => setTargetAlbumId(e.target.value)}
                  className="w-full input-warm text-sm"
                  required
                >
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a._count?.photos || 0} ảnh)
                    </option>
                  ))}
                </select>
              </div>

              {/* File Picker Box */}
              <label className="border-2 border-dashed border-warmBorder hover:border-primary/50 bg-paper/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center space-y-2 group">
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-primary">Nhấn để chọn ảnh từ máy tính / điện thoại</span>
                  <p className="text-[11px] text-ink-muted">
                    Hỗ trợ JPG, PNG, WEBP — Có thể chọn nhiều ảnh cùng lúc
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

              {/* Selected Files List */}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                    {selectedFiles.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-paper rounded-2xl border border-warmBorder flex gap-3 relative group"
                      >
                        <img
                          src={item.previewUrl}
                          alt={item.fileName}
                          className="w-16 h-16 object-cover rounded-xl shrink-0 border border-warmBorder"
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
                            className="w-full px-2 py-1 bg-surface border border-warmBorder rounded-lg text-[11px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-warmBorder">
                <button
                  type="button"
                  onClick={() => setShowQuickUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-warmBorder text-sm font-medium text-ink hover:bg-paper"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={uploading || selectedFiles.length === 0}
                  className="px-5 py-2 rounded-xl bg-primary text-surface text-sm font-semibold hover:bg-primary-dark shadow-sm disabled:opacity-50 inline-flex items-center space-x-2"
                >
                  {uploading ? (
                    <span>Đang tải lên ({selectedFiles.length} ảnh)...</span>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Tải lên {selectedFiles.length ? `(${selectedFiles.length} ảnh)` : ''}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tạo Album Mới (Admin/Mod) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface rounded-3xl border border-warmBorder max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-warmHover">
            <h3 className="text-xl font-bold text-ink">Tạo Album Ảnh Mới</h3>
            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Tên Album <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Lễ hội Đình Làng Giao Tác 2026"
                  className="w-full input-warm text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Ngày diễn ra sự kiện
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full input-warm text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Mô tả Album
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả tóm tắt về nội dung và ý nghĩa của album..."
                  className="w-full input-warm text-sm resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-warmBorder text-sm font-medium text-ink hover:bg-paper"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl bg-primary text-surface text-sm font-semibold hover:bg-primary-dark shadow-sm disabled:opacity-50"
                >
                  {creating ? 'Đang tạo...' : 'Tạo Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
