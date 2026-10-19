/**
 * Markdown processing utility functions
 * These are extracted for testing and reused in eleventy.config.ts
 */

/**
 * Convert a string to a URL-friendly slug.
 * Handles Swedish characters (å, ä, ö) and normalizes unicode.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim();
}

/**
 * Escape HTML special characters to prevent XSS.
 */
export function escHtml(str: string | undefined): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Flatten markdown's <p>...</p> blocks into <br><br>-separated content so
 * stanza spacing matches the <br>-only semantics used inside columns and in
 * the legacy HTML pages — one blank line in source = one empty visual line.
 */
export function flattenParagraphs(html: string): string {
  // First remove existing trailing <br> tags to avoid duplication
  const withoutTrailing = html.replace(/(<br>\s*)+$/, '');
  // Then replace <p> tags with content + <br><br>
  return withoutTrailing.replace(/<p>([\s\S]*?)<\/p>/g, (_, inner) => inner.trim() + '<br><br>\n');
}

/**
 * Preserve runs of 2+ blank lines before markdown-it collapses them.
 * N blank lines in source → N visual empty lines in output.
 * Each extra blank line beyond the first is injected as a standalone <br>
 * HTML block, which passes through flattenParagraphs unchanged.
 */
export function preprocessBlankLines(src: string): string {
  return src.replace(/\n{3,}/g, (match) => {
    const extraBlanks = match.length - 2;
    return '\n\n' + Array(extraBlanks).fill('<br>').join('\n\n') + '\n\n';
  });
}
