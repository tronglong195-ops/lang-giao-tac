const prisma = require('../../config/db');

/**
 * Lấy danh sách 8 dòng họ Làng Giao Tác
 */
const getAllClans = async () => {
  const clans = await prisma.clan.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { members: true },
      },
    },
  });
  return clans;
};

/**
 * Lấy chi tiết dòng họ và dựng cây phả hệ
 */
const getClanBySlug = async (slug) => {
  const clan = await prisma.clan.findUnique({
    where: { slug },
    include: {
      members: {
        orderBy: [{ generation: 'asc' }, { orderIndex: 'asc' }, { createdAt: 'asc' }],
      },
    },
  });

  if (!clan) return null;

  // Dựng cây phân cấp cha - con (Hierarchical Tree)
  const memberMap = {};
  const treeRoots = [];

  clan.members.forEach((m) => {
    memberMap[m.id] = { ...m, children: [] };
  });

  clan.members.forEach((m) => {
    if (m.parentId && memberMap[m.parentId]) {
      memberMap[m.parentId].children.push(memberMap[m.id]);
    } else {
      treeRoots.push(memberMap[m.id]);
    }
  });

  return {
    ...clan,
    tree: treeRoots,
  };
};

/**
 * Thêm thành viên vào gia phả
 */
const addMember = async (clanId, data) => {
  const {
    fullName,
    gender = 'male',
    generation = 1,
    branchName,
    birthYear,
    deathYear,
    spouseName,
    parentId,
    tombLocation,
    careerHonor,
    biography,
    avatarUrl,
    orderIndex = 0,
  } = data;

  const member = await prisma.genealogyMember.create({
    data: {
      clanId,
      fullName,
      gender,
      generation: Number(generation) || 1,
      branchName,
      birthYear: birthYear ? String(birthYear) : null,
      deathYear: deathYear ? String(deathYear) : null,
      spouseName,
      parentId: parentId || null,
      tombLocation,
      careerHonor,
      biography,
      avatarUrl,
      orderIndex: Number(orderIndex) || 0,
    },
  });

  return member;
};

/**
 * Cập nhật thông tin thành viên gia phả
 */
const updateMember = async (memberId, data) => {
  const member = await prisma.genealogyMember.update({
    where: { id: memberId },
    data: {
      fullName: data.fullName,
      gender: data.gender,
      generation: data.generation ? Number(data.generation) : undefined,
      branchName: data.branchName,
      birthYear: data.birthYear ? String(data.birthYear) : null,
      deathYear: data.deathYear ? String(data.deathYear) : null,
      spouseName: data.spouseName,
      parentId: data.parentId || null,
      tombLocation: data.tombLocation,
      careerHonor: data.careerHonor,
      biography: data.biography,
      avatarUrl: data.avatarUrl,
      orderIndex: data.orderIndex !== undefined ? Number(data.orderIndex) : undefined,
    },
  });

  return member;
};

/**
 * Xóa thành viên khỏi gia phả
 */
const deleteMember = async (memberId) => {
  return await prisma.genealogyMember.delete({
    where: { id: memberId },
  });
};

/**
 * Cập nhật thông tin tổng quan dòng họ
 */
const updateClanInfo = async (clanId, data) => {
  return await prisma.clan.update({
    where: { id: clanId },
    data,
  });
};

module.exports = {
  getAllClans,
  getClanBySlug,
  addMember,
  updateMember,
  deleteMember,
  updateClanInfo,
};
