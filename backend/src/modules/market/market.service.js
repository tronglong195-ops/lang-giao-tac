const prisma = require('../../config/db');

const getAllProducts = async (category) => {
  const where = category && category !== 'all' ? { category } : {};
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

const deleteProduct = async (id) => {
  return await prisma.marketProduct.delete({
    where: { id },
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
};
