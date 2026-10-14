import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Database,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
  Users,
  Copy,
} from 'lucide-react';
import { isFirebaseConfigured } from '../../config/firebase';
import { seedAllToFirestore } from '../../scripts/migrateToFirestore';

export const FirebaseSyncSettings = () => {
  const [seeding, setSeeding] = useState(false);
  const [logs, setLogs] = useState([]);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [copiedRule, setCopiedRule] = useState(false);

  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || '';
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '';
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '';

  const handleStartSeed = async () => {
    if (!isFirebaseConfigured) {
      alert('Chưa phát hiện cấu hình Firebase trong tệp .env! Vui lòng cấu hình VITE_FIREBASE_* trước.');
      return;
    }

    if (!window.confirm('Hành động này sẽ nạp toàn bộ 153 thành viên phả hệ họ Nguyễn Trọng, 6 mốc lịch sử và tin tức mẫu lên Cloud Firestore. Bạn có chắc chắn muốn tiến hành?')) {
      return;
    }

    setSeeding(true);
    setLogs([]);
    setSyncSuccess(false);

    try {
      await seedAllToFirestore((msg) => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
      });
      setSyncSuccess(true);
    } catch (err) {
      setLogs((prev) => [...prev, `❌ [LỖI] ${err.message}`]);
      alert('Có lỗi xảy ra trong quá trình đồng bộ: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-surface rounded-2xl border border-warmBorder p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                Quản Trị Google Firebase (Serverless)
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted">
                Hệ thống Backend không máy chủ: Cloud Firestore, Firebase Auth, Cloud Storage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isFirebaseConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Đã kết nối Firebase Cloud
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Chế độ dữ liệu dự phòng (Local Fallback)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Thông số cấu hình hiện tại */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-warmBorder">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4 text-primary" />
            Firestore Project ID
          </div>
          <div className="font-bold text-ink text-sm sm:text-base truncate">
            {projectId || '<Chưa thiết lập>'}
          </div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-warmBorder">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-primary" />
            Firebase Auth Domain
          </div>
          <div className="font-bold text-ink text-sm sm:text-base truncate">
            {authDomain || '<Chưa thiết lập>'}
          </div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-warmBorder">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-primary" />
            Storage Bucket
          </div>
          <div className="font-bold text-ink text-sm sm:text-base truncate">
            {storageBucket || '<Chưa thiết lập>'}
          </div>
        </div>
      </div>

      {/* Hướng dẫn thiết lập nhanh */}
      {!isFirebaseConfigured && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 text-ink">
          <h3 className="font-bold text-base text-amber-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            3 Bước kết nối Firebase vào trang web:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-amber-950/80 leading-relaxed">
            <li>
              Truy cập{' '}
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-primary underline inline-flex items-center gap-1"
              >
                Firebase Console <ExternalLink className="w-3.5 h-3.5" />
              </a>{' '}
              và tạo một dự án mới (ví dụ đặt tên: <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300">lang-giao-tac</code>).
            </li>
            <li>
              Bật 3 dịch vụ miễn phí: <strong>Authentication</strong> (Google & Email), <strong>Firestore Database</strong> (Vị trí Singapore <code>asia-southeast1</code>), và <strong>Storage</strong>.
            </li>
            <li>
              Vào <em>Project Settings</em> ➔ <em>Web App</em> ➔ Sao chép các khóa cấu hình và dán vào tệp <code className="bg-white px-1.5 py-0.5 rounded border border-amber-300">frontend/.env</code>.
            </li>
          </ol>
        </div>
      )}

      {/* Hành động đồng bộ Dữ liệu mẫu */}
      <div className="bg-surface rounded-2xl border border-warmBorder p-6 shadow-sm">
        <h3 className="font-bold text-base text-ink mb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Đồng Bộ Toàn Bộ Dữ Liệu Mẫu Lên Cloud Firestore
        </h3>
        <p className="text-xs sm:text-sm text-ink-muted mb-4 leading-relaxed">
          Nạp tự động 153 thành viên gia phả dòng họ Nguyễn Trọng (11 thế hệ, 9 Tộc trưởng đời, 67 vị nét đứt), 6 mốc lịch sử làng từ năm 1685, tin tức chính quyền và video tư liệu Đình Làng lên CSDL Firebase.
        </p>

        <button
          onClick={handleStartSeed}
          disabled={seeding || !isFirebaseConfigured}
          className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
            isFirebaseConfigured
              ? 'bg-primary text-surface hover:bg-primary-dark active:scale-95'
              : 'bg-paper text-ink-muted border border-warmBorder cursor-not-allowed'
          }`}
        >
          {seeding ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đang đẩy dữ liệu lên Firestore...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Bắt đầu Đồng Bộ Dữ Liệu lên Firestore</span>
            </>
          )}
        </button>

        {/* Khung Log hiển thị tiến trình */}
        {logs.length > 0 && (
          <div className="mt-4 bg-ink text-surface rounded-xl p-4 font-mono text-xs max-h-60 overflow-y-auto space-y-1 shadow-inner">
            {logs.map((log, index) => (
              <div key={index} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        )}

        {syncSuccess && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            Toàn bộ 153 thành viên gia phả và dữ liệu lịch sử đã được đồng bộ hoàn hảo lên Cloud Firestore!
          </div>
        )}
      </div>

      {/* Thông tin Quy tắc Bảo mật */}
      <div className="bg-surface rounded-2xl border border-warmBorder p-6 shadow-sm">
        <h3 className="font-bold text-base text-ink mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Quy Tắc Phân Quyền & Bảo Mật (Security Rules)
        </h3>
        <p className="text-xs sm:text-sm text-ink-muted mb-4">
          Hệ thống đã chuẩn bị sẵn 2 tệp quy tắc bảo mật chính quy:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-paper rounded-xl border border-warmBorder">
            <div className="font-bold text-ink mb-1">firestore.rules</div>
            <div className="text-ink-muted">Quy định quyền xem công khai, thành viên được gửi bài/ảnh, chỉ Admin được sửa gia phả & phê duyệt.</div>
          </div>
          <div className="p-3 bg-paper rounded-xl border border-warmBorder">
            <div className="font-bold text-ink mb-1">storage.rules</div>
            <div className="text-ink-muted">Bảo vệ kho ảnh & tài liệu, giới hạn dung lượng tải ảnh tối đa 25MB cho ảnh 4K và PDF gia phả.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
