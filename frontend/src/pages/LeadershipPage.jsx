import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Shield,
  Users,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  HeartHandshake,
  BadgeCheck,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const LeadershipPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const mainLeaders = [
    {
      id: 'bi-thu',
      name: 'Lê Văn Tiến',
      role: 'Bí thư Chi bộ',
      badge: 'Lãnh đạo Chi bộ',
      badgeColor: 'bg-red-900 text-yellow-300 border-amber-400',
      avatarColor: 'from-red-600 to-red-800 text-white',
      duties: [
        'Lãnh đạo toàn diện công tác Đảng, chính trị, tư tưởng tại Tổ dân phố 9 Thuận Lộc.',
        'Định hướng các chủ trương phát triển kinh tế - văn hóa - xã hội, bảo đảm quốc phòng - an ninh.',
        'Chủ trì các kỳ sinh hoạt Chi bộ định kỳ và đột xuất, giám sát thực hiện Nghị quyết của Đảng ủy Phường Nam Hồng Lĩnh.',
      ],
      term: 'Nhiệm kỳ 2025 - 2027',
      address: 'TDP 9 Thuận Lộc (Làng Giao Tác xưa), Phường Nam Hồng Lĩnh',
    },
    {
      id: 'to-truong',
      name: 'Nguyễn Thanh Hiệp',
      role: 'Tổ trưởng Tổ dân phố',
      badge: 'Quản lý Hành chính TDP',
      badgeColor: 'bg-red-800 text-white border-red-300',
      avatarColor: 'from-red-700 to-red-900 text-white',
      duties: [
        'Quản lý, điều hành toàn bộ các hoạt động hành chính, trật tự trị an, an toàn xã hội trên địa bàn TDP 9.',
        'Tiếp nhận, triển khai các chủ trương, chính sách, pháp luật của Nhà nước và chỉ đạo của UBND Phường Nam Hồng Lĩnh đến nhân dân.',
        'Đại diện cho quyền lợi, nghĩa vụ chính đáng của bà con nhân dân trong các cuộc họp và giao dịch hành chính.',
      ],
      term: 'Nhiệm kỳ 2026 - 2028',
      address: 'TDP 9 Thuận Lộc (Làng Giao Tác xưa), Phường Nam Hồng Lĩnh',
    },
    {
      id: 'truong-ban-ctmt',
      name: 'Nguyễn Huy Hòa',
      role: 'Trưởng Ban Công tác Mặt trận',
      badge: 'Đại đoàn kết toàn dân',
      badgeColor: 'bg-amber-500 text-white border-amber-300',
      avatarColor: 'from-amber-500 to-amber-700 text-white',
      duties: [
        'Chủ trì tập hợp, củng cố và phát huy sức mạnh khối đại đoàn kết toàn dân tộc tại TDP 9 Thuận Lộc.',
        'Tuyên truyền, vận động nhân dân hưởng ứng cuộc vận động "Toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh".',
        'Tổ chức Ngày hội Đại đoàn kết toàn dân tộc (18/11 hàng năm), chủ trì tổ hòa giải cơ sở và công tác an sinh xã hội.',
      ],
      term: 'Nhiệm kỳ 2024 - 2029',
      address: 'TDP 9 Thuận Lộc (Làng Giao Tác xưa), Phường Nam Hồng Lĩnh',
    },
  ];

  const subCommittees = [
    {
      name: 'Chi hội Phụ nữ TDP 9',
      leader: 'Bà Phan Thị Lan',
      role: 'Chi hội trưởng Phụ nữ',
      task: 'Phụ trách phong trào phụ nữ 5 không 3 sạch, tuyến đường hoa kiểu mẫu và hoạt động văn nghệ.',
      icon: Users,
    },
    {
      name: 'Chi hội Cựu chiến binh TDP 9',
      leader: 'Ông Nguyễn Văn Thành',
      role: 'Chi hội trưởng CCB',
      task: 'Giữ gìn truyền thống Bộ đội Cụ Hồ, gương mẫu đi đầu trong công tác an ninh trật tự làng xóm.',
      icon: Shield,
    },
    {
      name: 'Chi hội Nông dân TDP 9',
      leader: 'Ông Lê Doãn Hùng',
      role: 'Chi hội trưởng Nông dân',
      task: 'Hướng dẫn sản xuất nông nghiệp, phát triển mô hình kinh tế, nông sản sạch OCOP Làng Giao Tác.',
      icon: Award,
    },
    {
      name: 'Chi đoàn Thanh niên TDP 9',
      leader: 'Đ/c Nguyễn Trọng Hải',
      role: 'Bí thư Chi đoàn',
      task: 'Xung kích chuyển đổi số cộng đồng, vệ sinh môi trường nông thôn mới và sinh hoạt thiếu nhi hè.',
      icon: Sparkles,
    },
    {
      name: 'Chi hội Người cao tuổi TDP 9',
      leader: 'Cụ Phan Sỹ Hùng',
      role: 'Chi hội trưởng Người cao tuổi',
      task: 'Tuổi cao gương sáng, gìn giữ thuần phong mỹ tục, khuyến học khuyến tài và bảo tồn di tích làng.',
      icon: HeartHandshake,
    },
    {
      name: 'Ban Quản trị Cổng Thông Tin Số',
      leader: 'Nguyễn Trọng Long',
      role: 'Quản trị viên Hệ thống Số',
      task: 'Phụ trách số hóa gia phả, tin tức sự kiện, danh bạ đồng hương và truyền thông Làng Giao Tác.',
      icon: FileText,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <Helmet>
        <title>Ban Cán Sự & Lãnh Đạo Tổ Dân Phố 9 Thuận Lộc — Làng Giao Tác</title>
        <meta
          name="description"
          content="Thông tin cơ cấu tổ chức Ban Cán sự, Bí thư Chi bộ, Tổ trưởng Tổ dân phố, Trưởng ban CTMT và các đoàn thể Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh."
        />
        <meta property="og:title" content="Ban Cán Sự & Lãnh Đạo TDP 9 Thuận Lộc — Làng Giao Tác" />
        <meta
          property="og:description"
          content="Cơ cấu tổ chức Ban Cán sự TDP 9 Thuận Lộc (Làng Giao Tác xưa), Phường Nam Hồng Lĩnh, TX Hồng Lĩnh, Hà Tĩnh."
        />
        <meta property="og:image" content="/images/leadership/hoi_nghi_sap_xep_tdp.jpg" />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-800 text-white rounded-3xl p-6 sm:p-12 shadow-2xl border-2 border-amber-400 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 text-xs font-bold uppercase tracking-wider">
            <Landmark className="w-4 h-4" />
            <span>Hệ Thống Chính Trị Cơ Sở</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-tight text-yellow-200">
            Ban Cán Sự & Lãnh Đạo Tổ Dân Phố 9 Thuận Lộc
          </h1>

          <p className="text-xs sm:text-base text-stone-200 leading-relaxed font-sans">
            Cơ cấu tổ chức bộ máy Chi bộ, Ban cán sự và Ban Công tác Mặt trận 
            <strong> Tổ dân phố 9 Thuận Lộc (Làng Giao Tác xưa)</strong>, trực thuộc Đảng ủy - HĐND - UBND - UBMTTQ Phường Nam Hồng Lĩnh, Thị xã Hồng Lĩnh, Tỉnh Hà Tĩnh.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-yellow-300">
            <span className="flex items-center space-x-1 bg-red-900/80 px-3 py-1.5 rounded-xl border border-yellow-400/30">
              <Calendar className="w-3.5 h-3.5 text-yellow-400" />
              <span>Nghị quyết sắp xếp: 01/7/2026</span>
            </span>
            <span className="flex items-center space-x-1 bg-red-900/80 px-3 py-1.5 rounded-xl border border-yellow-400/30">
              <MapPin className="w-3.5 h-3.5 text-yellow-400" />
              <span>TDP 9, Phường Nam Hồng Lĩnh</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Ảnh Hội Nghị Sắp Xếp Tổ Dân Phố Chính Thức */}
      <section className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm space-y-6">
        <div className="border-b border-warmBorder pb-4">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-red-900 uppercase tracking-wider mb-1">
            <BadgeCheck className="w-4 h-4 text-red-700" />
            <span>Sự Kiện Trọng Thể</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink">
            Hội Nghị Công Bố Các Nghị Quyết, Quyết Định Về Sắp Xếp Tổ Dân Phố
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            Đảng ủy - HĐND - UBND - UBMTTQ Phường Nam Hồng Lĩnh tổ chức trao quyết định và nhiệm vụ cho Ban cán sự các Tổ dân phố trên địa bàn (Ngày 01/7/2026).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 rounded-2xl overflow-hidden shadow-warm border-2 border-amber-300/80 bg-stone-100 group">
            <img
              src="/images/leadership/hoi_nghi_sap_xep_tdp.jpg"
              alt="Hội nghị công bố nghị quyết quyết định sắp xếp tổ dân phố Phường Nam Hồng Lĩnh"
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
            />
            <div className="p-3 bg-paper border-t border-warmBorder text-center text-xs text-ink-muted italic">
              Hình ảnh: Lãnh đạo Phường Nam Hồng Lĩnh trao Quyết định và tặng hoa chúc mừng Ban cán sự Tổ dân phố 9 Thuận Lộc
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50 to-amber-50 border-2 border-red-200 text-stone-800 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 rounded-full bg-red-900 text-yellow-300 font-bold flex items-center justify-center text-sm shadow-xs">
                  9
                </span>
                <div>
                  <h3 className="font-bold text-red-950 text-sm sm:text-base">TDP 9 THUẬN LỘC</h3>
                  <p className="text-[11px] text-stone-500 font-medium">Làng Giao Tác — Phường Nam Hồng Lĩnh</p>
                </div>
              </div>

              <div className="space-y-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-white border border-red-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-700 block">Bí Thư Chi Bộ</span>
                    <strong className="text-sm text-stone-900">Lê Văn Tiến</strong>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-900 flex items-center justify-center font-bold">
                    🔴
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-red-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-700 block">Tổ Trưởng TDP</span>
                    <strong className="text-sm text-stone-900">Nguyễn Thanh Hiệp</strong>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-900 flex items-center justify-center font-bold">
                    🔴
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-amber-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-700 block">Trưởng Ban CTMT</span>
                    <strong className="text-sm text-stone-900">Nguyễn Huy Hòa</strong>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    🟡
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Chi Tiết Lãnh Đạo Chủ Chốt (3 Nhân Sự Trọng Tâm) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-primary-subtle text-primary-dark text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-primary" />
            <span>Thường Trực Ban Cán Sự</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-ink">
            Thành Viên Ban Cán Sự TDP 9 Thuận Lộc
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Trách nhiệm, phụ trách và định hướng phát triển địa bàn Tổ dân phố 9
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainLeaders.map((leader) => (
            <div
              key={leader.id}
              className="bg-surface rounded-3xl border-2 border-warmBorder hover:border-red-800 p-6 sm:p-7 shadow-warm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-5">
                {/* Header Profile Card */}
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${leader.avatarColor} flex items-center justify-center font-bold text-2xl shadow-md shrink-0 border-2 border-white`}
                  >
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border mb-1 ${leader.badgeColor}`}
                    >
                      {leader.badge}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-ink group-hover:text-red-900 transition-colors">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary">{leader.role}</p>
                  </div>
                </div>

                {/* Duties */}
                <div className="space-y-2 border-t border-warmBorder pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted block">
                    Nhiệm vụ trọng tâm:
                  </span>
                  <ul className="space-y-2">
                    {leader.duties.map((duty, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-stone-700 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{duty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer info */}
              <div className="mt-6 pt-4 border-t border-warmBorder/70 text-[11px] text-ink-muted space-y-1">
                <div className="flex items-center justify-between">
                  <span>Nhiệm kỳ:</span>
                  <strong className="text-ink">{leader.term}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Địa bàn:</span>
                  <span className="truncate max-w-[170px]">{leader.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Các Chi Hội & Đoàn Thể Trực Thuộc TDP 9 */}
      <section className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-10 shadow-warm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warmBorder pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-secondary/15 text-accent text-xs font-bold uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Đoàn Thể Cơ Sở</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-ink">
              Các Chi Hội & Đoàn Thể Trực Thuộc TDP 9 Thuận Lộc
            </h2>
          </div>
          <span className="text-xs text-ink-muted">Tập hợp sức mạnh toàn dân</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subCommittees.map((sub, idx) => {
            const Icon = sub.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-paper border border-warmBorder hover:border-primary/40 hover:shadow-warm transition-all duration-200 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-ink">{sub.name}</h3>
                      <p className="text-xs text-accent font-medium">{sub.role}</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed pt-1">{sub.task}</p>
                </div>

                <div className="pt-3 border-t border-warmBorder/60 flex items-center justify-between text-xs text-ink-muted">
                  <span>Phụ trách:</span>
                  <strong className="text-primary-dark">{sub.leader}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Lịch Làm Việc & Kênh Tiếp Dân */}
      <section className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 p-6 sm:p-10 shadow-warm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-900 text-yellow-300 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Tiếp Dân & Lịch Sinh Hoạt</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold font-serif text-red-950 leading-tight">
              Địa Điểm Làm Việc & Tiếp Nhận Ý Kiến Nhân Dân
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Ban Cán sự Tổ dân phố 9 Thuận Lộc luôn lắng nghe, tiếp thu và giải quyết kịp thời các tâm tư, nguyện vọng chính đáng của bà con nhân dân và người con xa quê.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs space-y-1">
                <span className="font-bold text-red-900 block">🏛️ Địa điểm sinh hoạt chung:</span>
                <p className="text-stone-700 font-medium">Nhà Văn Hóa TDP 9 Thuận Lộc (cạnh Đình Làng Giao Tác)</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-xs space-y-1">
                <span className="font-bold text-red-900 block">📅 Lịch sinh hoạt Chi bộ:</span>
                <p className="text-stone-700 font-medium">Ngày 03 hàng tháng</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-amber-300 shadow-md space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-900 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">Liên Hệ Ban Cán Sự TDP 9</h3>
              <p className="text-xs text-stone-500 mt-1">Mọi thông tin phản ánh hoặc hỗ trợ thủ tục hành chính</p>
            </div>

            <div className="pt-2">
              <Link
                to="/dong-huong"
                className="inline-flex items-center justify-center space-x-2 w-full px-5 py-3 rounded-xl bg-red-900 hover:bg-red-800 text-yellow-200 font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                <span>Tra cứu Danh bạ Đồng hương</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
