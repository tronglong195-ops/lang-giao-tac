const prisma = require('../../config/db');

const getAllObituaries = async () => {
  return await prisma.obituary.findMany({
    orderBy: { diedAt: 'desc' },
    include: {
      _count: {
        select: { condolences: true },
      },
    },
  });
};

const getObituaryById = async (id) => {
  return await prisma.obituary.findUnique({
    where: { id },
    include: {
      condolences: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};

const createObituary = async (data) => {
  return await prisma.obituary.create({
    data: {
      deceasedName: data.deceasedName,
      aliasName: data.aliasName,
      age: Number(data.age) || 70,
      clanName: data.clanName,
      diedAt: new Date(data.diedAt),
      funeralTime: data.funeralTime,
      burialTime: data.burialTime,
      cemeteryPlace: data.cemeteryPlace,
      biography: data.biography,
      coverImageUrl: data.coverImageUrl,
    },
  });
};

const addCondolence = async (obituaryId, data) => {
  return await prisma.condolence.create({
    data: {
      obituaryId,
      senderName: data.senderName || 'Bà con đồng hương',
      senderFrom: data.senderFrom,
      message: data.message || 'Xin thành kính phân ưu cùng gia quyến!',
      incenseCount: Number(data.incenseCount) || 1,
    },
  });
};

const deleteObituary = async (id) => {
  return await prisma.obituary.delete({
    where: { id },
  });
};

module.exports = {
  getAllObituaries,
  getObituaryById,
  createObituary,
  addCondolence,
  deleteObituary,
};
