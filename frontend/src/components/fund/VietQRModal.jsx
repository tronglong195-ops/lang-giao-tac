import React, { useState } from 'react';
import { QrCode, Copy, CheckCircle2, Heart, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { fundService } from '../../services/fundService';

const SUGGESTED_AMOUNTS = [100000, 200000, 500000, 1000000, 2000000, 5000000];

export const VietQRModal = ({ isOpen, onClose, campaign, onDonationSuccess }) => {
  const [step, setStep] = useState('input'); // 'input' | 'qr' | 'success'
  const [donorName, setDonorName] = useState('');
  const [donorClan, setDonorClan] = useState('');
  const [amount, setAmount] = useState(200000);
  const [message, setMessage] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !campaign) return null;

  const transferNote = `${campaign.qrCodePrefix || 'GIAOTAC'} ${donorName ? donorName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 15) : 'CONEMQUENHA'}`;

  // VietQR Image URL format
  const qrUrl = `https://img.vietqr.io/image/${campaign.bankName || 'MBBANK'}-${campaign.bankAccount || '0912345678'}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferNote)}&accountName=${encodeURIComponent(campaign.bankAccountName || 'BAN CAN SU TDP 9')}`;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleConfirmTransfer = async () => {
    setSubmitting(true);
    try {
      await fundService.donate({
        campaignId: campaign.id,
        donorName: donorName.trim() || 'Nhà hảo tâm ẩn danh',
        donorClan: donorClan.trim() || 'Con em Làng Giao Tác',
        amount: Number(amount),
        message: message.trim(),
        txCode: `TX-${Date.now().toString().slice(-6)}`,
      });
      setStep('success');
      if (onDonationSuccess) onDonationSuccess();
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu thông tin đóng góp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-surface rounded-3xl border border-warmBorder max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-warmBorder pb-3">
          <div className="flex items-center space-x-2 text-primary font-bold">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-base sm:text-lg font-bold text-primary-dark">Ủng Hộ Quỹ Quê Hương</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-paper"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Input Donation Info */}
        {step === 'input' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3 rounded-2xl bg-paper border border-warmBorder">
              <span className="text-[11px] text-ink-muted block">Chiến dịch:</span>
              <p className="font-bold text-ink text-sm sm:text-base">{campaign.title}</p>
            </div>

            {/* Donor Name & Clan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Họ và tên / Gia đình</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Trọng Long"
                  className="w-full input-warm text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Dòng họ / Nơi ở</label>
                <input
                  type="text"
                  value={donorClan}
                  onChange={(e) => setDonorClan(e.target.value)}
                  placeholder="Ví dụ: Họ Nguyễn Trọng — Hà Nội"
                  className="w-full input-warm text-sm"
                />
              </div>
            </div>

            {/* Suggested Amounts */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink uppercase">Chọn số tiền ủng hộ (VNĐ)</label>
              <div className="grid grid-cols-3 gap-2">
                {SUGGESTED_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                      amount === amt
                        ? 'bg-primary text-surface shadow-xs scale-102 ring-2 ring-primary/40'
                        : 'bg-paper hover:bg-primary-subtle text-ink border border-warmBorder'
                    }`}
                  >
                    {amt.toLocaleString('vi-VN')} đ
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Hoặc nhập số tiền tùy tâm..."
                className="w-full input-warm text-sm mt-2 font-bold text-primary"
              />
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-ink uppercase">Lời nhắn gửi quê hương</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Lời chúc các cháu hiếu học hoặc đôi lời tâm tình cùng bà con quê nhà..."
                className="w-full input-warm text-sm resize-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep('qr')}
              className="w-full py-3 rounded-xl bg-primary text-surface font-bold text-sm hover:bg-primary-dark shadow-warm transition-all flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Tạo Mã VietQR Quét Nhanh ({amount.toLocaleString('vi-VN')} đ)</span>
            </button>
          </div>
        )}

        {/* STEP 2: Scan VietQR */}
        {step === 'qr' && (
          <div className="space-y-4 text-center">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Quét mã bằng bất kỳ App Ngân hàng nào (Vietcombank, BIDV, MB, Agribank, Techcombank...)</span>
            </div>

            {/* QR Image Box */}
            <div className="p-4 bg-white rounded-3xl border-2 border-primary/20 shadow-md inline-block max-w-[280px] w-full mx-auto">
              <img src={qrUrl} alt="Mã VietQR" className="w-full h-auto rounded-xl" />
            </div>

            {/* Bank Info Copy Box */}
            <div className="bg-paper rounded-2xl border border-warmBorder p-3.5 space-y-2 text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Ngân hàng:</span>
                <span className="font-bold text-ink">{campaign.bankName || 'MBBANK'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Số tài khoản:</span>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold font-mono text-primary text-sm">{campaign.bankAccount}</span>
                  <button
                    onClick={() => handleCopy(campaign.bankAccount, 'stk')}
                    className="p-1 rounded text-ink-light hover:text-primary"
                    title="Sao chép STK"
                  >
                    {copiedField === 'stk' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Chủ tài khoản:</span>
                <span className="font-semibold text-ink">{campaign.bankAccountName}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-warmBorder">
                <span className="text-ink-muted">Nội dung CK:</span>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold font-mono text-ink text-xs">{transferNote}</span>
                  <button
                    onClick={() => handleCopy(transferNote, 'note')}
                    className="p-1 rounded text-ink-light hover:text-primary"
                    title="Sao chép nội dung"
                  >
                    {copiedField === 'note' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="flex-1 py-2.5 rounded-xl border border-warmBorder text-xs font-semibold text-ink hover:bg-paper"
              >
                Quay lại
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmTransfer}
                className="flex-2 py-2.5 rounded-xl bg-primary text-surface text-xs font-bold hover:bg-primary-dark shadow-sm disabled:opacity-50"
              >
                {submitting ? 'Đang ghi nhận...' : 'Tôi Đã Chuyển Khoản Thành Công'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-primary-dark">Ghi Nhận Đóng Góp Thành Công!</h4>
            <p className="text-xs sm:text-sm text-ink-muted max-w-sm mx-auto leading-relaxed">
              Ban Quản lý Quỹ & Ban Cán sự TDP 9 Thuận Lộc xin trân trọng cảm ơn tấm lòng thơm thảo của quý vị. 
              Tên và lời chúc của bạn đã được vinh danh trên Bảng Vàng Quê Hương.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-primary text-surface font-semibold text-xs sm:text-sm hover:bg-primary-dark shadow-sm"
            >
              Đóng và Xem Bảng Vàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
