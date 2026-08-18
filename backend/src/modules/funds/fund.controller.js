const fundService = require('./fund.service');

const getAllCampaigns = async (req, res, next) => {
  try {
    const campaigns = await fundService.getAllCampaigns();
    res.status(200).json({ success: true, data: { campaigns } });
  } catch (error) {
    next(error);
  }
};

const getCampaignDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const campaign = await fundService.getCampaignBySlug(slug);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chiến dịch quỹ này.' });
    }
    res.status(200).json({ success: true, data: { campaign } });
  } catch (error) {
    next(error);
  }
};

const getVietQR = async (req, res, next) => {
  try {
    const { bankName, bankAccount, bankAccountName, amount, note } = req.query;
    const qrUrl = fundService.generateVietQRUrl({ bankName, bankAccount, bankAccountName, amount, note });
    res.status(200).json({ success: true, data: { qrUrl } });
  } catch (error) {
    next(error);
  }
};

const donate = async (req, res, next) => {
  try {
    const donation = await fundService.createDonation(req.body);
    res.status(201).json({
      success: true,
      message: 'Cảm ơn tấm lòng vàng của bạn đã ủng hộ Quỹ Quê Hương Làng Giao Tác!',
      data: { donation },
    });
  } catch (error) {
    next(error);
  }
};

const createCampaign = async (req, res, next) => {
  try {
    const campaign = await fundService.createCampaign(req.body);
    res.status(201).json({
      success: true,
      message: 'Đã tạo chiến dịch quỹ mới thành công.',
      data: { campaign },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCampaigns,
  getCampaignDetail,
  getVietQR,
  donate,
  createCampaign,
};
