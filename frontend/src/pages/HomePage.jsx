import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  Calendar,
  Image as ImageIcon,
  Landmark,
  MapPin,
  Users,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Award,
  HeartHandshake,
} from 'lucide-react';
import api from '../services/api';
import { newsService } from '../services/newsService';
import { postService } from '../services/postService';
import { photoService } from '../services/photoService';
import { eventService } from '../services/eventService';
import { HeroSlider } from '../components/common/HeroSlider';
import { SectionDivider } from '../components/layout/SectionDivider';
import { LightboxModal } from '../components/common/LightboxModal';

const DEFAULT_HERO_SLIDES = [
  {
    id: 'slide-1',
    title: 'Làng Giao Tác — TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh',
    subtitle: 'Mảnh đất địa linh nhân kiệt dưới chân dãy Hồng Lĩnh hùng vĩ, tỉnh Hà Tĩnh',
    imageUrl: '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
    link: '/lich-su',
    linkText: 'Tìm hiểu lịch sử làng',
    tag: 'Lịch sử & Cội nguồn',
  },
  {
    id: 'slide-2',
    title: 'Giữ Gìn Bản Sắc Văn Hóa & Cội Nguồn 8 Dòng Họ',
    subtitle: 'Nơi kết nối các thế hệ con em Giao Tác — TDP 9 Thuận Lộc từ khắp mọi miền',
    imageUrl: '/images/village/476468343_1020712713424436_7762543762157463751_n.jpg',
    link: '/gia-pha',
    linkText: 'Tra cứu gia phả 8 dòng họ',
    tag: 'Phả hệ & Cội nguồn',
  },
  {
    id: 'slide-3',
    title: 'Tổ Dân Phố 9 Thuận Lộc Ngày Càng Đổi Thay',
    subtitle: 'Đường hoa rực rỡ, nông thôn mới kiểu mẫu và đô thị văn minh',
    imageUrl: '/images/village/476776564_1020712773424430_8938770403532008026_n.jpg',
    link: '/bai-viet',
    linkText: 'Đọc bài viết cộng đồng',
    tag: 'Đổi thay quê hương',
  },
  {
    id: 'slide-4',
    title: 'Chung Tay Xây Dựng Quỹ Quê Hương & Khuyến Học',
    subtitle: 'Ủng hộ tài năng trẻ quê nhà minh bạch 100% qua mã VietQR',
    imageUrl: '/images/village/486784254_9667039123355634_3798108786214067335_n.jpg',
    link: '/quy-que-huong',
    linkText: 'Xem quỹ khuyến học',
    tag: 'Quỹ quê hương',
  },
];

export const HomePage = () => {
  const [heroSlides, setHeroSlides] = useState(DEFAULT_HERO_SLIDES);
  const [latestNews, setLatestNews] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [featuredPhotos, setFeaturedPhotos] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slidesRes, newsRes, postsRes, photosRes, eventsRes] = await Promise.all([
          api.get('/hero-slides'),
          newsService.getNews({ limit: 3, isOfficial: true }),
          postService.getPosts({ limit: 3, status: 'published' }),
          photoService.getFeaturedPhotos(6),
          eventService.getEvents({ limit: 3, timeFilter: 'upcoming' }),
        ]);

        if (slidesRes.data?.data?.slides) {
          setHeroSlides(slidesRes.data.data.slides);
        }
        if (newsRes?.news) {
          setLatestNews(newsRes.news);
        }
        if (postsRes?.posts) {
          setFeaturedPosts(postsRes.posts);
        }
        if (photosRes) {
          setFeaturedPhotos(photosRes);
        }
        if (eventsRes?.events) {
          setUpcomingEvents(eventsRes.events);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Slideshow Full Width */}
      <section className="relative">
        <HeroSlider slides={heroSlides} />
      </section>

      {/* 2. Tin Nổi Bật & Thông Báo Chính Quyền */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-warmBorder">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-secondary/15 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5 text-secondary-dark" />
              <span>Thông tin từ Ban Quản Lý</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
              Tin Tức & Thông Báo Làng Quê
            </h2>
          </div>
          <Link
            to="/tin-tuc"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary-dark mt-3 md:mt-0 transition-colors group"
          >
            <span>Xem tất cả thông báo</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.length > 0 ? (
            latestNews.map((item) => (
              <article
                key={item.id}
                className="bg-surface rounded-2xl border border-warmBorder p-6 shadow-warm hover:shadow-warmHover transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-ink-light">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary font-medium">
                      {item.source || 'Thông báo'}
                    </span>
                    <span>{new Date(item.publishedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <h3 className="font-bold text-lg text-ink group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    <Link to={`/tin-tuc/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <div
                    className="text-xs text-ink-muted line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: item.contentHtml.replace(/<[^>]*>?/gm, ''),
                    }}
                  />
                </div>
                <div className="pt-5 mt-4 border-t border-warmBorder/60 flex items-center justify-between">
                  <span className="text-xs text-accent font-medium">Ban Quản lý Làng Giao Tác</span>
                  <Link
                    to={`/tin-tuc/${item.slug}`}
                    className="text-xs font-semibold text-primary group-hover:underline flex items-center space-x-1"
                  >
                    <span>Chi tiết</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-ink-muted text-sm bg-surface rounded-2xl border border-warmBorder">
              Đang cập nhật tin tức mới nhất từ Ban Quản lý Thôn...
            </div>
          )}
        </div>
      </section>

      {/* Decorative Wave */}
      <SectionDivider variant="tiles" fill="#FFFDF7" bg="#FBF6EC" />

      {/* 3. Giới thiệu nét đẹp Làng Giao Tác */}
      <section className="bg-surface py-16 border-y border-warmBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-primary-subtle text-primary-dark text-xs font-bold uppercase tracking-wider">
                <Landmark className="w-4 h-4 text-primary" />
                <span>Mảnh Đất Địa Linh Nhân Kiệt</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight leading-tight">
                Về Thăm Làng Giao Tác — TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh
              </h2>
              <p className="text-ink-muted text-sm sm:text-base leading-relaxed">
                Tọa lạc dưới chân dãy núi Hồng Lĩnh hùng vĩ, <strong>Làng Giao Tác xưa (nay là Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh)</strong> từ thuở khai hoang mở đất năm 1685 đã nổi tiếng là vùng quê giàu truyền thống hiếu học, kiên cường bất khuất trong bảo vệ quê hương và luôn gìn giữ nếp nhà thuần phong mỹ tục, nghĩa tình làng xóm.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-paper border border-warmBorder text-center">
                  <div className="text-2xl font-extrabold text-primary">1685</div>
                  <div className="text-xs text-ink-muted mt-1 font-medium">Năm lập làng</div>
                </div>
                <div className="p-4 rounded-xl bg-paper border border-warmBorder text-center">
                  <div className="text-2xl font-extrabold text-secondary-dark">TDP 9</div>
                  <div className="text-xs text-ink-muted mt-1 font-medium">Thuận Lộc (Nam Hồng Lĩnh)</div>
                </div>
                <div className="p-4 rounded-xl bg-paper border border-warmBorder text-center">
                  <div className="text-2xl font-extrabold text-accent">12 Đời</div>
                  <div className="text-xs text-ink-muted mt-1 font-medium">Dòng tộc nối nghiệp</div>
                </div>
                <div className="p-4 rounded-xl bg-paper border border-warmBorder text-center">
                  <div className="text-2xl font-extrabold text-primary-dark">Đô thị</div>
                  <div className="text-xs text-ink-muted mt-1 font-medium">Văn minh kiểu mẫu</div>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/lich-su"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary text-surface font-semibold text-sm hover:bg-primary-dark transition-colors shadow-md"
                >
                  <span>Xem đầy đủ mốc lịch sử làng</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <img
                src="/images/village/484215892_9601885749870972_6761004858315934829_n.jpg"
                alt="Đình Làng Giao Tác - TDP 9 Thuận Lộc"
                className="w-full h-56 sm:h-64 object-cover rounded-2xl shadow-warm hover:scale-[1.02] transition-transform duration-300"
              />
              <img
                src="/images/village/474096867_1006185811543793_8014259646970075430_n.jpg"
                alt="Giếng Cổ Làng Giao Tác"
                className="w-full h-56 sm:h-64 object-cover rounded-2xl shadow-warm hover:scale-[1.02] transition-transform duration-300 mt-6"
              />
              <img
                src="/images/village/480212312_1025661522929555_8709853623689778697_n.jpg"
                alt="Cánh đồng làng mùa vàng"
                className="w-full h-56 sm:h-64 object-cover rounded-2xl shadow-warm hover:scale-[1.02] transition-transform duration-300 -mt-6"
              />
              <img
                src="/images/village/476776564_1020712773424430_8938770403532008026_n.jpg"
                alt="Đường hoa nông thôn mới TDP 9"
                className="w-full h-56 sm:h-64 object-cover rounded-2xl shadow-warm hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Wave */}
      <SectionDivider variant="tiles" fill="#FBF6EC" bg="#FFFDF7" flip />

      {/* 3.5. Video Tư Liệu Đặc Sắc: Đình Làng Giao Tác */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-10 shadow-warm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Video Player */}
            <div className="lg:col-span-7">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-warm border border-warmBorder group">
                <iframe
                  src="https://www.youtube.com/embed/bTtaKwLR59w"
                  title="Video giới thiệu về Đình làng Giao Tác"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Right: Info & Key Points */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>Thước Phim Tư Liệu Quý Giá</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight leading-snug">
                Đình Làng Giao Tác — Di Tích Lịch Sử Văn Hóa Cấp Tỉnh
              </h3>

              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                Tọa lạc tại thôn Thuận Giang (nay là TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh) — Nơi lưu giữ cội nguồn lịch sử, dấu ấn cách mạng và nếp sống văn hóa ngót 150 năm của làng.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-paper border border-warmBorder flex items-start space-x-2.5">
                  <span className="font-bold text-primary shrink-0">🏛️ Năm 1875:</span>
                  <span className="text-ink">Khởi dựng thời vua Tự Đức 28 nhờ cụ Chánh Do & dân làng.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-paper border border-warmBorder flex items-start space-x-2.5">
                  <span className="font-bold text-primary shrink-0">🚩 20/2/1930:</span>
                  <span className="text-ink">Thành lập Chi bộ Đảng làng Giao Tác — tiền thân Đảng bộ xã.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-paper border border-warmBorder flex items-start space-x-2.5">
                  <span className="font-bold text-primary shrink-0">⭐ Năm 2018:</span>
                  <span className="text-ink">Đón nhận Bằng Di tích Lịch sử - Văn hóa cấp Tỉnh.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/bai-viet/video-gioi-thieu-dinh-lang-giao-tac-di-tich-lich-su-van-hoa"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-surface text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                >
                  <span>Xem bài viết chi tiết & bình luận</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bài viết cộng đồng nổi bật */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-warmBorder">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/15 text-accent-dark text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-accent" />
              <span>Tiếng Lòng Dân Làng & Con Em Xa Xứ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
              Ký Ức, Gia Phả & Nét Đẹp Làng Quê
            </h2>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Link
              to="/bai-viet/viet-bai"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-secondary text-ink font-semibold text-xs hover:bg-secondary-dark hover:text-surface transition-colors shadow-sm"
            >
              <span>Viết bài chia sẻ</span>
            </Link>
            <Link
              to="/bai-viet"
              className="inline-flex items-center space-x-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors group"
            >
              <span>Tất cả bài viết</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-surface rounded-2xl border border-warmBorder overflow-hidden shadow-warm hover:shadow-warmHover transition-all duration-300 flex flex-col group"
            >
              {post.coverImageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-surface/90 text-primary-dark backdrop-blur-md shadow-sm">
                    {post.category}
                  </span>
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <h3 className="font-bold text-lg text-ink group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    <Link to={`/bai-viet/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <div
                    className="text-xs text-ink-muted line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: post.contentHtml.replace(/<[^>]*>?/gm, ''),
                    }}
                  />
                </div>

                <div className="pt-4 border-t border-warmBorder flex items-center justify-between text-xs text-ink-light">
                  <div className="flex items-center space-x-2">
                    {post.author.avatarUrl ? (
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.fullName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary-subtle text-primary flex items-center justify-center font-bold text-[10px]">
                        {post.author.fullName.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium text-ink truncate max-w-[120px]">
                      {post.author.fullName}
                    </span>
                  </div>
                  <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Thư viện ảnh làng quê (Gallery Preview) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-warmBorder">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-secondary/15 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
              <ImageIcon className="w-3.5 h-3.5 text-secondary" />
              <span>Gìn Giữ Khoảnh Khắc</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark tracking-tight">
              Thư Viện Ảnh Làng Quê Xưa & Nay
            </h2>
          </div>
          <Link
            to="/thu-vien-anh"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary-dark mt-3 md:mt-0 transition-colors group"
          >
            <span>Xem tất cả Album</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="relative h-40 sm:h-48 rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-warm transition-all duration-300"
            >
              <img
                src={photo.imageUrl}
                alt={photo.caption || 'Ảnh làng Giao Tác'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-surface text-xs">
                <p className="font-medium line-clamp-2 text-[11px]">{photo.caption}</p>
                {photo.takenYear && <span className="text-[10px] text-secondary">Năm {photo.takenYear}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Sự kiện sắp diễn ra & Kết nối bản đồ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upcoming Events (7 cols) */}
          <div className="lg:col-span-7 bg-surface rounded-2xl border border-warmBorder p-6 sm:p-8 shadow-warm space-y-6">
            <div className="flex items-center justify-between border-b border-warmBorder pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary-dark flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">Sự Kiện & Lễ Hội Làng</h3>
                  <p className="text-xs text-ink-muted">Các hoạt động văn hóa, lễ tế sắp diễn ra</p>
                </div>
              </div>
              <Link to="/su-kien" className="text-xs font-semibold text-primary hover:underline">
                Xem tất cả
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-paper border border-warmBorder/70 hover:border-primary/40 transition-colors gap-3"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-primary text-surface flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold leading-none uppercase">
                        Tháng {new Date(evt.eventDate).getMonth() + 1}
                      </span>
                      <span className="text-base font-extrabold leading-none mt-1">
                        {new Date(evt.eventDate).getDate()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-ink leading-snug">{evt.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-ink-muted mt-1">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/su-kien"
                    className="self-end sm:self-center px-3.5 py-1.5 rounded-lg bg-surface text-primary-dark border border-warmBorder text-xs font-semibold hover:bg-primary hover:text-surface transition-colors"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Village Map Callout (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-primary-dark to-primary text-surface rounded-2xl p-6 sm:p-8 shadow-warm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-surface/20 text-xs font-semibold text-secondary-light">
                <MapPin className="w-3.5 h-3.5" />
                <span>Bản Đồ Địa Danh Làng</span>
              </span>
              <h3 className="text-2xl font-bold tracking-tight">
                Khám Phá Các Di Tích & Địa Danh Làng Giao Tác
              </h3>
              <p className="text-xs sm:text-sm text-paper/90 leading-relaxed">
                Khám phá bản đồ trực quan tương tác với hiệu ứng flyTo từ bản đồ Việt Nam vào tận từng xóm ngõ, giếng cổ, mái đình và nhà thờ tổ tiên.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/ban-do"
                className="w-full text-center block py-3 rounded-xl bg-secondary text-ink font-bold text-sm hover:bg-secondary-light transition-colors shadow-md"
              >
                Mở Bản Đồ Làng Giao Tác
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Photo Gallery */}
      <LightboxModal
        photos={featuredPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
};
