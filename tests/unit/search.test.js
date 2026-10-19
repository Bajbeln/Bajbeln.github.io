/**
 * Unit tests for search.js utility functions
 */
import { describe, it, expect } from 'vitest';
import { searchItems, searchSongs, normalizeSwedish } from '../../utils/search.js';

// Mock song data for testing
const mockSongs = [
  { title: 'Efraims sång', path: '/nosaby/01', content: 'När jag var i Yngsjö' },
  { title: 'Kärlekssång', path: '/nosaby/06', content: 'Kärleken är som en ros' },
  {
    title: ' Invokation till Pelle Andersson',
    path: '/christian-iv/06',
    content: 'Invokation text',
  },
  { title: 'Totalfinal', path: '/nosaby/08', content: 'Det var en gång en final' },
  { title: 'Mälardalen', path: '/kristina/01', content: 'I Mälardalen' },
  { title: 'Café', path: '/florence/01', content: 'Vi sitter på café' },
];

const mockSongIndex = [
  { title: 'Efraims sång', path: '/nosaby/nos-01-efraims-sang' },
  { title: 'Kärlekssång', path: '/nosaby/nos-06-karlekssang' },
  { title: 'Totalfinal', path: '/nosaby/nos-08-totalfinal' },
  { title: 'Invokation till Pelle Andersson', path: '/christian-iv/cxi-06' },
];

describe('Search Utilities', () => {
  describe('normalizeSwedish', () => {
    it('converts Swedish characters to ASCII equivalents', () => {
      expect(normalizeSwedish('Efraims sång')).toBe('efraims sang');
      expect(normalizeSwedish('ÅäÖ')).toBe('aao');
      expect(normalizeSwedish('Mälardalen')).toBe('malardalen');
    });

    it('handles already ASCII text', () => {
      expect(normalizeSwedish('Hello World')).toBe('hello world');
    });

    it('handles mixed case', () => {
      expect(normalizeSwedish('EfRaimS SÅnG')).toBe('efraims sang');
    });

    it('handles empty string', () => {
      expect(normalizeSwedish('')).toBe('');
    });

    it('handles accented characters', () => {
      expect(normalizeSwedish('Café')).toBe('cafe');
      expect(normalizeSwedish('Résumé')).toBe('resume');
    });
  });

  describe('searchItems', () => {
    it('returns all items when query is empty', () => {
      const result = searchItems(mockSongs, '');
      expect(result).toEqual(mockSongs);
    });

    it('returns empty array when query is null and items is null', () => {
      const result = searchItems(null, null);
      expect(result).toEqual([]);
    });

    it('returns empty array when query is null and items is undefined', () => {
      const result = searchItems(undefined, null);
      expect(result).toEqual([]);
    });

    it('returns empty array when items is null', () => {
      const result = searchItems(null, 'test');
      expect(result).toEqual([]);
    });

    it('returns empty array when items is not an array', () => {
      const result = searchItems({}, 'test');
      expect(result).toEqual([]);
    });

    it('finds exact title matches', () => {
      const result = searchItems(mockSongs, 'Efraims sång');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Efraims sång');
    });

    it('finds partial title matches', () => {
      const result = searchItems(mockSongs, 'sång');
      expect(result).toHaveLength(2); // Efraims sång, Kärlekssång
    });

    it('finds content matches', () => {
      const result = searchItems(mockSongs, 'Yngsjö');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Efraims sång');
    });

    it('finds path matches', () => {
      const result = searchItems(mockSongs, 'nosaby');
      expect(result).toHaveLength(3);
    });

    it('is case-insensitive', () => {
      const result1 = searchItems(mockSongs, 'EFRAIMS SÅNG');
      const result2 = searchItems(mockSongs, 'efraims sång');
      const result3 = searchItems(mockSongs, 'EfRaImS sÅnG');

      expect(result1).toHaveLength(1);
      expect(result2).toHaveLength(1);
      expect(result3).toHaveLength(1);
    });

    it('handles items without title', () => {
      const itemsWithNoTitle = [
        { content: 'Some content' },
        { title: 'Has title', content: 'content' },
      ];
      const result = searchItems(itemsWithNoTitle, 'content');
      expect(result).toHaveLength(2);
    });

    it('handles items without content', () => {
      const itemsWithNoContent = [
        { title: 'Title only' },
        { title: 'Another title', content: 'content' },
      ];
      const result = searchItems(itemsWithNoContent, 'Title');
      expect(result).toHaveLength(2);
    });

    it('returns empty array when no matches found', () => {
      const result = searchItems(mockSongs, 'Nonexistent Song');
      expect(result).toHaveLength(0);
    });

    it('handles items with all empty fields', () => {
      const items = [{}, { title: '', content: '', path: '' }];
      const result = searchItems(items, 'test');
      expect(result).toHaveLength(0);
    });
  });

  describe('searchSongs', () => {
    it('delegates to searchItems', () => {
      const result = searchSongs(mockSongIndex, 'Efraims');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Efraims sång');
    });

    it('handles empty song index', () => {
      const result = searchSongs([], 'test');
      expect(result).toHaveLength(0);
    });

    it('finds songs by partial title', () => {
      const result = searchSongs(mockSongIndex, 'total');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Totalfinal');
    });

    it('finds songs in path', () => {
      const result = searchSongs(mockSongIndex, 'cxi');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Invokation till Pelle Andersson');
    });

    it('returns empty array when no matches found', () => {
      const result = searchSongs(mockSongIndex, 'Nonexistent');
      expect(result).toHaveLength(0);
    });
  });
});
