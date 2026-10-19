import { describe, it, expect } from 'vitest';
import {
  slugify,
  escHtml,
  flattenParagraphs,
  preprocessBlankLines,
} from '../../utils/markdown-helpers.ts';

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('handles Swedish characters (å, ä, ö)', () => {
    expect(slugify('Efraims sång')).toBe('efraims-sang');
    expect(slugify('ÅäÖ')).toBe('aao');
    expect(slugify('Mälardalen')).toBe('malardalen');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('Hello World Test')).toBe('hello-world-test');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('Hello   World')).toBe('hello-world');
    expect(slugify('Hello---World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
    expect(slugify('Hello@World#Test')).toBe('helloworldtest');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify(' Hello World ')).toBe('hello-world');
    expect(slugify('-Hello World-')).toBe('hello-world');
    expect(slugify('--Hello--World--')).toBe('hello-world');
  });

  it('handles empty strings', () => {
    expect(slugify('')).toBe('');
  });

  it('handles accented characters', () => {
    expect(slugify('Café')).toBe('cafe');
    expect(slugify('Résumé')).toBe('resume');
  });

  it('handles song titles from the project', () => {
    expect(slugify('[NOS 1] Efraims sång')).toBe('nos-1-efraims-sang');
    expect(slugify('[CXI 6] Invokation till Pelle Andersson')).toBe(
      'cxi-6-invokation-till-pelle-andersson'
    );
  });
});

describe('escHtml', () => {
  it('escapes ampersand', () => {
    expect(escHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('escapes less than', () => {
    expect(escHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes greater than', () => {
    expect(escHtml('5 > 3')).toBe('5 &gt; 3');
  });

  it('escapes double quotes', () => {
    expect(escHtml('"Hello"')).toBe('&quot;Hello&quot;');
  });

  it('handles multiple special characters', () => {
    expect(escHtml('<a href="test">Link & Text</a>')).toBe(
      '&lt;a href=&quot;test&quot;&gt;Link &amp; Text&lt;/a&gt;'
    );
  });

  it('handles empty string', () => {
    expect(escHtml('')).toBe('');
  });

  it('handles null/undefined', () => {
    expect(escHtml(null)).toBe('');
    expect(escHtml(undefined)).toBe('');
  });

  it('does not escape safe text', () => {
    expect(escHtml('Hello World')).toBe('Hello World');
  });
});

describe('flattenParagraphs', () => {
  it('replaces <p> tags with <br><br>', () => {
    expect(flattenParagraphs('<p>Line 1</p>')).toBe('Line 1<br><br>\n');
  });

  it('handles multiple paragraphs', () => {
    const input = '<p>Para 1</p>\n<p>Para 2</p>';
    const expected = 'Para 1<br><br>\n\nPara 2<br><br>\n';
    expect(flattenParagraphs(input)).toBe(expected);
  });

  it('removes trailing <br> tags', () => {
    const input = '<p>Test</p><br><br>';
    expect(flattenParagraphs(input)).toBe('Test<br><br>\n');
  });

  it('handles empty input', () => {
    expect(flattenParagraphs('')).toBe('');
  });

  it('handles content without paragraphs', () => {
    const input = '<strong>Bold</strong> text';
    expect(flattenParagraphs(input)).toBe('<strong>Bold</strong> text');
  });

  it('handles nested HTML in paragraphs', () => {
    const input = '<p><strong>Bold</strong> text</p>';
    expect(flattenParagraphs(input)).toBe('<strong>Bold</strong> text<br><br>\n');
  });

  it('handles paragraphs with whitespace', () => {
    const input = '<p>  Line 1  </p>';
    expect(flattenParagraphs(input)).toBe('Line 1<br><br>\n');
  });
});

describe('preprocessBlankLines', () => {
  it('preserves two blank lines', () => {
    const input = 'Line 1\n\nLine 2';
    expect(preprocessBlankLines(input)).toBe('Line 1\n\nLine 2');
  });

  it('converts 3 blank lines to 2 with <br>', () => {
    const input = 'Line 1\n\n\nLine 2';
    expect(preprocessBlankLines(input)).toBe('Line 1\n\n<br>\n\nLine 2');
  });

  it('converts 4 blank lines to 2 with two <br>s', () => {
    const input = 'Line 1\n\n\n\nLine 2';
    expect(preprocessBlankLines(input)).toBe('Line 1\n\n<br>\n\n<br>\n\nLine 2');
  });

  it('handles empty input', () => {
    expect(preprocessBlankLines('')).toBe('');
  });

  it('handles input with only newlines', () => {
    const input = '\n\n\n\n';
    expect(preprocessBlankLines(input)).toBe('\n\n<br>\n\n<br>\n\n');
  });
});
