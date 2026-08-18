import api from './api';

export const marketService = {
  // Lấy danh sách sản phẩm Chợ Quê
  getAllProducts: async (category = 'all') => {
    const res = await api.get('/market', {
      params: { category: category !== 'all' ? category : undefined },
    });
    return res.data?.data?.products || [];
  },

  // Lấy chi tiết sản phẩm
  getProductDetail: async (id) => {
    const res = await api.get(`/market/${id}`);
    return res.data?.data?.product || null;
  },

  // Đăng sản phẩm mới
  createProduct: async (productData) => {
    const res = await api.post('/market', productData);
    return res.data;
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    const res = await api.delete(`/market/${id}`);
    return res.data;
  },
};
