import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart, Landmark, Compass, Users } from 'lucide-react';
import { SectionDivider } from './SectionDivider';

export const Footer = () => {
  return (
    <footer className="bg-[#261C14] text-[#D8CABE] relative mt-16 pt-0">
      {/* Decorative Wave at Top of Footer */}
      <SectionDivider variant="tiles" fill="#261C14" bg="#FBF6EC" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About Village */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-secondary-light">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg text-surface tracking-wide block leading-tight">
                  LÀNG GIAO TÁC
                </span>
                <span className="text-[11px] text-secondary block">
                  TDP 9 Thuận Lộc, TX Hồng Lĩnh
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#BFAFA0]">
              Làng Giao Tác xưa, nay là <strong>Tổ dân phố 9, xã Thuận Lộc, thị xã Hồng Lĩnh (Hà Tĩnh)</strong>. Mảnh đất địa linh nhân kiệt dưới chân núi Hồng Lĩnh lưu giữ truyền thống hiếu học, nghĩa tình làng xóm và cội nguồn của bao thế hệ con em xa xứ.
            </p>
            <div className="p-3.5 rounded-xl bg-[#33261C] border border-[#483729] text-xs text-secondary-light italic">
              "Dù đi bốn hướng tám phương <br />
              Vẫn mang trong dạ tình thương quê nhà."
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-surface font-semibold text-base border-b border-[#483729] pb-2 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-secondary" />
              <span>Chuyên mục chính</span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/lich-su" className="hover:text-secondary transition-colors flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Lịch sử hình thành làng</span>
                </Link>
              </li>
              <li>
                <Link to="/tin-tuc" className="hover:text-secondary transition-colors flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Tin tức & Thông báo</span>
                </Link>
              </li>
              <li>
                <Link to="/bai-viet" className="hover:text-secondary transition-colors flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Bài viết cộng đồng</span>
                </Link>
              </li>
              <li>
                <Link to="/thu-vien-anh" className="hover:text-secondary transition-colors flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Thư viện ảnh làng quê</span>
                </Link>
              </li>
              <li>
                <Link to="/ban-do" className="hover:text-secondary transition-colors flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Bản đồ vị trí & Di tích</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories & Community */}
          <div className="space-y-4">
            <h3 className="text-surface font-semibold text-base border-b border-[#483729] pb-2 flex items-center space-x-2">
              <Users className="w-4 h-4 text-secondary" />
              <span>Kết nối đồng hương</span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dong-huong" className="hover:text-secondary transition-colors flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>Danh bạ Hội đồng hương</span>
                </Link>
              </li>
              <li>
                <Link to="/su-kien" className="hover:text-secondary transition-colors flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>Lễ hội & Sự kiện thường niên</span>
                </Link>
              </li>
              <li>
                <Link to="/bai-viet?category=Ẩm thực quê" className="hover:text-secondary transition-colors flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>Đặc sản & Ẩm thực quê</span>
                </Link>
              </li>
              <li>
                <Link to="/bai-viet/viet-bai" className="hover:text-secondary transition-colors flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span>Đóng góp bài viết kỷ niệm</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Village Admin Info */}
          <div className="space-y-4">
            <h3 className="text-surface font-semibold text-base border-b border-[#483729] pb-2 flex items-center space-x-2">
              <Landmark className="w-4 h-4 text-secondary" />
              <span>Thông tin liên hệ</span>
            </h3>
            <div className="space-y-3 text-sm text-[#BFAFA0]">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>TDP 9, Xã Thuận Lộc, Thị xã Hồng Lĩnh, Tỉnh Hà Tĩnh</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span>BLL / Admin (Nguyễn Trọng Long): <strong>0832991002</strong></span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>banquantri@langgiaotac.vn</span>
              </div>
            </div>
            <p className="text-xs text-[#8E7E70] pt-2">
              Website do con em Làng Giao Tác — TDP 9 Thuận Lộc xây dựng và vận hành.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#3A2D23] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E7E70] gap-4">
          <p>© {new Date().getFullYear()} Làng Giao Tác (TDP 9 Thuận Lộc, TX Hồng Lĩnh, Hà Tĩnh). Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center space-x-1 text-[#BFAFA0]">
            <span>Gìn giữ & phát huy giá trị văn hóa làng quê quê hương</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline mx-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
