import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  BookOpen,
  Image as ImageIcon,
  KeyRound,
  Edit3,
  MapPin,
  CheckCircle2,
  Calendar,
  Eye,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { photoService } from '../services/photoService';
import { authService } from '../services/authService';
import { StatusBadge } from '../components/common/StatusBadge';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'photos' | 'profile' | 'password'

  // My Posts
  const [myPosts, setMyPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // My Photos
  const [myPhotos, setMyPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  // Edit Profile Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [hometownGroup, setHometownGroup] = useState(user?.hometownGroup || '');
  const [currentLocation, setCurrentLocation] = useState(user?.currentLocation || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    if (activeTab === 'posts') {
      const loadPosts = async () => {
        setLoadingPosts(true);
        try {
          const data = await postService.getMyPosts();
          if (data?.posts) setMyPosts(data.posts);
        } catch (error) {
          console.error('Lỗi khi tải bài viết cá nhân:', error);
        } finally {
          setLoadingPosts(false);
        }
      };
      loadPosts();
    } else if (activeTab === 'photos') {
      const loadPhotos = async () => {
        setLoadingPhotos(true);
        try {
          const data = await photoService.getMyPhotos();
          if (data?.photos) setMyPhotos(data.photos);
        } catch (error) {
          console.error('Lỗi khi tải ảnh cá nhân:', error);
        } finally {
          setLoadingPhotos(false);
        }
      };
      loadPhotos();
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      await updateProfile({
        fullName,
        avatarUrl,
        hometownGroup,
        currentLocation,
        bio,
      });
      setProfileMsg('Cập nhật thông tin cá nhân thành công!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (error) {
      alert(error.response?.data?.message || 'Cập nhật thất bại.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setChangingPass(true);
    setPassMsg('');
    setPassError('');
    try {
      const res = await authService.changePassword({ currentPassword, newPassword });
      setPassMsg(res.message || 'Đổi mật khẩu thành công!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setPassError(error.response?.data?.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/20 shadow-md shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-primary text-surface flex items-center justify-center font-bold text-3xl shrink-0 shadow-md">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
        )}

        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl font-bold text-ink">{user?.fullName}</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-primary-subtle text-primary capitalize">
              {user?.role === 'admin'
                ? 'Quản trị viên'
                : user?.role === 'moderator'
                ? 'Điều hành viên'
                : 'Dân làng / Đồng hương'}
            </span>
          </div>

          <p className="text-xs text-ink-muted">{user?.email}</p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-accent pt-1">
            {user?.hometownGroup && (
              <span className="flex items-center space-x-1">
                <span>Quê gốc: <strong>{user.hometownGroup}</strong></span>
              </span>
            )}
            {user?.currentLocation && (
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Nơi ở: <strong>{user.currentLocation}</strong></span>
              </span>
            )}
          </div>

          {user?.bio && (
            <p className="text-xs text-ink-muted max-w-2xl leading-relaxed pt-1">{user.bio}</p>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-warmBorder pb-4">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'posts'
              ? 'bg-primary text-surface shadow-sm'
              : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bài viết của tôi ({myPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'photos'
              ? 'bg-primary text-surface shadow-sm'
              : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Ảnh đã đóng góp ({myPhotos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'profile'
              ? 'bg-primary text-surface shadow-sm'
              : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Chỉnh sửa hồ sơ</span>
        </button>

        <button
          onClick={() => setActiveTab('password')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'password'
              ? 'bg-primary text-surface shadow-sm'
              : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Đổi mật khẩu</span>
        </button>
      </div>

      {/* Tab 1: My Posts */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-ink">Danh sách bài viết đã gửi</h2>
            <Link
              to="/bai-viet/viet-bai"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Viết bài mới</span>
            </Link>
          </div>

          {loadingPosts ? (
            <div className="text-center py-12 text-ink-muted">Đang tải bài viết...</div>
          ) : myPosts.length === 0 ? (
            <div className="text-center py-16 bg-surface rounded-2xl border border-warmBorder text-ink-muted text-sm space-y-3">
              <p>Bạn chưa gửi bài viết nào.</p>
              <Link
                to="/bai-viet/viet-bai"
                className="inline-block px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold"
              >
                Gửi bài viết đầu tiên ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-2xl bg-surface border border-warmBorder shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={post.status} />
                      <span className="text-xs text-primary font-medium">{post.category}</span>
                      <span className="text-xs text-ink-light">•</span>
                      <span className="text-xs text-ink-light">
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-ink">
                      {post.status === 'published' ? (
                        <Link to={`/bai-viet/${post.slug}`} className="hover:text-primary">
                          {post.title}
                        </Link>
                      ) : (
                        post.title
                      )}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-center text-xs text-ink-muted">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{post.viewCount} lượt xem</span>
                    </span>
                    {post.status === 'published' && (
                      <Link
                        to={`/bai-viet/${post.slug}`}
                        className="px-3 py-1.5 rounded-lg bg-paper border border-warmBorder text-primary font-semibold hover:bg-primary-subtle"
                      >
                        Xem bài
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Photos */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-ink">Ảnh bạn đã tải lên</h2>
            <Link
              to="/thu-vien-anh"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Xem Thư viện Album để tải ảnh</span>
            </Link>
          </div>

          {loadingPhotos ? (
            <div className="text-center py-12 text-ink-muted">Đang tải ảnh...</div>
          ) : myPhotos.length === 0 ? (
            <div className="text-center py-16 bg-surface rounded-2xl border border-warmBorder text-ink-muted text-sm space-y-3">
              <p>Bạn chưa đóng góp bức ảnh nào.</p>
              <Link
                to="/thu-vien-anh"
                className="inline-block px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold"
              >
                Mở Thư viện Album để đóng góp ảnh
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {myPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-surface rounded-2xl border border-warmBorder overflow-hidden shadow-sm space-y-2 p-2"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || 'Ảnh cá nhân'}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <div className="p-1 space-y-1">
                    <StatusBadge status={photo.status} />
                    <p className="text-xs font-medium text-ink line-clamp-1">
                      {photo.caption || 'Không có chú thích'}
                    </p>
                    <p className="text-[10px] text-ink-muted truncate">
                      Album: {photo.album?.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Edit Profile */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleUpdateProfile}
          className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm max-w-2xl space-y-5"
        >
          <h2 className="font-bold text-lg text-ink">Chỉnh Sửa Thông Tin Cá Nhân</h2>

          {profileMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Họ và tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full input-warm text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Ảnh đại diện (URL Cloudinary / Link ảnh)
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="w-full input-warm text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Xóm / Thôn gốc tại Giao Tác
              </label>
              <input
                type="text"
                value={hometownGroup}
                onChange={(e) => setHometownGroup(e.target.value)}
                placeholder="Ví dụ: Xóm Đoài (Thôn 2)"
                className="w-full input-warm text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Nơi đang sinh sống/làm việc
              </label>
              <input
                type="text"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="Ví dụ: Cầu Giấy, Hà Nội"
                className="w-full input-warm text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Giới thiệu ngắn
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full input-warm text-sm resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-primary text-surface font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50"
            >
              {savingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Change Password */}
      {activeTab === 'password' && (
        <form
          onSubmit={handleChangePassword}
          className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm max-w-md space-y-5"
        >
          <h2 className="font-bold text-lg text-ink">Đổi Mật Khẩu</h2>

          {passMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passMsg}</span>
            </div>
          )}

          {passError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {passError}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full input-warm text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full input-warm text-sm"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPass}
              className="px-6 py-2.5 rounded-xl bg-primary text-surface font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50"
            >
              {changingPass ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
