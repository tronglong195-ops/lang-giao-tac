import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <p className="text-sm font-medium text-ink-muted">Đang tải dữ liệu làng quê...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-surface rounded-2xl border border-warmBorder text-center space-y-4 shadow-warm">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-ink">Khu vực hạn chế quyền truy cập</h2>
        <p className="text-sm text-ink-muted">
          Trang này chỉ dành cho Ban Quản trị và Điều hành viên của Làng Giao Tác.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2.5 rounded-xl bg-primary text-surface font-medium hover:bg-primary-dark transition-colors text-sm"
        >
          Quay lại trang trước
        </button>
      </div>
    );
  }

  return children;
};
