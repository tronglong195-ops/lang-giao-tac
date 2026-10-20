/**
 * NẠP BÀI TIN TỨC LÊN CLOUD FIRESTORE (collection "news")
 *
 * Vì firestore.rules chỉ cho phép Admin/Moderator ghi vào "news", script dùng
 * Firebase Admin SDK với khóa Service Account (bỏ qua rules, chỉ chạy trên máy quản trị).
 *
 * Chuẩn bị (làm 1 lần):
 *   1. Firebase Console → Project settings → Service accounts → "Generate new private key"
 *   2. Lưu file tải về thành:  frontend/scripts/serviceAccountKey.json
 *      (file này đã nằm trong .gitignore — TUYỆT ĐỐI không commit lên GitHub)
 *
 * Chạy (trong thư mục frontend):
 *   npm run seed:tin-tuc            → nạp / cập nhật bài
 *   npm run seed:tin-tuc -- --dry   → chỉ kiểm tra dữ liệu, không ghi gì
 *   node scripts/seedTinTucBaiViet.mjs --key D:\keys\lang-giao-tac.json
 *
 * Chạy lại nhiều lần an toàn: mỗi bài ghi theo id cố định (merge), không sinh bài trùng.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tinTucBaiViet } from './data/tinTucBaiViet-2026-10.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry') || args.includes('--dry-run');
const keyArgIdx = args.indexOf('--key');
const keyPath = resolve(
  keyArgIdx >= 0 && args[keyArgIdx + 1]
    ? args[keyArgIdx + 1]
    : process.env.GOOGLE_APPLICATION_CREDENTIALS || resolve(__dirname, 'serviceAccountKey.json')
);

// ---------- 1. Kiểm tra dữ liệu ----------
function validate(list) {
  const errors = [];
  const ids = new Set();
  const slugs = new Set();
  for (const a of list) {
    const tag = a.id || a.title || '(không có id)';
    for (const f of ['id', 'slug', 'title', 'summary', 'contentHtml', 'source', 'publishedAt', 'sourceUrl']) {
      if (!a[f]) errors.push(`[${tag}] thiếu trường "${f}"`);
    }
    if (ids.has(a.id)) errors.push(`[${tag}] trùng id`);
    if (slugs.has(a.slug)) errors.push(`[${tag}] trùng slug`);
    ids.add(a.id);
    slugs.add(a.slug);
    if (!/^[a-z0-9-]+$/.test(a.slug || '')) errors.push(`[${tag}] slug chỉ được chứa a-z, 0-9, dấu "-"`);
    if (Number.isNaN(Date.parse(a.publishedAt))) errors.push(`[${tag}] publishedAt không hợp lệ`);
    if (a.originalUrl) errors.push(`[${tag}] không đặt originalUrl (sẽ bị coi là bài cào từ Cổng phường)`);
  }
  return errors;
}

const errors = validate(tinTucBaiViet);
if (errors.length) {
  console.error('❌ Dữ liệu bài viết có lỗi:\n  - ' + errors.join('\n  - '));
  process.exit(1);
}
console.log(`✅ Dữ liệu hợp lệ: ${tinTucBaiViet.length} bài viết.`);

if (isDryRun) {
  for (const a of tinTucBaiViet) {
    console.log(`  • [${a.timeStr}] ${a.title}\n      /tin-tuc/${a.slug}`);
  }
  console.log('ℹ️  Chế độ --dry: không ghi lên Firestore.');
  process.exit(0);
}

// ---------- 2. Ghi lên Firestore ----------
if (!existsSync(keyPath)) {
  console.error(
    `❌ Không tìm thấy khóa Service Account tại:\n   ${keyPath}\n` +
      '   Tải khóa tại Firebase Console → Project settings → Service accounts → Generate new private key,\n' +
      '   lưu thành frontend/scripts/serviceAccountKey.json rồi chạy lại.'
  );
  process.exit(1);
}

const { initializeApp, cert } = await import('firebase-admin/app');
const { getFirestore } = await import('firebase-admin/firestore');

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

console.log(`📡 Đang nạp vào project "${serviceAccount.project_id}" → collection "news"...`);

const batch = db.batch();
for (const a of tinTucBaiViet) {
  batch.set(db.collection('news').doc(a.id), { ...a, updatedAt: new Date().toISOString() }, { merge: true });
}
await batch.commit();

for (const a of tinTucBaiViet) console.log(`  ✓ ${a.title}`);
console.log(`\n🎉 Đã nạp ${tinTucBaiViet.length} bài. Xem tại: https://lang-giao-tac-tdp9.web.app/tin-tuc`);
process.exit(0);
