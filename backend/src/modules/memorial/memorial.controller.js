const memorialService = require('./memorial.service');

const getAllObituaries = async (req, res, next) => {
  try {
    const obituaries = await memorialService.getAllObituaries();
    res.status(200).json({ success: true, data: { obituaries } });
  } catch (error) {
    next(error);
  }
};

const getObituaryDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const obituary = await memorialService.getObituaryById(id);
    if (!obituary) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin cáo phó này.' });
    }
    res.status(200).json({ success: true, data: { obituary } });
  } catch (error) {
    next(error);
  }
};

const createObituary = async (req, res, next) => {
  try {
    const obituary = await memorialService.createObituary(req.body);
    res.status(201).json({
      success: true,
      message: 'Đã tạo thông báo cáo phó thành công.',
      data: { obituary },
    });
  } catch (error) {
    next(error);
  }
};

const addCondolence = async (req, res, next) => {
  try {
    const { id } = req.params;
    const condolence = await memorialService.addCondolence(id, req.body);
    res.status(201).json({
      success: true,
      message: 'Đã gửi lời chia buồn và thắp nén tâm nhang thành công.',
      data: { condolence },
    });
  } catch (error) {
    next(error);
  }
};

const deleteObituary = async (req, res, next) => {
  try {
    const { id } = req.params;
    await memorialService.deleteObituary(id);
    res.status(200).json({ success: true, message: 'Đã xóa thông báo cáo phó.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllObituaries,
  getObituaryDetail,
  createObituary,
  addCondolence,
  deleteObituary,
};
