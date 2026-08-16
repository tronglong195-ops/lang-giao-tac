import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Image as ImageIcon,
  Bell,
  Calendar,
  Landmark,
  Users,
  Eye,
  Trash2,
  PlusCircle,
  Edit,
  AlertTriangle,
  Star,
  Lock,
  Unlock,
  Award,
  Search,
  Ban,
  UserX,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { newsService } from '../services/newsService';
import { eventService } from '../services/eventService';
import { historyService } from '../services/historyService';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'posts'; // 'posts' | 'photos' | 'news' | 'events' | 'history' | 'users'

  const [stats, setStats] = useState(null);

  // Pending Posts
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Pending Photos
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  // News Management
  const [newsList, setNewsList] = useState([]);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsSource, setNewsSource] = useState('Ban Quản lý Làng Giao Tác');

  // Events Management
  const [eventList, setEventList] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCover, setEventCover] = useState('');

  // History Management
  const [historyList, setHistoryList] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingHistory, setEditingHistory] = useState(null);
  const [historyYear, setHistoryYear] = useState('');
  const [historyTitle, setHistoryTitle] = useState('');
  const [historyDesc, setHistoryDesc] = useState('');
  const [historyImage, setHistoryImage] = useState('');
  const [historyOrder, setHistoryOrder] = useState(0);

  // Users Management
  const [usersList, setUsersList] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Rating Modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedUserForRating, setSelectedUserForRating] = useState(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingBadge, setRatingBadge] = useState('');
  const [adminNote, setAdminNote] = useState('');

  // Ban Modal
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUserForBan, setSelectedUserForBan] = useState(null);
  const [banReasonInput, setBanReasonInput] = useState('');

  // Confirm Modal
  const [confirmModalData, setConfirmModalData] = useState(null);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      if (data) setStats(data);
    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Load active tab data
  useEffect(() => {
    if (activeTab === 'posts') {
      loadPendingPosts();
    } else if (activeTab === 'photos') {
      loadPendingPhotos();
    } else if (activeTab === 'news') {
      loadNewsList();
    } else if (activeTab === 'events') {
      loadEventList();
    } else if (activeTab === 'history') {
      loadHistoryList();
    } else if (activeTab === 'users' && isAdmin) {
      loadUsersList();
    }
  }, [activeTab]);

  const setTab = (tab) => {
    searchParams.set('tab', tab);
    setSearchParams(searchParams);
  };

  // --- POSTS ---
  const loadPendingPosts = async () => {
    setLoadingPosts(true);
    try {
      const data = await adminService.getPendingPosts();
      if (data?.posts) setPendingPosts(data.posts);
    } catch (error) {
      console.error('Lỗi tải bài pending:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleReviewPost = async (postId, status) => {
    try {
      await adminService.reviewPost(postId, status);
      setSelectedPost(null);
      loadPendingPosts();
      fetchStats();
    } catch (error) {
      alert('Không thể duyệt bài viết.');
    }
  };

  // --- PHOTOS ---
  const loadPendingPhotos = async () => {
    setLoadingPhotos(true);
    try {
      const data = await adminService.getPendingPhotos();
      if (data?.photos) setPendingPhotos(data.photos);
    } catch (error) {
      console.error('Lỗi tải ảnh pending:', error);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleReviewPhoto = async (photoId, status) => {
    try {
      await adminService.reviewPhoto(photoId, status);
      loadPendingPhotos();
      fetchStats();
    } catch (error) {
      alert('Không thể duyệt ảnh.');
    }
  };

  // --- NEWS CRUD ---
  const loadNewsList = async () => {
    try {
      const data = await newsService.getNews({ limit: 50 });
      if (data?.news) setNewsList(data.news);
    } catch (error) {
      console.error('Lỗi tải tin tức:', error);
    }
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;

    try {
      if (editingNews) {
        await newsService.updateNews(editingNews.id, {
          title: newsTitle.trim(),
          contentHtml: newsContent.trim(),
          source: newsSource.trim(),
        });
      } else {
        await newsService.createNews({
          title: newsTitle.trim(),
          contentHtml: newsContent.trim(),
          source: newsSource.trim(),
        });
      }
      setShowNewsModal(false);
      setEditingNews(null);
      setNewsTitle('');
      setNewsContent('');
      loadNewsList();
      fetchStats();
    } catch (error) {
      alert('Lỗi khi lưu tin tức.');
    }
  };

  const handleDeleteNews = (id) => {
    setConfirmModalData({
      title: 'Xóa tin tức',
      message: 'Bạn có chắc chắn muốn xóa tin tức/thông báo này không?',
      onConfirm: async () => {
        await newsService.deleteNews(id);
        setConfirmModalData(null);
        loadNewsList();
        fetchStats();
      },
    });
  };

  // --- EVENTS CRUD ---
  const loadEventList = async () => {
    try {
      const data = await eventService.getEvents({ limit: 50 });
      if (data?.events) setEventList(data.events);
    } catch (error) {
      console.error('Lỗi tải sự kiện:', error);
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDesc.trim() || !eventDate || !eventLocation.trim()) return;

    try {
      if (editingEvent) {
        await eventService.updateEvent(editingEvent.id, {
          title: eventTitle.trim(),
          description: eventDesc.trim(),
          eventDate,
          location: eventLocation.trim(),
          coverImageUrl: eventCover.trim() || undefined,
        });
      } else {
        await eventService.createEvent({
          title: eventTitle.trim(),
          description: eventDesc.trim(),
          eventDate,
          location: eventLocation.trim(),
          coverImageUrl: eventCover.trim() || undefined,
        });
      }
      setShowEventModal(false);
      setEditingEvent(null);
      setEventTitle('');
      setEventDesc('');
      setEventDate('');
      setEventLocation('');
      setEventCover('');
      loadEventList();
      fetchStats();
    } catch (error) {
      alert('Lỗi khi lưu sự kiện.');
    }
  };

  const handleDeleteEvent = (id) => {
    setConfirmModalData({
      title: 'Xóa sự kiện',
      message: 'Bạn có chắc chắn muốn xóa sự kiện này không?',
      onConfirm: async () => {
        await eventService.deleteEvent(id);
        setConfirmModalData(null);
        loadEventList();
        fetchStats();
      },
    });
  };

  // --- HISTORY CRUD ---
  const loadHistoryList = async () => {
    try {
      const data = await historyService.getTimelines();
      if (data) setHistoryList(data);
    } catch (error) {
      console.error('Lỗi tải lịch sử:', error);
    }
  };

  const handleSaveHistory = async (e) => {
    e.preventDefault();
    if (!historyYear.trim() || !historyTitle.trim() || !historyDesc.trim()) return;

    try {
      if (editingHistory) {
        await historyService.updateTimeline(editingHistory.id, {
          yearLabel: historyYear.trim(),
          title: historyTitle.trim(),
          description: historyDesc.trim(),
          imageUrl: historyImage.trim() || undefined,
          orderIndex: Number(historyOrder),
        });
      } else {
        await historyService.createTimeline({
          yearLabel: historyYear.trim(),
          title: historyTitle.trim(),
          description: historyDesc.trim(),
          imageUrl: historyImage.trim() || undefined,
          orderIndex: Number(historyOrder),
        });
      }
      setShowHistoryModal(false);
      setEditingHistory(null);
      setHistoryYear('');
      setHistoryTitle('');
      setHistoryDesc('');
      setHistoryImage('');
      setHistoryOrder(0);
      loadHistoryList();
    } catch (error) {
      alert('Lỗi khi lưu mốc lịch sử.');
    }
  };

  const handleDeleteHistory = (id) => {
    setConfirmModalData({
      title: 'Xóa mốc lịch sử',
      message: 'Bạn có chắc chắn muốn xóa mốc lịch sử này?',
      onConfirm: async () => {
        await historyService.deleteTimeline(id);
        setConfirmModalData(null);
        loadHistoryList();
      },
    });
  };

  // --- USERS MANAGEMENT ---
  const loadUsersList = async (customParams = {}) => {
    setLoadingUsers(true);
    try {
      const data = await adminService.getUsers({
        search: customParams.search !== undefined ? customParams.search : (searchUser || undefined),
        role: customParams.role !== undefined ? customParams.role : (filterRole !== 'all' ? filterRole : undefined),
        status: customParams.status !== undefined ? customParams.status : (filterStatus !== 'all' ? filterStatus : undefined),
      });
      if (data?.users) setUsersList(data.users);
    } catch (error) {
      console.error('Lỗi tải người dùng:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleUpdateRole = async (targetId, role) => {
    try {
      await adminService.updateUserRole(targetId, role);
      loadUsersList();
    } catch (error) {
      alert(error.response?.data?.message || 'Không thể đổi quyền.');
    }
  };

  const handleToggleVerify = async (targetId) => {
    try {
      await adminService.toggleVerifyUser(targetId);
      loadUsersList();
    } catch (error) {
      alert('Không thể đổi trạng thái xác minh.');
    }
  };

  const handleOpenRatingModal = (u) => {
    setSelectedUserForRating(u);
    setRatingScore(u.rating || 5);
    setRatingBadge(u.badge || '');
    setAdminNote(u.adminNote || '');
    setShowRatingModal(true);
  };

  const handleSaveRating = async (e) => {
    e.preventDefault();
    if (!selectedUserForRating) return;
    try {
      await adminService.rateUser(selectedUserForRating.id, {
        rating: ratingScore,
        badge: ratingBadge,
        adminNote,
      });
      setShowRatingModal(false);
      setSelectedUserForRating(null);
      loadUsersList();
    } catch (error) {
      alert('Lỗi khi lưu đánh giá thành viên.');
    }
  };

  const handleOpenBanModal = (u) => {
    setSelectedUserForBan(u);
    setBanReasonInput(u.banReason || 'Vi phạm quy chuẩn cộng đồng Làng Giao Tác');
    setShowBanModal(true);
  };

  const handleConfirmBan = async () => {
    if (!selectedUserForBan) return;
    try {
      await adminService.banUser(selectedUserForBan.id, {
        isBanned: !selectedUserForBan.isBanned,
        banReason: !selectedUserForBan.isBanned ? banReasonInput : null,
      });
      setShowBanModal(false);
      setSelectedUserForBan(null);
      loadUsersList();
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi thay đổi trạng thái khóa tài khoản.');
    }
  };

  const handleDeleteUser = (u) => {
    setConfirmModalData({
      title: `Xác nhận xóa tài khoản: ${u.fullName}`,
      message: `Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${u.fullName}" (${u.email}) không? Toàn bộ bài viết và ảnh của người này sẽ bị xóa và lần sau không thể đăng nhập được nữa.`,
      onConfirm: async () => {
        try {
          await adminService.deleteUser(u.id);
          setConfirmModalData(null);
          loadUsersList();
          fetchStats();
        } catch (error) {
          alert(error.response?.data?.message || 'Lỗi khi xóa thành viên.');
        }
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-primary-dark text-surface rounded-3xl p-6 sm:p-8 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface/15 text-secondary-light text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Khu Vực Quản Trị Hệ Thống</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ban Quản Trị & Điều Hành Làng Giao Tác
          </h1>
          <p className="text-xs sm:text-sm text-paper/80">
            Xin chào <strong>{user?.fullName}</strong> ({user?.role === 'admin' ? 'Quản trị viên' : 'Điều hành viên'})
          </p>
        </div>

        {/* Stats Pills */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-surface/10 backdrop-blur-md text-center">
              <span className="text-lg font-bold text-secondary-light">{stats.pendingPosts}</span>
              <p className="text-[11px] text-paper/80">Bài chờ duyệt</p>
            </div>
            <div className="p-3 rounded-xl bg-surface/10 backdrop-blur-md text-center">
              <span className="text-lg font-bold text-secondary-light">{stats.pendingPhotos}</span>
              <p className="text-[11px] text-paper/80">Ảnh chờ duyệt</p>
            </div>
            <div className="p-3 rounded-xl bg-surface/10 backdrop-blur-md text-center">
              <span className="text-lg font-bold text-surface">{stats.totalNews}</span>
              <p className="text-[11px] text-paper/80">Thông báo</p>
            </div>
            <div className="p-3 rounded-xl bg-surface/10 backdrop-blur-md text-center">
              <span className="text-lg font-bold text-surface">{stats.totalUsers}</span>
              <p className="text-[11px] text-paper/80">Thành viên</p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-warmBorder pb-4">
        <button
          onClick={() => setTab('posts')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'posts'
              ? 'bg-primary text-surface shadow-sm'
              : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Duyệt bài viết ({stats?.pendingPosts || 0})</span>
        </button>

        <button
          onClick={() => setTab('photos')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'photos'
              ? 'bg-primary text-surface shadow-sm'
              : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Duyệt ảnh ({stats?.pendingPhotos || 0})</span>
        </button>

        <button
          onClick={() => setTab('news')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'news'
              ? 'bg-primary text-surface shadow-sm'
              : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Quản lý Tin tức</span>
        </button>

        <button
          onClick={() => setTab('events')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'events'
              ? 'bg-primary text-surface shadow-sm'
              : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Quản lý Sự kiện</span>
        </button>

        <button
          onClick={() => setTab('history')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-primary text-surface shadow-sm'
              : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Mốc Lịch sử làng</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setTab('users')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-primary text-surface shadow-sm'
                : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Thành viên & Phân quyền</span>
          </button>
        )}
      </div>

      {/* Tab 1: Review Pending Posts */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-ink">Bài viết đang chờ phê duyệt ({pendingPosts.length})</h2>

          {loadingPosts ? (
            <div className="text-center py-12 text-ink-muted">Đang tải danh sách bài viết...</div>
          ) : pendingPosts.length === 0 ? (
            <div className="text-center py-16 bg-surface rounded-2xl border border-warmBorder text-ink-muted text-sm">
              Không có bài viết nào đang chờ duyệt.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-surface rounded-3xl border border-warmBorder p-6 shadow-warm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                        {post.category}
                      </span>
                      <span className="text-ink-light">
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-ink leading-snug">{post.title}</h3>

                    <div className="flex items-center space-x-2 text-xs text-ink-muted">
                      <span>Tác giả: <strong>{post.author?.fullName}</strong></span>
                      {post.author?.hometownGroup && <span>({post.author.hometownGroup})</span>}
                    </div>

                    <div
                      className="text-xs text-ink-muted line-clamp-3 leading-relaxed border-t border-warmBorder/60 pt-2"
                      dangerouslySetInnerHTML={{
                        __html: post.contentHtml.replace(/<[^>]*>?/gm, ''),
                      }}
                    />
                  </div>

                  <div className="pt-4 border-t border-warmBorder flex items-center justify-between">
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem toàn bài</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleReviewPost(post.id, 'rejected')}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100"
                      >
                        Từ chối
                      </button>
                      <button
                        onClick={() => handleReviewPost(post.id, 'published')}
                        className="px-3.5 py-1.5 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark shadow-sm"
                      >
                        Duyệt & Xuất bản
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal Xem Toàn Bộ Bài Viết */}
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
              <div className="bg-surface rounded-3xl border border-warmBorder max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-warmHover">
                <div className="space-y-2 border-b border-warmBorder pb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary font-bold text-xs">
                    {selectedPost.category}
                  </span>
                  <h2 className="font-bold text-2xl text-ink leading-snug">{selectedPost.title}</h2>
                  <p className="text-xs text-ink-muted">Tác giả: {selectedPost.author?.fullName}</p>
                </div>

                {selectedPost.coverImageUrl && (
                  <img
                    src={selectedPost.coverImageUrl}
                    alt="Cover"
                    className="w-full max-h-64 object-cover rounded-xl"
                  />
                )}

                <div
                  className="tiptap-content text-sm text-ink leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedPost.contentHtml }}
                />

                <div className="flex justify-end space-x-2 pt-4 border-t border-warmBorder">
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="px-4 py-2 rounded-xl border border-warmBorder text-sm text-ink hover:bg-paper"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => handleReviewPost(selectedPost.id, 'rejected')}
                    className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-sm font-semibold hover:bg-rose-100"
                  >
                    Từ chối
                  </button>
                  <button
                    onClick={() => handleReviewPost(selectedPost.id, 'published')}
                    className="px-5 py-2 rounded-xl bg-primary text-surface text-sm font-semibold hover:bg-primary-dark shadow-sm"
                  >
                    Duyệt xuất bản
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Review Pending Photos */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-ink">Ảnh do thành viên gửi ({pendingPhotos.length})</h2>

          {loadingPhotos ? (
            <div className="text-center py-12 text-ink-muted">Đang tải danh sách ảnh...</div>
          ) : pendingPhotos.length === 0 ? (
            <div className="text-center py-16 bg-surface rounded-2xl border border-warmBorder text-ink-muted text-sm">
              Không có bức ảnh nào đang chờ duyệt.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-surface rounded-2xl border border-warmBorder overflow-hidden shadow-warm space-y-3 p-3 flex flex-col justify-between"
                >
                  <img
                    src={photo.imageUrl}
                    alt="Pending photo"
                    className="w-full h-48 object-cover rounded-xl"
                  />

                  <div className="space-y-1 px-1">
                    <p className="text-xs font-bold text-ink">{photo.caption || 'Không có chú thích'}</p>
                    <p className="text-[11px] text-ink-muted">Album: {photo.album?.title}</p>
                    <p className="text-[11px] text-accent">Người gửi: {photo.uploader?.fullName}</p>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-warmBorder">
                    <button
                      onClick={() => handleReviewPhoto(photo.id, 'rejected')}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100"
                    >
                      Từ chối
                    </button>
                    <button
                      onClick={() => handleReviewPhoto(photo.id, 'approved')}
                      className="px-3.5 py-1.5 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark shadow-sm"
                    >
                      Phê duyệt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: News Management */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-ink">Danh sách Tin tức & Thông báo ({newsList.length})</h2>
            <button
              onClick={() => {
                setEditingNews(null);
                setNewsTitle('');
                setNewsContent('');
                setNewsSource('Ban Quản lý Làng Giao Tác');
                setShowNewsModal(true);
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng thông báo mới</span>
            </button>
          </div>

          <div className="space-y-3">
            {newsList.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-surface border border-warmBorder shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs text-ink-light">
                    <span className="px-2 py-0.5 rounded-md bg-primary-subtle text-primary font-semibold">
                      {item.source}
                    </span>
                    <span>{new Date(item.publishedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <h3 className="font-bold text-base text-ink">{item.title}</h3>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setEditingNews(item);
                      setNewsTitle(item.title);
                      setNewsContent(item.contentHtml);
                      setNewsSource(item.source || 'Ban Quản lý Làng Giao Tác');
                      setShowNewsModal(true);
                    }}
                    className="p-2 text-ink-muted hover:text-primary rounded-lg hover:bg-paper"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNews(item.id)}
                    className="p-2 text-ink-muted hover:text-red-600 rounded-lg hover:bg-red-50"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Thêm / Sửa Tin Tức */}
          {showNewsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
              <div className="bg-surface rounded-3xl border border-warmBorder max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-warmHover">
                <h3 className="font-bold text-xl text-ink">
                  {editingNews ? 'Chỉnh Sửa Thông Báo' : 'Đăng Thông Báo Mới'}
                </h3>
                <form onSubmit={handleSaveNews} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Tiêu đề thông báo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newsTitle}
                      onChange={(e) => setNewsTitle(e.target.value)}
                      className="w-full input-warm text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Nguồn phát hành
                    </label>
                    <input
                      type="text"
                      value={newsSource}
                      onChange={(e) => setNewsSource(e.target.value)}
                      className="w-full input-warm text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Nội dung thông báo (hỗ trợ HTML / văn bản) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={6}
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      className="w-full input-warm text-sm resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewsModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-warmBorder text-sm text-ink hover:bg-paper"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-primary text-surface text-sm font-semibold hover:bg-primary-dark shadow-sm"
                    >
                      Lưu thông báo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Events Management */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-ink">Danh sách Sự kiện làng ({eventList.length})</h2>
            <button
              onClick={() => {
                setEditingEvent(null);
                setEventTitle('');
                setEventDesc('');
                setEventDate('');
                setEventLocation('');
                setEventCover('');
                setShowEventModal(true);
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm sự kiện mới</span>
            </button>
          </div>

          <div className="space-y-3">
            {eventList.map((evt) => (
              <div
                key={evt.id}
                className="p-5 rounded-2xl bg-surface border border-warmBorder shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs text-primary font-bold">
                    {new Date(evt.eventDate).toLocaleDateString('vi-VN')}
                  </span>
                  <h3 className="font-bold text-base text-ink">{evt.title}</h3>
                  <p className="text-xs text-ink-muted">Địa điểm: {evt.location}</p>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setEditingEvent(evt);
                      setEventTitle(evt.title);
                      setEventDesc(evt.description);
                      setEventDate(evt.eventDate ? evt.eventDate.split('T')[0] : '');
                      setEventLocation(evt.location);
                      setEventCover(evt.coverImageUrl || '');
                      setShowEventModal(true);
                    }}
                    className="p-2 text-ink-muted hover:text-primary rounded-lg hover:bg-paper"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="p-2 text-ink-muted hover:text-red-600 rounded-lg hover:bg-red-50"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Thêm / Sửa Sự Kiện */}
          {showEventModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
              <div className="bg-surface rounded-3xl border border-warmBorder max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-warmHover">
                <h3 className="font-bold text-xl text-ink">
                  {editingEvent ? 'Chỉnh Sửa Sự Kiện' : 'Thêm Sự Kiện Mới'}
                </h3>
                <form onSubmit={handleSaveEvent} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Tên sự kiện <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full input-warm text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                        Ngày diễn ra <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full input-warm text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                        Địa điểm tổ chức <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        className="w-full input-warm text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Ảnh bìa (URL Cloudinary)
                    </label>
                    <input
                      type="url"
                      value={eventCover}
                      onChange={(e) => setEventCover(e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full input-warm text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Mô tả chi tiết sự kiện <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={eventDesc}
                      onChange={(e) => setEventDesc(e.target.value)}
                      className="w-full input-warm text-sm resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEventModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-warmBorder text-sm text-ink hover:bg-paper"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-primary text-surface text-sm font-semibold hover:bg-primary-dark shadow-sm"
                    >
                      Lưu sự kiện
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: History Management */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-ink">Mốc Lịch sử Làng Giao Tác ({historyList.length})</h2>
            <button
              onClick={() => {
                setEditingHistory(null);
                setHistoryYear('');
                setHistoryTitle('');
                setHistoryDesc('');
                setHistoryImage('');
                setHistoryOrder(historyList.length + 1);
                setShowHistoryModal(true);
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm mốc lịch sử</span>
            </button>
          </div>

          <div className="space-y-3">
            {historyList.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-surface border border-warmBorder shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-lg bg-secondary-subtle text-accent font-bold text-xs">
                    {item.yearLabel} (Thứ tự: {item.orderIndex})
                  </span>
                  <h3 className="font-bold text-base text-ink">{item.title}</h3>
                  <p className="text-xs text-ink-muted line-clamp-2">{item.description}</p>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setEditingHistory(item);
                      setHistoryYear(item.yearLabel);
                      setHistoryTitle(item.title);
                      setHistoryDesc(item.description);
                      setHistoryImage(item.imageUrl || '');
                      setHistoryOrder(item.orderIndex || 0);
                      setShowHistoryModal(true);
                    }}
                    className="p-2 text-ink-muted hover:text-primary rounded-lg hover:bg-paper"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteHistory(item.id)}
                    className="p-2 text-ink-muted hover:text-red-600 rounded-lg hover:bg-red-50"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Thêm/Sửa Mốc Lịch Sử */}
          {showHistoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
              <div className="bg-surface rounded-3xl border border-warmBorder max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-warmHover">
                <h3 className="font-bold text-xl text-ink">
                  {editingHistory ? 'Chỉnh Sửa Mốc Lịch Sử' : 'Thêm Mốc Lịch Sử Mới'}
                </h3>
                <form onSubmit={handleSaveHistory} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                        Mốc thời gian (Năm) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={historyYear}
                        onChange={(e) => setHistoryYear(e.target.value)}
                        placeholder="Ví dụ: Năm 1685"
                        className="w-full input-warm text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                        Thứ tự hiển thị
                      </label>
                      <input
                        type="number"
                        value={historyOrder}
                        onChange={(e) => setHistoryOrder(e.target.value)}
                        className="w-full input-warm text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Tiêu đề sự kiện lịch sử <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={historyTitle}
                      onChange={(e) => setHistoryTitle(e.target.value)}
                      className="w-full input-warm text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Hình ảnh minh họa (URL Cloudinary)
                    </label>
                    <input
                      type="url"
                      value={historyImage}
                      onChange={(e) => setHistoryImage(e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full input-warm text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Mô tả chi tiết <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={historyDesc}
                      onChange={(e) => setHistoryDesc(e.target.value)}
                      className="w-full input-warm text-sm resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowHistoryModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-warmBorder text-sm text-ink hover:bg-paper"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-primary text-surface text-sm font-semibold hover:bg-primary-dark shadow-sm"
                    >
                      Lưu mốc lịch sử
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Users & Permissions Management (Admin only) */}
      {activeTab === 'users' && isAdmin && (
        <div className="space-y-6">
          {/* Header & Bộ đếm thống kê thành viên */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-surface border border-warmBorder shadow-xs">
              <span className="text-2xl font-bold text-primary-dark">{usersList.length}</span>
              <p className="text-xs text-ink-muted mt-0.5">Tổng số thành viên</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-warmBorder shadow-xs">
              <span className="text-2xl font-bold text-emerald-600">
                {usersList.filter((u) => u.isVerified).length}
              </span>
              <p className="text-xs text-ink-muted mt-0.5">Đã xác minh dân làng</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-warmBorder shadow-xs">
              <span className="text-2xl font-bold text-amber-600">
                {usersList.filter((u) => u.badge || (u.rating && u.rating >= 4)).length}
              </span>
              <p className="text-xs text-ink-muted mt-0.5">Được khen thưởng / Đánh giá cao</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-warmBorder shadow-xs">
              <span className="text-2xl font-bold text-red-600">
                {usersList.filter((u) => u.isBanned).length}
              </span>
              <p className="text-xs text-ink-muted mt-0.5">Tài khoản bị khóa</p>
            </div>
          </div>

          {/* Thanh tìm kiếm và bộ lọc */}
          <div className="bg-surface rounded-2xl border border-warmBorder p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadUsersList()}
                placeholder="Tìm theo tên, email, xóm làng hoặc nơi ở..."
                className="w-full pl-9 pr-4 py-2 input-warm text-xs"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center space-x-2">
              {/* Role Filter */}
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  loadUsersList({ role: e.target.value });
                }}
                className="input-warm py-2 px-3 text-xs bg-surface"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">👑 Quản trị viên</option>
                <option value="moderator">🛡️ Điều hành viên</option>
                <option value="member">🌾 Thành viên làng</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  loadUsersList({ status: e.target.value });
                }}
                className="input-warm py-2 px-3 text-xs bg-surface"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">🟢 Đang hoạt động</option>
                <option value="banned">🔴 Bị khóa tài khoản</option>
              </select>

              <button
                type="button"
                onClick={() => loadUsersList()}
                className="px-3.5 py-2 rounded-xl bg-primary text-surface font-semibold text-xs hover:bg-primary-dark transition-colors shrink-0"
              >
                Lọc
              </button>
            </div>
          </div>

          {/* Bảng Danh Sách Thành Viên */}
          <div className="bg-surface rounded-3xl border border-warmBorder overflow-hidden shadow-warm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ink">
                <thead className="bg-paper border-b border-warmBorder text-ink-muted uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Thành viên</th>
                    <th className="p-4">Quê quán & Nơi ở</th>
                    <th className="p-4">Phân quyền chức vụ</th>
                    <th className="p-4">Đánh giá & Khen thưởng</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warmBorder/60">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-ink-muted">
                        Đang tải danh sách thành viên...
                      </td>
                    </tr>
                  ) : usersList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-ink-muted">
                        Không tìm thấy thành viên nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    usersList.map((u) => (
                      <tr
                        key={u.id}
                        className={`transition-colors ${
                          u.isBanned ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-paper/50'
                        }`}
                      >
                        {/* 1. Thành viên info */}
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            {u.avatarUrl ? (
                              <img
                                src={u.avatarUrl}
                                alt={u.fullName}
                                className="w-9 h-9 rounded-xl object-cover border border-warmBorder shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-primary-subtle text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                {u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-sm text-ink truncate">
                                  {u.fullName}
                                </span>
                                {u.id === user?.id && (
                                  <span className="text-[10px] font-bold text-primary bg-primary-subtle px-1.5 py-0.2 rounded">
                                    (Bạn)
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-ink-muted truncate mt-0.5">{u.email}</p>
                              <div className="flex items-center space-x-2 text-[10px] text-ink-muted/80 mt-1">
                                <span>📝 {u._count?.posts || 0} bài viết</span>
                                <span>•</span>
                                <span>📸 {u._count?.photos || 0} ảnh</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Quê quán & Nơi ở */}
                        <td className="p-4 text-xs">
                          <div className="font-medium text-ink">
                            {u.hometownGroup || 'TDP 9 Thuận Lộc'}
                          </div>
                          <div className="text-[11px] text-accent mt-0.5">
                            {u.currentLocation || 'Chưa cập nhật nơi ở'}
                          </div>
                        </td>

                        {/* 3. Phân quyền chức vụ */}
                        <td className="p-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                            disabled={u.id === user?.id}
                            className={`input-warm py-1.5 px-2.5 text-xs font-bold rounded-xl transition-all ${
                              u.role === 'admin'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : u.role === 'moderator'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-surface text-ink'
                            }`}
                          >
                            <option value="member">🌾 Thành viên</option>
                            <option value="moderator">🛡️ Điều hành viên</option>
                            <option value="admin">👑 Quản trị viên</option>
                          </select>
                        </td>

                        {/* 4. Đánh giá & Khen thưởng */}
                        <td className="p-4">
                          <div className="space-y-1.5">
                            {/* Stars */}
                            <div className="flex items-center space-x-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= (u.rating || 5)
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-stone-300'
                                  }`}
                                />
                              ))}
                              <span className="text-[11px] font-bold text-ink-muted ml-1">
                                {u.rating || 5}/5
                              </span>
                            </div>

                            {/* Badge nếu có */}
                            {u.badge && (
                              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                                <Award className="w-3 h-3 text-amber-600" />
                                <span>{u.badge}</span>
                              </div>
                            )}

                            <div>
                              <button
                                type="button"
                                onClick={() => handleOpenRatingModal(u)}
                                className="text-[11px] font-semibold text-primary hover:text-primary-dark underline flex items-center space-x-1"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Đánh giá & Khen thưởng</span>
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 5. Trạng thái */}
                        <td className="p-4 space-y-1.5">
                          {/* Xác minh */}
                          <div>
                            <button
                              type="button"
                              onClick={() => handleToggleVerify(u.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                                u.isVerified
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200'
                              }`}
                              title="Bấm để đổi trạng thái xác minh"
                            >
                              {u.isVerified ? '✓ Đã xác minh dân làng' : 'Chưa xác minh'}
                            </button>
                          </div>

                          {/* Khóa/Hoạt động */}
                          <div>
                            {u.isBanned ? (
                              <span
                                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold border border-red-200"
                                title={`Lý do khóa: ${u.banReason || 'Vi phạm quy định'}`}
                              >
                                <Ban className="w-3 h-3 text-red-600" />
                                <span>Bị khóa tài khoản</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>Đang hoạt động</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 6. Thao tác (Khóa, Mở khóa, Xóa) */}
                        <td className="p-4 text-right">
                          {u.id !== user?.id && u.role !== 'admin' && (
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* Nút Khóa / Mở khóa */}
                              <button
                                type="button"
                                onClick={() => handleOpenBanModal(u)}
                                className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors ${
                                  u.isBanned
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                }`}
                                title={u.isBanned ? 'Mở khóa tài khoản' : 'Khóa tài khoản này'}
                              >
                                {u.isBanned ? (
                                  <>
                                    <Unlock className="w-3.5 h-3.5" />
                                    <span>Mở khóa</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Khóa</span>
                                  </>
                                )}
                              </button>

                              {/* Nút Xóa vĩnh viễn */}
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u)}
                                className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                                title="Xóa vĩnh viễn thành viên này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Đánh Giá & Khen Thưởng Thành Viên */}
          {showRatingModal && selectedUserForRating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-surface rounded-3xl border border-warmBorder max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-warmBorder pb-3">
                  <div>
                    <h3 className="font-bold text-lg text-ink">
                      Đánh Giá & Khen Thưởng Thành Viên
                    </h3>
                    <p className="text-xs text-ink-muted mt-0.5">
                      Thành viên: <strong>{selectedUserForRating.fullName}</strong> ({selectedUserForRating.email})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRatingModal(false)}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveRating} className="space-y-4">
                  {/* Chấm điểm sao */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Mức độ đánh giá uy tín (1 - 5 Sao)
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-paper rounded-2xl border border-warmBorder">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingScore(star)}
                          className="focus:outline-none p-1 transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= ratingScore
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-stone-300 hover:text-amber-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm font-bold text-primary-dark ml-2">
                        {ratingScore === 5
                          ? '⭐⭐⭐⭐⭐ Xuất sắc'
                          : ratingScore === 4
                          ? '⭐⭐⭐⭐ Tốt / Tích cực'
                          : ratingScore === 3
                          ? '⭐⭐⭐ Khá'
                          : ratingScore === 2
                          ? '⭐⭐ Cần nhắc nhở'
                          : '⭐ Kém / Cảnh cáo'}
                      </span>
                    </div>
                  </div>

                  {/* Danh sách huy hiệu gợi ý */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Trao tặng Huy hiệu Danh Dự
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        '🌾 Thành viên Tích Cực',
                        '🎖️ Cống Hiến Xuất Sắc',
                        '🤝 Đồng Hương Gắn Kết',
                        '🪙 Nhà Tài Trợ Quê Hương',
                        '✍️ Cây Bút Vàng Làng Xã',
                        '📷 Nhiếp Ảnh Gia Quê Nhà',
                      ].map((presetBadge) => (
                        <button
                          key={presetBadge}
                          type="button"
                          onClick={() =>
                            setRatingBadge(ratingBadge === presetBadge ? '' : presetBadge)
                          }
                          className={`p-2 rounded-xl text-xs font-semibold text-left border transition-all ${
                            ratingBadge === presetBadge
                              ? 'bg-primary text-surface border-primary shadow-xs'
                              : 'bg-paper text-ink border-warmBorder hover:border-primary/40'
                          }`}
                        >
                          {presetBadge}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={ratingBadge}
                      onChange={(e) => setRatingBadge(e.target.value)}
                      placeholder="Hoặc nhập huy hiệu tùy chỉnh..."
                      className="w-full input-warm text-xs mt-2"
                    />
                  </div>

                  {/* Ghi chú / Đánh giá của Admin */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                      Ghi chú / Lời khen tặng của Ban Quản Trị
                    </label>
                    <textarea
                      rows={3}
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Ví dụ: Đóng góp tích cực nhiều hình ảnh xưa và bài viết ý nghĩa cho làng..."
                      className="w-full input-warm text-xs resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-warmBorder">
                    <button
                      type="button"
                      onClick={() => setShowRatingModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-warmBorder text-xs text-ink hover:bg-paper font-semibold"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-primary text-surface text-xs font-bold hover:bg-primary-dark shadow-sm"
                    >
                      Lưu Đánh Giá
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Khóa / Mở Khóa Tài Khoản */}
          {showBanModal && selectedUserForBan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-surface rounded-3xl border border-warmBorder max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      selectedUserForBan.isBanned
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {selectedUserForBan.isBanned ? (
                      <Unlock className="w-5 h-5" />
                    ) : (
                      <Ban className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-ink">
                      {selectedUserForBan.isBanned
                        ? 'Mở Khóa Tài Khoản Thành Viên'
                        : 'Khóa Tài Khoản Thành Viên'}
                    </h3>
                    <p className="text-xs text-ink-muted">
                      Thành viên: <strong>{selectedUserForBan.fullName}</strong>
                    </p>
                  </div>
                </div>

                {!selectedUserForBan.isBanned ? (
                  <div className="space-y-3">
                    <p className="text-xs text-ink-muted leading-relaxed">
                      Khi bị khóa, thành viên này sẽ <strong>không thể đăng nhập vào hệ thống</strong> được nữa cho đến khi Quản trị viên mở khóa lại.
                    </p>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                        Lý do khóa tài khoản
                      </label>
                      <input
                        type="text"
                        value={banReasonInput}
                        onChange={(e) => setBanReasonInput(e.target.value)}
                        placeholder="Ví dụ: Vi phạm quy tắc đăng bài, chia sẻ nội dung không phù hợp..."
                        className="w-full input-warm text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Bạn có chắc chắn muốn mở khóa cho tài khoản <strong>{selectedUserForBan.fullName}</strong>? Sau khi mở khóa, người này có thể đăng nhập và sinh hoạt bình thường.
                  </p>
                )}

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-warmBorder">
                  <button
                    type="button"
                    onClick={() => setShowBanModal(false)}
                    className="px-4 py-2 rounded-xl border border-warmBorder text-xs text-ink hover:bg-paper font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBan}
                    className={`px-5 py-2 rounded-xl text-xs font-bold text-surface shadow-sm ${
                      selectedUserForBan.isBanned
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {selectedUserForBan.isBanned ? 'Xác Nhận Mở Khóa' : 'Xác Nhận Khóa Tài Khoản'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Confirm Modal */}
      {confirmModalData && (
        <ConfirmModal
          isOpen={true}
          title={confirmModalData.title}
          message={confirmModalData.message}
          onConfirm={confirmModalData.onConfirm}
          onCancel={() => setConfirmModalData(null)}
        />
      )}
    </div>
  );
};
