const prisma = require('../../config/db');

class HistoryService {
  async getHistoryTimelines() {
    const timelines = await prisma.historyTimeline.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    return timelines;
  }

  async createTimeline({ yearLabel, title, description, imageUrl, orderIndex = 0 }) {
    if (!yearLabel || !title || !description) {
      throw new Error('Vui lòng cung cấp Năm mốc thời gian, Tiêu đề và Mô tả lịch sử.');
    }

    const item = await prisma.historyTimeline.create({
      data: {
        yearLabel: yearLabel.trim(),
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl?.trim() || null,
        orderIndex: Number(orderIndex) || 0,
      },
    });

    return item;
  }

  async updateTimeline(id, { yearLabel, title, description, imageUrl, orderIndex }) {
    const existing = await prisma.historyTimeline.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Mốc lịch sử không tồn tại.');
    }

    const updateData = {};
    if (yearLabel) updateData.yearLabel = yearLabel.trim();
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl?.trim() || null;
    if (orderIndex !== undefined) updateData.orderIndex = Number(orderIndex);

    const updated = await prisma.historyTimeline.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async deleteTimeline(id) {
    const existing = await prisma.historyTimeline.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Mốc lịch sử không tồn tại.');
    }

    await prisma.historyTimeline.delete({
      where: { id },
    });

    return { message: 'Đã xóa mốc lịch sử thành công.' };
  }
}

module.exports = new HistoryService();
