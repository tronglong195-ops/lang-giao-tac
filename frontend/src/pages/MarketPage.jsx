import React, { useEffect, useState, useRef } from 'react';
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
  Edit,
  Trash2,
  UploadCloud,
  Image as ImageIcon,
} from 'lucide-react';
import { marketService } from '../services/marketService';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';

const CATEGORIES = [
  { id: 'all', name: 'Tất cả đặc sản' },
  { id: 'DacSan', name: 'Đặc sản truyền thống' },
  { id: 'NongSan', name: 'Nông sản mùa vụ' },
  { id: 'AmThuc', name: 'Ẩm thực quê nhà' },
  { id: 'ThuCong', name: 'Thủ công mỹ nghệ' },
];

export const MarketPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Add / Edit Product
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingProductId, setEditingProductId] = useState(null);

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
    isAvailable: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await marketService.getAllProducts({ category, search: searchQuery });
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

  // Mở modal Thêm mới
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingProductId(null);
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
      isAvailable: true,
    });
    setShowModal(true);
  };

  // Mở modal Sửa đặc sản
  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setEditingProductId(product.id);
    setProductForm({
      title: product.title || '',
      category: product.category || 'DacSan',
      price: product.price || '',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      sellerName: product.sellerName || '',
      sellerPhone: product.sellerPhone || '',
      sellerZalo: product.sellerZalo || '',
      address: product.address || 'TDP 9 Thuận Lộc, Phường Nam Hồng Lĩnh',
      isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
    });
    setShowModal(true);
  };

  // Xử lý chọn ảnh từ thiết bị
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Giới hạn 8MB
    if (file.size > 8 * 1024 * 1024) {
      alert('Kích thước ảnh tối đa là 8MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result;
      if (!base64) return;

      setUploadingImage(true);
      try {
        // Tải ảnh qua backend upload module nếu có token
        if (user) {
          const res = await api.post('/upload/image', {
            image: base64,
            folder: 'giaotac_market',
          });
          if (res.data?.data?.imageUrl) {
            setProductForm((prev) => ({ ...prev, imageUrl: res.data.data.imageUrl }));
          } else {
            setProductForm((prev) => ({ ...prev, imageUrl: base64 }));
          }
        } else {
          setProductForm((prev) => ({ ...prev, imageUrl: base64 }));
        }
      } catch (err) {
        console.warn('Dùng base64 trực tiếp do lỗi upload:', err.message);
        setProductForm((prev) => ({ ...prev, imageUrl: base64 }));
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Xử lý Lưu (Thêm mới hoặc Cập nhật)
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title.trim() || !productForm.sellerPhone.trim()) {
      alert('Vui lòng nhập Tên sản phẩm và Số điện thoại liên hệ.');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await marketService.createProduct(productForm);
        alert('Đã đăng đặc sản lên Chợ Quê thành công!');
      } else {
        await marketService.updateProduct(editingProductId, productForm);
        alert('Đã cập nhật thông tin đặc sản thành công!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Lỗi khi lưu sản phẩm:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm.');
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý Xóa đặc sản
  const handleDeleteProduct = async (product) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa đặc sản "${product.title}" khỏi Chợ Quê Làng Giao Tác không?`
    );
    if (!confirmDelete) return;

    try {
      await marketService.deleteProduct(product.id);
      alert(`Đã xóa thành công đặc sản "${product.title}".`);
      fetchProducts();
    } catch (err) {
      console.error('Lỗi xóa sản phẩm:', err);
      alert(err.response?.data?.message || 'Không thể xóa sản phẩm. Vui lòng thử lại.');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Helmet>
        <title>Chợ Quê & Đặc Sản OCOP — Làng Giao Tác</title>
        <meta
          name="description"
          content="Gian hàng nông sản và đặc sản Làng Giao Tác — TDP 9 Thuận Lộc. Kết nối trực tiếp nhà vườn: kẹo cu đơ, cam bù, mật mía, rượu quê."
        />
        <meta property="og:title" content="Chợ Quê & Đặc Sản OCOP — Làng Giao Tác" />
        <meta
          property="og:description"
          content="Gian hàng nông sản và đặc sản Làng Giao Tác — TDP 9 Thuận Lộc. Kết nối trực tiếp nhà vườn."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Header */}
      <div className="bg-surface rounded-3xl border border-warmBorder p-6 sm:p-10 shadow-warm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
          <span>Chợ Quê & Nông Sản OCOP Làng Giao Tác</span>
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

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-primary text-surface text-xs sm:text-sm font-bold hover:bg-primary-dark shadow-warm transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng Đặc Sản Mới</span>
          </button>
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
                  ? 'bg-primary text-surface shadow-xs font-bold'
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
            placeholder="Tìm món ngon, đặc sản, nhà vườn..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-warmBorder bg-surface text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-3xl border border-warmBorder text-ink-muted text-sm space-y-3">
          <ShoppingBag className="w-12 h-12 mx-auto text-ink-light" />
          <p className="font-medium">Chưa có sản phẩm nào trong danh mục này.</p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary text-surface text-xs font-bold hover:bg-primary-dark"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm sản phẩm đầu tiên</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-surface rounded-3xl border border-warmBorder overflow-hidden shadow-warm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* Product Image & Badges */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-paper">
                <img
                  src={
                    product.imageUrl ||
                    '/images/village/487122810_9667039056688974_8593141678606100657_n.jpg'
                  }
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface/95 backdrop-blur-xs text-primary font-bold text-[10px] uppercase shadow-xs">
                  {product.category === 'DacSan'
                    ? 'Đặc Sản'
                    : product.category === 'NongSan'
                    ? 'Nông Sản'
                    : product.category === 'ThuCong'
                    ? 'Thủ Công'
                    : 'Ẩm Thực'}
                </span>

                {/* Quick Edit / Delete Buttons for Admin / Moderator / User */}
                {(isAdmin || user) && (
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="p-1.5 rounded-full bg-surface/90 backdrop-blur-sm text-ink-muted hover:text-primary hover:bg-surface shadow-md transition-all"
                      title="Chỉnh sửa thông tin đặc sản"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="p-1.5 rounded-full bg-surface/90 backdrop-blur-sm text-red-500 hover:text-red-700 hover:bg-surface shadow-md transition-all"
                        title="Xóa đặc sản"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Product Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-primary font-bold text-base block">{product.price || 'Liên hệ'}</span>
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

      {/* --- MODAL THÊM / SỬA ĐẶC SẢN --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface rounded-3xl border border-warmBorder max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-warmBorder pb-3">
              <div className="space-y-0.5">
                <h3 className="font-bold text-lg text-ink">
                  {modalMode === 'create' ? 'Đăng Đặc Sản Lên Chợ Quê' : 'Chỉnh Sửa Thông Tin Đặc Sản'}
                </h3>
                <p className="text-xs text-ink-muted">
                  {modalMode === 'create'
                    ? 'Giới thiệu nông sản, đặc sản quê hương đến bà con và con em muôn phương.'
                    : 'Cập nhật giá cả, hình ảnh hoặc thông tin liên hệ nhà vườn.'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-3.5 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">
                  Tên sản phẩm / Đặc sản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="Ví dụ: Kẹo Cu Đơ Hà Tĩnh truyền thống, Cam Bù..."
                  className="w-full px-3.5 py-2 rounded-xl border border-warmBorder bg-paper text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Danh mục</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-warmBorder bg-paper text-sm outline-none focus:border-primary"
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
                    placeholder="Ví dụ: 50.000đ / kg, Liên hệ..."
                    className="w-full px-3.5 py-2 rounded-xl border border-warmBorder bg-paper text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ink uppercase">Mô tả sản phẩm</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Mô tả nguyên liệu, hương vị, tiêu chuẩn OCOP, cách đóng gói..."
                  className="w-full px-3.5 py-2 rounded-xl border border-warmBorder bg-paper text-sm resize-none outline-none focus:border-primary"
                />
              </div>

              {/* Hình ảnh sản phẩm (File upload hoặc URL) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-ink uppercase">Hình ảnh đặc sản</label>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-2 rounded-xl bg-paper hover:bg-primary-subtle text-primary border border-warmBorder text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingImage ? 'Đang tải ảnh...' : 'Chọn ảnh từ máy / điện thoại'}</span>
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="Hoặc dán đường dẫn ảnh (URL) tại đây..."
                  className="w-full px-3.5 py-2 rounded-xl border border-warmBorder bg-paper text-xs outline-none focus:border-primary"
                />

                {productForm.imageUrl && (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-warmBorder mt-1">
                    <img src={productForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">
                    Hộ sản xuất / Người bán
                  </label>
                  <input
                    type="text"
                    value={productForm.sellerName}
                    onChange={(e) => setProductForm({ ...productForm, sellerName: e.target.value })}
                    placeholder="Ví dụ: Nhà vườn Bác An"
                    className="w-full px-3.5 py-2 rounded-xl border border-warmBorder bg-paper text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.sellerPhone}
                    onChange={(e) => setProductForm({ ...productForm, sellerPhone: e.target.value })}
                    placeholder="0988123456"
                    className="w-full px-3.5 py-2 rounded-xl border border-warmBorder bg-paper text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Số Zalo</label>
                  <input
                    type="text"
                    value={productForm.sellerZalo}
                    onChange={(e) => setProductForm({ ...productForm, sellerZalo: e.target.value })}
                    placeholder="0988123456"
                    className="w-full px-3.5 py-2 rounded-xl border border-warmBorder bg-paper text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-ink uppercase">Địa chỉ tại làng</label>
                  <input
                    type="text"
                    value={productForm.address}
                    onChange={(e) => setProductForm({ ...productForm, address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-warmBorder bg-paper text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-warmBorder">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-warmBorder text-xs font-semibold text-ink hover:bg-paper"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-primary text-surface text-xs font-bold hover:bg-primary-dark shadow-sm disabled:opacity-50"
                >
                  {submitting
                    ? 'Đang Lưu...'
                    : modalMode === 'create'
                    ? 'Đăng Sản Phẩm'
                    : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
