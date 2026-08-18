const genealogyService = require('./genealogy.service');

const getAllClans = async (req, res, next) => {
  try {
    const clans = await genealogyService.getAllClans();
    res.status(200).json({ success: true, data: { clans } });
  } catch (error) {
    next(error);
  }
};

const getClanDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const clan = await genealogyService.getClanBySlug(slug);
    if (!clan) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dòng họ này.' });
    }
    res.status(200).json({ success: true, data: { clan } });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { clanId } = req.params;
    const member = await genealogyService.addMember(clanId, req.body);
    res.status(201).json({ success: true, message: 'Đã thêm thành viên vào gia phả thành công.', data: { member } });
  } catch (error) {
    next(error);
  }
};

const updateMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await genealogyService.updateMember(id, req.body);
    res.status(200).json({ success: true, message: 'Cập nhật thông tin thành viên thành công.', data: { member } });
  } catch (error) {
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    await genealogyService.deleteMember(id);
    res.status(200).json({ success: true, message: 'Đã xóa thành viên khỏi gia phả.' });
  } catch (error) {
    next(error);
  }
};

const updateClanInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const clan = await genealogyService.updateClanInfo(id, req.body);
    res.status(200).json({ success: true, message: 'Cập nhật thông tin dòng họ thành công.', data: { clan } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClans,
  getClanDetail,
  addMember,
  updateMember,
  deleteMember,
  updateClanInfo,
};
