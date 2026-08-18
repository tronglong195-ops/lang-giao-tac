const { uploadImage } = require('../../services/cloudinary.service');

const uploadSingleImage = async (req, res, next) => {
  try {
    const { image, folder } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp dữ liệu hình ảnh (Base64 hoặc URL).' });
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
