import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Bell,
  Clock,
  Sparkles,
  HelpCircle,
  RefreshCw,
  UserCheck,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { emailAlertService } from '../../services/emailAlertService';

export const EmailAlertSettings = () => {
  const [enabled, setEnabled] = useState(true);
  const [recipientEmail, setRecipientEmail] = useState('tronglong195@gmail.com');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [notifyOnLogin, setNotifyOnLogin] = useState(true);
  const [notifyOnRegister, setNotifyOnRegister] = useState(true);
  const [notifyOnPost, setNotifyOnPost] = useState(true);
  const [notifyOnPhoto, setNotifyOnPhoto] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // Activity logs state
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    const settings = emailAlertService.getSettings();
    setEnabled(settings.enabled ?? true);
    setRecipientEmail(settings.recipientEmail || 'tronglong195@gmail.com');
    setWebhookUrl(settings.webhookUrl || '');
    setNotifyOnLogin(settings.notifyOnLogin ?? true);
    setNotifyOnRegister(settings.notifyOnRegister ?? true);
    setNotifyOnPost(settings.notifyOnPost ?? true);
    setNotifyOnPhoto(settings.notifyOnPhoto ?? true);

    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoadingLogs(true);
    try {
      const recent = await emailAlertService.getRecentActivityLogs(15);
      setLogs(recent);
    } catch (e) {
      console.warn('Lỗi tải activity logs:', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSave = () => {
    emailAlertService.saveSettings({
      enabled,
      recipientEmail: recipientEmail.trim(),
      webhookUrl: webhookUrl.trim(),
      notifyOnLogin,
      notifyOnRegister,
      notifyOnPost,
      notifyOnPhoto,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestEmail = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await emailAlertService.testEmail(recipientEmail.trim(), webhookUrl.trim());
      setTestResult(res);
      loadLogs();
    } catch (e) {
      setTestResult({ success: false, error: e.message });
    } finally {
      setTesting(false);
    }
  };

  const googleAppsScriptCode = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var recipient = data.to || 'tronglong195@gmail.com';
    var subject = data.subject || 'Thông báo từ Website Làng Giao Tác';
    var htmlBody = data.html || '';
    var textBody = data.text || '';
    
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: textBody,
      htmlBody: htmlBody
    });
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  return (
    <div className="space-y-8">
      {/* 1. Header Card */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-ink tracking-tight">
                Cài Đặt Thông Báo Email Quản Trị
              </h3>
              <p className="text-xs text-ink-muted">
                Tự động gửi email thông báo khi có người đăng nhập, đăng ký mới, hoặc có nội dung chờ duyệt
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-surface font-bold text-xs flex items-center space-x-2 shadow-warm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu Cài Đặt</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã lưu cài đặt thông báo email thành công!</span>
          </div>
        )}

        {/* Form controls */}
        <div className="mt-6 pt-6 border-t border-warmBorder grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5">
                Email Quản Trị Viên Nhận Báo Cáo:
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="tronglong195@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-paper border border-warmBorder text-sm text-ink font-medium focus:outline-none focus:border-primary"
                />
              </div>
              <p className="text-[11px] text-ink-muted mt-1">
                Tất cả thông báo hệ thống sẽ được gửi tự động tới địa chỉ hòm thư này.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-paper rounded-2xl border border-warmBorder">
              <div>
                <span className="font-bold text-xs text-ink block">Bật Tính Năng Thông Báo Email</span>
                <span className="text-[11px] text-ink-muted">Tự động kích hoạt khi có sự kiện phát sinh</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-warmBorder peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Event Checkboxes */}
          <div className="space-y-3 bg-paper p-5 rounded-2xl border border-warmBorder">
            <span className="text-xs font-bold text-ink block mb-2">
              Các Sự Kiện Sẽ Gửi Email Thông Báo:
            </span>

            <label className="flex items-center space-x-2.5 text-xs text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnLogin}
                onChange={(e) => setNotifyOnLogin(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="font-medium">🔔 Khi có người đăng nhập (kèm thời gian, thiết bị, IP)</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnRegister}
                onChange={(e) => setNotifyOnRegister(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="font-medium">👤 Khi có thành viên mới đăng ký tài khoản</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnPost}
                onChange={(e) => setNotifyOnPost(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="font-medium">📝 Khi có bài viết cộng đồng mới gửi chờ duyệt</span>
            </label>

            <label className="flex items-center space-x-2.5 text-xs text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnPhoto}
                onChange={(e) => setNotifyOnPhoto(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span className="font-medium">📸 Khi có hình ảnh mới tải lên album chờ duyệt</span>
            </label>
          </div>
        </div>

        {/* Test Email Button Box */}
        <div className="mt-6 pt-6 border-t border-warmBorder flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-ink block">Kiểm Tra Kết Nối Gửi Email:</span>
            <span className="text-[11px] text-ink-muted">
              Bấm nút để hệ thống bắn thử 1 email test về <b>{recipientEmail}</b>
            </span>
          </div>

          <button
            type="button"
            onClick={handleTestEmail}
            disabled={testing}
            className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-ink font-bold text-xs flex items-center space-x-2 transition-all shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{testing ? 'Đang gửi email test...' : 'Gửi Thử Email Ngay'}</span>
          </button>
        </div>

        {testResult && (
          <div
            className={`mt-4 p-4 rounded-2xl border text-xs space-y-1.5 ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center space-x-2 font-bold">
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span>
                {testResult.success
                  ? `Đã kích hoạt gửi email kiểm tra thành công qua phương thức: ${testResult.method || 'Trực tiếp'}!`
                  : `Chưa gửi được: ${testResult.error || testResult.reason}`}
              </span>
            </div>
            {testResult.success && (
              <p className="text-[11px] text-emerald-800">
                👉 Vui lòng mở hòm thư <b>{recipientEmail}</b> (kiểm tra cả mục Hộp thư đến và mục Spam/Thư rác) để xem email thử nghiệm!
              </p>
            )}
          </div>
        )}
      </div>

      {/* 2. Webhook / Google Apps Script Guide Card */}
      <div className="p-6 sm:p-8 bg-paper rounded-3xl border border-warmBorder space-y-4 text-xs text-ink leading-relaxed">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h4 className="font-bold text-sm text-primary-dark">
              Cách Gửi Email Trực Tiếp Bằng Gmail Qua Google Apps Script (0đ Trọn Đời — Cực Kỳ Ổn Định)
            </h4>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(googleAppsScriptCode);
              setCopiedScript(true);
              setTimeout(() => setCopiedScript(false), 2500);
            }}
            className="px-3 py-1.5 rounded-lg bg-surface hover:bg-white text-ink border border-warmBorder font-semibold text-[11px] flex items-center space-x-1 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedScript ? 'Đã sao chép!' : 'Sao chép mã Apps Script'}</span>
          </button>
        </div>

        <p className="text-ink-muted">
          Để nhận được email gửi thẳng vào Hộp thư chính (Inbox) với tốc độ tức thì 1 giây từ chính Gmail của bạn mà không lo giới hạn hay bị đánh dấu Spam, bác chỉ cần làm 3 bước sau:
        </p>

        <ol className="list-decimal pl-5 space-y-2 text-ink">
          <li>
            Truy cập trang{' '}
            <a
              href="https://script.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary font-bold hover:underline inline-flex items-center space-x-0.5"
            >
              <span>Google Apps Script</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>{' '}
            và bấm nút <b>"Dự án mới" (New project)</b>.
          </li>
          <li>
            Xóa hết mã mặc định, dán đoạn mã bên dưới vào rồi bấm <b>"Triển khai" (Deploy)</b> ➔ <b>"Triển khai mới" (New deployment)</b>.
          </li>
          <li>
            Chọn loại <b>"Ứng dụng web" (Web app)</b>, mục <em>Người có quyền truy cập</em> chọn: <b>"Bất kỳ ai" (Anyone)</b>.
          </li>
          <li>Sao chép đường link URL ứng dụng web vừa nhận được và dán vào ô bên dưới:</li>
        </ol>

        <div className="pt-2">
          <label className="text-xs font-bold text-ink block mb-1">
            Đường Dẫn Webhook Google Apps Script (Tùy chọn):
          </label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-warmBorder text-sm text-ink font-mono focus:outline-none focus:border-primary"
          />
        </div>

        <pre className="p-3.5 bg-ink text-surface rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-48">
          {googleAppsScriptCode}
        </pre>
      </div>

      {/* 3. Live Activity Logs from Cloud Firestore */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-warmBorder">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-primary" />
            <h4 className="font-bold text-sm text-primary-dark">
              Nhật Ký Đăng Nhập & Hoạt Động Thời Gian Thực (Cloud Firestore)
            </h4>
          </div>
          <button
            type="button"
            onClick={loadLogs}
            disabled={loadingLogs}
            className="p-1.5 rounded-lg bg-paper hover:bg-warmBorder text-ink-light transition-colors"
            title="Làm mới nhật ký"
          >
            <RefreshCw className={`w-4 h-4 ${loadingLogs ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="py-8 text-center text-xs text-ink-muted">
            Chưa có ghi nhận hoạt động nào gần đây.
          </div>
        ) : (
          <div className="space-y-2.5">
            {logs.map((log) => {
              const isLogin = log.eventType === 'login';
              const isRegister = log.eventType === 'register';
              const isPost = log.eventType === 'post_submission';
              const isPhoto = log.eventType === 'photo_submission';

              return (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-paper border border-warmBorder flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start sm:items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isLogin
                          ? 'bg-blue-100 text-blue-700'
                          : isRegister
                          ? 'bg-emerald-100 text-emerald-700'
                          : isPost
                          ? 'bg-amber-100 text-amber-700'
                          : isPhoto
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {isLogin ? (
                        <UserCheck className="w-4 h-4" />
                      ) : isRegister ? (
                        <Sparkles className="w-4 h-4" />
                      ) : isPost ? (
                        <FileText className="w-4 h-4" />
                      ) : isPhoto ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-ink">{log.subject}</p>
                      <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-1">{log.text}</p>
                    </div>
                  </div>

                  <div className="text-[11px] text-ink-light shrink-0 text-left sm:text-right">
                    <span>{log.createdAtStr || 'Vừa xong'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

