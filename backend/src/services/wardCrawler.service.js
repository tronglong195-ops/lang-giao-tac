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

// In-memory cache cho live ward news
let cachedArticles = [];
let lastCacheTime = 0;
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 phút

/**
 * Cào dữ liệu bài viết từ Cổng thông tin điện tử Phường Nam Hồng Lĩnh
 * Hỗ trợ quét nhiều trang (page 1 đến page 7)
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
        const imageUrl = rawImg
          ? `https://namhonglinh.hatinh.gov.vn${rawImg}`
          : '/images/village/484215892_9601885749870972_6761004858315934829_n.jpg';
        const summary = contentMatch
          ? decodeHtmlEntities(contentMatch[1].replace(/<[^>]*>?/gm, ''))
          : 'Tin tức sự kiện chính thức công bố tại Phường Nam Hồng Lĩnh, thị xã Hồng Lĩnh, tỉnh Hà Tĩnh.';
        const timeStr = timeMatch
          ? decodeHtmlEntities(timeMatch[1].replace(/<[^>]*>?/gm, ''))
          : 'Tháng 8/2026';

        articles.push({
          title,
          originalUrl,
          imageUrl,
          summary,
          timeStr,
          source: 'Cổng TTĐT Phường Nam Hồng Lĩnh',
          page,
        });
      }
    }

    return articles;
  } catch (error) {
    console.error(`[WardCrawler] Lỗi cào tin trang ${page}:`, error.message);
    return [];
  }
}

/**
 * Cào toàn bộ các bài viết qua nhiều trang và lưu bộ nhớ đệm
 */
async function getAllWardArticles(maxPages = 4, forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedArticles.length > 0 && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedArticles;
  }

  const all = [];
  for (let p = 1; p <= maxPages; p++) {
    const pageArticles = await scrapeWardNewsPage(p);
    for (const art of pageArticles) {
      if (!all.some((x) => x.originalUrl === art.originalUrl || x.title === art.title)) {
        all.push(art);
      }
    }
  }

  if (all.length > 0) {
    cachedArticles = all;
    lastCacheTime = now;
  }

  return cachedArticles;
}

/**
 * Cào nội dung chi tiết bài viết (Full HTML, hình ảnh, trích đoạn)
 */
async function scrapeArticleDetail(articleUrl) {
  try {
    const res = await fetch(articleUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
    });

    if (!res.ok) return null;
    const html = await res.text();

    const titleMatch =
      html.match(/<h1[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
      html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
      html.match(/<title>([\s\S]*?)<\/title>/i);

    const timeMatch = html.match(/<span[^>]*class="[^"]*time[^"]*"[^>]*>([\s\S]*?)<\/span>/i);

    const bodyMatch =
      html.match(/<div class="content-detail[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
      html.match(/<div class="detail-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

    let contentHtml = bodyMatch ? bodyMatch[1] : '';

    // Chuẩn hóa tất cả đường dẫn ảnh relative thành absolute
    contentHtml = contentHtml.replace(
      /src=["'](\/namhonglinh\/[^"']+)["']/gi,
      'src="https://namhonglinh.hatinh.gov.vn$1"'
    );

    const firstImgMatch = contentHtml.match(
      /src=["'](https:\/\/namhonglinh\.hatinh\.gov\.vn\/[^"']+)["']/i
    );
    const coverImage = firstImgMatch ? firstImgMatch[1] : '';

    return {
      title: titleMatch ? decodeHtmlEntities(titleMatch[1].replace(/<[^>]+>/g, '')) : '',
      timeStr: timeMatch ? decodeHtmlEntities(timeMatch[1].replace(/<[^>]+>/g, '')) : 'Tháng 8/2026',
      contentHtml: decodeHtmlEntities(contentHtml),
      coverImage,
      originalUrl: articleUrl,
      source: 'Cổng Thông Tin Điện Tử Phường Nam Hồng Lĩnh',
    };
  } catch (err) {
    console.warn(`[WardCrawler] Không thể tải chi tiết bài viết ${articleUrl}:`, err.message);
    return null;
  }
}

/**
 * Đồng bộ bài viết từ Cổng TTĐT Phường Nam Hồng Lĩnh vào cơ sở dữ liệu
 */
async function syncWardNews(options = {}) {
  const maxPages = options.maxPages || 4;
  console.log(`[WardCrawler] Bắt đầu đồng bộ tin tức Phường Nam Hồng Lĩnh (tối đa ${maxPages} trang)...`);

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

  const articles = await getAllWardArticles(maxPages, true);
  let totalSaved = 0;
  const syncedArticles = [];

  for (const item of articles) {
    try {
      const slug = createSlug(item.title);

      const existing = await prisma.news.findFirst({
        where: {
          OR: [{ slug }, { title: item.title }],
        },
      });

      // Tạo cấu trúc bài viết chuẩn mực, đẹp mắt, có ảnh lớn và dẫn nguồn gốc
      const contentHtml = `
        <div class="ward-news-article space-y-6">
          <div class="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-xs text-red-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div class="space-y-0.5">
              <div class="font-bold text-red-900 flex items-center space-x-1.5">
                <span>🏛️ NGUỒN CHÍNH THỐNG: CỔNG THÔNG TIN ĐIỆN TỬ PHƯỜNG NAM HỒNG LĨNH</span>
              </div>
              <p class="text-stone-600 text-[11px]">
                Thời gian công bố: <strong>${item.timeStr || 'Tháng 8/2026'}</strong> | Thị xã Hồng Lĩnh, Hà Tĩnh
              </p>
            </div>
            <a href="${item.originalUrl}" target="_blank" rel="noopener noreferrer" class="shrink-0 px-3.5 py-1.5 rounded-xl bg-red-900 hover:bg-red-800 text-yellow-200 font-bold text-xs shadow-xs transition-colors flex items-center space-x-1">
              <span>Xem Bài Gốc ↗</span>
            </a>
          </div>

          ${
            item.imageUrl
              ? `<div class="rounded-2xl overflow-hidden shadow-warm border border-stone-200 max-h-[460px] bg-stone-100"><img src="${item.imageUrl}" alt="${item.title}" class="w-full h-full object-cover" /></div>`
              : ''
          }

          <div class="lead p-4 bg-amber-50/60 rounded-xl border-l-4 border-red-800 text-stone-800 font-medium text-sm sm:text-base leading-relaxed">
            ${item.summary}
          </div>

          <div class="text-stone-700 leading-relaxed space-y-4 text-sm sm:text-base">
            <p>
              Bản tin chính thức được phát hành và thông tin rộng rãi đến toàn thể bà con nhân dân tại các Tổ dân phố trên địa bàn Phường Nam Hồng Lĩnh và Làng Giao Tác (TDP 9).
            </p>
            <p>
              Để tra cứu văn bản gốc, các quyết định chỉ đạo và hồ sơ liên quan, bà con có thể truy cập trực tiếp bài viết gốc trên Cổng thông tin điện tử Phường Nam Hồng Lĩnh tại địa chỉ: 
              <a href="${item.originalUrl}" target="_blank" rel="noopener noreferrer" class="text-red-900 font-bold underline break-all">${item.originalUrl}</a>.
            </p>
          </div>
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

  console.log(`[WardCrawler] Hoàn tất: Tìm thấy ${articles.length} bài, lưu mới/cập nhật ${totalSaved} bài.`);
  return {
    success: true,
    totalCrawled: articles.length,
    totalSaved,
    syncedArticles,
    message: `Đã đồng bộ thành công ${articles.length} bài viết từ Cổng TTĐT Phường Nam Hồng Lĩnh!`,
  };
}

module.exports = {
  scrapeWardNewsPage,
  getAllWardArticles,
  scrapeArticleDetail,
  syncWardNews,
};
