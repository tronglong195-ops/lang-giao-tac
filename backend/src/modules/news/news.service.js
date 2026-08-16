const prisma = require('../../config/db');
const { createSlug } = require('../../utils/slugify');

class NewsService {
  async getNews({ page = 1, limit = 10, search, isOfficial }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {};

    if (isOfficial !== undefined && isOfficial !== 'all') {
      where.isOfficial = isOfficial === 'true' || isOfficial === true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { contentHtml: { contains: search, mode: 'insensitive' } },
        { source: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, news] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({
        where,
        skip,
        take,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: {
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
      news,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take) || 1,
      },
    };
  }

  async getNewsBySlug(slug) {
    const item = await prisma.news.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            role: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!item) {
      throw new Error('Không tìm thấy tin tức/thông báo này.');
    }

    return item;
  }

  async createNews(user, { title, contentHtml, source, isOfficial = true, publishedAt }) {
    if (!title || !contentHtml) {
      throw new Error('Vui lòng cung cấp tiêu đề và nội dung bản tin.');
    }

    const slug = createSlug(title);

    const item = await prisma.news.create({
      data: {
        authorId: user.id,
        title: title.trim(),
        slug,
        contentHtml,
        source: source?.trim() || 'Ban Quản lý Làng Giao Tác',
        isOfficial: Boolean(isOfficial),
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    return item;
  }

  async updateNews(newsId, { title, contentHtml, source, isOfficial, publishedAt }) {
    const existing = await prisma.news.findUnique({
      where: { id: newsId },
    });

    if (!existing) {
      throw new Error('Không tìm thấy tin tức cần cập nhật.');
    }

    const updateData = {};
    if (title) {
      updateData.title = title.trim();
    }
    if (contentHtml) updateData.contentHtml = contentHtml;
    if (source !== undefined) updateData.source = source?.trim() || null;
    if (isOfficial !== undefined) updateData.isOfficial = Boolean(isOfficial);
    if (publishedAt) updateData.publishedAt = new Date(publishedAt);

    const updated = await prisma.news.update({
      where: { id: newsId },
      data: updateData,
      include: {
        author: {
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

  async deleteNews(newsId) {
    const existing = await prisma.news.findUnique({
      where: { id: newsId },
    });

    if (!existing) {
      throw new Error('Tin tức không tồn tại.');
    }

    await prisma.news.delete({
      where: { id: newsId },
    });

    return { message: 'Đã xóa tin tức thành công.' };
  }
}

module.exports = new NewsService();
