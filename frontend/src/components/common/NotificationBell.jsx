import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  FileText,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  ExternalLink,
  UserPlus,
} from 'lucide-react';
import { notificationService } from '../../services/notification.service';
import { useAuth } from '../../context/AuthContext';

export const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Lấy số lượng thông báo chưa đọc
  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      // Bỏ qua lỗi ngầm
    }
  };

  // Lấy danh sách thông báo đầy đủ khi mở dropdown
  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await notificationService.getNotifications({ limit: 15 });
      setNotifications(data.data || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Lỗi lấy danh sách thông báo:', err);
    } finally {
      setLoading(false);
    }
  };

  // Định kỳ thăm dò thông báo chưa đọc (20 giây/lần)
  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 20000);
    return () => clearInterval(interval);
  }, [user]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = async (item) => {
    if (!item.isRead) {
      try {
        await notificationService.markAsRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Lỗi đánh dấu đã đọc:', err);
      }
    }
    setIsOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Lỗi đánh dấu tất cả đã đọc:', err);
    }
  };

  if (!user) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'member_registered':
        return <UserPlus className="w-4 h-4 text-emerald-600" />;
      case 'post_pending':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'photo_pending':
        return <ImageIcon className="w-4 h-4 text-blue-600" />;
      case 'post_approved':
      case 'photo_approved':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-primary" />;
    }
  };

  const formatTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        aria-label="Thông báo"
        className="relative p-2 sm:p-2.5 rounded-xl bg-paper hover:bg-surface border border-warmBorder/80 text-ink hover:text-primary transition-all duration-200 shadow-xs focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-auto sm:mt-2.5 w-[calc(100vw-24px)] max-w-sm sm:w-96 bg-surface rounded-2xl border border-warmBorder shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-paper border-b border-warmBorder flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-primary-dark">Thông Báo</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                  {unreadCount} mới
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-primary hover:text-primary-dark flex items-center space-x-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đọc tất cả</span>
              </button>
            )}
          </div>

          {/* List of Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-warmBorder/50">
            {loading ? (
              <div className="p-8 text-center text-xs text-ink-muted">
                Đang tải thông báo...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center mx-auto text-ink-muted">
                  <Bell className="w-5 h-5 opacity-40" />
                </div>
                <p className="text-xs text-ink-muted">Chưa có thông báo nào.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 flex items-start space-x-3 cursor-pointer transition-colors ${
                    item.isRead
                      ? 'bg-surface hover:bg-paper/50'
                      : 'bg-primary-subtle/40 hover:bg-primary-subtle/70 font-medium'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-surface border border-warmBorder shrink-0 mt-0.5 shadow-xs">
                    {getNotificationIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-xs font-bold truncate ${
                          item.isRead ? 'text-ink' : 'text-primary-dark'
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-ink-muted shrink-0">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted line-clamp-2 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Link */}
          {user.role === 'admin' || user.role === 'moderator' ? (
            <div className="p-2.5 bg-paper/80 border-t border-warmBorder text-center">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/quan-tri');
                }}
                className="text-xs font-bold text-primary hover:text-primary-dark flex items-center justify-center space-x-1.5 w-full py-1"
              >
                <span>Mở Bảng Quản Trị & Phê Duyệt</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
