const eventService = require('./event.service');

class EventController {
  async getEvents(req, res) {
    try {
      const { page, limit, timeFilter } = req.query;
      const result = await eventService.getEvents({ page, limit, timeFilter });

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tải danh sách sự kiện.',
      });
    }
  }

  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);

      return res.status(200).json({
        success: true,
        data: { event },
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message || 'Không tìm thấy sự kiện.',
      });
    }
  }

  async createEvent(req, res) {
    try {
      const { title, description, eventDate, location, coverImageUrl } = req.body;
      const event = await eventService.createEvent(req.user, {
        title,
        description,
        eventDate,
        location,
        coverImageUrl,
      });

      return res.status(201).json({
        success: true,
        message: 'Tạo sự kiện thành công.',
        data: { event },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi tạo sự kiện.',
      });
    }
  }

  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const { title, description, eventDate, location, coverImageUrl } = req.body;

      const updated = await eventService.updateEvent(id, {
        title,
        description,
        eventDate,
        location,
        coverImageUrl,
      });

      return res.status(200).json({
        success: true,
        message: 'Cập nhật sự kiện thành công.',
        data: { event: updated },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi cập nhật sự kiện.',
      });
    }
  }

  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const result = await eventService.deleteEvent(id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Lỗi khi xóa sự kiện.',
      });
    }
  }
}

module.exports = new EventController();
