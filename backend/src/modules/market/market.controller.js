const marketService = require('./market.service');

const getAllProducts = async (req, res, next) => {
  try {
    const { category } = req.query;
    const products = await marketService.getAllProducts(category);
    res.status(200).json({ success: true, data: { products } });
  } catch (error) {
    next(error);
  }
};

const getProductDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await marketService.getProductById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm này.' });
    }
    res.status(200).json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await marketService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Đã đăng sản phẩm lên Chợ Quê thành công.',
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await marketService.deleteProduct(id);
    res.status(200).json({ success: true, message: 'Đã xóa sản phẩm khỏi Chợ Quê.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductDetail,
  createProduct,
  deleteProduct,
};
