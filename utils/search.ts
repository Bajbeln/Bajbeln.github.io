/**
 * Search utility functions for Bajbeln
 * Can be used both client-side and server-side
 */

interface SearchableItem {
  title: string;
  content?: string;
  path?: string;
}

/**
 * Simple case-insensitive search
 * @param items - Array of items to search
 * @param query - Search query
 * @returns Filtered items matching the query
 */
export function searchItems(items: SearchableItem[], query: string): SearchableItem[] {
  if (!query || query.trim() === '') {
    return items || [];
  }

  if (!items || !Array.isArray(items)) {
    return [];
  }

  const lowerQuery = query.toLowerCase();

  return items.filter((item): boolean => {
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
 * @param songIndex - Array of song objects
 * @param query - Search query
 * @returns Matching songs
 */
export function searchSongs(songIndex: SearchableItem[], query: string): SearchableItem[] {
  return searchItems(songIndex, query);
}

/**
 * Normalize Swedish characters for better search
 * @param text - Text to normalize
 * @returns Normalized text
 */
export function normalizeSwedish(text: string): string {
  return text
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
