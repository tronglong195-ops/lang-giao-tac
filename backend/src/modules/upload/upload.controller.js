const { uploadImage } = require('../../services/cloudinary.service');

const isValidImageData = (str) => {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed.startsWith('data:')) {
    // Phải là data:image/...
    return /^data:image\/(jpeg|jpg|png|webp|gif|svg\+xml);base64,/i.test(trimmed);
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/images/')) {
    return true;
  }
  return false;
};

const uploadSingleImage = async (req, res, next) => {
  try {
    const { image, folder } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp dữ liệu hình ảnh.' });
    }

    if (!isValidImageData(image)) {
      return res.status(400).json({
        success: false,
        message: 'Định dạng file không hợp lệ. Chỉ chấp nhận hình ảnh (JPEG, PNG, WebP, GIF).',
      });
    }

    // Giới hạn dung lượng chuỗi Base64 ~10MB
    if (image.length > 15 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Kích thước hình ảnh vượt quá giới hạn cho phép (tối đa 10MB).',
      });
    }

    const imageUrl = await uploadImage(image, folder || 'giaotac_uploads');
    return res.status(200).json({
      success: true,
      message: 'Tải ảnh lên thành công.',
      data: { imageUrl },
    });
  } catch (error) {
    next(error);
  }
};

const uploadBatchImages = async (req, res, next) => {
  try {
    const { images, folder } = req.body;
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp danh sách hình ảnh.' });
    }

    // Kiểm tra từng ảnh trong mảng
    for (const img of images) {
      if (!isValidImageData(img)) {
        return res.status(400).json({
          success: false,
          message: 'Một hoặc nhiều file trong danh sách không phải định dạng hình ảnh hợp lệ.',
        });
      }
    }

    const { uploadImage } = require('../../services/cloudinary.service');
    const uploadPromises = images.map((img) => uploadImage(img, folder || 'giaotac_albums'));
    const urls = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      message: `Đã xử lý tải lên ${urls.length} ảnh thành công.`,
      data: { imageUrls: urls },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadSingleImage,
  uploadBatchImages,
};
