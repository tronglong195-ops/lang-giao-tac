import React, { useEffect, useState, useRef } from 'react';
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
  Camera,
  Upload,
  X,
  Sparkles,
  Star,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { photoService } from '../services/photoService';
import { authService } from '../services/authService';
import { StatusBadge } from '../components/common/StatusBadge';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const avatarInputRef = useRef(null);

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

  // Xử lý tải ảnh avatar từ thiết bị
  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Dung lượng ảnh tối đa 8MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target.result;
      setAvatarUrl(base64Url);
      // Tự động lưu avatar mới vào hồ sơ
      try {
        await updateProfile({ avatarUrl: base64Url });
        setProfileMsg('Đã cập nhật ảnh đại diện mới thành công!');
        setTimeout(() => setProfileMsg(''), 3000);
      } catch (err) {
        console.error('Lỗi khi lưu avatar:', err);
      }
    };
    reader.readAsDataURL(file);
  };

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
    if (!currentPassword || !newPassword) {
      setPassError('Vui lòng nhập cả mật khẩu cũ và mới.');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    setChangingPass(true);
    setPassError('');
    setPassMsg('');
    try {
      const res = await authService.changePassword({
        currentPassword,
        newPassword,
      });
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
        {/* Avatar with Camera Upload Overlay */}
        <div className="relative group shrink-0">
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarFileSelect}
            className="hidden"
            id="avatar-quick-upload"
          />
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-md relative bg-primary text-surface flex items-center justify-center font-bold text-3xl">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user?.fullName?.charAt(0) || 'U'}</span>
            )}
          </div>
          {/* Camera Button */}
          <label
            htmlFor="avatar-quick-upload"
            className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-primary text-white hover:bg-primary-dark cursor-pointer shadow-md transition-transform hover:scale-110 flex items-center justify-center"
            title="Tải ảnh đại diện từ máy tính/điện thoại"
          >
            <Camera className="w-4 h-4" />
          </label>
        </div>

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

          {/* Huy hiệu danh dự & Đánh giá sao từ Ban Quản Trị */}
          {(user?.badge || (user?.rating && user?.rating > 0)) && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              {user?.badge && (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-xs">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>{user.badge}</span>
                </div>
              )}
              {user?.rating && (
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-ink">
                  <span className="text-[11px] text-ink-muted">Độ uy tín:</span>
                  <div className="flex items-center space-x-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= user.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {profileMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{profileMsg}</span>
        </div>
      )}

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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-ink">Danh Sách Bài Viết Đã Gửi</h2>
            <Link
              to="/bai-viet/viet-bai"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Gửi bài viết mới</span>
            </Link>
          </div>

          {loadingPosts ? (
            <div className="text-center py-12 text-ink-muted">Đang tải bài viết...</div>
          ) : myPosts.length === 0 ? (
            <div className="text-center py-16 bg-surface rounded-2xl border border-warmBorder text-ink-muted text-sm space-y-3">
              <p>Bạn chưa có bài viết nào.</p>
              <Link
                to="/bai-viet/viet-bai"
                className="inline-block px-4 py-2 rounded-xl bg-primary text-surface text-xs font-semibold"
              >
                Viết bài đầu tiên của bạn
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-surface rounded-2xl border border-warmBorder p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-subtle text-primary">
                        {post.category}
                      </span>
                      <StatusBadge status={post.status} />
                    </div>

                    <h3 className="font-bold text-ink hover:text-primary transition-colors line-clamp-2">
                      {post.status === 'published' ? (
                        <Link to={`/bai-viet/${post.slug}`}>{post.title}</Link>
                      ) : (
                        <span>{post.title}</span>
                      )}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-warmBorder text-xs text-ink-muted">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{post.viewCount} lượt xem</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Photos */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-ink">Ảnh Bạn Đã Đóng Góp</h2>
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

          {/* Avatar Upload in Edit Form */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Ảnh đại diện
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-warmBorder bg-paper shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-primary">
                    {fullName.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-quick-upload"
                className="px-4 py-2 rounded-xl bg-paper border border-warmBorder hover:bg-surface text-xs font-semibold text-ink cursor-pointer inline-flex items-center space-x-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải ảnh từ máy tính/điện thoại</span>
              </label>
            </div>
          </div>

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
              {changingPass ? 'Đang đổi mật khẩu...' : 'Cập nhật mật khẩu'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
