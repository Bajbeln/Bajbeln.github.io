/**
 * Search utility functions for Bajbeln
 * Can be used both client-side and server-side
 */

/**
 * Simple case-insensitive search
 * @param {Array<{title: string, content?: string, path?: string}>} items - Array of items to search
 * @param {string} query - Search query
 * @returns {Array} Filtered items matching the query
 */
export function searchItems(items, query) {
  if (!query || query.trim() === '') {
    return items || [];
  }

  if (!items || !Array.isArray(items)) {
    return [];
  }

  const lowerQuery = query.toLowerCase();

  return items.filter((item) => {
    if (!item) return false;

    // Search in title
    if (item.title && item.title.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    // Search in content
    if (item.content && item.content.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    // Search in path
    if (item.path && item.path.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    return false;
  });
}

/**
 * Search specifically for songs
 * @param {Array} songIndex - Array of song objects
 * @param {string} query - Search query
 * @returns {Array} Matching songs
 */
export function searchSongs(songIndex, query) {
  return searchItems(songIndex, query);
}

/**
 * Normalize Swedish characters for better search
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
export function normalizeSwedish(text) {
  return text
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Export for CommonJS
module.exports = {
  searchItems,
  searchSongs,
  normalizeSwedish,
};
