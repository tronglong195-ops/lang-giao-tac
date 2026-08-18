import React, { useEffect, useState } from 'react';
import {
  Heart,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
  Search,
  ArrowRight,
  Info,
} from 'lucide-react';
import { fundService } from '../services/fundService';
import { VietQRModal } from '../components/fund/VietQRModal';

export const FundPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [searchDonor, setSearchDonor] = useState('');

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const data = await fundService.getAllCampaigns();
      setCampaigns(data);
      if (data.length > 0) {
        const detail = await fundService.getCampaignBySlug(data[0].slug);
        setSelectedCampaign(detail);
      }
    } catch (err) {
      console.error('Lỗi tải quỹ quê hương:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSelectCampaign = async (camp) => {
    try {
      const detail = await fundService.getCampaignBySlug(camp.slug);
      setSelectedCampaign(detail);
    } catch (err) {
      console.error('Lỗi tải chi tiết chiến dịch:', err);
    }
  };

  const progressPercent = selectedCampaign
    ? Math.min(100, Math.round((selectedCampaign.raisedAmount / selectedCampaign.targetAmount) * 100))
    : 0;

  const filteredDonations = selectedCampaign?.donations?.filter((d) =>
    d.donorName.toLowerCase().includes(searchDonor.toLowerCase()) ||
    d.donorClan?.toLowerCase().includes(searchDonor.toLowerCase()) ||
    d.message?.toLowerCase().includes(searchDonor.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Banner */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-10 shadow-warm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Quỹ Quê Hương & Khuyến Học Làng Giao Tác</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-primary-dark tracking-tight leading-snug">
          Chung Tay Xây Dựng Quê Hương — Minh Bạch 100%
        </h1>

        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-3xl">
          Nơi hội tụ những tấm lòng thơm thảo của bà con nội ngoại và con em xa quê đóng góp cho Quỹ khuyến học, 
          tôn tạo di tích Đình làng, mở rộng đường hoa và chăm lo các hoàn cảnh khó khăn tại TDP 9 Thuận Lộc.
        </p>
      </div>

      {/* Campaign Selector Tabs */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {campaigns.map((camp) => {
          const isSelected = selectedCampaign?.id === camp.id;
          return (
            <button
              key={camp.id}
              onClick={() => handleSelectCampaign(camp)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center space-x-2 shadow-xs ${
                isSelected
                  ? 'bg-primary text-surface shadow-warm scale-102 ring-2 ring-primary/30'
                  : 'bg-surface hover:bg-paper text-ink border border-warmBorder'
              }`}
            >
              <span>{camp.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Campaign Focus Card */}
      {selectedCampaign && (
        <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Info & Progress Bar */}
            <div className="lg:col-span-2 space-y-5">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                Đang Kêu Gọi Đóng Góp
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark leading-snug">
                {selectedCampaign.title}
              </h2>

              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                {selectedCampaign.description}
              </p>

              {/* Progress Bar Container */}
              <div className="p-5 bg-paper rounded-3xl border border-warmBorder space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-ink-muted font-medium">Tiến độ quyên góp:</span>
                  <span className="font-bold text-primary text-base">{progressPercent}%</span>
                </div>

                <div className="w-full h-4 bg-warmBorder/60 rounded-full overflow-hidden p-0.5">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-1000 shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-ink-light block">Đã nhận được</span>
                    <span className="text-sm font-bold text-primary">
                      {selectedCampaign.raisedAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-ink-light block">Mục tiêu</span>
                    <span className="text-sm font-bold text-ink">
                      {selectedCampaign.targetAmount.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Donate CTA Card */}
            <div className="p-6 bg-gradient-to-br from-primary-subtle/50 to-paper rounded-3xl border border-primary/20 space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-primary text-surface flex items-center justify-center shadow-warm">
                <QrCode className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-lg text-primary-dark">Ủng Hộ Trực Tuyến</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Quét mã VietQR bằng mọi ứng dụng ngân hàng. Tiền chuyển trực tiếp vào tài khoản Ban Cán sự TDP 9.
              </p>

              <button
                onClick={() => setShowQRModal(true)}
                className="w-full py-3.5 rounded-2xl bg-primary text-surface font-bold text-sm hover:bg-primary-dark shadow-warm transition-all flex items-center justify-center space-x-2"
              >
                <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                <span>Quét Mã VietQR Ngay</span>
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Minh bạch 100% & Sao kê thời gian thực</span>
              </div>
            </div>
          </div>

          {/* Bảng Vàng Vinh Danh & Lời Chúc Quê Hương */}
          <div className="space-y-4 pt-6 border-t border-warmBorder">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg sm:text-xl font-bold text-ink">
                  Bảng Vàng Tri Ân Tấm Lòng Vàng ({selectedCampaign.donations?.length || 0})
                </h3>
              </div>

              {/* Search Bar for Donors */}
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
                <input
                  type="text"
                  value={searchDonor}
                  onChange={(e) => setSearchDonor(e.target.value)}
                  placeholder="Tìm theo tên người ủng hộ, dòng họ..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-warmBorder bg-paper text-xs"
                />
              </div>
            </div>

            {filteredDonations.length === 0 ? (
              <div className="text-center py-12 text-ink-muted text-xs bg-paper rounded-2xl border border-warmBorder">
                Chưa có thông tin ủng hộ cho tìm kiếm này. Hãy là người đầu tiên chung tay đóng góp!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDonations.map((d, index) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-2xl bg-paper/60 border border-warmBorder hover:border-primary/40 shadow-xs space-y-2 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-ink text-sm sm:text-base flex items-center space-x-1.5">
                          <span>{d.donorName}</span>
                          {index < 3 && <span className="text-xs">👑</span>}
                        </span>
                        {d.donorClan && (
                          <p className="text-xs text-accent font-medium">{d.donorClan}</p>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs sm:text-sm inline-block">
                          +{d.amount.toLocaleString('vi-VN')} đ
                        </span>
                        <span className="text-[10px] text-ink-light block pt-0.5">
                          {new Date(d.donatedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>

                    {d.message && (
                      <p className="text-xs text-ink-muted italic bg-surface/80 p-2.5 rounded-xl border border-warmBorder/60 leading-relaxed">
                        "{d.message}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VietQR Donation Modal */}
      {selectedCampaign && (
        <VietQRModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          campaign={selectedCampaign}
          onDonationSuccess={() => fetchCampaigns()}
        />
      )}
    </div>
  );
};
