/**
 * Dịch vụ đọc dữ liệu trực tiếp từ Google Sheets qua Google Visualization API.
 * Cơ chế thông minh, tự động nhận diện tiếng Việt có dấu/không dấu và thứ tự cột.
 */

// Hàm loại bỏ dấu tiếng Việt để so sánh tên cột dễ dàng
const removeVietnameseTones = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};

export const googleSheetsService = {
  extractSheetId: (input) => {
    if (!input) return '';
    const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
  },

  /**
   * Đọc dữ liệu thô từ Google Sheets
   */
  fetchSheetData: async (sheetId, sheetName = '') => {
    const cleanId = googleSheetsService.extractSheetId(sheetId);
    if (!cleanId) return [];

    // Các biến thể tên sheet có thể có
    const sheetVariations = sheetName
      ? [sheetName, sheetName.toLowerCase(), 'TinTuc', 'Tin tức', 'Sheet1', '']
      : [''];

    for (const name of sheetVariations) {
      let url = `https://docs.google.com/spreadsheets/d/${cleanId}/gviz/tq?tqx=out:json`;
      if (name) {
        url += `&sheet=${encodeURIComponent(name)}`;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) continue;

        const text = await res.text();
        // Bóc tách JSON từ hàm query callback của Google
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
        if (!jsonMatch || !jsonMatch[1]) continue;

        const data = JSON.parse(jsonMatch[1]);
        if (!data.table || !data.table.rows || data.table.rows.length === 0) continue;

        // Lấy danh sách tên cột
        const cols = data.table.cols.map((col, idx) => ({
          raw: col.label || `col_${idx}`,
          normalized: removeVietnameseTones(col.label || `col_${idx}`).replace(/[^a-z0-9]/g, ''),
          index: idx,
        }));

        // Chuyển đổi các dòng thành danh sách đối tượng
        const rows = data.table.rows.map((row, rowIndex) => {
          const item = { _rowIndex: rowIndex + 1 };
          if (row.c) {
            row.c.forEach((cell, cellIdx) => {
              const colInfo = cols[cellIdx] || { normalized: `col_${cellIdx}`, raw: `col_${cellIdx}` };
              const cellValue = cell ? (cell.f !== undefined ? cell.f : cell.v) : '';
              item[colInfo.normalized] = cellValue;
              item[colInfo.raw] = cellValue;
              item[`col_${cellIdx}`] = cellValue;
            });
          }
          return item;
        });

        if (rows.length > 0) {
          return rows;
        }
      } catch (err) {
        // Thử tiếp biến thể tên sheet tiếp theo
        continue;
      }
    }

    return [];
  },

  /**
   * Đọc danh sách Tin tức từ Google Sheets
   */
  fetchNews: async (sheetId) => {
    const rows = await googleSheetsService.fetchSheetData(sheetId, 'TinTuc');
    if (!rows || rows.length === 0) return [];

    const newsList = rows
      .map((r, i) => {
        // Tìm giá trị Tiêu đề linh hoạt
        const title =
          r.tieude || r.title || r.tenbaiviet || r.ten || r['Tiêu đề'] || r.col_0 || '';
        if (!title || String(title).trim().length === 0) return null;

        const summary =
          r.tomtat || r.summary || r.mota || r['Tóm tắt'] || r.col_1 || '';
        const content =
          r.noidung || r.content || r.chitiet || r['Nội dung'] || r.col_2 || summary || title;
        const rawImage =
          r.anhbia || r.anh || r.image || r.hinh || r.hinhanh || r['Ảnh bìa'] || r.col_3 || '';
        const author =
          r.tacgia || r.author || r.nguoidang || r['Tác giả'] || r.col_4 || 'Ban Cán sự TDP 9';
        const date =
          r.ngaydang || r.ngay || r.date || r['Ngày đăng'] || r.col_5 || new Date().toLocaleDateString('vi-VN');

        // Định dạng URL ảnh nếu là Google Drive
        let coverImage = rawImage;
        if (rawImage && (rawImage.includes('drive.google.com') || rawImage.includes('docs.google.com'))) {
          const match = rawImage.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || rawImage.match(/[?&]id=([a-zA-Z0-9_-]+)/);
          if (match && match[1]) {
            coverImage = `https://lh3.googleusercontent.com/d/${match[1]}`;
          }
        }

        const slug = `gsheet-news-${i + 1}-${title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 50)}`;

        return {
          id: `gsheet-news-${i + 1}`,
          title: String(title).trim(),
          slug,
          summary: String(summary).trim(),
          contentHtml: String(content).trim(),
          coverImageUrl: coverImage || '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg',
          author: { fullName: String(author).trim() },
          source: 'Google Sheets (Tự động)',
          publishedAt: date,
          isOfficial: true,
          fromGoogleSheets: true,
        };
      })
      .filter(Boolean);

    // Lưu vào bộ nhớ tạm thời của trình duyệt để trang chi tiết bài viết có thể mở được
    if (newsList.length > 0) {
      try {
        sessionStorage.setItem('giaotac_gsheet_news_cache', JSON.stringify(newsList));
      } catch (e) {}
    }

    return newsList;
  },

  /**
   * Đọc danh sách Đóng góp Quỹ từ Google Sheets
   */
  fetchDonations: async (sheetId) => {
    const rows = await googleSheetsService.fetchSheetData(sheetId, 'QuyQueHuong');
    if (!rows || rows.length === 0) return [];

    return rows
      .map((r, i) => {
        const donorName =
          r.nguoiungho || r.donorname || r.ten || r['Người ủng hộ'] || r.col_0 || '';
        if (!donorName) return null;

        const donorClan =
          r.dongho || r.clan || r.noio || r['Dòng họ'] || r.col_1 || 'Con em quê hương';
        const amount = Number(
          String(r.sotien || r.amount || r['Số tiền'] || r.col_2 || '0').replace(/[^0-9]/g, '')
        );
        const message =
          r.loichuc || r.message || r.noidung || r['Lời chúc'] || r.col_3 || '';
        const date =
          r.ngayungho || r.date || r['Ngày ủng hộ'] || r.col_4 || new Date().toISOString();

        return {
          id: `donation-gsheet-${i + 1}`,
          donorName: String(donorName).trim(),
          donorClan: String(donorClan).trim(),
          amount: amount || 0,
          message: String(message).trim(),
          donatedAt: date,
          txCode: `GS-${i + 1}`,
          fromGoogleSheets: true,
        };
      })
      .filter(Boolean);
  },

  /**
   * Gửi dữ liệu bài viết mới ngược lên Google Sheets qua Webhook
   */
  sendToWebhook: async (webhookUrl, payload) => {
    if (!webhookUrl || !webhookUrl.trim()) return false;
    try {
      await fetch(webhookUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString(),
        }),
      });
      return true;
    } catch (err) {
      console.error('Lỗi gửi Webhook Google Apps Script:', err);
      return false;
    }
  },
};
