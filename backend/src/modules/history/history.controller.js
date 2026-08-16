const historyService = require('./history.service');

class HistoryController {
  async getHistoryTimelines(req, res) {
    try {
      const timelines = await historyService.getHistoryTimelines();
      return res.status(200).json({
        success: true,
        data: { timelines },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải dòng thời gian lịch sử.',
      });
    }
  }

  async createTimeline(req, res) {
    try {
      const { yearLabel, title, description, imageUrl, orderIndex } = req.body;
      const timeline = await historyService.createTimeline({
        yearLabel,
        title,
        description,
        imageUrl,
        orderIndex,
      });

      return res.status(201).json({
        success: true,
        message: 'Thêm mốc lịch sử thành công.',
        data: { timeline },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi thêm mốc lịch sử.',
      });
    }
  }

  async updateTimeline(req, res) {
    try {
      const { id } = req.params;
      const { yearLabel, title, description, imageUrl, orderIndex } = req.body;

      const updated = await historyService.updateTimeline(id, {
        yearLabel,
        title,
        description,
        imageUrl,
        orderIndex,
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật mốc lịch sử thành công.',
        data: { timeline: updated },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật mốc lịch sử.',
      });
    }
  }

  async deleteTimeline(req, res) {
    try {
      const { id } = req.params;
      const result = await historyService.deleteTimeline(id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi xóa mốc lịch sử.',
      });
    }
  }
}

module.exports = new HistoryController();
