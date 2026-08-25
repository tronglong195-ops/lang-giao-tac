const prisma = require('../../config/db');

const getAllProducts = async (params = {}) => {
  const category = typeof params === 'string' ? params : params.category;
  const search = typeof params === 'object' ? params.search : null;

  const where = {};
  if (category && category !== 'all') {
    where.category = category;
  }

  if (search && search.trim()) {
    where.OR = [
      { title: { contains: search.trim(), mode: 'insensitive' } },
      { description: { contains: search.trim(), mode: 'insensitive' } },
      { sellerName: { contains: search.trim(), mode: 'insensitive' } },
    ];
  }

  return await prisma.marketProduct.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
};

const getProductById = async (id) => {
  return await prisma.marketProduct.findUnique({
    where: { id },
  });
};

const createProduct = async (data) => {
  return await prisma.marketProduct.create({
    data: {
      title: data.title,
      category: data.category || 'DacSan',
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl,
      sellerName: data.sellerName,
      sellerPhone: data.sellerPhone,
      sellerZalo: data.sellerZalo || data.sellerPhone,
      address: data.address || 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
    },
  });
};

const updateProduct = async (id, data) => {
  return await prisma.marketProduct.update({
    where: { id },
    data: {
      title: data.title,
      category: data.category,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl,
      sellerName: data.sellerName,
      sellerPhone: data.sellerPhone,
      sellerZalo: data.sellerZalo || data.sellerPhone,
      address: data.address,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    },
  });
};

const deleteProduct = async (id) => {
  return await prisma.marketProduct.delete({
    where: { id },
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
