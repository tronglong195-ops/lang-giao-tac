const prisma = require('../../config/db');

/**
 * Lấy tất cả chiến dịch Quỹ Quê Hương
 */
const getAllCampaigns = async () => {
  const campaigns = await prisma.fundCampaign.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { donations: true },
      },
    },
  });
  return campaigns;
};

/**
 * Lấy chi tiết chiến dịch + danh sách ủng hộ đã xác nhận
 */
const getCampaignBySlug = async (slug) => {
  const campaign = await prisma.fundCampaign.findUnique({
    where: { slug },
    include: {
      donations: {
        where: { isVerified: true },
        orderBy: { donatedAt: 'desc' },
      },
    },
  });
  return campaign;
};

/**
 * Sinh mã VietQR URL chuẩn Napas 247
 */
const generateVietQRUrl = ({ bankName = 'MBBANK', bankAccount = '0912345678', bankAccountName = 'BAN CAN SU TDP 9', amount, note }) => {
  const encodedNote = encodeURIComponent(note || 'UNG HO LANG GIAO TAC');
  const encodedAccountName = encodeURIComponent(bankAccountName);
  const amountStr = amount ? `&amount=${amount}` : '';
  return `https://img.vietqr.io/image/${bankName}-${bankAccount}-compact2.png?accountName=${encodedAccountName}${amountStr}&addInfo=${encodedNote}`;
};

/**
 * Gửi thông tin ủng hộ (Online hoặc Đã chuyển khoản)
 */
const createDonation = async (data) => {
  const { campaignId, donorName, donorClan, amount, message, txCode } = data;

  const donation = await prisma.fundDonation.create({
    data: {
      campaignId,
      donorName: donorName || 'Nhà hảo tâm ẩn danh',
      donorClan: donorClan || 'Con em quê hương Giao Tác',
      amount: Number(amount) || 0,
      message,
      txCode,
      isVerified: true, // Mặc định ghi nhận
    },
  });

  // Cập nhật tổng số tiền đã nhận của chiến dịch
  await prisma.fundCampaign.update({
    where: { id: campaignId },
    data: {
      raisedAmount: {
        increment: Number(amount) || 0,
      },
    },
  });

  return donation;
};

/**
 * Tạo chiến dịch mới (Dành cho Admin)
 */
const createCampaign = async (data) => {
  const {
    title,
    slug,
    description,
    targetAmount,
    bankName = 'MBBANK',
    bankAccount,
    bankAccountName,
    qrCodePrefix = 'GIAOTAC',
    coverImageUrl,
    endDate,
  } = data;

  return await prisma.fundCampaign.create({
    data: {
      title,
      slug,
      description,
      targetAmount: Number(targetAmount),
      bankName,
      bankAccount,
      bankAccountName,
      qrCodePrefix,
      coverImageUrl,
      endDate: endDate ? new Date(endDate) : null,
    },
  });
};

module.exports = {
  getAllCampaigns,
  getCampaignBySlug,
  generateVietQRUrl,
  createDonation,
  createCampaign,
};
