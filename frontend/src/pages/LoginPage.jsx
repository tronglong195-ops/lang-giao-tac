import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Landmark, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(''); // 'google' | 'facebook' | ''
  const [error, setError] = useState('');

  // Dialog nhập email thử nghiệm nhanh cho Google / Facebook trong môi trường dev
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialProvider, setSocialProvider] = useState(''); // 'google' | 'facebook'
  const [socialName, setSocialName] = useState('');
  const [socialEmail, setSocialEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setError('');
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setError('');
    // Kiểm tra nếu có Google Client ID môi trường production
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (googleClientId && window.google?.accounts?.id) {
      setSocialLoading('google');
      try {
        // Khởi tạo Google One-Tap / Popup
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            try {
              // Gửi token credential đến backend
              await loginWithGoogle({ idToken: response.credential });
              navigate(from, { replace: true });
            } catch (err) {
              setError(err.response?.data?.message || 'Đăng nhập Google thất bại.');
            } finally {
              setSocialLoading('');
            }
          },
        });
        window.google.accounts.id.prompt();
      } catch (err) {
        setSocialLoading('');
        setSocialProvider('google');
        setSocialName('Nguyễn Văn An (Google)');
        setSocialEmail('nguyenvanan.google@gmail.com');
        setShowSocialModal(true);
      }
    } else {
      // Mở modal xác nhận 1-chạm nhanh cho Google
      setSocialProvider('google');
      setSocialName('Nguyễn Văn An (Google)');
      setSocialEmail('nguyenvanan.google@gmail.com');
      setShowSocialModal(true);
    }
  };

  const handleFacebookClick = async () => {
    setError('');
    setSocialProvider('facebook');
    setSocialName('Trần Thị Lan (Facebook)');
    setSocialEmail('tranlan.fb@gmail.com');
    setShowSocialModal(true);
  };

  const handleConfirmSocialLogin = async (e) => {
    e.preventDefault();
    if (!socialEmail.trim()) return;

    setSocialLoading(socialProvider);
    setError('');
    try {
      if (socialProvider === 'google') {
        await loginWithGoogle({
          googleId: `gid_${Date.now()}`,
          email: socialEmail.trim(),
          fullName: socialName.trim() || 'Người dùng Google',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        });
      } else {
        await loginWithFacebook({
          facebookId: `fbid_${Date.now()}`,
          email: socialEmail.trim(),
          fullName: socialName.trim() || 'Người dùng Facebook',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        });
      }
      setShowSocialModal(false);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập qua mạng xã hội thất bại.');
    } finally {
      setSocialLoading('');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-surface rounded-3xl border border-warmBorder p-8 sm:p-10 shadow-warm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-secondary-light flex items-center justify-center mx-auto shadow-md">
            <Landmark className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-primary-dark tracking-tight">
            Đăng Nhập Làng Giao Tác
          </h1>
          <p className="text-xs text-ink-muted">
            TDP 9 Thuận Lộc (TX Hồng Lĩnh) — Kết nối bà con quê hương
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Social Login Buttons */}
        <div className="space-y-3">
          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={socialLoading !== ''}
            className="w-full py-2.5 px-4 rounded-xl border border-warmBorder hover:border-slate-400 bg-surface hover:bg-slate-50 transition-all font-semibold text-xs sm:text-sm text-ink flex items-center justify-center space-x-3 shadow-sm disabled:opacity-60"
          >
            {/* Google SVG Logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{socialLoading === 'google' ? 'Đang kết nối Google...' : 'Tiếp tục với Google'}</span>
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            onClick={handleFacebookClick}
            disabled={socialLoading !== ''}
            className="w-full py-2.5 px-4 rounded-xl border border-[#1877F2]/30 bg-[#1877F2] hover:bg-[#166fe5] text-white transition-all font-semibold text-xs sm:text-sm flex items-center justify-center space-x-3 shadow-sm disabled:opacity-60"
          >
            {/* Facebook SVG Logo */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>{socialLoading === 'facebook' ? 'Đang kết nối Facebook...' : 'Tiếp tục với Facebook'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-warmBorder w-full"></div>
          <span className="bg-surface px-3 text-[11px] text-ink-muted uppercase font-bold tracking-wider shrink-0">
            Hoặc bằng Email
          </span>
          <div className="border-t border-warmBorder w-full"></div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Địa chỉ Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full input-warm pl-10 text-sm"
                required
              />
              <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Mật khẩu
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full input-warm pl-10 text-sm"
                required
              />
              <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-surface font-bold text-sm hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Đang đăng nhập...' : 'Đăng nhập với Email'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials hint */}
        <div className="p-3.5 rounded-xl bg-paper border border-warmBorder text-[11px] text-ink-muted space-y-1">
          <p className="font-bold text-accent">Tài khoản Quản trị & Mẫu:</p>
          <p>• <strong>Admin (Nguyễn Trọng Long):</strong> admin@langgiaotac.vn / 123456</p>
          <p>• <strong>Thành viên:</strong> nguyenthimai@gmail.com / 123456</p>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-warmBorder">
          <p className="text-xs text-ink-muted">
            Chưa có tài khoản?{' '}
            <Link to="/dang-ky" className="font-bold text-primary hover:underline">
              Đăng ký tài khoản dân làng
            </Link>
          </p>
        </div>
      </div>

      {/* Modal xác thực nhanh Google / Facebook */}
      {showSocialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-3xl border border-warmBorder max-w-sm w-full p-6 sm:p-7 space-y-5 shadow-warmHover animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-ink">
                Đăng Nhập Nhanh Qua {socialProvider === 'google' ? 'Google' : 'Facebook'}
              </h3>
              <p className="text-xs text-ink-muted">
                Xác nhận thông tin hồ sơ để đăng nhập tự động vào hệ thống
              </p>
            </div>

            <form onSubmit={handleConfirmSocialLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Họ và tên</label>
                <input
                  type="text"
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                  className="w-full input-warm text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Email tài khoản</label>
                <input
                  type="email"
                  value={socialEmail}
                  onChange={(e) => setSocialEmail(e.target.value)}
                  className="w-full input-warm text-sm"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSocialModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-warmBorder text-xs font-semibold text-ink hover:bg-paper"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={socialLoading !== ''}
                  className="w-1/2 py-2.5 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark shadow-sm disabled:opacity-50"
                >
                  {socialLoading !== '' ? 'Đang vào...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
