/**
 * Slug Generation Utility
 * Converts title strings to URL-safe slugs
 * SNBT AI - Competition
 */

/**
 * Generate URL-safe slug from title
 * @param {string} title - Original title
 * @returns {string} - URL-safe slug
 */
export const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Generate unique slug by checking against existing slugs
 * @param {string} title - Original title
 * @param {Function} checkExists - Async function to check if slug exists
 * @returns {Promise<string>} - Unique slug
 */
export const generateUniqueSlug = async (title, checkExists) => {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

export default { generateSlug, generateUniqueSlug };
