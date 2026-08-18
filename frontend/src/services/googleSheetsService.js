/**
 * Dịch vụ đọc dữ liệu trực tiếp từ Google Sheets qua Google Visualization API.
 * Ưu điểm:
 * - Hoàn toàn MIỄN PHÍ, không cần đăng ký API Key hay thẻ tín dụng.
 * - Chỉ cần file Google Sheets được bật chế độ: "Bất kỳ ai có đường liên kết đều có thể xem".
 * - Tự động trích xuất tiêu đề cột và chuyển thành mảng JSON đối tượng.
 */

export const googleSheetsService = {
  /**
   * Trích xuất Sheet ID từ đường dẫn Google Sheets
   * Ví dụ: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit -> 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   */
  extractSheetId: (input) => {
    if (!input) return '';
    const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
  },

  /**
   * Lấy dữ liệu từ một trang tính Google Sheets
   * @param {string} sheetId - ID của file Google Sheets
   * @param {string} sheetName - Tên sheet (ví dụ: 'TinTuc', 'QuyKhuyenHoc', 'DanhBa')
   */
  fetchSheetData: async (sheetId, sheetName = '') => {
    const cleanId = googleSheetsService.extractSheetId(sheetId);
    if (!cleanId) return [];

    let url = `https://docs.google.com/spreadsheets/d/${cleanId}/gviz/tq?tqx=out:json`;
    if (sheetName) {
      url += `&sheet=${encodeURIComponent(sheetName)}`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Lỗi kết nối Google Sheets: ${res.statusText}`);

      const text = await res.text();
      // Google Visualization trả về dạng: /*O_o*/ google.visualization.Query.setResponse({...});
      const jsonString = text.replace(/^[/*\sO_o]*google\.visualization\.Query\.setResponse\(/, '').replace(/\);?\s*$/, '');
      const data = JSON.parse(jsonString);

      if (!data.table || !data.table.rows) return [];

      // Lấy danh sách tên cột từ dòng tiêu đề (cols)
      const cols = data.table.cols.map((col, idx) => col.label || `col_${idx}`);

      // Chuyển đổi các dòng thành danh sách đối tượng JSON
      const rows = data.table.rows.map((row, rowIndex) => {
        const item = { id: `gsheet-${rowIndex + 1}` };
        row.c.forEach((cell, cellIdx) => {
          const colName = cols[cellIdx] || `col_${cellIdx}`;
          item[colName] = cell ? cell.v : '';
        });
        return item;
      });

      return rows;
    } catch (error) {
      console.error(`Lỗi đọc dữ liệu Google Sheet (${sheetName}):`, error);
      return [];
    }
  },

  /**
   * Đọc danh sách Tin tức từ Google Sheets
   * Cột mong đợi: TieuDe, TomTat, NoiDung, AnhBia, TacGia, NgayDang, Nguon
   */
  fetchNews: async (sheetId) => {
    const rows = await googleSheetsService.fetchSheetData(sheetId, 'TinTuc');
    return rows.map((r, i) => ({
      id: r.id || `news-gsheet-${i}`,
      title: r.TieuDe || r.title || 'Thông báo từ Ban Quản Lý',
      slug: (r.TieuDe || `tin-tuc-${i}`).toLowerCase().replace(/[^a-z0-9]/g, '-'),
      summary: r.TomTat || r.summary || '',
      content: r.NoiDung || r.content || '',
      coverImage: r.AnhBia || r.imageUrl || '',
      author: r.TacGia || 'Ban Cán sự TDP 9',
      source: r.Nguon || 'Làng Giao Tác',
      publishedAt: r.NgayDang || new Date().toISOString(),
      isOfficial: true,
      fromGoogleSheets: true,
    }));
  },

  /**
   * Đọc danh sách Đóng góp Quỹ từ Google Sheets
   * Cột mong đợi: NguoiUngHo, DongHo, SoTien, LoiChuc, NgayUngHo, MaGiaoDich
   */
  fetchDonations: async (sheetId) => {
    const rows = await googleSheetsService.fetchSheetData(sheetId, 'QuyQueHuong');
    return rows.map((r, i) => ({
      id: r.id || `donation-gsheet-${i}`,
      donorName: r.NguoiUngHo || r.donorName || 'Nhà hảo tâm',
      donorClan: r.DongHo || r.clan || 'Con em quê hương',
      amount: Number(r.SoTien || r.amount || 0),
      message: r.LoiChuc || r.message || '',
      donatedAt: r.NgayUngHo || new Date().toISOString(),
      txCode: r.MaGiaoDich || `TX-${i + 1}`,
      fromGoogleSheets: true,
    }));
  },

  /**
   * Đọc danh bạ Hội đồng hương từ Google Sheets
   * Cột mong đợi: HoVaTen, DongHo, NoiO, SoDienThoai, NgheNghiep, GhiChu
   */
  fetchDirectory: async (sheetId) => {
    const rows = await googleSheetsService.fetchSheetData(sheetId, 'DanhBa');
    return rows.map((r, i) => ({
      id: r.id || `dir-gsheet-${i}`,
      fullName: r.HoVaTen || r.fullName || 'Thành viên',
      clan: r.DongHo || 'Chưa cập nhật',
      currentLocation: r.NoiO || 'Hà Nội',
      phone: r.SoDienThoai || '',
      occupation: r.NgheNghiep || '',
      note: r.GhiChu || '',
      fromGoogleSheets: true,
    }));
  },

  /**
   * Gửi dữ liệu bài viết mới, tin tức, đóng góp quỹ ngược lên Google Sheets qua Webhook (Google Apps Script)
   * @param {string} webhookUrl - URL Web App của Google Apps Script
   * @param {object} payload - Dữ liệu cần ghi
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
      console.error('Lỗi khi gửi dữ liệu lên Google Sheets Webhook:', err);
      return false;
    }
  },
};
