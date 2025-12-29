/**
 * Text processing utilities
 */

/**
 * Strips HTML tags from content to get plain text
 * Removes script tags, style tags, and all HTML tags
 * @param {string} content - HTML content
 * @returns {string} Plain text content
 */
export function stripHtmlTags(content) {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove script tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // remove style tags
    .replace(/<[^>]+>/g, ' ') // remove all HTML tags
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim(); // trim leading/trailing spaces and return
}

/**
 * Truncates content to a maximum length
 * @param {string} content - Content to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated content
 */
export function truncateContent(content, maxLength) {
  if (content.length <= maxLength) return content; // if within limit, return as it is
  return content.substring(0, maxLength) + '...'; // else truncate and append ellipsis
}

/**
 * Creates a simple fallback summary by extracting the first N words from the content
 * @param {string} content - Plain text content
 * @param {number} maxWords - Maximum number of words
 * @returns {string} Fallback summary
 */
export function extractFirstWords(content, maxWords) {
  const words = content
    .split(/\s+/) // split by whitespace
    .filter((word) => word.length > 0) // filter out empty strings
    .slice(0, maxWords); // take only the first N words
  return words.join(' ') + (words.length >= maxWords ? '...' : ''); // join back to string and append ellipsis if truncated
}
