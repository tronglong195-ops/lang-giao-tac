const prisma = require('../../config/db');

class VillagerService {
  async getVillagers({ page = 1, limit = 15, region, generationBranch, search }) {
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where = {};

    if (region && region !== 'all') {
      where.region = { contains: region, mode: 'insensitive' };
    }

    if (generationBranch && generationBranch !== 'all') {
      where.generationBranch = { contains: generationBranch, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { region: { contains: search, mode: 'insensitive' } },
        { generationBranch: { contains: search, mode: 'insensitive' } },
        { contactInfo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, list] = await Promise.all([
      prisma.villagerDirectory.count({ where }),
      prisma.villagerDirectory.findMany({
        where,
        skip,
        take,
        orderBy: { fullName: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              avatarUrl: true,
              hometownGroup: true,
              currentLocation: true,
              bio: true,
            },
          },
        },
      }),
    ]);

    // Lọc bỏ số điện thoại nếu phonePublic = false và người xem không phải admin/mod
    const villagers = list.map((item) => {
      if (!item.phonePublic) {
        return {
          ...item,
          contactInfo: item.contactInfo ? 'Liên hệ qua BLL Đồng hương' : null,
        };
      }
      return item;
    });

    return {
      villagers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / take) || 1,
      },
    };
  }

  async getStats() {
    const [total, regionsRaw, branchesRaw] = await Promise.all([
      prisma.villagerDirectory.count(),
      prisma.villagerDirectory.groupBy({
        by: ['region'],
        _count: { region: true },
      }),
      prisma.villagerDirectory.groupBy({
        by: ['generationBranch'],
        _count: { generationBranch: true },
      }),
    ]);

    const regions = regionsRaw.map((r) => ({ name: r.region, count: r._count.region }));
    const branches = branchesRaw
      .filter((b) => b.generationBranch)
      .map((b) => ({ name: b.generationBranch, count: b._count.generationBranch }));

    return {
      totalVillagers: total,
      regions,
      branches,
    };
  }

  async createVillager(user, { fullName, region, phonePublic = false, contactInfo, generationBranch }) {
    if (!fullName || !region) {
      throw new Error('Vui lòng cung cấp Họ tên và Khu vực sinh sống.');
    }

    const villager = await prisma.villagerDirectory.create({
      data: {
        userId: user ? user.id : null,
        fullName: fullName.trim(),
        region: region.trim(),
        phonePublic: Boolean(phonePublic),
        contactInfo: contactInfo?.trim() || null,
        generationBranch: generationBranch?.trim() || null,
      },
    });

    return villager;
  }

  async updateVillager(user, id, { fullName, region, phonePublic, contactInfo, generationBranch }) {
    const existing = await prisma.villagerDirectory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Không tìm thấy thông tin danh bạ.');
    }

    const isOwner = user && existing.userId === user.id;
    const isAdminOrMod = user && (user.role === 'admin' || user.role === 'moderator');

    if (!isOwner && !isAdminOrMod) {
      throw new Error('Bạn không có quyền sửa thông tin này.');
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName.trim();
    if (region) updateData.region = region.trim();
    if (phonePublic !== undefined) updateData.phonePublic = Boolean(phonePublic);
    if (contactInfo !== undefined) updateData.contactInfo = contactInfo?.trim() || null;
    if (generationBranch !== undefined) updateData.generationBranch = generationBranch?.trim() || null;

    const updated = await prisma.villagerDirectory.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async deleteVillager(user, id) {
    const existing = await prisma.villagerDirectory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Thông tin không tồn tại.');
    }

    const isOwner = user && existing.userId === user.id;
    const isAdminOrMod = user && (user.role === 'admin' || user.role === 'moderator');

    if (!isOwner && !isAdminOrMod) {
      throw new Error('Bạn không có quyền xóa bản ghi này.');
    }

    await prisma.villagerDirectory.delete({
      where: { id },
    });

    return { message: 'Đã xóa bản ghi danh bạ thành công.' };
  }
}

module.exports = new VillagerService();
