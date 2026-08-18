import React, { useEffect, useState } from 'react';
import {
  Heart,
  Flame,
  Calendar,
  MapPin,
  Clock,
  PlusCircle,
  X,
  Sparkles,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { memorialService } from '../services/memorialService';
import { useAuth } from '../context/AuthContext';

export const MemorialPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  const [obituaries, setObituaries] = useState([]);
  const [selectedObituary, setSelectedObituary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal Add Obituary (Admin)
  const [showAddModal, setShowAddModal] = useState(false);
  const [obitForm, setObitForm] = useState({
    deceasedName: '',
    aliasName: '',
    age: '',
    clanName: 'Họ Nguyễn Trọng',
    diedAt: new Date().toISOString().slice(0, 10),
    funeralTime: '',
    burialTime: '',
    cemeteryPlace: 'Nghĩa trang Làng Giao Tác — TDP 9 Thuận Lộc',
    biography: '',
  });
  const [submittingObit, setSubmittingObit] = useState(false);

  // Condolence Form
  const [senderName, setSenderName] = useState(user?.fullName || '');
  const [senderFrom, setSenderFrom] = useState('');
  const [message, setMessage] = useState('');
  const [incenseCount, setIncenseCount] = useState(3);
  const [submittingCondolence, setSubmittingCondolence] = useState(false);
  const [condolenceSent, setCondolenceSent] = useState(false);

  const fetchObituaries = async () => {
    setLoading(true);
    try {
      const data = await memorialService.getAllObituaries();
      setObituaries(data);
      if (data.length > 0) {
        loadDetail(data[0].id);
      }
    } catch (err) {
      console.error('Lỗi tải sổ tang:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDetail = async (id) => {
    try {
      const detail = await memorialService.getObituaryDetail(id);
      setSelectedObituary(detail);
      setCondolenceSent(false);
    } catch (err) {
      console.error('Lỗi tải chi tiết cáo phó:', err);
    }
  };

  useEffect(() => {
    fetchObituaries();
  }, []);

  const handleSendCondolence = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedObituary) return;

    setSubmittingCondolence(true);
    try {
      await memorialService.sendCondolence(selectedObituary.id, {
        senderName: senderName.trim() || 'Bà con phương xa',
        senderFrom: senderFrom.trim() || 'Con em Làng Giao Tác',
        message: message.trim(),
        incenseCount: Number(incenseCount) || 1,
      });
      setCondolenceSent(true);
      setMessage('');
      loadDetail(selectedObituary.id);
    } catch (err) {
      alert('Có lỗi xảy ra khi gửi lời chia buồn.');
    } finally {
      setSubmittingCondolence(false);
    }
  };

  const handleCreateObituary = async (e) => {
    e.preventDefault();
    if (!obitForm.deceasedName) return;

    setSubmittingObit(true);
    try {
      await memorialService.createObituary(obitForm);
      setShowAddModal(false);
      fetchObituaries();
    } catch (err) {
      alert('Lỗi khi đăng cáo phó.');
    } finally {
      setSubmittingObit(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Somber Memorial Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-3xl border border-stone-700 p-6 sm:p-10 shadow-2xl text-stone-100 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-800 border border-stone-600 text-stone-300 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
          <span>Sổ Tang & Không Gian Tri Ân Tâm Linh</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-amber-100 tracking-tight leading-snug">
              Kính Tiễn Hương Hồn — Thành Kính Phân Ưu
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-2xl pt-1">
              Nơi con em quê hương trong và ngoài nước gửi nén tâm nhang, lời chia buồn và tiễn biệt 
              những người con ưu tú, các bậc cao niên Làng Giao Tác về cõi vĩnh hằng.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-amber-600/90 text-stone-900 font-bold text-xs sm:text-sm hover:bg-amber-500 transition-all shrink-0 shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Thông Báo Cáo Phó</span>
            </button>
          )}
        </div>
      </div>

      {/* Obituary List / Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Obituaries List */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-ink flex items-center space-x-2">
            <span>Danh Sách Cáo Phó</span>
            <span className="text-xs text-ink-muted font-normal">({obituaries.length})</span>
          </h3>

          {obituaries.length === 0 ? (
            <div className="p-8 bg-surface rounded-2xl border border-warmBorder text-center text-xs text-ink-muted">
              Hiện không có thông báo cáo phó.
            </div>
          ) : (
            <div className="space-y-3">
              {obituaries.map((obit) => {
                const isSelected = selectedObituary?.id === obit.id;
                return (
                  <div
                    key={obit.id}
                    onClick={() => loadDetail(obit.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-stone-900 text-stone-100 border-amber-500 shadow-md scale-101'
                        : 'bg-surface hover:bg-paper text-ink border-warmBorder'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={isSelected ? 'text-amber-400 font-semibold' : 'text-primary font-bold'}>
                        {obit.clanName}
                      </span>
                      <span className={isSelected ? 'text-stone-400' : 'text-ink-light'}>
                        Hưởng thọ {obit.age} tuổi
                      </span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base line-clamp-1">{obit.deceasedName}</h4>

                    <div className={`flex items-center justify-between text-[11px] pt-1 ${isSelected ? 'text-stone-400' : 'text-ink-muted'}`}>
                      <span>Từ trần: {new Date(obit.diedAt).toLocaleDateString('vi-VN')}</span>
                      <span>{obit._count?.condolences || 0} lời chia buồn</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Obituary Tribute Room & Condolence Board */}
        {selectedObituary && (
          <div className="lg:col-span-2 space-y-6">
            {/* Tribute Header Card */}
            <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm space-y-5">
              <div className="border-b border-warmBorder pb-4 text-center space-y-1">
                <span className="text-xs font-bold text-accent uppercase tracking-widest block">
                  VÔ CÙNG THƯƠNG TIẾC
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark">
                  {selectedObituary.deceasedName}
                </h2>
                {selectedObituary.aliasName && (
                  <p className="text-xs text-ink-muted italic">({selectedObituary.aliasName})</p>
                )}
                <p className="text-xs font-semibold text-ink pt-1">
                  Hưởng thọ {selectedObituary.age} tuổi — {selectedObituary.clanName}
                </p>
              </div>

              {/* Funeral Logistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-paper rounded-2xl border border-warmBorder space-y-1">
                  <div className="flex items-center space-x-1.5 text-primary font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Lễ phát tang</span>
                  </div>
                  <p className="text-ink-muted">{selectedObituary.funeralTime || 'Theo thông báo gia đình'}</p>
                </div>

                <div className="p-3 bg-paper rounded-2xl border border-warmBorder space-y-1">
                  <div className="flex items-center space-x-1.5 text-accent font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Lễ an táng</span>
                  </div>
                  <p className="text-ink-muted">{selectedObituary.burialTime || 'Theo thông báo gia đình'}</p>
                </div>
              </div>

              {selectedObituary.cemeteryPlace && (
                <div className="flex items-start space-x-2 text-xs text-ink-muted p-3 bg-paper/60 rounded-xl">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Nơi an nghỉ:</strong> {selectedObituary.cemeteryPlace}</span>
                </div>
              )}

              {selectedObituary.biography && (
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed italic bg-paper/40 p-4 rounded-2xl border border-warmBorder/60">
                  "{selectedObituary.biography}"
                </p>
              )}
            </div>

            {/* Light Virtual Incense & Condolence Form */}
            <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-warm space-y-5">
              <div className="flex items-center space-x-2 border-b border-warmBorder pb-3">
                <Flame className="w-5 h-5 text-amber-600 fill-amber-600 animate-bounce" />
                <h3 className="font-bold text-base sm:text-lg text-ink">Thắp Nén Tâm Nhang & Gửi Lời Chia Buồn</h3>
              </div>

              {condolenceSent && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đã dâng nén tâm nhang và gửi lời chia buồn tới gia quyến thành công.</span>
                </div>
              )}

              <form onSubmit={handleSendCondolence} className="space-y-3.5 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase">Họ và tên</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Nguyễn Văn An"
                      className="w-full input-warm text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-ink uppercase">Nơi ở hiện tại / Tổ chức</label>
                    <input
                      type="text"
                      value={senderFrom}
                      onChange={(e) => setSenderFrom(e.target.value)}
                      placeholder="Hội đồng hương Giao Tác tại Hà Nội"
                      className="w-full input-warm text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Dâng nén hương</label>
                  <div className="flex items-center space-x-3">
                    {[1, 3, 5].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setIncenseCount(cnt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                          incenseCount === cnt
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-paper text-ink border border-warmBorder hover:bg-amber-50'
                        }`}
                      >
                        <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{cnt} Nén Tâm Nhang</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">
                    Lời chia buồn sâu sắc <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Xin thành kính dâng nén tâm nhang tiễn biệt Cụ về cõi vĩnh hằng và chia buồn cùng gia quyến..."
                    className="w-full input-warm text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingCondolence}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-amber-300 font-bold text-xs hover:bg-stone-800 transition-all flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingCondolence ? 'Đang gửi...' : 'Dâng Nén Nhang & Gửi Lời Chia Buồn'}</span>
                </button>
              </form>

              {/* Condolences List */}
              <div className="space-y-3 pt-6 border-t border-warmBorder">
                <h4 className="font-bold text-sm text-ink">
                  Lời Phân Ưu Của Bà Con Xa Gần ({selectedObituary.condolences?.length || 0})
                </h4>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {selectedObituary.condolences?.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-2xl bg-paper/60 border border-warmBorder space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ink flex items-center space-x-1">
                          <Flame className="w-3 h-3 text-amber-600 fill-amber-600" />
                          <span>{c.senderName}</span>
                          {c.senderFrom && <span className="text-ink-muted font-normal">({c.senderFrom})</span>}
                        </span>
                        <span className="text-[10px] text-ink-light">
                          {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-ink-muted leading-relaxed italic pt-0.5">"{c.message}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Obituary Modal (Admin) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface rounded-3xl border border-warmBorder max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-warmBorder pb-3">
              <h3 className="font-bold text-lg text-ink">Đăng Thông Báo Cáo Phó Mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateObituary} className="space-y-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Họ và tên người quá cố *</label>
                <input
                  type="text"
                  required
                  value={obitForm.deceasedName}
                  onChange={(e) => setObitForm({ ...obitForm, deceasedName: e.target.value })}
                  placeholder="Ví dụ: Cụ Bà Nguyễn Thị Lương"
                  className="w-full input-warm text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Hưởng thọ / Hưởng dương</label>
                  <input
                    type="number"
                    value={obitForm.age}
                    onChange={(e) => setObitForm({ ...obitForm, age: e.target.value })}
                    placeholder="90"
                    className="w-full input-warm text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Dòng họ</label>
                  <input
                    type="text"
                    value={obitForm.clanName}
                    onChange={(e) => setObitForm({ ...obitForm, clanName: e.target.value })}
                    placeholder="Họ Nguyễn Trọng"
                    className="w-full input-warm text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Thời gian phát tang</label>
                  <input
                    type="text"
                    value={obitForm.funeralTime}
                    onChange={(e) => setObitForm({ ...obitForm, funeralTime: e.target.value })}
                    placeholder="07h00 ngày 15/07/2026"
                    className="w-full input-warm text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Thời gian an táng</label>
                  <input
                    type="text"
                    value={obitForm.burialTime}
                    onChange={(e) => setObitForm({ ...obitForm, burialTime: e.target.value })}
                    placeholder="14h00 cùng ngày"
                    className="w-full input-warm text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Nơi an nghỉ</label>
                <input
                  type="text"
                  value={obitForm.cemeteryPlace}
                  onChange={(e) => setObitForm({ ...obitForm, cemeteryPlace: e.target.value })}
                  className="w-full input-warm text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Đôi nét tiểu sử tưởng nhớ</label>
                <textarea
                  rows={2}
                  value={obitForm.biography}
                  onChange={(e) => setObitForm({ ...obitForm, biography: e.target.value })}
                  className="w-full input-warm text-sm resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-warmBorder">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-warmBorder text-xs font-semibold text-ink"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingObit}
                  className="px-5 py-2 rounded-xl bg-primary text-surface text-xs font-bold hover:bg-primary-dark disabled:opacity-50"
                >
                  {submittingObit ? 'Đang lưu...' : 'Đăng Cáo Phó'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
