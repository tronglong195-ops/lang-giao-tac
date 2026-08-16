const prisma = require('../../config/db');

class EventService {
  async getEvents({ page = 1, limit = 10, timeFilter = 'all' }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const now = new Date();
    const where = {};

    if (timeFilter === 'upcoming') {
      where.eventDate = { gte: now };
    } else if (timeFilter === 'past') {
      where.eventDate = { lt: now };
    }

    const [total, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        skip,
        take,
        orderBy: { eventDate: timeFilter === 'past' ? 'desc' : 'asc' },
        include: {
          createdBy: {
            select: {
              id: true,
              fullName: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return {
      events,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take) || 1,
      },
    };
  }

  async getEventById(id) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error('Sự kiện không tồn tại.');
    }

    return event;
  }

  async createEvent(user, { title, description, eventDate, location, coverImageUrl }) {
    if (!title || !description || !eventDate || !location) {
      throw new Error('Vui lòng cung cấp đầy đủ Tiêu đề, Mô tả, Thời gian và Địa điểm sự kiện.');
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        eventDate: new Date(eventDate),
        location: location.trim(),
        coverImageUrl: coverImageUrl?.trim() || null,
        createdById: user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    return event;
  }

  async updateEvent(id, { title, description, eventDate, location, coverImageUrl }) {
    const existing = await prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Sự kiện không tồn tại.');
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (eventDate) updateData.eventDate = new Date(eventDate);
    if (location) updateData.location = location.trim();
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl?.trim() || null;

    const updated = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    return updated;
  }

  async deleteEvent(id) {
    const existing = await prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Sự kiện không tồn tại.');
    }

    await prisma.event.delete({
      where: { id },
    });

    return { message: 'Đã xóa sự kiện thành công.' };
  }
}

module.exports = new EventService();
