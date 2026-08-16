import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { VillageMusicPlayer } from './components/common/VillageMusicPlayer';

// Pages
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { NewsListPage } from './pages/NewsListPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { PostListPage } from './pages/PostListPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { PostEditorPage } from './pages/PostEditorPage';
import { GalleryPage } from './pages/GalleryPage';
import { AlbumDetailPage } from './pages/AlbumDetailPage';
import { MapPage } from './pages/MapPage';
import { DirectoryPage } from './pages/DirectoryPage';
import { EventsPage } from './pages/EventsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-paper text-ink font-sans relative">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Trang chủ */}
              <Route path="/" element={<HomePage />} />

              {/* Lịch sử làng */}
              <Route path="/lich-su" element={<HistoryPage />} />

              {/* Tin tức chính quyền */}
              <Route path="/tin-tuc" element={<NewsListPage />} />
              <Route path="/tin-tuc/:slug" element={<NewsDetailPage />} />

              {/* Bài viết cộng đồng */}
              <Route path="/bai-viet" element={<PostListPage />} />
              <Route path="/bai-viet/:slug" element={<PostDetailPage />} />
              <Route
                path="/bai-viet/viet-bai"
                element={
                  <ProtectedRoute>
                    <PostEditorPage />
                  </ProtectedRoute>
                }
              />

              {/* Thư viện ảnh */}
              <Route path="/thu-vien-anh" element={<GalleryPage />} />
              <Route path="/thu-vien-anh/:albumId" element={<AlbumDetailPage />} />

              {/* Bản đồ vị trí */}
              <Route path="/ban-do" element={<MapPage />} />

              {/* Danh bạ đồng hương */}
              <Route path="/dong-huong" element={<DirectoryPage />} />

              {/* Sự kiện làng */}
              <Route path="/su-kien" element={<EventsPage />} />

              {/* Xác thực */}
              <Route path="/dang-nhap" element={<LoginPage />} />
              <Route path="/dang-ky" element={<RegisterPage />} />

              {/* Trang cá nhân (Yêu cầu đăng nhập) */}
              <Route
                path="/tai-khoan"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Trang quản trị (Yêu cầu quyền Admin hoặc Moderator) */}
              <Route
                path="/quan-tri"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'moderator']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />

          {/* Trình phát nhạc nền quê hương Hà Tĩnh Nhớ Về */}
          <VillageMusicPlayer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
