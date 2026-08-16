import React, { useState } from 'react';
import { Share2, Copy, Check, Facebook, MessageCircle, X, QrCode } from 'lucide-react';

export const ShareModal = ({ isOpen, onClose, title, url, description }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Không thể sao chép liên kết:', err);
    }
  };

  const shareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(title || 'Làng Giao Tác — TDP 9 Thuận Lộc')}`;
    window.open(fbUrl, '_blank', 'width=600,height=500');
  };

  const shareZalo = () => {
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(fullUrl)}`;
    window.open(zaloUrl, '_blank', 'width=600,height=500');
  };

  // QR Code URL using free API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(fullUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface rounded-3xl border border-warmBorder max-w-md w-full p-6 sm:p-7 space-y-5 shadow-warmHover relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-paper text-ink-muted hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-secondary/15 text-accent">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary-dark">Chia Sẻ Album & Ảnh</h3>
            <p className="text-xs text-ink-muted">Gửi tới bà con, hội đồng hương và bạn bè</p>
          </div>
        </div>

        {/* Title Preview */}
        {title && (
          <div className="p-3.5 rounded-2xl bg-paper/70 border border-warmBorder text-xs text-ink font-medium leading-relaxed">
            "{title}"
          </div>
        )}

        {/* Quick Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {/* Facebook */}
          <button
            onClick={shareFacebook}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 text-[#1877F2] font-semibold text-xs transition-colors space-y-1.5"
          >
            <Facebook className="w-5 h-5" />
            <span>Facebook</span>
          </button>

          {/* Zalo */}
          <button
            onClick={shareZalo}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#0068FF]/10 hover:bg-[#0068FF]/20 border border-[#0068FF]/20 text-[#0068FF] font-semibold text-xs transition-colors space-y-1.5"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Zalo</span>
          </button>

          {/* QR Code */}
          <button
            onClick={() => setShowQr(!showQr)}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-semibold transition-colors space-y-1.5 ${
              showQr
                ? 'bg-primary text-surface border-primary'
                : 'bg-paper hover:bg-paper/80 border-warmBorder text-ink'
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span>Mã QR</span>
          </button>
        </div>

        {/* QR Code Display */}
        {showQr && (
          <div className="p-4 rounded-2xl bg-paper border border-warmBorder text-center space-y-2 animate-in zoom-in-95 duration-200">
            <img
              src={qrCodeUrl}
              alt="Mã QR chia sẻ"
              className="w-40 h-40 mx-auto rounded-xl shadow-sm border border-warmBorder bg-white p-2"
            />
            <p className="text-[11px] text-ink-muted">
              Quét bằng camera điện thoại để xem ngay trên thiết bị cá nhân
            </p>
          </div>
        )}

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider">
            Sao chép liên kết
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={fullUrl}
              className="flex-1 input-warm text-xs bg-paper font-mono truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs inline-flex items-center space-x-1.5 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-primary text-surface hover:bg-primary-dark shadow-sm'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
