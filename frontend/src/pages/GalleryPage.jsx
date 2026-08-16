import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Calendar, PlusCircle, User, ArrowRight } from 'lucide-react';
import { photoService } from '../services/photoService';
import { useAuth } from '../context/AuthContext';

export const GalleryPage = () => {
  const { isAdminOrMod } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Modal Create Album
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchAlbums = async (page = 1) => {
    setLoading(true);
    try {
      const data = await photoService.getAlbums({ page, limit: 12 });
      if (data) {
        setAlbums(data.albums);
        setPagination(data.pagination);
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
            Tổng hợp những thước ảnh tư liệu quý báu, lễ hội và sinh hoạt đời thường của Làng Giao Tác.
          </p>
        </div>

        {isAdminOrMod && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-primary text-surface font-semibold text-sm hover:bg-primary-dark transition-colors shadow-md self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tạo Album ảnh mới</span>
          </button>
        )}
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

                <div className="p-6 pt-0">
                  <Link
                    to={`/thu-vien-anh/${album.id}`}
                    className="w-full py-2.5 rounded-xl bg-paper hover:bg-primary-subtle text-primary-dark text-xs font-bold transition-colors border border-warmBorder flex items-center justify-center space-x-1"
                  >
                    <span>Mở xem Album</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
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
