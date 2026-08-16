const villagerService = require('./villager.service');

class VillagerController {
  async getVillagers(req, res) {
    try {
      const { page, limit, region, generationBranch, search } = req.query;
      const result = await villagerService.getVillagers({
        page,
        limit,
        region,
        generationBranch,
        search,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải danh bạ đồng hương.',
      });
    }
  }

  async getStats(req, res) {
    try {
      const stats = await villagerService.getStats();
      return res.status(200).json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải thống kê đồng hương.',
      });
    }
  }

  async createVillager(req, res) {
    try {
      const { fullName, region, phonePublic, contactInfo, generationBranch } = req.body;
      const villager = await villagerService.createVillager(req.user, {
        fullName,
        region,
        phonePublic,
        contactInfo,
        generationBranch,
      });

      return res.status(201).json({
        success: true,
        message: 'Đăng ký thông tin vào danh bạ thành công.',
        data: { villager },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi đăng ký danh bạ.',
      });
    }
  }

  async updateVillager(req, res) {
    try {
      const { id } = req.params;
      const { fullName, region, phonePublic, contactInfo, generationBranch } = req.body;

      const updated = await villagerService.updateVillager(req.user, id, {
        fullName,
        region,
        phonePublic,
        contactInfo,
        generationBranch,
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật danh bạ thành công.',
        data: { villager: updated },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật danh bạ.',
      });
    }
  }

  async deleteVillager(req, res) {
    try {
      const { id } = req.params;
      const result = await villagerService.deleteVillager(req.user, id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi xóa danh bạ.',
      });
    }
  }
}

module.exports = new VillagerController();
