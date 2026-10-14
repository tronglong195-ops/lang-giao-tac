import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

const DEFAULT_ADMIN_EMAIL = 'tronglong195@gmail.com';
const STORAGE_KEY = 'giaotac_email_alert_settings';

export const emailAlertService = {
  getSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return {
          enabled: true,
          recipientEmail: DEFAULT_ADMIN_EMAIL,
          webhookUrl: '',
          notifyOnLogin: true,
          notifyOnRegister: true,
          notifyOnPost: true,
          notifyOnPhoto: true,
          ...JSON.parse(saved),
        };
      }
    } catch (e) {
      console.warn('Lỗi đọc cài đặt email alerts:', e);
    }

    return {
      enabled: true,
      recipientEmail: DEFAULT_ADMIN_EMAIL,
      webhookUrl: '',
      notifyOnLogin: true,
      notifyOnRegister: true,
      notifyOnPost: true,
      notifyOnPhoto: true,
    };
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('Lỗi lưu cài đặt email alerts:', e);
      return false;
    }
  },

  async sendMail({ to, subject, text, html, eventType = 'general', metadata = {} }) {
    const settings = this.getSettings();
    if (!settings.enabled) {
      return { success: false, reason: 'Tính năng thông báo email đang tắt.' };
    }

    const recipient = to || settings.recipientEmail || DEFAULT_ADMIN_EMAIL;
    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    // 1. Ghi nhật ký vào Cloud Firestore (activity_logs & admin_alerts)
    if (isFirebaseConfigured && db) {
      try {
        const payload = {
          eventType,
          recipient,
          subject,
          text: text || '',
          metadata,
          createdAt: serverTimestamp(),
          createdAtStr: timeStr,
        };
        await addDoc(collection(db, 'activity_logs'), payload);
        await addDoc(collection(db, 'admin_alerts'), payload);

        // Hỗ trợ Firebase Extension (Trigger Email) nếu có cài đặt
        await addDoc(collection(db, 'mail'), {
          to: recipient,
          message: {
            subject,
            text: text || '',
            html: html || ('<p>' + (text || '') + '</p>'),
          },
        }).catch(() => {});
      } catch (dbErr) {
        console.warn('[EmailAlertService] Ghi Firestore log gặp cảnh báo:', dbErr.message);
      }
    }

    // 2. Gửi qua Webhook (Google Apps Script / Custom Webhook) nếu có
    if (settings.webhookUrl && settings.webhookUrl.trim()) {
      try {
        const webhookUrl = settings.webhookUrl.trim();
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: recipient,
            subject,
            text,
            html,
            eventType,
            metadata,
            timestamp: timeStr,
          }),
        });

        console.log('[EmailAlertService] Đã gửi thông báo qua Webhook tới ' + recipient);
        return { success: true, method: 'Webhook' };
      } catch (hookErr) {
        console.error('⚠️ [EmailAlertService] Lỗi gửi qua Webhook:', hookErr.message);
      }
    }

    // 3. Fallback gửi qua FormSubmit trực tiếp từ trình duyệt
    try {
      const res = await fetch('https://formsubmit.co/ajax/' + recipient, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: subject,
          title: subject,
          content: text,
          time: timeStr,
          details: JSON.stringify(metadata),
        }),
      });
      const data = await res.json().catch(() => null);
      if (data && (data.success === 'true' || data.success === true)) {
        console.log('[EmailAlertService] Đã gửi email thành công qua FormSubmit tới ' + recipient);
        return { success: true, method: 'FormSubmit' };
      }
    } catch (e) {}

    return { success: true, method: 'Firestore Log' };
  },

  async sendLoginAlert({ user, loginMethod = 'Email & Mật khẩu' }) {
    const settings = this.getSettings();
    if (!settings.notifyOnLogin) return;

    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
    const name = user.fullName || user.email || 'Thành viên Làng Giao Tác';
    const subject = '🔔 [Làng Giao Tác] Thành viên đăng nhập: ' + name;

    const text = 'Thành viên ' + name + ' (' + (user.email || 'Không có email') + ') vừa đăng nhập vào hệ thống Làng Giao Tác lúc ' + timeStr + ' bằng ' + loginMethod + '.\nThiết bị: ' + userAgent;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; border: 1px solid #E8DFD5; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #2D5A27; padding: 20px; text-align: center; color: #FFFDF7;">
          <h2 style="margin: 0; font-size: 20px;">🌾 CỔNG THÔNG TIN LÀNG GIAO TÁC</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, Tỉnh Hà Tĩnh</p>
        </div>
        <div style="padding: 24px; color: #2B2118;">
          <h3 style="color: #2D5A27; margin-top: 0;">Thông Báo Đăng Nhập Hệ Thống</h3>
          <p style="font-size: 14px; line-height: 1.6;">Hệ thống ghi nhận một lượt đăng nhập mới:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #555;">Họ và tên:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #2D5A27;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email tài khoản:</td>
              <td style="padding: 8px 0; color: #222;">${user.email || 'Đăng nhập Google'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Vai trò:</td>
              <td style="padding: 8px 0; color: #222;"><b>${user.role || 'Thành viên'}</b></td>
            </tr>
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Phương thức:</td>
              <td style="padding: 8px 0; color: #222;">${loginMethod}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Thời gian:</td>
              <td style="padding: 8px 0; color: #222;">${timeStr}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Trình duyệt / Thiết bị:</td>
              <td style="padding: 8px 0; color: #777; font-size: 11px;">${userAgent}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://lang-giao-tac-tdp9.web.app/quan-tri" style="display: inline-block; background-color: #2D5A27; color: #FFFDF7; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 13px;">👉 Mở Trang Quản Trị</a>
          </div>
        </div>
        <div style="background-color: #EFE8DF; padding: 12px 20px; text-align: center; font-size: 11px; color: #777;">
          Email tự động gửi từ hệ thống Website Làng Giao Tác tới Quản trị viên (${settings.recipientEmail})
        </div>
      </div>
    `;

    return this.sendMail({
      to: settings.recipientEmail,
      subject,
      text,
      html,
      eventType: 'login',
      metadata: {
        userId: user.id || user.uid,
        userName: name,
        email: user.email,
        role: user.role,
        loginMethod,
      },
    });
  },

  async sendRegisterAlert({ user, registrationMethod = 'Form Đăng Ký' }) {
    const settings = this.getSettings();
    if (!settings.notifyOnRegister) return;

    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const name = user.fullName || user.email || 'Bà con mới';
    const subject = '👤 [Làng Giao Tác] Thành viên mới gia nhập: ' + name;

    const text = 'Thành viên mới ' + name + ' (' + user.email + ') vừa đăng ký tài khoản Làng Giao Tác lúc ' + timeStr + '.\nQuê quán/Dòng họ: ' + (user.hometownGroup || 'TDP 9 Thuận Lộc') + '\nNơi ở hiện tại: ' + (user.currentLocation || 'Chưa cập nhật');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; border: 1px solid #E8DFD5; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #2D5A27; padding: 20px; text-align: center; color: #FFFDF7;">
          <h2 style="margin: 0; font-size: 20px;">🌾 CỘNG ĐỒNG LÀNG GIAO TÁC</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, Tỉnh Hà Tĩnh</p>
        </div>
        <div style="padding: 24px; color: #2B2118;">
          <h3 style="color: #2D5A27; margin-top: 0;">🎉 Chào Đón Thành Viên Mới</h3>
          <p style="font-size: 14px; line-height: 1.6;">Hệ thống vừa có một thành viên mới hoàn tất đăng ký tài khoản:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #555;">Họ và tên:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #2D5A27;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 8px 0; color: #222;">${user.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Dòng họ / Nhóm:</td>
              <td style="padding: 8px 0; color: #222;">${user.hometownGroup || 'TDP 9 Thuận Lộc'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Nơi ở hiện tại:</td>
              <td style="padding: 8px 0; color: #222;">${user.currentLocation || 'Chưa cập nhật'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Phương thức:</td>
              <td style="padding: 8px 0; color: #222;">${registrationMethod}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Thời gian:</td>
              <td style="padding: 8px 0; color: #222;">${timeStr}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://lang-giao-tac-tdp9.web.app/quan-tri?tab=users" style="display: inline-block; background-color: #2D5A27; color: #FFFDF7; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 13px;">Xem Danh Sách Thành Viên</a>
          </div>
        </div>
        <div style="background-color: #EFE8DF; padding: 12px 20px; text-align: center; font-size: 11px; color: #777;">
          Email tự động gửi từ hệ thống Website Làng Giao Tác tới Quản trị viên (${settings.recipientEmail})
        </div>
      </div>
    `;

    return this.sendMail({
      to: settings.recipientEmail,
      subject,
      text,
      html,
      eventType: 'register',
      metadata: {
        userId: user.id || user.uid,
        userName: name,
        email: user.email,
        hometownGroup: user.hometownGroup,
        currentLocation: user.currentLocation,
      },
    });
  },

  async sendNewPostAlert({ post, author = {} }) {
    const settings = this.getSettings();
    if (!settings.notifyOnPost) return;

    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const authorName = author.fullName || author.email || 'Bà con Làng';
    const subject = '📝 [Làng Giao Tác] Có bài viết mới chờ duyệt: "' + post.title + '"';

    const text = 'Có bài viết mới "' + post.title + '" của tác giả ' + authorName + ' gửi lúc ' + timeStr + ' đang chờ Quản trị viên duyệt.';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; border: 1px solid #E8DFD5; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #D9A441; padding: 20px; text-align: center; color: #261C14;">
          <h2 style="margin: 0; font-size: 20px;">📝 BÀI VIẾT MỚI CẦN PHÊ DUYỆT</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px;">Cổng thông tin Làng Giao Tác — TDP 9 Thuận Lộc</p>
        </div>
        <div style="padding: 24px; color: #2B2118;">
          <h3 style="color: #2D5A27; margin-top: 0;">${post.title}</h3>
          <p style="font-size: 13px; color: #666; margin-bottom: 16px;">
            Tác giả: <strong>${authorName}</strong> | Thời gian: ${timeStr}
          </p>
          <div style="margin-top: 24px; text-align: center;">
            <a href="https://lang-giao-tac-tdp9.web.app/quan-tri?tab=posts" style="display: inline-block; background-color: #2D5A27; color: #FFFDF7; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px;">👉 Duyệt Bài Viết Ngay</a>
          </div>
        </div>
      </div>
    `;

    return this.sendMail({
      to: settings.recipientEmail,
      subject,
      text,
      html,
      eventType: 'post_submission',
      metadata: { postId: post.id, title: post.title, authorName },
    });
  },

  async sendNewPhotoAlert({ photoCount = 1, albumTitle = 'Kho Ảnh Quê Hương', uploader = {} }) {
    const settings = this.getSettings();
    if (!settings.notifyOnPhoto) return;

    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const uploaderName = uploader.fullName || uploader.email || 'Bà con';
    const subject = '📸 [Làng Giao Tác] Có ' + photoCount + ' hình ảnh mới tải lên chờ duyệt (' + albumTitle + ')';

    const text = 'Thành viên ' + uploaderName + ' vừa tải ' + photoCount + ' hình ảnh lên album "' + albumTitle + '" lúc ' + timeStr + ' đang chờ duyệt.';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; border: 1px solid #E8DFD5; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #2D5A27; padding: 20px; text-align: center; color: #FFFDF7;">
          <h2 style="margin: 0; font-size: 20px;">📸 HÌNH ẢNH MỚI CẦN KIỂM DUYỆT</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Làng Giao Tác — TDP 9 Thuận Lộc</p>
        </div>
        <div style="padding: 24px; color: #2B2118;">
          <p style="font-size: 14px; line-height: 1.6;">
            Thành viên <strong>${uploaderName}</strong> vừa tải lên <strong>${photoCount} ảnh</strong> vào album <em>"${albumTitle}"</em> lúc ${timeStr}.
          </p>
          <div style="margin-top: 24px; text-align: center;">
            <a href="https://lang-giao-tac-tdp9.web.app/quan-tri?tab=photos" style="display: inline-block; background-color: #2D5A27; color: #FFFDF7; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px;">👉 Mở Bảng Quản Trị Duyệt Ảnh</a>
          </div>
        </div>
      </div>
    `;

    return this.sendMail({
      to: settings.recipientEmail,
      subject,
      text,
      html,
      eventType: 'photo_submission',
      metadata: { photoCount, albumTitle, uploaderName },
    });
  },

  async testEmail(targetEmail, customWebhook = null) {
    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const recipient = targetEmail || this.getSettings().recipientEmail || DEFAULT_ADMIN_EMAIL;
    const webhook = customWebhook !== null ? customWebhook : this.getSettings().webhookUrl;

    const subject = '🧪 [Test Kết Nối] Kiểm tra hệ thống gửi Email Làng Giao Tác';
    const text = 'Xin chào Admin! Nếu bạn nhận được email này, tính năng thông báo email tự động của Làng Giao Tác đã hoạt động 100% hoàn hảo vào lúc ' + timeStr + '.';

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #FAF8F5; border-radius: 16px; border: 2px solid #2D5A27; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2D5A27; margin-top: 0;">🌾 KẾT NỐI EMAIL THÀNH CÔNG!</h2>
        <p style="font-size: 14px; line-height: 1.6;">Xin chào Quản trị viên <b>${recipient}</b>,</p>
        <p style="font-size: 14px; line-height: 1.6;">Hệ thống thông báo tự động của Website Làng Giao Tác đã được kết nối thành công.</p>
        <div style="background-color: #FFFDF7; border: 1px solid #E8DFD5; padding: 12px 16px; border-radius: 10px; font-size: 13px; color: #333; margin: 16px 0;">
          ✅ Mọi lượt <b>Đăng nhập</b>, <b>Đăng ký mới</b>, <b>Bài viết chờ duyệt</b> và <b>Ảnh chờ duyệt</b> sẽ tự động gửi báo cáo chi tiết về hòm thư này.
        </div>
        <p style="color: #888; font-size: 12px; margin-bottom: 0;">Thời gian thử nghiệm: ${timeStr}</p>
      </div>
    `;

    if (webhook && webhook.trim()) {
      try {
        await fetch(webhook.trim(), {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: recipient,
            subject,
            text,
            html,
            eventType: 'test',
            timestamp: timeStr,
          }),
        });
        return { success: true, method: 'Google Apps Script / Webhook' };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    return await this.sendMail({
      to: recipient,
      subject,
      text,
      html,
      eventType: 'test',
    });
  },

  async getRecentActivityLogs(limitCount = 20) {
    if (!isFirebaseConfigured || !db) return [];
    try {
      const q = query(
        collection(db, 'activity_logs'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('Lỗi đọc activity_logs:', e);
      return [];
    }
  },
};

