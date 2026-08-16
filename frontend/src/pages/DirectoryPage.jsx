import React, { useEffect, useState } from 'react';
import { Users, Search, MapPin, Phone, UserCheck, PlusCircle, CheckCircle2, Info } from 'lucide-react';
import { villagerService } from '../services/villagerService';
import { useAuth } from '../context/AuthContext';

export const DirectoryPage = () => {
  const { user } = useAuth();
  const [villagers, setVillagers] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modal register directory
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [region, setRegion] = useState(user?.currentLocation || 'Hà Nội');
  const [generationBranch, setGenerationBranch] = useState(user?.hometownGroup || '');
  const [contactInfo, setContactInfo] = useState('');
  const [phonePublic, setPhonePublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchVillagers = async (page = 1, reg = selectedRegion, branch = selectedBranch, q = search) => {
    setLoading(true);
    try {
      const data = await villagerService.getVillagers({
        page,
        limit: 15,
        region: reg === 'all' ? undefined : reg,
        generationBranch: branch === 'all' ? undefined : branch,
        search: q || undefined,
      });
      if (data) {
        setVillagers(data.villagers);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh bạ đồng hương:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await villagerService.getStats();
      if (data) setStats(data);
    } catch (error) {
      console.error('Lỗi khi tải thống kê:', error);
    }
  };

  useEffect(() => {
    fetchVillagers(1, selectedRegion, selectedBranch, search);
    fetchStats();
  }, [selectedRegion, selectedBranch]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVillagers(1, selectedRegion, selectedBranch, search);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !region.trim()) return;

    setSubmitting(true);
    setSuccessMsg('');
    try {
      await villagerService.createVillager({
        fullName: fullName.trim(),
        region: region.trim(),
        generationBranch: generationBranch.trim() || undefined,
        contactInfo: contactInfo.trim() || undefined,
        phonePublic,
      });
      setSuccessMsg('Đăng ký vào Danh bạ đồng hương thành công!');
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg('');
        fetchVillagers(1);
        fetchStats();
      }, 1500);
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-warmBorder">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-secondary/15 text-accent text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Nghĩa Tình Đồng Hương</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark tracking-tight">
            Danh Bạ Đồng Hương Làng Giao Tác
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            Kết nối những người con quê hương Làng Giao Tác đang sinh sống và làm việc trên mọi miền Tổ quốc và hải ngoại.
          </p>
        </div>

        <button
          onClick={() => {
            if (user) {
              setFullName(user.fullName || '');
              setRegion(user.currentLocation || 'Hà Nội');
              setGenerationBranch(user.hometownGroup || '');
            }
            setShowModal(true);
          }}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-primary text-surface font-semibold text-sm hover:bg-primary-dark transition-colors shadow-md self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng ký vào Danh bạ</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-surface border border-warmBorder shadow-warm text-center">
            <span className="text-2xl font-bold text-primary">{stats.totalVillagers}</span>
            <p className="text-xs text-ink-muted mt-1">Hội viên đã đăng ký</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface border border-warmBorder shadow-warm text-center">
            <span className="text-2xl font-bold text-secondary-dark">{stats.regions?.length || 0}</span>
            <p className="text-xs text-ink-muted mt-1">Khu vực / Tỉnh thành</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface border border-warmBorder shadow-warm text-center">
            <span className="text-2xl font-bold text-accent">{stats.branches?.length || 0}</span>
            <p className="text-xs text-ink-muted mt-1">Dòng họ & Chi phái</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface border border-warmBorder shadow-warm text-center">
            <span className="text-2xl font-bold text-primary-dark">100%</span>
            <p className="text-xs text-ink-muted mt-1">Tình quê gắn kết</p>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 shadow-warm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo họ tên, số điện thoại..."
              className="w-full input-warm pl-10 text-sm"
            />
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Region filter */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full input-warm text-sm bg-surface"
            >
              <option value="all">Tất cả khu vực sinh sống</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Bình Dương">Bình Dương</option>
              <option value="Hà Tĩnh">Tại quê nhà (Hà Tĩnh)</option>
              <option value="Hải ngoại">Hải ngoại (Quốc tế)</option>
            </select>
          </div>

          {/* Branch / Clan filter */}
          <div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full input-warm text-sm bg-surface"
            >
              <option value="all">Tất cả dòng họ</option>
              <option value="Nguyễn Trọng">Họ Nguyễn Trọng</option>
              <option value="Nguyễn Duy">Họ Nguyễn Duy</option>
              <option value="Nguyễn Huy">Họ Nguyễn Huy</option>
              <option value="Phan Sỹ">Họ Phan Sỹ</option>
              <option value="Nguyễn Văn">Họ Nguyễn Văn</option>
              <option value="Phạm Hữu">Họ Phạm Hữu</option>
              <option value="Trần Đình">Họ Trần Đình</option>
              <option value="Lê">Họ Lê</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table / Grid */}
      {loading ? (
        <div className="text-center py-20 text-ink-muted">Đang tải danh bạ đồng hương...</div>
      ) : villagers.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-warmBorder text-ink-muted text-sm space-y-3">
          <p>Chưa tìm thấy thông tin đồng hương phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {villagers.map((item) => (
            <div
              key={item.id}
              className="bg-surface rounded-2xl border border-warmBorder p-6 shadow-warm hover:shadow-warmHover transition-all space-y-4"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-primary-subtle text-primary flex items-center justify-center font-bold text-lg shrink-0">
                  {item.fullName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-bold text-base text-ink truncate">{item.fullName}</h3>
                    {item.userId && (
                      <span title="Tài khoản đã xác thực">
                        <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-primary font-medium mt-0.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.region}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-warmBorder/60 pt-3">
                {item.generationBranch && (
                  <div className="flex items-center justify-between text-ink-muted">
                    <span>Dòng họ / Xóm gốc:</span>
                    <span className="font-semibold text-accent truncate max-w-[170px]">
                      {item.generationBranch}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-ink-muted">
                  <span>Liên hệ:</span>
                  <span className="font-semibold text-ink flex items-center space-x-1">
                    <Phone className="w-3 h-3 text-secondary-dark" />
                    <span>{item.contactInfo || 'Bảo mật'}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchVillagers(p, selectedRegion, selectedBranch, search)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                p === pagination.page
                  ? 'bg-primary text-surface shadow-sm'
                  : 'bg-surface text-ink hover:bg-paper border border-warmBorder'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface rounded-3xl border border-warmBorder max-w-md w-full p-6 sm:p-8 space-y-4 shadow-warmHover">
            <h3 className="text-xl font-bold text-ink">Đăng Ký Danh Bạ Đồng Hương</h3>
            <p className="text-xs text-ink-muted">
              Cung cấp thông tin để Ban liên lạc và con em Làng Giao Tác dễ dàng kết nối.
            </p>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 pt-1">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Phan Văn An"
                  className="w-full input-warm text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Khu vực đang sinh sống <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Ví dụ: Hà Nội, TP.HCM, Đà Nẵng, Đức..."
                  className="w-full input-warm text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Dòng họ / Chi phái
                </label>
                <input
                  type="text"
                  list="clan-list"
                  value={generationBranch}
                  onChange={(e) => setGenerationBranch(e.target.value)}
                  placeholder="Chọn hoặc nhập dòng họ (ví dụ: Họ Nguyễn Trọng...)"
                  className="w-full input-warm text-sm"
                />
                <datalist id="clan-list">
                  <option value="Họ Nguyễn Trọng" />
                  <option value="Họ Nguyễn Duy" />
                  <option value="Họ Nguyễn Huy" />
                  <option value="Họ Phan Sỹ" />
                  <option value="Họ Nguyễn Văn" />
                  <option value="Họ Phạm Hữu" />
                  <option value="Họ Trần Đình" />
                  <option value="Họ Lê" />
                </datalist>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Số điện thoại / Zalo / Email liên hệ
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="0912.xxx.xxx"
                  className="w-full input-warm text-sm"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="phonePublic"
                  checked={phonePublic}
                  onChange={(e) => setPhonePublic(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <label htmlFor="phonePublic" className="text-xs text-ink">
                  Cho phép hiển thị số liên hệ công khai trong danh bạ
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-warmBorder text-sm font-medium text-ink hover:bg-paper"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-primary text-surface text-sm font-semibold hover:bg-primary-dark shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Đang gửi...' : 'Đăng ký'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
