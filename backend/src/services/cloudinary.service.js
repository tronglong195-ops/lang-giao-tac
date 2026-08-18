const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary nếu có ENV, nếu không sẽ dùng fallback thông minh
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Upload ảnh lên Cloudinary hoặc xử lý Base64 an toàn
 * @param {string} fileStr - Base64 data URL hoặc đường dẫn file
 * @param {string} folder - Thư mục lưu trữ (vd: 'giaotac_posts', 'giaotac_albums')
 */
const uploadImage = async (fileStr, folder = 'lang_giao_tac') => {
  if (!fileStr) return null;

  // Nếu là URL đã hosted sẵn (https://...)
  if (fileStr.startsWith('http://') || fileStr.startsWith('https://')) {
    return fileStr;
  }

  // Nếu đã cấu hình Cloudinary API Key
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }, // Tự động WebP / AVIF
          { width: 1600, crop: 'limit' }, // Giới hạn chiều rộng tối đa 1600px
        ],
      });
      return uploadResponse.secure_url;
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên Cloudinary:', error.message);
      return fileStr;
    }
  }

  return fileStr;
};

module.exports = {
  uploadImage,
};
