const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.ADMIN_ALERT_EMAIL || 'tronglong195@gmail.com';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    try {
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
      const smtpPort = parseInt(process.env.SMTP_PORT, 10) || 465;
      const smtpUser = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
      const smtpPass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').trim().replace(/\s+/g, '');

      if (smtpUser && smtpPass) {
        // Cấu hình kết nối trực tiếp qua cổng 465 (SSL) để tránh bị chặn cổng 587 trên Cloud Render
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // True cho cổng 465 SSL
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 8000, // 8 giây timeout
          greetingTimeout: 8000,
          socketTimeout: 8000,
        });
        console.log(`📧 [EmailService] Đã cấu hình SMTP Server qua cổng ${smtpPort} (SSL: ${smtpPort === 465}) cho ${smtpUser} ➔ ${ADMIN_EMAIL}`);
      } else {
        this.transporter = null;
        console.log(`⚠️ [EmailService] Chưa thiết lập SMTP_USER/SMTP_PASS trong .env. Email thông báo sẽ được ghi log chi tiết tới ${ADMIN_EMAIL}.`);
      }
    } catch (err) {
      this.transporter = null;
      console.error('⚠️ [EmailService] Lỗi khởi tạo transporter:', err.message);
    }
  }

  async sendMail({ to, subject, html, text }) {
    const recipient = to || ADMIN_EMAIL;
    const smtpUser = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
    const fromAddress = process.env.SMTP_FROM || `"Làng Giao Tác" <${smtpUser || 'tronglong195@gmail.com'}>`;

    console.log(`\n📬 [EMAIL NOTIFICATION] ➔ Gửi tới: ${recipient}`);
    console.log(`📌 Tiêu đề: ${subject}`);
    if (text) console.log(`📝 Nội dung: ${text}`);

    // Cách 1: Gửi qua Resend HTTP API nếu có RESEND_API_KEY (Không bao giờ bị chặn cổng SMTP trên Cloud)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey.trim()}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'Làng Giao Tác <onboarding@resend.dev>',
            to: [recipient],
            subject,
            text,
            html,
          }),
        });
        const resData = await response.json();
        if (response.ok) {
          console.log(`✅ [EmailService] Gửi email thành công qua Resend HTTP API:`, resData.id);
          return { success: true, messageId: resData.id, via: 'Resend API' };
        } else {
          console.error(`⚠️ [EmailService] Resend API error:`, resData);
        }
      } catch (httpErr) {
        console.error(`⚠️ [EmailService] Lỗi gọi Resend HTTP API:`, httpErr.message);
      }
    }

    // Cách 2: Gửi qua SMTP Transporter (Port 465 SSL)
    if (!this.transporter) {
      return { success: false, reason: 'Chưa cấu hình SMTP_USER và SMTP_PASS trên server' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: fromAddress,
        to: recipient,
        subject,
        text,
        html,
      });
      console.log(`✅ [EmailService] Gửi email thành công qua SMTP: ${info.messageId}`);
      return { success: true, messageId: info.messageId, via: 'SMTP' };
    } catch (error) {
      console.error(`❌ [EmailService] Gặp lỗi khi gửi email qua SMTP:`, error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * 0. Gửi email thông báo khi có thành viên mới đăng ký tài khoản
   */
  async sendRegisterAlert({ user, registrationMethod = 'Form Đăng ký' }) {
    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const subject = `👤 [Làng Giao Tác] Thành viên mới gia nhập: ${user.fullName || user.email}`;

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
              <td style="padding: 8px 0; font-weight: bold; color: #2D5A27;">${user.fullName || 'Chưa cập nhật'}</td>
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
            <a href="https://lang-giao-tac-1.onrender.com/quan-tri" style="display: inline-block; background-color: #2D5A27; color: #FFFDF7; text-decoration: none; padding: 10px 24px; border-radius: 10px; font-weight: bold; font-size: 13px;">Xem Danh Sách Thành Viên</a>
          </div>
        </div>
        <div style="background-color: #EFE8DF; padding: 12px 20px; text-align: center; font-size: 11px; color: #777;">
          Email thông báo tự động gửi tới Quản trị viên (${ADMIN_EMAIL})
        </div>
      </div>
    `;

    return this.sendMail({
      to: ADMIN_EMAIL,
      subject,
      text: `Thành viên mới ${user.fullName} (${user.email}) vừa đăng ký tài khoản Làng Giao Tác lúc ${timeStr} qua ${registrationMethod}.`,
      html,
    });
  }

  /**
   * 1. Gửi email thông báo khi có người đăng nhập
   */
  async sendLoginAlert({ user, loginMethod = 'Email', ipAddress = 'Unknown', userAgent = 'Unknown' }) {
    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const subject = `🔔 [Làng Giao Tác] Thành viên đăng nhập: ${user.fullName || user.email}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; border: 1px solid #E8DFD5; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #2D5A27; padding: 20px; text-align: center; color: #FFFDF7;">
          <h2 style="margin: 0; font-size: 20px;">🌾 CỔNG THÔNG TIN LÀNG GIAO TÁC</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh, Tỉnh Hà Tĩnh</p>
        </div>
        <div style="padding: 24px; color: #2B2118;">
          <h3 style="color: #2D5A27; margin-top: 0;">Thông Báo Đăng Nhập Hệ Thống</h3>
          <p style="font-size: 14px; line-height: 1.6;">Hệ thống ghi nhận một lượt đăng nhập mới với thông tin sau:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #555;">Họ và tên:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #2D5A27;">${user.fullName || 'Chưa cập nhật'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Email tài khoản:</td>
              <td style="padding: 8px 0; color: #222;">${user.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #E8DFD5;">
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Vai trò:</td>
              <td style="padding: 8px 0; color: #222;"><span style="background-color: #EBF3EA; color: #2D5A27; padding: 2px 8px; border-radius: 6px; font-weight: bold;">${user.role || 'member'}</span></td>
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
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Thiết bị / Trình duyệt:</td>
              <td style="padding: 8px 0; color: #777; font-size: 11px;">${userAgent}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://lang-giao-tac-1.onrender.com/quan-tri" style="display: inline-block; background-color: #2D5A27; color: #FFFDF7; text-decoration: none; padding: 10px 24px; border-radius: 10px; font-weight: bold; font-size: 13px;">Mở Trang Quản Trị</a>
          </div>
        </div>
        <div style="background-color: #EFE8DF; padding: 12px 20px; text-align: center; font-size: 11px; color: #777;">
          Email tự động gửi từ hệ thống Website Làng Giao Tác tới Quản trị viên (${ADMIN_EMAIL})
        </div>
      </div>
    `;

    return this.sendMail({
      to: ADMIN_EMAIL,
      subject,
      text: `Thành viên ${user.fullName} (${user.email}) vừa đăng nhập vào hệ thống lúc ${timeStr} bằng ${loginMethod}.`,
      html,
    });
  }

  /**
   * 2. Gửi email thông báo khi có bài viết mới chờ duyệt
   */
  async sendNewPostAlert({ post, author }) {
    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const subject = `📝 [Làng Giao Tác] Có bài viết mới chờ duyệt: "${post.title}"`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; border: 1px solid #E8DFD5; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #D9A441; padding: 20px; text-align: center; color: #261C14;">
          <h2 style="margin: 0; font-size: 20px;">📝 BÀI VIẾT MỚI CẦN PHÊ DUYỆT</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px;">Cổng thông tin Làng Giao Tác — TDP 9 Thuận Lộc</p>
        </div>
        <div style="padding: 24px; color: #2B2118;">
          <h3 style="color: #2D5A27; margin-top: 0;">${post.title}</h3>
          <p style="font-size: 13px; color: #666; margin-bottom: 16px;">
            Chuyên mục: <strong>${post.category || 'Ký ức & Tâm tình'}</strong> | Tác giả: <strong>${author.fullName || author.email}</strong>
          </p>
          
          <div style="background-color: #FFFDF7; border: 1px solid #E8DFD5; padding: 14px; border-radius: 12px; font-size: 13px; color: #444; line-height: 1.6; max-height: 150px; overflow: hidden;">
            ${post.contentHtml ? post.contentHtml.replace(/<[^>]*>/g, '').substring(0, 250) + '...' : 'Không có nội dung tóm tắt.'}
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://lang-giao-tac-1.onrender.com/quan-tri" style="display: inline-block; background-color: #2D5A27; color: #FFFDF7; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 10px rgba(45,90,39,0.2);">👉 Duyệt Bài Viết Ngay</a>
          </div>
        </div>
        <div style="background-color: #EFE8DF; padding: 12px 20px; text-align: center; font-size: 11px; color: #777;">
          Gửi tới Quản trị viên (${ADMIN_EMAIL}) vào lúc ${timeStr}
        </div>
      </div>
    `;

    return this.sendMail({
      to: ADMIN_EMAIL,
      subject,
      text: `Có bài viết mới "${post.title}" của tác giả ${author.fullName} gửi lúc ${timeStr} đang chờ Admin duyệt.`,
      html,
    });
  }

  /**
   * 3. Gửi email thông báo khi có ảnh mới tải lên album chờ duyệt
   */
  async sendNewPhotoAlert({ photoCount = 1, uploader, albumTitle = 'Kho Ảnh Quê Hương' }) {
    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const subject = `📸 [Làng Giao Tác] Có ${photoCount} hình ảnh mới tải lên chờ duyệt (${albumTitle})`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; border: 1px solid #E8DFD5; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #2D5A27; padding: 20px; text-align: center; color: #FFFDF7;">
          <h2 style="margin: 0; font-size: 20px;">📸 HÌNH ẢNH MỚI CẦN KIỂM DUYỆT</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Làng Giao Tác — TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh</p>
        </div>
        <div style="padding: 24px; color: #2B2118;">
          <p style="font-size: 14px; line-height: 1.6;">
            Thành viên <strong>${uploader.fullName || uploader.email}</strong> vừa đóng góp <strong>${photoCount} hình ảnh</strong> vào album <em>"${albumTitle}"</em>.
          </p>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://lang-giao-tac-1.onrender.com/quan-tri" style="display: inline-block; background-color: #2D5A27; color: #FFFDF7; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px;">👉 Mở Bảng Quản Trị Duyệt Ảnh</a>
          </div>
        </div>
        <div style="background-color: #EFE8DF; padding: 12px 20px; text-align: center; font-size: 11px; color: #777;">
          Gửi tới Quản trị viên (${ADMIN_EMAIL}) vào lúc ${timeStr}
        </div>
      </div>
    `;

    return this.sendMail({
      to: ADMIN_EMAIL,
      subject,
      text: `Thành viên ${uploader.fullName} vừa tải ${photoCount} ảnh lên album "${albumTitle}" lúc ${timeStr} đang chờ duyệt.`,
      html,
    });
  }

  /**
   * 4. Gửi email cho Tác giả khi bài viết được Admin duyệt
   */
  async sendPostApprovedAlert({ post, author }) {
    if (!author?.email) return;

    const subject = `🎉 [Làng Giao Tác] Bài viết "${post.title}" của bạn đã được xuất bản!`;
    const postUrl = `https://lang-giao-tac-1.onrender.com/bai-viet/${post.slug}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; border: 1px solid #E8DFD5; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #2D5A27; padding: 20px; text-align: center; color: #FFFDF7;">
          <h2 style="margin: 0; font-size: 20px;">🎉 BÀI VIẾT ĐÃ ĐƯỢC PHÊ DUYỆT</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Cổng thông tin Làng Giao Tác</p>
        </div>
        <div style="padding: 24px; color: #2B2118;">
          <p style="font-size: 14px; line-height: 1.6;">
            Xin chào <strong>${author.fullName}</strong>,<br/>
            Ban Quản Trị Làng Giao Tác đã phê duyệt bài viết <strong>"${post.title}"</strong> của bạn. Bài viết hiện đã được xuất bản chính thức trên Cổng thông tin để toàn thể bà con cùng đón đọc.
          </p>

          <div style="margin-top: 24px; text-align: center;">
            <a href="${postUrl}" style="display: inline-block; background-color: #2D5A27; color: #FFFDF7; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: bold; font-size: 14px;">Xem Bài Viết Của Bạn</a>
          </div>
        </div>
        <div style="background-color: #EFE8DF; padding: 12px 20px; text-align: center; font-size: 11px; color: #777;">
          Trân trọng cảm ơn đóng góp quý báu của bạn cho quê hương Làng Giao Tác!
        </div>
      </div>
    `;

    return this.sendMail({
      to: author.email,
      subject,
      text: `Bài viết "${post.title}" của bạn đã được Ban Quản Trị Làng Giao Tác phê duyệt và xuất bản tại: ${postUrl}`,
      html,
    });
  }
}

module.exports = new EmailService();
