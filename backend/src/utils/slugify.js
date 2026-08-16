const slugifyLib = require('slugify');

/**
 * Chuyển đổi chuỗi tiếng Việt có dấu thành slug URL thân thiện
 * @param {string} text 
 * @param {boolean} appendRandom 
 * @returns {string}
 */
const createSlug = (text, appendRandom = true) => {
  if (!text) return '';

  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');

  let slug = slugifyLib(normalized, {
    lower: true,
    strict: true,
    trim: true,
  });

  if (appendRandom) {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    slug = `${slug}-${randomSuffix}`;
  }

  return slug;
};

module.exports = {
  createSlug,
};
