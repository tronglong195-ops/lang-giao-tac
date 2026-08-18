import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Phone,
  MessageCircle,
  MapPin,
  Tag,
  Search,
  PlusCircle,
  CheckCircle2,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import { marketService } from '../services/marketService';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { id: 'all', name: 'Tất cả đặc sản' },
  { id: 'DacSan', name: 'Đặc sản truyền thống' },
  { id: 'NongSan', name: 'Nông sản mùa vụ' },
  { id: 'AmThuc', name: 'Ẩm thực quê nhà' },
  { id: 'ThuCong', name: 'Thủ công mỹ nghệ' },
];

export const MarketPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Add Product
  const [showAddModal, setShowAddModal] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'DacSan',
    price: '',
    description: '',
    imageUrl: '',
    sellerName: user?.fullName || '',
    sellerPhone: '',
    sellerZalo: '',
    address: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await marketService.getAllProducts(category);
      setProducts(data);
    } catch (err) {
      console.error('Lỗi tải sản phẩm chợ quê:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.sellerPhone) return;

    setSubmitting(true);
    try {
      await marketService.createProduct(productForm);
      setShowAddModal(false);
      fetchProducts();
      setProductForm({
        title: '',
        category: 'DacSan',
        price: '',
        description: '',
        imageUrl: '',
        sellerName: user?.fullName || '',
        sellerPhone: '',
        sellerZalo: '',
        address: 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
      });
    } catch (err) {
      alert('Có lỗi xảy ra khi đăng sản phẩm.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Header */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-10 shadow-warm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
          <span>Chợ Quê & Nông Sản OCOP</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-primary-dark tracking-tight leading-snug">
              Đặc Sản Làng Giao Tác — Hồng Lĩnh
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-2xl pt-1">
              Gian hàng kết nối trực tiếp với các hộ sản xuất, nhà vườn tại TDP 9 Thuận Lộc. 
              Mang kẹo cu đơ, cam bù, mật mía, gạo mới và hương vị quê nhà đến muôn nơi.
            </p>
          </div>

          {user && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-primary text-surface text-xs sm:text-sm font-bold hover:bg-primary-dark shadow-warm transition-all shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng Nông Sản / Đặc Sản</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                category === cat.id
                  ? 'bg-primary text-surface shadow-xs'
                  : 'bg-surface hover:bg-paper text-ink border border-warmBorder'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm món ngon, đặc sản..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-warmBorder bg-surface text-xs"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-3xl border border-warmBorder text-ink-muted text-sm space-y-3">
          <ShoppingBag className="w-12 h-12 mx-auto text-ink-light" />
          <p className="font-medium">Chưa có sản phẩm nào trong danh mục này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-surface rounded-3xl border border-warmBorder overflow-hidden shadow-warm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Product Image */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-paper">
                <img
                  src={product.imageUrl || '/images/village/486669654_9667039090022304_8533644671297434351_n.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-xs text-primary font-bold text-[10px] uppercase shadow-xs">
                  {product.category === 'DacSan' ? 'Đặc Sản' : product.category === 'NongSan' ? 'Nông Sản' : 'Ẩm Thực'}
                </span>
              </div>

              {/* Product Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-primary font-bold text-base block">{product.price}</span>
                  <h3 className="font-bold text-sm sm:text-base text-ink line-clamp-2 leading-snug">
                    {product.title}
                  </h3>
                  <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Seller & Contact Bar */}
                <div className="pt-3 border-t border-warmBorder space-y-2.5">
                  <div className="text-[11px] text-ink-muted space-y-0.5">
                    <span className="font-semibold text-ink block">{product.sellerName}</span>
                    <span className="flex items-center space-x-1 text-ink-light truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{product.address}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${product.sellerPhone}`}
                      className="py-2 px-2 rounded-xl bg-primary text-surface font-semibold text-xs flex items-center justify-center space-x-1 hover:bg-primary-dark transition-colors shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Gọi Điện</span>
                    </a>

                    <a
                      href={`https://zalo.me/${product.sellerZalo || product.sellerPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center justify-center space-x-1 hover:bg-blue-700 transition-colors shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Nhắn Zalo</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface rounded-3xl border border-warmBorder max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-warmBorder pb-3">
              <h3 className="font-bold text-lg text-ink">Đăng Sản Phẩm Lên Chợ Quê</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">
                  Tên sản phẩm / Đặc sản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="Ví dụ: Kẹo Cu Đơ Hà Tĩnh truyền thống..."
                  className="w-full input-warm text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Danh mục</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full input-warm text-sm"
                  >
                    <option value="DacSan">Đặc sản truyền thống</option>
                    <option value="NongSan">Nông sản mùa vụ</option>
                    <option value="AmThuc">Ẩm thực quê nhà</option>
                    <option value="ThuCong">Thủ công mỹ nghệ</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Giá tham khảo</label>
                  <input
                    type="text"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="Ví dụ: 50.000đ / kg"
                    className="w-full input-warm text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Mô tả sản phẩm</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Mô tả nguyên liệu, hương vị, cách đóng gói..."
                  className="w-full input-warm text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">
                    Số điện thoại liên hệ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.sellerPhone}
                    onChange={(e) => setProductForm({ ...productForm, sellerPhone: e.target.value })}
                    placeholder="0988123456"
                    className="w-full input-warm text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Số Zalo</label>
                  <input
                    type="text"
                    value={productForm.sellerZalo}
                    onChange={(e) => setProductForm({ ...productForm, sellerZalo: e.target.value })}
                    placeholder="0988123456"
                    className="w-full input-warm text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Địa chỉ tại làng</label>
                <input
                  type="text"
                  value={productForm.address}
                  onChange={(e) => setProductForm({ ...productForm, address: e.target.value })}
                  className="w-full input-warm text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-warmBorder">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-warmBorder text-xs font-semibold text-ink"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-primary text-surface text-xs font-bold hover:bg-primary-dark disabled:opacity-50"
                >
                  {submitting ? 'Đang đăng...' : 'Đăng Sản Phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
