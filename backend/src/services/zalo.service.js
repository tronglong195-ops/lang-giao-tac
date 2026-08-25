/**
 * Dịch vụ gửi tin nhắn thông báo Zalo ZNS (Zalo Notification Service)
 * Tự động bỏ qua an toàn nếu chưa cấu hình biến môi trường ZALO_OA_ACCESS_TOKEN
 */

class ZaloService {
  constructor() {
    this.accessToken = process.env.ZALO_OA_ACCESS_TOKEN || null;
    this.templateId = process.env.ZALO_ZNS_TEMPLATE_ID || null;
  }

  /**
   * Chuẩn hóa số điện thoại theo định dạng chuẩn quốc tế của Zalo (84xxxxxxxxx)
   */
  normalizePhoneNumber(phone) {
    if (!phone) return null;
    let clean = String(phone).replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '84' + clean.slice(1);
    } else if (!clean.startsWith('84')) {
      clean = '84' + clean;
    }
    return clean;
  }

  /**
   * Gửi tin nhắn ZNS qua Zalo OpenAPI
   */
  async sendZNS({ phone, templateId, templateData = {} }) {
    const token = process.env.ZALO_OA_ACCESS_TOKEN || this.accessToken;
    const tId = templateId || process.env.ZALO_ZNS_TEMPLATE_ID || this.templateId;

    // Nếu chưa thiết lập Access Token -> im lặng bỏ qua, không làm lỗi luồng chính
    if (!token || !tId) {
      return { skipped: true, reason: 'Chưa cấu hình ZALO_OA_ACCESS_TOKEN hoặc ZALO_ZNS_TEMPLATE_ID' };
    }

    const formattedPhone = this.normalizePhoneNumber(phone);
    if (!formattedPhone) {
      return { skipped: true, reason: 'Số điện thoại không hợp lệ' };
    }

    try {
      const response = await fetch('https://business.openapi.zalo.me/message/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          access_token: token,
        },
        body: JSON.stringify({
          phone: formattedPhone,
          template_id: tId,
          template_data: templateData,
        }),
      });

      const result = await response.json();
      if (result.error !== 0) {
        console.warn('⚠️ [ZaloService] Phản hồi lỗi từ Zalo API:', result.message || result.error);
      } else {
        console.log(`📱 [ZaloService] Đã gửi tin nhắn ZNS thành công tới: ${formattedPhone}`);
      }
      return result;
    } catch (error) {
      // Ghi log cảnh báo nhưng không throw error làm gián đoạn luồng server
      console.warn('⚠️ [ZaloService] Không thể kết nối tới Zalo OpenAPI:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Gửi thông báo bài viết đã được duyệt cho tác giả qua Zalo
   */
  async sendPostApprovedZNS({ phone, postTitle, authorName }) {
    return await this.sendZNS({
      phone,
      templateData: {
        customer_name: authorName || 'Bà con Làng Giao Tác',
        post_title: postTitle || 'Bài viết mới',
        status: 'Đã phê duyệt xuất bản',
        date: new Date().toLocaleDateString('vi-VN'),
      },
    });
  }

  /**
   * Gửi thông báo cảnh báo hệ thống hoặc tin nóng khẩn
   */
  async sendSystemAlertZNS({ phone, title, message }) {
    return await this.sendZNS({
      phone,
      templateData: {
        title: title || 'Thông báo từ Ban Cán sự TDP 9',
        content: message || '',
        date: new Date().toLocaleDateString('vi-VN'),
      },
    });
  }
}

module.exports = new ZaloService();
