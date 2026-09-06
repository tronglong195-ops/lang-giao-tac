import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  MapPin,
  Search,
  PlusCircle,
  Award,
  Heart,
  Sparkles,
  Info,
  Shield,
  X,
  Scroll,
  BookOpen,
} from 'lucide-react';
import { genealogyService } from '../services/genealogyService';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import { FamilyTreeCanvas } from '../components/genealogy/FamilyTreeCanvas';

// --- HỌA TIẾT HOÀNG GIA & CUNG ĐÌNH VIỆT NAM ---

/**
 * Bức Hoành Phi Lưỡng Long Chầu Nguyệt & Đại Tự Thếp Vàng
 */
const RoyalImperialBanner = () => (
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#581010] via-[#7F1D1D] to-[#3B0707] border-4 border-amber-500/90 p-6 sm:p-10 text-center shadow-2xl space-y-4">
    {/* Họa tiết hoa văn triện 4 góc */}
    <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400" />
    <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400" />
    <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400" />
    <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400" />

    {/* Đại tự Hoành phi dát vàng */}
    <div className="inline-flex flex-col items-center justify-center space-y-1">
      <div className="px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-700 via-yellow-500 to-amber-700 border-2 border-yellow-200 shadow-xl">
        <span className="font-serif text-xl sm:text-3xl font-black text-stone-950 tracking-[0.3em] uppercase drop-shadow-sm">
          木 本 水 源 • 飲 水 思 源
        </span>
      </div>
      <span className="text-[11px] sm:text-xs font-serif italic text-amber-200/90 tracking-widest pt-1">
        "Cây Có Cội Nước Có Nguồn — Uống Nước Nhớ Nguồn Tri Ân Tiên Tổ"
      </span>
    </div>

    {/* Tiêu đề chính */}
    <div className="space-y-2 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-200 tracking-tight leading-snug drop-shadow-md">
        BÁCH GIA PHẢ HỆ • BÁT ĐẠI DÒNG TỘC
      </h1>
      <p className="text-xs sm:text-sm text-amber-100/80 font-serif leading-relaxed max-w-3xl mx-auto">
        Nơi phụng thờ, tôn vinh và lưu truyền mạch nguồn phả tộc thiêng liêng của các bậc tiền nhân khai canh lập ấp 
        tại <strong>Làng Giao Tác — Tổ dân phố 9 Thuận Lộc, Phường Nam Hồng Lĩnh, tỉnh Hà Tĩnh</strong>.
      </p>
    </div>

    {/* Đôi Câu Đối Cổ Phong Cung Đình */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 max-w-3xl mx-auto">
      <div className="px-4 py-2 rounded-xl bg-black/40 border border-amber-500/60 flex items-center justify-center space-x-2">
        <span className="font-serif font-bold text-yellow-300 text-sm sm:text-base tracking-wider">
          祖 宗 功 德 千 年 盛
        </span>
        <span className="text-amber-200/70 text-xs italic font-serif">
          (Tổ tông công đức thiên niên thịnh)
        </span>
      </div>
      <div className="px-4 py-2 rounded-xl bg-black/40 border border-amber-500/60 flex items-center justify-center space-x-2">
        <span className="font-serif font-bold text-yellow-300 text-sm sm:text-base tracking-wider">
          子 孝 孫 賢 萬 代 榮
        </span>
        <span className="text-amber-200/70 text-xs italic font-serif">
          (Tử hiếu tôn hiền vạn đại vinh)
        </span>
      </div>
    </div>
  </div>
);

export const GenealogyPage = () => {
  const { clanSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  const [clans, setClans] = useState([]);
  const [selectedClan, setSelectedClan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'members'

  // Modal Detail Member
  const [selectedMemberDetail, setSelectedMemberDetail] = useState(null);

  // Modal Add / Edit Member
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [parentForNewChild, setParentForNewChild] = useState(null);
  const [memberForm, setMemberForm] = useState({
    fullName: '',
    gender: 'male',
    generation: 1,
    branchName: '',
    birthYear: '',
    deathYear: '',
    spouseName: '',
    tombLocation: '',
    careerHonor: '',
    biography: '',
  });
  const [submittingMember, setSubmittingMember] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Clans List
  useEffect(() => {
    const fetchClans = async () => {
      setLoading(true);
      try {
        const data = await genealogyService.getAllClans();
        setClans(data);
        if (data.length > 0) {
          const targetSlug = clanSlug || data[0].slug;
          loadClanDetail(targetSlug);
        }
      } catch (err) {
        console.error('Lỗi tải danh sách dòng họ:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClans();
  }, [clanSlug]);

  // 2. Load Single Clan Detail with Tree
  const loadClanDetail = async (slug) => {
    try {
      const clan = await genealogyService.getClanBySlug(slug);
      setSelectedClan(clan);
    } catch (err) {
      console.error('Lỗi tải chi tiết dòng họ:', err);
    }
  };

  const handleSelectClan = (clan) => {
    navigate(`/gia-pha/${clan.slug}`);
    loadClanDetail(clan.slug);
  };

  const handleOpenAddRootMember = () => {
    setParentForNewChild(null);
    setMemberForm({
      fullName: '',
      gender: 'male',
      generation: 1,
      branchName: 'Thủy Tổ / Tiên Khởi',
      birthYear: '',
      deathYear: '',
      spouseName: '',
      tombLocation: '',
      careerHonor: '',
      biography: '',
    });
    setShowMemberModal(true);
  };

  const handleOpenAddChild = (parentNode) => {
    setParentForNewChild(parentNode);
    setMemberForm({
      fullName: '',
      gender: 'male',
      generation: parentNode ? parentNode.generation + 1 : 1,
      branchName: parentNode ? parentNode.branchName || '' : 'Chi Trưởng',
      birthYear: '',
      deathYear: '',
      spouseName: '',
      tombLocation: '',
      careerHonor: '',
      biography: '',
    });
    setShowMemberModal(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!memberForm.fullName.trim() || !selectedClan) return;

    setSubmittingMember(true);
    try {
      await genealogyService.addMember(selectedClan.id, {
        ...memberForm,
        parentId: parentForNewChild ? parentForNewChild.id : null,
      });
      setShowMemberModal(false);
      loadClanDetail(selectedClan.slug);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi thêm thành viên gia phả.');
    } finally {
      setSubmittingMember(false);
    }
  };

  const filteredMembers =
    selectedClan?.members?.filter(
      (m) =>
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.branchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.careerHonor?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const clanTitle = selectedClan
    ? `Gia Phả ${selectedClan.name} — Cội Nguồn Làng Giao Tác`
    : 'Gia Phả & Cội Nguồn 8 Dòng Họ — Làng Giao Tác';

  const clanDesc =
    selectedClan?.originStory ||
    'Phả hệ số, danh sách tiên tổ, chi phái và lịch giỗ tổ của 8 dòng họ Làng Giao Tác — TDP 9 Thuận Lộc, Hà Tĩnh.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Helmet>
        <title>{`${clanTitle}`}</title>
        <meta name="description" content={clanDesc.slice(0, 160)} />
        <meta property="og:title" content={clanTitle} />
        <meta property="og:description" content={clanDesc.slice(0, 160)} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* 1. Hoành Phi Cung Đình & Câu Đối Hoàng Gia */}
      <RoyalImperialBanner />

      {/* 2. Thanh Chọn 8 Dòng Họ (Thẻ Bài Bát Đại Dòng Tộc Sơn Son Thếp Vàng) */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#7F1D1D] px-1">
          <Scroll className="w-4 h-4 text-amber-700" />
          <span>Bát Đại Dòng Tộc Tiền Khai Làng Giao Tác</span>
        </div>

        <div className="flex items-center space-x-2.5 overflow-x-auto pb-3 scrollbar-none">
          {clans.map((clan) => {
            const isSelected = selectedClan?.id === clan.id;
            return (
              <button
                key={clan.id}
                onClick={() => handleSelectClan(clan)}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-serif font-black whitespace-nowrap transition-all duration-300 flex items-center space-x-2.5 shadow-md ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#7F1D1D] text-yellow-300 border-2 border-amber-400 ring-4 ring-amber-400/30 scale-102 shadow-xl'
                    : 'bg-gradient-to-r from-[#FDFBF7] to-[#F5EBE1] hover:from-[#FFF] hover:to-[#FDFBF7] text-stone-900 border border-amber-700/30 hover:border-amber-600'
                }`}
              >
                <span>⚜️ {clan.name}</span>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-sans font-bold ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 shadow-xs'
                      : 'bg-amber-100 text-amber-900 border border-amber-300/60'
                  }`}
                >
                  {clan._count?.members || 0} vị
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Khung Tổng Quan Dòng Tộc (Nhà Thờ Họ, Ngày Giỗ Tổ, Trưởng Tộc) */}
      {selectedClan && (
        <div className="rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5EBE1] border-2 border-amber-600/60 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-amber-300/80 pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-red-900 text-yellow-300 text-xs font-serif font-bold uppercase tracking-wider border border-amber-400">
                <span>{selectedClan.ancestorName || 'Tiên Tổ Khởi Dựng'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-black text-red-950">
                {selectedClan.name} — Làng Giao Tác
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isAdmin && (
                <button
                  onClick={handleOpenAddRootMember}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-yellow-200 text-xs sm:text-sm font-serif font-bold shadow-md transition-all border border-amber-400"
                >
                  <PlusCircle className="w-4 h-4 text-yellow-300" />
                  <span>Khởi Tạo Cụ Thủy Tổ</span>
                </button>
              )}
            </div>
          </div>

          {/* Hộp Thông Tin Cổ Kính (Từ đường, Lễ giỗ, Trưởng tộc) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {selectedClan.templeAddress && (
              <div className="p-4 rounded-2xl bg-white/80 border border-amber-300 space-y-1.5 shadow-xs">
                <div className="flex items-center space-x-1.5 text-red-900 font-serif font-bold">
                  <MapPin className="w-4 h-4 text-red-700" />
                  <span>Từ Đường / Nhà Thờ Họ</span>
                </div>
                <p className="text-stone-700 font-medium">{selectedClan.templeAddress}</p>
              </div>
            )}

            {selectedClan.deathAnniversary && (
              <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-400 space-y-1.5 text-amber-950 shadow-xs">
                <div className="flex items-center space-x-1.5 font-serif font-bold text-amber-900">
                  <Calendar className="w-4 h-4 text-amber-800" />
                  <span>Ngày Giỗ Tổ (Âm Lịch)</span>
                </div>
                <p className="font-serif font-bold text-sm text-red-900">{selectedClan.deathAnniversary}</p>
              </div>
            )}

            {selectedClan.leaderName && (
              <div className="p-4 rounded-2xl bg-white/80 border border-amber-300 space-y-1.5 shadow-xs">
                <div className="flex items-center space-x-1.5 text-red-900 font-serif font-bold">
                  <Shield className="w-4 h-4 text-red-700" />
                  <span>Trưởng Tộc / Khánh Tiết</span>
                </div>
                <p className="text-stone-700 font-medium">{selectedClan.leaderName}</p>
              </div>
            )}
          </div>

          {selectedClan.originStory && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-300/80 space-y-1">
              <span className="text-[11px] font-serif font-bold uppercase tracking-widest text-amber-900">
                📜 Lược Sử Khai Canh & Tông Phả
              </span>
              <p className="text-xs sm:text-sm text-stone-800 font-serif leading-relaxed italic">
                "{selectedClan.originStory}"
              </p>
            </div>
          )}

          {/* Chuyển Đổi Chế Độ Xem */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-amber-300/80 pb-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('tree')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all shadow-xs ${
                  activeTab === 'tree'
                    ? 'bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-yellow-300 border border-amber-400 shadow-md'
                    : 'text-stone-700 hover:bg-amber-100/60 border border-amber-200'
                }`}
              >
                🌳 Sơ Đồ Cây Phả Hệ
              </button>

              <button
                onClick={() => setActiveTab('panorama')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all shadow-xs ${
                  activeTab === 'panorama'
                    ? 'bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-yellow-300 border border-amber-400 shadow-md'
                    : 'text-stone-700 hover:bg-amber-100/60 border border-amber-200'
                }`}
              >
                🏛️ Toàn Cảnh 11 Đời (Bảng Gốc)
              </button>

              <button
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all shadow-xs ${
                  activeTab === 'members'
                    ? 'bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-yellow-300 border border-amber-400 shadow-md'
                    : 'text-stone-700 hover:bg-amber-100/60 border border-amber-200'
                }`}
              >
                📖 Danh Mục Phả Tộc ({selectedClan.members?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab('document')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all shadow-xs ${
                  activeTab === 'document'
                    ? 'bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-yellow-300 border border-amber-400 shadow-md'
                    : 'text-stone-700 hover:bg-amber-100/60 border border-amber-200'
                }`}
              >
                🖼️ Bản Đồ Gốc & Tải PDF
              </button>
            </div>

            {activeTab === 'members' && (
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tra cứu tiên tổ, chức vị, chi..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-300 bg-white text-xs text-stone-900 outline-none focus:border-red-800"
                />
              </div>
            )}
          </div>

          {/* Tab 1: Cây Phả Hệ Tương Tác Cổ Điển */}
          {activeTab === 'tree' && (
            <FamilyTreeCanvas
              tree={selectedClan.tree || []}
              clanName={selectedClan.name}
              onSelectMember={(member) => setSelectedMemberDetail(member)}
              onAddChild={handleOpenAddChild}
              isAdmin={isAdmin}
            />
          )}

          {/* Tab 2: Toàn Cảnh 11 Đời Phả Hệ (Bảng Gốc 11 Cột) */}
          {activeTab === 'panorama' && (
            <div className="space-y-4">
              {/* Chú giải bảng gốc */}
              <div className="p-4 rounded-2xl bg-amber-100/80 border-2 border-amber-400/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3 font-serif">
                  <span className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-300 text-stone-900 font-bold border border-amber-500 shadow-xs">
                    <span>🟡 Ô Nền Vàng: Tộc Trưởng Đời</span>
                  </span>
                  <span className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white text-stone-900 border-2 border-dashed border-amber-600 font-medium">
                    <span>▫️ Viền Nét Đứt: Quan hệ cần đối chiếu lại bảng gốc</span>
                  </span>
                  <span className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-red-900 text-yellow-200 font-bold border border-amber-400">
                    <span>👑 Thủy Tổ: Nguyễn Trọng Chất (Vũ Thị Mai)</span>
                  </span>
                </div>
                <span className="text-[11px] text-amber-900 italic font-mono">
                  Tổng 153 người • 11 đời • Nguồn: Bảng gia phả lập tháng 6/2022 (Nhâm Dần)
                </span>
              </div>

              {/* Bảng 11 Cột Cuộn Ngang */}
              <div className="overflow-x-auto pb-4 scrollbar-thin rounded-2xl border-2 border-amber-400 bg-[#2A0808] p-4 shadow-2xl">
                <div className="inline-flex gap-4 min-w-max items-start">
                  {[
                    { gen: 1, title: 'ĐỜI Thủy tổ', count: 1 },
                    { gen: 2, title: 'ĐỜI I', count: 3 },
                    { gen: 3, title: 'ĐỜI II', count: 2 },
                    { gen: 4, title: 'ĐỜI III', count: 2 },
                    { gen: 5, title: 'ĐỜI IV', count: 3 },
                    { gen: 6, title: 'ĐỜI V', count: 6 },
                    { gen: 7, title: 'ĐỜI VI', count: 10 },
                    { gen: 8, title: 'ĐỜI VII', count: 29 },
                    { gen: 9, title: 'ĐỜI VIII', count: 50 },
                    { gen: 10, title: 'ĐỜI IX', count: 42 },
                    { gen: 11, title: 'ĐỜI X', count: 5 },
                  ].map((col) => {
                    const colMembers = (selectedClan.members || []).filter((m) => m.generation === col.gen);
                    return (
                      <div
                        key={col.gen}
                        className="w-56 shrink-0 bg-black/30 backdrop-blur-xs rounded-2xl border border-amber-500/40 p-3 space-y-3 flex flex-col"
                      >
                        {/* Header Cột Đời */}
                        <div className="text-center py-2 px-3 rounded-xl bg-gradient-to-r from-red-900 to-red-950 border border-amber-400 shadow-md">
                          <h4 className="font-serif font-black text-yellow-300 text-xs sm:text-sm tracking-wider uppercase">
                            {col.title}
                          </h4>
                          <span className="text-[10px] text-amber-200/80 font-mono">
                            {colMembers.length} vị
                          </span>
                        </div>

                        {/* Danh sách thành viên trong đời */}
                        <div className="space-y-2.5">
                          {colMembers.map((m) => {
                            const isPatriarch = m.isPatriarch || m.careerHonor === 'Tộc Trưởng Đời';
                            const isDashed = m.isDashed;
                            return (
                              <div
                                key={m.id}
                                onClick={() => setSelectedMemberDetail(m)}
                                className={`p-3 rounded-xl border transition-all cursor-pointer select-none text-center space-y-1 shadow-md hover:scale-102 ${
                                  isPatriarch
                                    ? 'bg-gradient-to-b from-[#B45309] via-[#D97706] to-[#78350F] text-yellow-50 border-amber-300 ring-2 ring-yellow-400/70 shadow-lg'
                                    : col.gen === 1
                                    ? 'bg-gradient-to-b from-red-900 to-red-950 text-yellow-200 border-amber-400 ring-2 ring-amber-400/40'
                                    : 'bg-[#450A0A] hover:bg-[#5B1313] text-amber-100 border-amber-700/60 hover:border-amber-400'
                                } ${isDashed ? 'border-dashed border-2 border-amber-300/90' : ''}`}
                              >
                                {isPatriarch && (
                                  <span className="inline-block px-2 py-0.5 rounded bg-yellow-400 text-red-950 text-[9px] font-black uppercase tracking-wider mb-0.5 shadow-xs">
                                    👑 Tộc trưởng đời
                                  </span>
                                )}

                                <div className="font-serif font-bold text-xs sm:text-sm text-yellow-100 leading-tight">
                                  {m.fullName}
                                </div>

                                {m.spouseName && (
                                  <div className="text-[10px] text-rose-200 font-serif italic truncate">
                                    ({m.spouseName})
                                  </div>
                                )}

                                {m.parentName && (
                                  <div className="text-[9px] text-amber-300/70 font-sans truncate">
                                    Cha: {m.parentName}
                                  </div>
                                )}

                                {isDashed && (
                                  <span className="text-[8px] text-amber-300/80 italic block pt-0.5">
                                    (Cần đối chiếu gốc)
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Danh Mục Tra Cứu Bài Vị */}
          {activeTab === 'members' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => {
                const isPatriarch = member.isPatriarch || member.careerHonor === 'Tộc Trưởng Đời';
                const isDashed = member.isDashed;
                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMemberDetail(member)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 hover:scale-101 shadow-md ${
                      isPatriarch
                        ? 'bg-gradient-to-b from-[#FFFDF0] to-[#FEF3C7] border-amber-500 hover:border-amber-600'
                        : 'bg-gradient-to-b from-[#FFFDF9] to-[#FDF8F0] hover:to-[#FAF0E1] border-amber-400/80 hover:border-red-700'
                    } ${isDashed ? 'border-dashed border-amber-500' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-900 text-yellow-300 text-[10px] font-serif font-bold uppercase">
                        {member.genLabel || `Đời Thứ ${member.generation}`}
                      </span>
                      {isPatriarch && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold">
                          👑 Tộc Trưởng
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-base text-red-950 flex items-center justify-between">
                      <span>{member.fullName}</span>
                      {member.parentName && (
                        <span className="text-[11px] font-sans font-normal text-stone-500">
                          (Cha: {member.parentName})
                        </span>
                      )}
                    </h4>

                    {member.spouseName && (
                      <div className="text-[11px] text-rose-800 flex items-center space-x-1 pt-0.5 truncate">
                        <Heart className="w-3 h-3 text-rose-600 shrink-0" />
                        <span className="truncate">Chính thất / Phối ngẫu: {member.spouseName}</span>
                      </div>
                    )}

                    {isDashed && (
                      <p className="text-[10px] text-amber-800 italic bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        ⚠️ Viền nét đứt: Quan hệ cha–con cần đối chiếu lại bảng gốc
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 4: Bản Đồ Gốc & Tải File PDF */}
          {activeTab === 'document' && (
            <div className="rounded-3xl bg-surface border-2 border-amber-500/80 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-300 pb-4">
                <div>
                  <span className="px-3 py-0.5 rounded-full bg-red-900 text-yellow-300 text-xs font-serif font-bold uppercase">
                    Tư Liệu Gốc Của Dòng Tộc
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-red-950 mt-1">
                    Bản Đồ Gia Phả Chi Họ Nguyễn Trọng Chất (Tháng 6/2022)
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Bản đồ phả hệ đầy đủ 11 đời (từ Cụ Thủy Tổ đến Đời X) gồm 153 vị đinh nam.
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <a
                    href="/images/genealogy/gia-pha-ho-nguyen-trong-chat.pdf"
                    download="Gia-Pha-Dong-Toc-Ho-Nguyen-Trong-Chat-6-2022.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-900 hover:bg-red-800 text-yellow-200 font-serif font-bold text-xs shadow-md transition-all border border-amber-400"
                  >
                    <span>📥 Tải File PDF Vector Gốc</span>
                  </a>
                  <a
                    href="/images/genealogy/gia-pha-ho-nguyen-trong-chat.png"
                    download="Gia-Pha-Ho-Nguyen-Trong-Chat-4K.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-serif font-bold text-xs border border-amber-400 shadow-xs"
                  >
                    <span>🖼️ Tải Ảnh 4K (3945 x 5184)</span>
                  </a>
                </div>
              </div>

              {/* Khung Xem Ảnh Sắc Nét */}
              <div className="rounded-2xl overflow-hidden border-2 border-amber-300 bg-stone-100 shadow-inner group relative">
                <img
                  src="/images/genealogy/gia-pha-ho-nguyen-trong-chat.png"
                  alt="Bản đồ gia phả dòng tộc họ Nguyễn Trọng — Chi họ Nguyễn Trọng Chất"
                  className="w-full h-auto object-contain cursor-zoom-in group-hover:scale-[1.01] transition-transform duration-300"
                  onClick={() => window.open('/images/genealogy/gia-pha-ho-nguyen-trong-chat.png', '_blank')}
                  title="Nhấp để xem ảnh kích thước đầy đủ trong tab mới"
                />
                <div className="p-3 text-center text-xs text-stone-500 bg-paper border-t border-warmBorder italic font-sans">
                  Nhấp vào ảnh để mở xem toàn cảnh độ phân giải cao (3945 x 5184 px)
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- MODAL CHI TIẾT THÀNH VIÊN (DẠNG SẮC PHONG HOÀNG TRIỀU) --- */}
      {selectedMemberDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5EBE1] border-4 border-amber-600 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedMemberDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Sắc Phong */}
            <div className="text-center space-y-1.5 border-b-2 border-amber-300 pb-4">
              <span className="px-3 py-1 rounded-full bg-red-950 text-yellow-300 text-xs font-serif font-black uppercase tracking-widest border border-amber-400 shadow-sm">
                ⚜️ TÔNG PHẢ CHI TIẾT • ĐỜI THỨ {selectedMemberDetail.generation}
              </span>
              <h3 className="text-2xl font-serif font-black text-red-950 pt-1">
                {selectedMemberDetail.fullName}
              </h3>
              {selectedMemberDetail.branchName && (
                <p className="text-xs text-amber-900 font-serif font-semibold">
                  Phân nhánh: {selectedMemberDetail.branchName}
                </p>
              )}
            </div>

            {/* Thông tin chi tiết */}
            <div className="space-y-3 text-xs sm:text-sm text-stone-800 font-serif leading-relaxed">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>
                  <strong>Năm sinh — Năm mất:</strong>{' '}
                  {selectedMemberDetail.birthYear || 'Tích niên'} — {selectedMemberDetail.deathYear || (selectedMemberDetail.careerHonor ? 'Hiện diện' : 'Chưa rõ')}
                </span>
              </div>

              {selectedMemberDetail.spouseName && (
                <div className="flex items-center space-x-2 text-rose-900 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>
                    <strong>Chính thất / Phối ngẫu:</strong> {selectedMemberDetail.spouseName}
                  </span>
                </div>
              )}

              {selectedMemberDetail.careerHonor && (
                <div className="p-3 rounded-xl bg-amber-100/80 border border-amber-300 space-y-1 text-red-950">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Award className="w-4 h-4 text-amber-700" />
                    <span>Phẩm hàm / Công đức / Vinh danh:</span>
                  </div>
                  <p className="italic">{selectedMemberDetail.careerHonor}</p>
                </div>
              )}

              {selectedMemberDetail.tombLocation && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>
                    <strong>Mộ phần tiên tổ:</strong> {selectedMemberDetail.tombLocation}
                  </span>
                </div>
              )}

              {selectedMemberDetail.biography && (
                <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1">
                  <strong>Hành trạng & Ký ức dòng tộc:</strong>
                  <p className="text-stone-700 text-xs italic">{selectedMemberDetail.biography}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMemberDetail(null)}
                className="px-5 py-2 rounded-xl bg-red-950 text-yellow-300 font-serif font-bold text-xs hover:bg-red-900 transition-all border border-amber-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL THÊM / SỬA THÀNH VIÊN GIA PHẢ --- */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EE] to-[#F5EBE1] border-4 border-amber-600 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b-2 border-amber-300 pb-3">
              <h3 className="text-lg font-serif font-black text-red-950">
                {parentForNewChild
                  ? `Khởi Tạo Hậu Duệ (Con của: ${parentForNewChild.fullName})`
                  : 'Khởi Tạo Cụ Thủy Tổ / Tiên Khởi'}
              </h3>
              <button
                onClick={() => setShowMemberModal(false)}
                className="p-1.5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-serif font-bold text-stone-800 mb-1">
                  Họ và Tên Tiên Tổ / Thành viên *
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.fullName}
                  onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Trọng Long, Cụ Nguyễn Trọng Văn..."
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 focus:border-red-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-serif font-bold text-stone-800 mb-1">Giới tính</label>
                  <select
                    value={memberForm.gender}
                    onChange={(e) => setMemberForm({ ...memberForm, gender: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 focus:border-red-800 outline-none"
                  >
                    <option value="male">Nam (Trai / Cụ Ông)</option>
                    <option value="female">Nữ (Gái / Cụ Bà)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-serif font-bold text-stone-800 mb-1">Đời thứ</label>
                  <input
                    type="number"
                    min="1"
                    value={memberForm.generation}
                    onChange={(e) => setMemberForm({ ...memberForm, generation: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 focus:border-red-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-serif font-bold text-stone-800 mb-1">Năm sinh</label>
                  <input
                    type="text"
                    value={memberForm.birthYear}
                    onChange={(e) => setMemberForm({ ...memberForm, birthYear: e.target.value })}
                    placeholder="1945 hoặc để trống"
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 focus:border-red-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-serif font-bold text-stone-800 mb-1">Năm mất (nếu có)</label>
                  <input
                    type="text"
                    value={memberForm.deathYear}
                    onChange={(e) => setMemberForm({ ...memberForm, deathYear: e.target.value })}
                    placeholder="2010 hoặc để trống"
                    className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 focus:border-red-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-serif font-bold text-stone-800 mb-1">Chi phái / Nhánh họ</label>
                <input
                  type="text"
                  value={memberForm.branchName}
                  onChange={(e) => setMemberForm({ ...memberForm, branchName: e.target.value })}
                  placeholder="Chi Trưởng, Chi Thứ Hai, Nhánh Tây..."
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 focus:border-red-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-serif font-bold text-stone-800 mb-1">Chính thất / Phối ngẫu</label>
                <input
                  type="text"
                  value={memberForm.spouseName}
                  onChange={(e) => setMemberForm({ ...memberForm, spouseName: e.target.value })}
                  placeholder="Họ tên người phối ngẫu"
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 focus:border-red-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-serif font-bold text-stone-800 mb-1">Phẩm hàm / Công đức / Chức vị</label>
                <input
                  type="text"
                  value={memberForm.careerHonor}
                  onChange={(e) => setMemberForm({ ...memberForm, careerHonor: e.target.value })}
                  placeholder="Hương sư, Cử nhân, Giáo viên, Bác sĩ..."
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 focus:border-red-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-serif font-bold text-stone-800 mb-1">Mộ phần tiên tổ</label>
                <input
                  type="text"
                  value={memberForm.tombLocation}
                  onChange={(e) => setMemberForm({ ...memberForm, tombLocation: e.target.value })}
                  placeholder="Khu nghĩa trang Núi Hồng Lĩnh..."
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 focus:border-red-800 outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-amber-300">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 font-bold hover:bg-stone-300"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={submittingMember}
                  className="px-5 py-2 rounded-xl bg-red-950 text-yellow-300 font-serif font-bold hover:bg-red-900 border border-amber-400 shadow-md disabled:opacity-50"
                >
                  {submittingMember ? 'Đang Lưu...' : 'Lưu Vào Phả Hệ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
