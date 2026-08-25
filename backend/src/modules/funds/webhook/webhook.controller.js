const prisma = require('../../../config/db');
const { verifyDonation, createDonation } = require('../fund.service');

/**
 * Webhook nhận thông báo biến động số dư từ Casso.vn hoặc SePay
 */
const handlePaymentWebhook = async (req, res, next) => {
  try {
    const webhookSecret = process.env.CASSO_WEBHOOK_SECRET;

    // Kiểm tra token xác thực nếu đã cấu hình secret
    if (webhookSecret && webhookSecret.trim()) {
      const incomingToken =
        req.headers['secure-token'] ||
        req.headers['authorization']?.replace(/^Bearer\s+/i, '') ||
        req.headers['x-api-key'] ||
        req.query.secret;

      if (incomingToken !== webhookSecret.trim()) {
        console.warn('⚠️ [FUNDS WEBHOOK] Từ chối request do sai webhook secret token.');
        return res.status(401).json({ success: false, message: 'Invalid webhook secret token' });
      }
    }

    const payload = req.body;
    console.log('🔔 [FUNDS WEBHOOK] Nhận dữ liệu thanh toán:', JSON.stringify(payload));

    // Chuẩn hóa danh sách giao dịch (hỗ trợ cả mảng Casso và object đơn lẻ SePay)
    let transactions = [];
    if (Array.isArray(payload?.data)) {
      transactions = payload.data;
    } else if (Array.isArray(payload)) {
      transactions = payload;
    } else if (payload && typeof payload === 'object') {
      transactions = [payload];
    }

    let processedCount = 0;

    for (const tx of transactions) {
      const content = (tx.description || tx.content || tx.code || '').trim();
      const amount = Number(tx.amount || tx.transferAmount || 0);
      const txCode = String(tx.tid || tx.id || tx.referenceCode || `TX-${Date.now()}`);

      if (amount <= 0 || !content) continue;

      // 1. Tìm chiến dịch theo qrCodePrefix có trong nội dung
      const campaigns = await prisma.fundCampaign.findMany();
      let matchedCampaign = campaigns.find((c) =>
        content.toUpperCase().includes(c.qrCodePrefix.toUpperCase())
      );

      // Nếu không khớp prefix nào, dùng chiến dịch mới nhất
      if (!matchedCampaign && campaigns.length > 0) {
        matchedCampaign = campaigns[0];
      }

      if (!matchedCampaign) continue;

      // 2. Tìm khoản ủng hộ chưa xác nhận (isVerified = false) có cùng số tiền
      let donation = await prisma.fundDonation.findFirst({
        where: {
          campaignId: matchedCampaign.id,
          amount: amount,
          isVerified: false,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (donation) {
        // Khớp khoản ủng hộ đã đăng ký trước ➔ Xác nhận thành công!
        await verifyDonation(donation.id, txCode);
        console.log(`✅ [FUNDS WEBHOOK] Đã đối soát & xác nhận thành công đơn ủng hộ #${donation.id} (${amount}đ)`);
      } else {
        // Giao dịch chuyển khoản trực tiếp không qua đăng ký trước ➔ Tự động tạo bản ghi vinh danh
        const donorNameMatch = content.match(/(?:từ|tu|nguoi|ck)\s+([^,\.-]+)/i);
        const donorName = donorNameMatch ? donorNameMatch[1].trim() : 'Nhà hảo tâm chuyển khoản';

        await prisma.fundDonation.create({
          data: {
            campaignId: matchedCampaign.id,
            donorName: donorName.slice(0, 50),
            donorClan: 'Con em quê hương',
            amount: amount,
            message: content.slice(0, 200),
            txCode: txCode,
            isVerified: true,
          },
        });

        // Cập nhật tổng quỹ
        await prisma.fundCampaign.update({
          where: { id: matchedCampaign.id },
          data: {
            raisedAmount: {
              increment: amount,
            },
          },
        });

        console.log(`✅ [FUNDS WEBHOOK] Đã ghi nhận mới khoản đóng góp trực tiếp: ${amount}đ vào chiến dịch ${matchedCampaign.title}`);
      }

      processedCount++;
    }

    return res.status(200).json({
      success: true,
      error: 0,
      message: `Đã xử lý đối soát thành công ${processedCount} giao dịch.`,
    });
  } catch (error) {
    console.error('❌ [FUNDS WEBHOOK ERROR]:', error);
    next(error);
  }
};

module.exports = {
  handlePaymentWebhook,
};
