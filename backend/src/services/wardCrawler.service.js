const prisma = require('../config/db');
const { createSlug } = require('../utils/slugify');

/**
 * Giải mã các ký tự HTML Entity tiếng Việt (ví dụ: &#x1EE9;, &quot;, &amp;...)
 */
function decodeHtmlEntities(text) {
  if (!text) return '';
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/**
 * Cào dữ liệu bài viết từ Cổng thông tin điện tử Phường Nam Hồng Lĩnh
 * URL: https://namhonglinh.hatinh.gov.vn/vi/chuyen-muc/tin-tuc---su-kien
 */
async function scrapeWardNewsPage(page = 1) {
  const targetUrl =
    page > 1
      ? `https://namhonglinh.hatinh.gov.vn/vi/chuyen-muc/tin-tuc---su-kien?page=${page}`
      : `https://namhonglinh.hatinh.gov.vn/vi/chuyen-muc/tin-tuc---su-kien`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      console.warn(`[WardCrawler] Không thể kết nối tới trang phường (HTTP ${response.status})`);
      return [];
    }

    const html = await response.text();
    const articles = [];

    // Tách các khối bài viết bằng class item hoặc post-item hoặc post-show
    const itemBlocks = html.split(/class=["'](?:post-item|item|post-show)/i);

    for (let i = 1; i < itemBlocks.length; i++) {
      const block = itemBlocks[i];

      // Bóc tách link bài viết
      const linkMatch = block.match(/href=["'](\/vi\/bai-viet\/[^"']+)["']/i);
      // Bóc tách ảnh đại diện
      const imgMatch = block.match(/src=["'](\/namhonglinh\/Others\/[^"']+)["']/i);
      // Bóc tách tiêu đề
      const titleMatch =
        block.match(/<h4[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h4>/i) ||
        block.match(/alt=["']([^"']+)["']/i);
      // Bóc tách đoạn tóm tắt
      const contentMatch = block.match(/<p\s+class=["']content[^"']*["']>([\s\S]*?)<\/p>/i);
      // Bóc tách thời gian đăng
      const timeMatch = block.match(/<span\s+class=["']info-post-times["'][^>]*>([\s\S]*?)<\/span>/i);

      if (linkMatch && titleMatch) {
        const relativeUrl = linkMatch[1];
        const originalUrl = `https://namhonglinh.hatinh.gov.vn${relativeUrl}`;
        const rawTitle = titleMatch[1].replace(/<[^>]*>?/gm, '');
        const title = decodeHtmlEntities(rawTitle);

        if (!title || title.length < 5) continue;

        // Tránh trùng lặp trong cùng 1 trang
        if (articles.some((a) => a.originalUrl === originalUrl || a.title === title)) {
          continue;
        }

        const rawImg = imgMatch ? imgMatch[1] : '';
        const imageUrl = rawImg ? `https://namhonglinh.hatinh.gov.vn${rawImg}` : '';
        const summary = contentMatch
          ? decodeHtmlEntities(contentMatch[1].replace(/<[^>]*>?/gm, ''))
          : '';
        const timeStr = timeMatch
          ? decodeHtmlEntities(timeMatch[1].replace(/<[^>]*>?/gm, ''))
          : '';

        articles.push({
          title,
          originalUrl,
          imageUrl,
          summary,
          timeStr,
        });
      }
    }

    return articles;
  } catch (error) {
    console.error('[WardCrawler] Lỗi cào tin tức trang phường:', error.message);
    return [];
  }
}

/**
 * Đồng bộ bài viết từ Cổng TTĐT Phường Nam Hồng Lĩnh vào cơ sở dữ liệu
 */
async function syncWardNews(options = {}) {
  const maxPages = options.maxPages || 2;
  console.log(`[WardCrawler] Bắt đầu đồng bộ tin tức Phường Nam Hồng Lĩnh (tối đa ${maxPages} trang)...`);

  // Tìm tài khoản Admin hoặc Ban cán sự để gán tác giả
  let author = await prisma.user.findFirst({
    where: { role: 'admin' },
  });

  if (!author) {
    author = await prisma.user.findFirst();
  }

  if (!author) {
    console.warn('[WardCrawler] Chưa có tài khoản trong DB để gán tác giả.');
    return { success: false, message: 'Chưa có tài khoản admin.' };
  }

  let totalCrawled = 0;
  let totalSaved = 0;
  const syncedArticles = [];

  for (let p = 1; p <= maxPages; p++) {
    const articles = await scrapeWardNewsPage(p);
    totalCrawled += articles.length;

    for (const item of articles) {
      try {
        const slug = createSlug(item.title);

        // Kiểm tra xem bài viết đã tồn tại chưa
        const existing = await prisma.news.findFirst({
          where: {
            OR: [{ slug }, { title: item.title }],
          },
        });

        // Tạo nội dung HTML hoàn chỉnh có ảnh, trích dẫn và link nguồn chính thức
        const contentHtml = `
          <div class="ward-news-article">
            ${
              item.imageUrl
                ? `<div class="mb-4 text-center"><img src="${item.imageUrl}" alt="${item.title}" class="rounded-xl shadow-md max-h-96 mx-auto object-cover" /></div>`
                : ''
            }
            ${item.summary ? `<p class="lead font-medium text-stone-700 italic mb-4">${item.summary}</p>` : ''}
            <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-4 flex items-center justify-between">
              <div>
                <strong>Nguồn trích dẫn:</strong> Cổng Thông Tin Điện Tử Phường Nam Hồng Lĩnh (Hà Tĩnh)<br />
                <strong>Thời gian công bố:</strong> Tháng 8/2026
              </div>
              <a href="${item.originalUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-red-800 text-yellow-200 font-bold text-xs hover:bg-red-900">
                Xem Bài Gốc ↗
              </a>
            </div>
            <p class="text-sm text-stone-600 leading-relaxed">
              Bản tin sự kiện chính thức được phát hành và thông tin rộng rãi đến toàn thể bà con nhân dân tại các Tổ dân phố trên địa bàn Phường Nam Hồng Lĩnh và Làng Giao Tác.
            </p>
          </div>
        `;

        if (!existing) {
          const created = await prisma.news.create({
            data: {
              authorId: author.id,
              title: item.title,
              slug,
              contentHtml,
              source: 'Cổng TTĐT Phường Nam Hồng Lĩnh',
              isOfficial: true,
              publishedAt: new Date(),
            },
          });
          totalSaved++;
          syncedArticles.push(created);
        } else {
          // Cập nhật nội dung và nguồn nếu bài cũ chưa có
          await prisma.news.update({
            where: { id: existing.id },
            data: {
              contentHtml,
              source: 'Cổng TTĐT Phường Nam Hồng Lĩnh',
            },
          });
        }
      } catch (err) {
        console.warn(`[WardCrawler] Bỏ qua bài viết "${item.title}":`, err.message);
      }
    }
  }

  console.log(`[WardCrawler] Hoàn tất: Cào được ${totalCrawled} bài, lưu mới ${totalSaved} bài.`);
  return {
    success: true,
    totalCrawled,
    totalSaved,
    syncedArticles,
    message: `Đã đồng bộ thành công ${totalSaved} bài viết mới từ Cổng TTĐT Phường Nam Hồng Lĩnh.`,
  };
}

module.exports = {
  scrapeWardNewsPage,
  syncWardNews,
};
