import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, PlusCircle, Clock, ArrowRight } from 'lucide-react';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';

export const EventsPage = () => {
  const { isAdminOrMod } = useAuth();
  const [events, setEvents] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | 'upcoming' | 'past'
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchEvents = async (page = 1, filter = timeFilter) => {
    setLoading(true);
    try {
      const data = await eventService.getEvents({ page, limit: 9, timeFilter: filter });
      if (data) {
        setEvents(data.events);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Lỗi khi tải sự kiện:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(1, timeFilter);
  }, [timeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-warmBorder">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-secondary/15 text-accent text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Sinh Hoạt Cộng Đồng</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark tracking-tight">
            Lễ Hội & Sự Kiện Làng Giao Tác
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Lịch các ngày lễ tế truyền thống, hội làng đầu xuân, giỗ tổ dòng họ và đại hội thể thao thanh niên.
          </p>
        </div>

        {isAdminOrMod && (
          <Link
            to="/quan-tri?tab=events"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-primary text-surface font-semibold text-sm hover:bg-primary-dark transition-colors shadow-md self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Quản lý & Thêm sự kiện</span>
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setTimeFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            timeFilter === 'all'
              ? 'bg-primary text-surface shadow-sm'
              : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
          }`}
        >
          Tất cả sự kiện
        </button>
        <button
          onClick={() => setTimeFilter('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            timeFilter === 'upcoming'
              ? 'bg-primary text-surface shadow-sm'
              : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
          }`}
        >
          Sắp diễn ra
        </button>
        <button
          onClick={() => setTimeFilter('past')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            timeFilter === 'past'
              ? 'bg-primary text-surface shadow-sm'
              : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
          }`}
        >
          Đã diễn ra
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-20 text-ink-muted">Đang tải danh sách sự kiện...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-warmBorder text-ink-muted text-sm">
          Không có sự kiện nào trong danh mục này.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((evt) => {
            const isUpcoming = new Date(evt.eventDate) >= new Date();

            return (
              <article
                key={evt.id}
                className="bg-surface rounded-3xl border border-warmBorder overflow-hidden shadow-warm hover:shadow-warmHover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {evt.coverImageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={evt.coverImageUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-surface/90 text-primary-dark backdrop-blur-md shadow-sm">
                        {isUpcoming ? 'Sắp diễn ra' : 'Đã kết thúc'}
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center space-x-2 text-xs text-primary font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(evt.eventDate).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h2 className="font-bold text-xl text-ink group-hover:text-primary transition-colors leading-snug">
                      {evt.title}
                    </h2>

                    <div className="flex items-center space-x-1.5 text-xs text-ink-muted">
                      <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed line-clamp-3 pt-1">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-warmBorder/60 mt-4 flex items-center justify-between text-xs text-ink-light">
                  <span>Ban Tổ Chức Lễ Hội</span>
                  <span className="font-semibold text-primary">Làng Giao Tác</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchEvents(p, timeFilter)}
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
