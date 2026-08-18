import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
  Search,
  PlusCircle,
  Award,
  Heart,
  ChevronRight,
  Sparkles,
  Info,
  Shield,
  X,
} from 'lucide-react';
import { genealogyService } from '../services/genealogyService';
import { useAuth } from '../context/AuthContext';
import { FamilyTreeCanvas } from '../components/genealogy/FamilyTreeCanvas';

export const GenealogyPage = () => {
  const { clanSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  const [clans, setClans] = useState([]);
  const [selectedClan, setSelectedClan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'members' | 'history'

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
      branchName: 'Thủy Tổ / Tiên Tổ',
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
      generation: parentNode.generation + 1,
      branchName: parentNode.branchName || '',
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

  const filteredMembers = selectedClan?.members?.filter((m) =>
    m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.branchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.careerHonor?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Banner Header */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-10 shadow-warm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          <span>Phả Hệ Số Làng Giao Tác</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-primary-dark tracking-tight leading-snug">
          Gia Phả & Cội Nguồn 8 Dòng Họ
        </h1>

        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-3xl">
          Nơi lưu giữ phả hệ thiêng liêng, tri ân tiên tổ và kết nối mạch nguồn huyết thống của 8 dòng họ lớn: 
          <strong> Họ Nguyễn Trọng, Nguyễn Duy, Nguyễn Huy, Phan Sỹ, Nguyễn Văn, Phạm Hữu, Trần Đình, Họ Lê</strong> tại Tổ dân phố 9 Thuận Lộc.
        </p>
      </div>

      {/* 8 Clan Navigation Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {clans.map((clan) => {
          const isSelected = selectedClan?.id === clan.id;
          return (
            <button
              key={clan.id}
              onClick={() => handleSelectClan(clan)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center space-x-2 shadow-xs ${
                isSelected
                  ? 'bg-primary text-surface shadow-warm scale-102 ring-2 ring-primary/30'
                  : 'bg-surface hover:bg-paper text-ink border border-warmBorder'
              }`}
            >
              <span>{clan.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-surface/20 text-surface' : 'bg-primary-subtle text-primary'}`}>
                {clan._count?.members || 0} cụ/vị
              </span>
            </button>
          );
        })}
      </div>

      {/* Clan Overview Card */}
      {selectedClan && (
        <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-warmBorder pb-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                {selectedClan.ancestorName || 'Tiên Tổ Khởi Dựng'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark">
                {selectedClan.name} — Làng Giao Tác
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isAdmin && (
                <button
                  onClick={handleOpenAddRootMember}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-primary text-surface text-xs sm:text-sm font-semibold hover:bg-primary-dark shadow-sm transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm cụ Thủy Tổ / Tiên Tổ</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-ink">
            {selectedClan.templeAddress && (
              <div className="p-3.5 rounded-2xl bg-paper/70 border border-warmBorder space-y-1">
                <div className="flex items-center space-x-1 text-primary font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Nhà thờ họ</span>
                </div>
                <p className="text-ink-muted">{selectedClan.templeAddress}</p>
              </div>
            )}

            {selectedClan.deathAnniversary && (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1 text-amber-900">
                <div className="flex items-center space-x-1 font-bold text-amber-800">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Ngày Giỗ Tổ (Âm lịch)</span>
                </div>
                <p className="font-semibold">{selectedClan.deathAnniversary}</p>
              </div>
            )}

            {selectedClan.leaderName && (
              <div className="p-3.5 rounded-2xl bg-paper/70 border border-warmBorder space-y-1">
                <div className="flex items-center space-x-1 text-accent font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Trưởng tộc / Ban khánh tiết</span>
                </div>
                <p className="text-ink-muted">{selectedClan.leaderName}</p>
              </div>
            )}
          </div>

          {selectedClan.originStory && (
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed italic bg-paper/40 p-4 rounded-2xl border border-warmBorder/60">
              "{selectedClan.originStory}"
            </p>
          )}

          {/* View Mode Tabs */}
          <div className="flex items-center justify-between border-b border-warmBorder pb-3 pt-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('tree')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === 'tree' ? 'bg-primary text-surface' : 'text-ink-muted hover:bg-paper'
                }`}
              >
                Sơ đồ Cây Phả Hệ
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  activeTab === 'members' ? 'bg-primary text-surface' : 'text-ink-muted hover:bg-paper'
                }`}
              >
                Danh Sách Tra Cứu ({selectedClan.members?.length || 0})
              </button>
            </div>

            {activeTab === 'members' && (
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên, chức vị, chi..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-warmBorder bg-paper text-xs"
                />
              </div>
            )}
          </div>

          {/* Tab 1: Interactive Tree View */}
          {activeTab === 'tree' && (
            <FamilyTreeCanvas
              tree={selectedClan.tree || []}
              onSelectMember={(member) => setSelectedMemberDetail(member)}
              onAddChild={handleOpenAddChild}
              isAdmin={isAdmin}
            />
          )}

          {/* Tab 2: Members List View */}
          {activeTab === 'members' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMemberDetail(member)}
                  className="p-4 rounded-2xl bg-paper/60 hover:bg-paper border border-warmBorder hover:border-primary/50 shadow-xs cursor-pointer space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold">
                      Đời thứ {member.generation}
                    </span>
                    {member.branchName && (
                      <span className="text-[11px] text-accent font-medium">{member.branchName}</span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-ink">{member.fullName}</h4>

                  <div className="text-xs text-ink-muted flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-ink-light" />
                    <span>
                      {member.birthYear || '?'} — {member.deathYear || (member.careerHonor ? 'Hiện diện' : '?')}
                    </span>
                  </div>

                  {member.careerHonor && (
                    <div className="text-[11px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded truncate">
                      {member.careerHonor}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMemberDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface rounded-3xl border border-warmBorder max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-warmBorder pb-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-surface text-xs font-bold">
                  Đời thứ {selectedMemberDetail.generation}
                </span>
                <span className="text-xs font-semibold text-accent">{selectedMemberDetail.branchName}</span>
              </div>
              <button
                onClick={() => setSelectedMemberDetail(null)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-paper"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <h3 className="text-xl font-bold text-primary-dark">{selectedMemberDetail.fullName}</h3>

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-paper rounded-2xl border border-warmBorder">
                <div>
                  <span className="text-ink-muted block text-[11px]">Năm sinh - Năm mất</span>
                  <span className="font-semibold text-ink">
                    {selectedMemberDetail.birthYear || '?'} — {selectedMemberDetail.deathYear || '?'}
                  </span>
                </div>
                {selectedMemberDetail.spouseName && (
                  <div>
                    <span className="text-ink-muted block text-[11px]">Phối ngẫu (Vợ/Chồng)</span>
                    <span className="font-semibold text-rose-700">{selectedMemberDetail.spouseName}</span>
                  </div>
                )}
              </div>

              {selectedMemberDetail.careerHonor && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                  <span className="font-bold block text-xs">Chức vị / Công đức:</span>
                  <span>{selectedMemberDetail.careerHonor}</span>
                </div>
              )}

              {selectedMemberDetail.tombLocation && (
                <div className="flex items-start space-x-1.5 text-ink-muted">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Mộ phần:</strong> {selectedMemberDetail.tombLocation}</span>
                </div>
              )}

              {selectedMemberDetail.biography && (
                <div className="space-y-1 pt-2 border-t border-warmBorder">
                  <span className="font-bold text-ink">Tiểu sử & Ghi chú:</span>
                  <p className="text-ink-muted leading-relaxed">{selectedMemberDetail.biography}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMemberDetail(null)}
                className="px-5 py-2 rounded-xl bg-primary text-surface text-xs font-semibold hover:bg-primary-dark"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Member Modal (Admin) */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface rounded-3xl border border-warmBorder max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-warmBorder pb-3">
              <h3 className="font-bold text-lg text-ink">
                {parentForNewChild ? `Thêm con cháu cụ ${parentForNewChild.fullName}` : 'Thêm Thành Viên Mới'}
              </h3>
              <button
                onClick={() => setShowMemberModal(false)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.fullName}
                  onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Trọng An"
                  className="w-full input-warm text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Đời thứ</label>
                  <input
                    type="number"
                    min="1"
                    value={memberForm.generation}
                    onChange={(e) => setMemberForm({ ...memberForm, generation: e.target.value })}
                    className="w-full input-warm text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Chi phái / Nhánh</label>
                  <input
                    type="text"
                    value={memberForm.branchName}
                    onChange={(e) => setMemberForm({ ...memberForm, branchName: e.target.value })}
                    placeholder="Ví dụ: Chi Trưởng"
                    className="w-full input-warm text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Năm sinh</label>
                  <input
                    type="text"
                    value={memberForm.birthYear}
                    onChange={(e) => setMemberForm({ ...memberForm, birthYear: e.target.value })}
                    placeholder="1950"
                    className="w-full input-warm text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Năm mất (nếu có)</label>
                  <input
                    type="text"
                    value={memberForm.deathYear}
                    onChange={(e) => setMemberForm({ ...memberForm, deathYear: e.target.value })}
                    placeholder="2020"
                    className="w-full input-warm text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Phối ngẫu (Vợ / Chồng)</label>
                <input
                  type="text"
                  value={memberForm.spouseName}
                  onChange={(e) => setMemberForm({ ...memberForm, spouseName: e.target.value })}
                  placeholder="Ví dụ: Bà Trần Thị Mai"
                  className="w-full input-warm text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Chức danh / Học vị / Công đức</label>
                <input
                  type="text"
                  value={memberForm.careerHonor}
                  onChange={(e) => setMemberForm({ ...memberForm, careerHonor: e.target.value })}
                  placeholder="Ví dụ: Hương sư, Cử nhân, Trưởng thôn..."
                  className="w-full input-warm text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Mộ phần</label>
                <input
                  type="text"
                  value={memberForm.tombLocation}
                  onChange={(e) => setMemberForm({ ...memberForm, tombLocation: e.target.value })}
                  placeholder="Ví dụ: Khu nghĩa trang dòng họ tại Đồi Mả Cả"
                  className="w-full input-warm text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Ghi chú tiểu sử</label>
                <textarea
                  rows={2}
                  value={memberForm.biography}
                  onChange={(e) => setMemberForm({ ...memberForm, biography: e.target.value })}
                  className="w-full input-warm text-sm resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-warmBorder">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 rounded-xl border border-warmBorder text-xs text-ink font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingMember}
                  className="px-5 py-2 rounded-xl bg-primary text-surface text-xs font-bold hover:bg-primary-dark disabled:opacity-50"
                >
                  {submittingMember ? 'Đang lưu...' : 'Lưu Thành Viên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
