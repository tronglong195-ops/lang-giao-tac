/**
 * Chuyển đổi linh hoạt các định dạng URL hình ảnh,
 * đặc biệt tự động nhận diện và chuyển đổi liên kết Google Drive sang dạng ảnh trực tiếp (Direct Embed).
 *
 * @param {string} url - Đường dẫn ảnh (Google Drive, Cloudinary, Local, hoặc Web URL)
 * @param {number} size - Kích thước ảnh tối đa mong muốn (mặc định 1600px)
 * @returns {string} URL ảnh trực tiếp hiển thị mượt mà trên website
 */
export const getDirectImageUrl = (url, size = 1600) => {
  if (!url) return '';

  // 1. Kiểm tra nếu là link Google Drive
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    // Trích xuất ID tệp từ URL Google Drive
    // Các dạng link phổ biến:
    // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // https://drive.google.com/open?id=FILE_ID
    // https://drive.google.com/uc?id=FILE_ID
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      // Định dạng CDN siêu tốc của Google User Content (không bị giới hạn băng thông)
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  // 2. Nếu là URL bình thường hoặc Cloudinary hoặc đường dẫn nội bộ (/images/...)
  return url;
};
