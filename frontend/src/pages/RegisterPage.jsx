import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, Mail, Lock, User, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '17339925701-s0tiajuplhl8e5h0o4epke98ksm3g00r.apps.googleusercontent.com';

export const RegisterPage = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hometownGroup, setHometownGroup] = useState('TDP 9 Thuận Lộc (Làng Giao Tác)');
  const [currentLocation, setCurrentLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [error, setError] = useState('');

  // Khởi tạo Google Identity Services chính thức
  useEffect(() => {
    const setupGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            if (response.credential) {
              setSocialLoading(true);
              setError('');
              try {
                await loginWithGoogle({ idToken: response.credential });
                navigate('/', { replace: true });
              } catch (err) {
                setError(err.response?.data?.message || 'Đăng ký nhanh qua Google thất bại.');
              } finally {
                setSocialLoading(false);
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render Google Sign-in Button vào container nếu có
        const btnContainer = document.getElementById('google-reg-slot');
        if (btnContainer && !btnContainer.hasChildNodes()) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signup_with',
            shape: 'rectangular',
            locale: 'vi',
          });
        }
      }
    };

    setupGoogle();
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        setupGoogle();
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [navigate, loginWithGoogle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) return;

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        hometownGroup,
        currentLocation: currentLocation.trim() || undefined,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký tài khoản thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePrompt = () => {
    setError('');
    if (window.google?.accounts?.id) {
      setSocialLoading(true);
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setSocialLoading(false);
        }
      });
    } else {
      setError('Đang tải thư viện Google, vui lòng thử lại sau 2 giây.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-surface rounded-3xl border border-warmBorder p-8 sm:p-10 shadow-warm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-secondary-light flex items-center justify-center mx-auto shadow-md">
            <Landmark className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-primary-dark tracking-tight">
            Đăng Ký Thành Viên Làng Giao Tác
          </h1>
          <p className="text-xs text-ink-muted">
            TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh — Tham gia cộng đồng bà con quê hương
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Quick Official Google Register */}
        <div className="space-y-3">
          {/* Google Official Button Render Slot */}
          <div id="google-reg-slot" className="w-full min-h-[44px] flex justify-center"></div>

          {/* Google Custom Button Fallback */}
          <button
            type="button"
            onClick={handleGooglePrompt}
            disabled={socialLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-warmBorder hover:border-slate-400 bg-surface hover:bg-slate-50 transition-all font-semibold text-xs sm:text-sm text-ink flex items-center justify-center space-x-3 shadow-sm disabled:opacity-60"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            <span>{socialLoading ? 'Đang kết nối Google...' : 'Đăng ký nhanh qua Google'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-warmBorder w-full"></div>
          <span className="bg-surface px-3 text-[11px] font-bold text-ink-muted uppercase tracking-wider">
            hoặc đăng ký bằng Form
          </span>
        </div>

        {/* Form đăng ký */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full input-warm input-warm-icon text-sm"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-ink uppercase tracking-wider">
              Email đăng nhập <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nguyenvana@gmail.com"
                className="w-full input-warm input-warm-icon text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full input-warm input-warm-icon text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Nhập lại mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full input-warm input-warm-icon text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Nhóm cư dân / Dòng họ
              </label>
              <select
                value={hometownGroup}
                onChange={(e) => setHometownGroup(e.target.value)}
                className="w-full input-warm text-xs"
              >
                <option value="Họ Nguyễn Trọng">Họ Nguyễn Trọng</option>
                <option value="Họ Nguyễn Duy">Họ Nguyễn Duy</option>
                <option value="Họ Nguyễn Huy">Họ Nguyễn Huy</option>
                <option value="Họ Phan Sỹ">Họ Phan Sỹ</option>
                <option value="Họ Nguyễn Văn">Họ Nguyễn Văn</option>
                <option value="Họ Phạm Hữu">Họ Phạm Hữu</option>
                <option value="Họ Trần Đình">Họ Trần Đình</option>
                <option value="Họ Lê">Họ Lê</option>
                <option value="TDP 9 Thuận Lộc (Làng Giao Tác)">TDP 9 Thuận Lộc (Làng Giao Tác)</option>
                <option value="Dâu rể / Con em quê hương">Dâu rể / Con em quê hương</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                Nơi ở hiện tại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  placeholder="TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, Hà Tĩnh..."
                  className="w-full input-warm input-warm-icon text-xs"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-primary text-surface font-semibold text-sm hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-warmBorder/60 text-xs text-ink-muted">
          <span>Đã có tài khoản? </span>
          <Link to="/dang-nhap" className="font-bold text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
