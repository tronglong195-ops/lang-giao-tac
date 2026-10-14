import api from './api';
import { firestoreDb } from './firestoreDb';

export const marketService = {
  // Lấy danh sách sản phẩm Chợ Quê
  getAllProducts: async (params = {}) => {
    const category = typeof params === 'string' ? params : params.category;
    const search = typeof params === 'object' ? params.search : undefined;

    if (firestoreDb.isAvailable()) {
      try {
        const conditions = [];
        if (category && category !== 'all') {
          conditions.push(['category', '==', category]);
        }
        let products = await firestoreDb.getAll('market_products', {
          conditions,
          orderField: 'createdAt',
          orderDir: 'desc',
        });
        if (search && search.trim()) {
          const q = search.trim().toLowerCase();
          products = products.filter(
            (p) =>
              p.title?.toLowerCase().includes(q) ||
              p.description?.toLowerCase().includes(q) ||
              p.sellerName?.toLowerCase().includes(q)
          );
        }
        if (products.length > 0) return products;
      } catch (err) {
        console.warn('Lỗi Firestore getAllProducts:', err.message);
      }
    }

    try {
      const res = await api.get('/market', {
        params: {
          category: category && category !== 'all' ? category : undefined,
          search: search && search.trim() ? search.trim() : undefined,
        },
      });
      return res.data?.data?.products || [];
    } catch (e) {
      return [];
    }
  },

  // Lấy chi tiết sản phẩm
  getProductDetail: async (id) => {
    if (firestoreDb.isAvailable()) {
      return await firestoreDb.getById('market_products', id);
    }

    const res = await api.get(`/market/${id}`);
    return res.data?.data?.product || null;
  },

  // Đăng sản phẩm mới
  createProduct: async (productData) => {
    if (firestoreDb.isAvailable()) {
      const created = await firestoreDb.create('market_products', productData);
      return { status: 'success', data: { product: created } };
    }

    const res = await api.post('/market', productData);
    return res.data;
  },

  // Cập nhật thông tin sản phẩm
  updateProduct: async (id, productData) => {
    if (firestoreDb.isAvailable()) {
      const updated = await firestoreDb.update('market_products', id, productData);
      return { status: 'success', data: { product: updated } };
    }

    const res = await api.put(`/market/${id}`, productData);
    return res.data;
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    if (firestoreDb.isAvailable()) {
      await firestoreDb.delete('market_products', id);
      return { status: 'success', message: 'Đã xóa sản phẩm' };
    }

    const res = await api.delete(`/market/${id}`);
    return res.data;
  },
};
