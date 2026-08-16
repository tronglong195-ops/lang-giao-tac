import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  User,
  LogOut,
  PenSquare,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdminOrMod } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Lịch sử', path: '/lich-su' },
    { name: 'Tin tức', path: '/tin-tuc' },
    { name: 'Bài viết', path: '/bai-viet' },
    { name: 'Thư viện ảnh', path: '/thu-vien-anh' },
    { name: 'Bản đồ', path: '/ban-do' },
    { name: 'Đồng hương', path: '/dong-huong' },
    { name: 'Sự kiện', path: '/su-kien' },
  ];

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-warmBorder shadow-warm">
      {/* Top Banner Accent Line */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Village Identity */}
          <Link
            to="/"
            className="flex items-center space-x-3 group transition-transform duration-300 hover:scale-[1.01]"
          >
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-secondary-light shadow-md border border-primary-dark/20 group-hover:bg-primary-dark transition-colors">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M12 3L2 9h3v12h4v-7h6v7h4V9h3L12 3zm0 3.84L16.45 9H7.55L12 6.84zM13 14h-2v-3h2v3z" />
              </svg>
            </div>
            <div>
              <span className="block font-bold text-xl sm:text-2xl text-primary-dark tracking-tight leading-none group-hover:text-primary transition-colors">
                LÀNG GIAO TÁC
              </span>
              <span className="block text-xs text-accent font-medium mt-1">
                TDP 9 Thuận Lộc, TX Hồng Lĩnh (Hà Tĩnh)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary-dark bg-primary-subtle font-semibold border-b-2 border-primary'
                      : 'text-ink/80 hover:text-primary hover:bg-paper'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* User & Action Buttons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Nút Viết bài */}
                <Link
                  to="/bai-viet/viet-bai"
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-primary text-surface text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Viết bài</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2.5 p-1.5 rounded-xl border border-warmBorder hover:bg-paper transition-colors focus:outline-none"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-lg object-cover border border-primary/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-primary-subtle text-primary flex items-center justify-center font-bold text-sm">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-ink max-w-[130px] truncate">
                      {user.fullName}
                    </span>
                    <ChevronDown className="w-4 h-4 text-ink-muted" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-surface border border-warmBorder shadow-warmHover py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-warmBorder">
                        <p className="text-xs text-ink-muted">Tài khoản</p>
                        <p className="text-sm font-bold text-ink truncate">{user.fullName}</p>
                        <p className="text-xs text-accent mt-0.5 capitalize">
                          {user.role === 'admin'
                            ? 'Quản trị viên'
                            : user.role === 'moderator'
                            ? 'Điều hành viên'
                            : 'Thành viên'}
                        </p>
                      </div>

                      <Link
                        to="/tai-khoan"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-ink hover:bg-paper hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4 text-ink-muted" />
                        <span>Trang cá nhân</span>
                      </Link>

                      {isAdminOrMod && (
                        <Link
                          to="/quan-tri"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-primary-dark font-medium bg-primary-subtle/50 hover:bg-primary-subtle transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span>Trang Quản trị</span>
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
              <div className="flex items-center space-x-2">
                <Link
                  to="/dang-nhap"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-ink hover:text-primary hover:bg-paper transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/dang-ky"
                  className="px-4 py-2 rounded-xl bg-primary text-surface text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden space-x-2">
            {user && (
              <Link
                to="/bai-viet/viet-bai"
                className="p-2 rounded-lg bg-primary text-surface hover:bg-primary-dark"
                title="Viết bài"
              >
                <PenSquare className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ink hover:bg-paper border border-warmBorder focus:outline-none"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-warmBorder bg-surface px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-warmBorder">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-surface font-semibold'
                      : 'text-ink hover:bg-paper'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {user ? (
            <div className="pt-2 space-y-2">
              <div className="flex items-center space-x-3 p-2 rounded-xl bg-paper">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary text-surface flex items-center justify-center font-bold">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm text-ink">{user.fullName}</p>
                  <p className="text-xs text-accent">{user.email}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-1 pt-1">
                <Link
                  to="/tai-khoan"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-ink hover:bg-paper rounded-lg"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span>Trang cá nhân</span>
                </Link>
                {isAdminOrMod && (
                  <Link
                    to="/quan-tri"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary-dark bg-primary-subtle rounded-lg"
                  >
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Trang Quản trị</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3 grid grid-cols-2 gap-3">
              <Link
                to="/dang-nhap"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl border border-warmBorder text-sm font-medium text-ink hover:bg-paper"
              >
                Đăng nhập
              </Link>
              <Link
                to="/dang-ky"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl bg-primary text-surface text-sm font-medium hover:bg-primary-dark"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
