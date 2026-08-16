import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getAccessToken, setAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khởi tạo phiên đăng nhập khi load trang
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAccessToken();
        if (token) {
          const me = await authService.getMe();
          setUser(me);
        } else {
          // Thử refresh token từ httpOnly cookie
          const res = await authService.refreshToken();
          if (res?.data?.user) {
            setUser(res.data.user);
          }
        }
      } catch (err) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    setUser(res.data.user);
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    setUser(res.data.user);
    return res;
  };

  const loginWithGoogle = async (googleData) => {
    const res = await authService.loginWithGoogle(googleData);
    setUser(res.data.user);
    return res;
  };

  const loginWithFacebook = async (facebookData) => {
    const res = await authService.loginWithFacebook(facebookData);
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const updateProfile = async (data) => {
    const updated = await authService.updateProfile(data);
    setUser((prev) => ({ ...prev, ...updated }));
    return updated;
  };

  const refreshUser = async () => {
    try {
      const me = await authService.getMe();
      setUser(me);
    } catch (err) {
      console.error('Lỗi làm mới thông tin user:', err);
    }
  };

  const isAdminOrMod = user && (user.role === 'admin' || user.role === 'moderator');
  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        updateProfile,
        refreshUser,
        isAdminOrMod,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
