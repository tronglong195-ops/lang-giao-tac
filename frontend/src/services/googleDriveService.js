/**
 * Dịch vụ xử lý và kết nối Thư mục Google Drive (Google Drive Folder) làm Album ảnh tự động.
 */

export const googleDriveService = {
  /**
   * Trích xuất Folder ID từ đường dẫn Google Drive
   * Ví dụ: https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ?usp=sharing -> 1aBcDeFgHiJkLmNoPqRsTuVwXyZ
   */
  extractFolderId: (input) => {
    if (!input) return '';
    const match = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
  },

  /**
   * Trích xuất File ID từ link ảnh Google Drive
   */
  extractFileId: (input) => {
    if (!input) return '';
    const match = input.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
  },

  /**
   * Chuyển đổi File ID thành URL ảnh trực tiếp
   */
  getDirectImageUrl: (fileId) => {
    if (!fileId) return '';
    const cleanId = googleDriveService.extractFileId(fileId);
    return `https://lh3.googleusercontent.com/d/${cleanId}`;
  },

  /**
   * Chuyển đổi Thư mục Google Drive thành Album ảnh (dùng danh sách link hoặc API)
   * @param {string} folderIdOrLinksText - Chuỗi link hoặc ID thư mục
   */
  parseDriveAlbumFromLinks: (title, textWithLinks) => {
    if (!textWithLinks) return null;

    // Tìm tất cả các link hoặc ID Google Drive trong văn bản
    const lines = textWithLinks.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const photos = [];

    lines.forEach((line, idx) => {
      const fileId = googleDriveService.extractFileId(line);
      if (fileId) {
        photos.push({
          id: `gdrive-photo-${idx + 1}`,
          title: `Ảnh ${idx + 1} - ${title || 'Làng Giao Tác'}`,
          url: `https://lh3.googleusercontent.com/d/${fileId}`,
          thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`,
        });
      }
    });

    return {
      title: title || 'Album Ảnh Từ Google Drive',
      photos,
      photoCount: photos.length,
      coverUrl: photos[0]?.url || '',
      fromGoogleDrive: true,
    };
  },
};
