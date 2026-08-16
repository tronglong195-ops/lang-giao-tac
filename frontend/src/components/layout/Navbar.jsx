import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../common/NotificationBell';
import {
  Menu,
  X,
  User,
  LogOut,
  PenSquare,
  ShieldCheck,
  ChevronDown,
  Home,
  Landmark,
  Image as ImageIcon,
  MapPin,
  Newspaper,
  BookOpen,
  Users,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdminOrMod } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  // Dropdown states for grouped desktop menus
  const [activeDropdown, setActiveDropdown] = useState(null); // 'heritage' | 'community' | null
  const dropdownRef = useRef(null);

  // Close dropdowns on route change
  useEffect(() => {
    setActiveDropdown(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Nhóm 1: Di Tích & Ký Ức
  const heritageGroup = [
    {
      name: 'Lịch sử & Đình Làng',
      path: '/lich-su',
      icon: Landmark,
      desc: '6 mốc lịch sử, video tư liệu Đình làng Giao Tác',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      name: 'Thư viện Album ảnh',
      path: '/thu-vien-anh',
      icon: ImageIcon,
      desc: 'Kho tư liệu ảnh quê hương xưa và nay',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      name: 'Bản đồ di tích',
      path: '/ban-do',
      icon: MapPin,
      desc: 'Vị trí đình làng, giếng cổ, nhà văn hóa TDP 9',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  ];

  // Nhóm 2: Bản Tin & Sinh Hoạt
  const communityGroup = [
    {
      name: 'Tin tức & Thông báo',
      path: '/tin-tuc',
      icon: Newspaper,
      desc: 'Thông báo chính quyền, phong trào TDP 9',
      color: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      name: 'Bài viết & Ký ức',
      path: '/bai-viet',
      icon: BookOpen,
      desc: 'Tâm tình, dòng họ, ca khúc quê hương',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      name: 'Hội đồng hương',
      path: '/dong-huong',
      icon: Users,
      desc: 'Danh bạ kết nối con em xa quê',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      name: 'Lịch sự kiện',
      path: '/su-kien',
      icon: Calendar,
      desc: 'Lễ hội làng, tế thần, ngày đại đoàn kết',
      color: 'bg-orange-50 text-orange-700 border-orange-200',
    },
  ];

  const isHeritageActive = heritageGroup.some((item) => location.pathname.startsWith(item.path));
  const isCommunityActive = communityGroup.some((item) => location.pathname.startsWith(item.path));

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-warmBorder shadow-warm" ref={dropdownRef}>
      {/* Top Banner Accent Line */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4 h-16 sm:h-20">
          {/* Logo & Village Identity */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-2.5 group transition-transform duration-300 hover:scale-[1.01] min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-primary flex items-center justify-center text-secondary-light shadow-md border border-primary-dark/20 group-hover:bg-primary-dark transition-colors shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 3L2 9h3v12h4v-7h6v7h4V9h3L12 3zm0 3.84L16.45 9H7.55L12 6.84zM13 14h-2v-3h2v3z" />
              </svg>
            </div>
            <div className="min-w-0">
              <span className="block font-bold text-sm sm:text-lg xl:text-xl text-primary-dark tracking-tight leading-none group-hover:text-primary transition-colors truncate">
                LÀNG GIAO TÁC
              </span>
              <span className="block text-[9px] sm:text-[11px] text-accent font-medium mt-0.5 sm:mt-1 truncate max-w-[150px] xs:max-w-[210px] sm:max-w-none">
                <span className="hidden sm:inline">TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh</span>
                <span className="sm:hidden">TDP 9 Thuận Lộc, TX Hồng Lĩnh</span>
              </span>
            </div>
          </Link>

          {/* Desktop Compact Dropdown Menu Bar */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 shrink-0">
            {/* 1. Trang Chủ */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'text-primary-dark bg-primary-subtle font-bold border border-primary/20 shadow-xs'
                    : 'text-ink/85 hover:text-primary hover:bg-paper'
                }`
              }
            >
              <Home className="w-4 h-4 text-primary shrink-0" />
              <span className="whitespace-nowrap">Trang chủ</span>
            </NavLink>

            {/* 2. Menu Thả: Di Tích & Ký Ức */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'heritage' ? null : 'heritage')
                }
                className={`flex items-center space-x-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isHeritageActive || activeDropdown === 'heritage'
                    ? 'text-primary-dark bg-primary-subtle font-bold border border-primary/20'
                    : 'text-ink/85 hover:text-primary hover:bg-paper'
                }`}
              >
                <Landmark className="w-4 h-4 text-accent shrink-0" />
                <span className="whitespace-nowrap">Di Tích & Ký Ức</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-ink-muted transition-transform duration-200 shrink-0 ${
                    activeDropdown === 'heritage' ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>

              {/* Dropdown Card */}
              {activeDropdown === 'heritage' && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-surface border border-warmBorder shadow-warmHover p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-accent uppercase tracking-wider border-b border-warmBorder/60 mb-1 flex items-center justify-between">
                    <span>Lịch sử & Cảnh sắc</span>
                    <Sparkles className="w-3 h-3 text-accent" />
                  </div>

                  <div className="space-y-1">
                    {heritageGroup.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname.startsWith(item.path);

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setActiveDropdown(null)}
                          className={`flex items-start space-x-3 p-2.5 rounded-xl transition-colors ${
                            isActive
                              ? 'bg-primary-subtle text-primary-dark font-bold'
                              : 'hover:bg-paper text-ink'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 border ${item.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold leading-tight">{item.name}</p>
                            <p className="text-[11px] text-ink-muted leading-snug mt-0.5 font-normal">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Menu Thả: Bản Tin & Sinh Hoạt */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'community' ? null : 'community')
                }
                className={`flex items-center space-x-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isCommunityActive || activeDropdown === 'community'
                    ? 'text-primary-dark bg-primary-subtle font-bold border border-primary/20'
                    : 'text-ink/85 hover:text-primary hover:bg-paper'
                }`}
              >
                <Newspaper className="w-4 h-4 text-secondary-dark shrink-0" />
                <span className="whitespace-nowrap">Bản Tin & Sinh Hoạt</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-ink-muted transition-transform duration-200 shrink-0 ${
                    activeDropdown === 'community' ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>

              {/* Dropdown Card */}
              {activeDropdown === 'community' && (
                <div className="absolute left-0 mt-2 w-84 rounded-2xl bg-surface border border-warmBorder shadow-warmHover p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-secondary-dark uppercase tracking-wider border-b border-warmBorder/60 mb-1 flex items-center justify-between">
                    <span>Cộng đồng & Sự kiện</span>
                    <Users className="w-3 h-3 text-secondary-dark" />
                  </div>

                  <div className="space-y-1">
                    {communityGroup.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname.startsWith(item.path);

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setActiveDropdown(null)}
                          className={`flex items-start space-x-3 p-2.5 rounded-xl transition-colors ${
                            isActive
                              ? 'bg-primary-subtle text-primary-dark font-bold'
                              : 'hover:bg-paper text-ink'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 border ${item.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold leading-tight">{item.name}</p>
                            <p className="text-[11px] text-ink-muted leading-snug mt-0.5 font-normal">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Hội Đồng Hương */}
            <NavLink
              to="/dong-huong"
              className={({ isActive }) =>
                `flex items-center space-x-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'text-primary-dark bg-primary-subtle font-bold border border-primary/20 shadow-xs'
                    : 'text-ink/85 hover:text-primary hover:bg-paper'
                }`
              }
            >
              <Users className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="whitespace-nowrap">Đồng hương</span>
            </NavLink>
          </nav>

          {/* User & Action Buttons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 shrink-0">
            {user ? (
              <div className="flex items-center space-x-2 xl:space-x-3 shrink-0">
                {/* Nút Viết bài */}
                <Link
                  to="/bai-viet/viet-bai"
                  className="flex items-center space-x-1.5 px-3 xl:px-4 py-2 rounded-xl bg-primary text-surface text-xs xl:text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm whitespace-nowrap shrink-0"
                >
                  <PenSquare className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">Viết bài</span>
                </Link>

                {/* Chuông Thông Báo In-App */}
                <NotificationBell />

                {/* User Dropdown */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl border border-warmBorder hover:bg-paper transition-colors focus:outline-none bg-surface shadow-xs shrink-0"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="w-7 h-7 xl:w-8 xl:h-8 rounded-lg object-cover border border-primary/20 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-lg bg-primary-subtle text-primary flex items-center justify-center font-bold text-xs xl:text-sm shrink-0">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <span className="text-xs xl:text-sm font-semibold text-ink max-w-[100px] xl:max-w-[130px] truncate whitespace-nowrap">
                      {user.fullName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-surface border border-warmBorder shadow-warmHover py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2.5 border-b border-warmBorder">
                        <p className="text-[11px] text-ink-muted">Tài khoản thành viên</p>
                        <p className="text-sm font-bold text-ink truncate">{user.fullName}</p>
                        <p className="text-xs text-accent mt-0.5 font-medium capitalize">
                          {user.role === 'admin'
                            ? '👑 Quản trị viên'
                            : user.role === 'moderator'
                            ? '🛡️ Điều hành viên'
                            : '🌾 Thành viên làng'}
                        </p>
                      </div>

                      <Link
                        to="/tai-khoan"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-ink hover:bg-paper hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4 text-ink-muted" />
                        <span>Trang cá nhân & Ảnh</span>
                      </Link>

                      {isAdminOrMod && (
                        <Link
                          to="/quan-tri"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-primary-dark font-semibold bg-primary-subtle/50 hover:bg-primary-subtle transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span>Bảng Quản Trị Hệ Thống</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 shrink-0">
                <Link
                  to="/dang-nhap"
                  className="px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold text-ink hover:text-primary hover:bg-paper transition-colors whitespace-nowrap"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/dang-ky"
                  className="px-3.5 py-2 rounded-xl bg-primary text-surface text-xs xl:text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm whitespace-nowrap"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger & Actions */}
          <div className="flex items-center lg:hidden space-x-1.5 shrink-0">
            {user && <NotificationBell />}
            {user && (
              <Link
                to="/bai-viet/viet-bai"
                className="p-2 rounded-xl bg-primary text-surface hover:bg-primary-dark shadow-sm shrink-0"
                title="Viết bài"
              >
                <PenSquare className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-ink hover:bg-paper border border-warmBorder focus:outline-none shrink-0"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-warmBorder bg-surface/98 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300 max-h-[85vh] overflow-y-auto p-4 space-y-6">
          {/* User Info (Mobile) */}
          {user ? (
            <div className="p-4 rounded-2xl bg-paper border border-warmBorder flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-primary/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary text-surface flex items-center justify-center font-bold text-base">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-ink">{user.fullName}</p>
                  <p className="text-xs text-accent">
                    {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                  </p>
                </div>
              </div>

              <Link
                to="/tai-khoan"
                className="px-3 py-1.5 rounded-lg bg-surface border border-warmBorder text-xs font-semibold text-primary"
              >
                Hồ sơ
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/dang-nhap"
                className="py-2.5 text-center rounded-xl border border-warmBorder text-xs font-semibold text-ink"
              >
                Đăng nhập
              </Link>
              <Link
                to="/dang-ky"
                className="py-2.5 text-center rounded-xl bg-primary text-surface text-xs font-semibold"
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Group 1: Trang chủ */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-2xl text-sm font-semibold transition-colors ${
                isActive ? 'bg-primary-subtle text-primary-dark border border-primary/20' : 'bg-paper text-ink'
              }`
            }
          >
            <Home className="w-5 h-5 text-primary" />
            <span>Trang chủ Làng Giao Tác</span>
          </NavLink>

          {/* Group 2: Di Tích & Ký Ức */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-accent uppercase tracking-wider px-1">
              Di Tích & Ký Ức
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {heritageGroup.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 p-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-subtle text-primary-dark font-bold'
                        : 'hover:bg-paper text-ink'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Group 3: Bản Tin & Hoạt Động */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-secondary-dark uppercase tracking-wider px-1">
              Bản Tin & Sinh Hoạt Làng
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {communityGroup.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 p-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-subtle text-primary-dark font-bold'
                        : 'hover:bg-paper text-ink'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Admin & Logout (Mobile) */}
          {user && (
            <div className="pt-2 border-t border-warmBorder space-y-2">
              {isAdminOrMod && (
                <Link
                  to="/quan-tri"
                  className="flex items-center space-x-2 p-3 rounded-xl bg-primary-subtle text-primary-dark font-semibold text-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Trang Quản Trị Hệ Thống</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 p-3 rounded-xl text-red-700 hover:bg-red-50 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
