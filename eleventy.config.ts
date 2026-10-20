import markdownIt from 'markdown-it';
import {
  preprocessBlankLines,
  flattenParagraphs,
  slugify,
  escHtml,
} from './utils/markdown-helpers';
import type { UserConfig, EleventyReturnConfig } from './types/eleventy';

// Cache for expensive operations
import NodeCache from 'node-cache';
const markdownCache = new NodeCache({ stdTTL: 60 * 60, checkperiod: 120 });

// markdown-it instance used both globally and inside the song shortcode
const mdLib = markdownIt({ html: true, breaks: true });

// Custom block rule for multi-column lyrics:
//   ::: cols
//   left-column markdown (bold, blank-line stanzas, etc. all work)
//   ::: col
//   right-column markdown
//   :::
// Renders as <div class="row"><div class="column">...</div>...</div>.
function colsPlugin(md: any): void {
  function colsRule(state: any, startLine: number, endLine: number, silent: boolean): boolean {
    const lineText = (i: number): string =>
      state.src.slice(state.bMarks[i] + state.tShift[i], state.eMarks[i]).trim();

    if (lineText(startLine) !== '::: cols') return false;
    if (silent) return true;

    let closeLine = -1;
    for (let i = startLine + 1; i < endLine; i++) {
      if (lineText(i) === ':::') {
        closeLine = i;
        break;
      }
    }
    if (closeLine === -1) return false;

    const columns: string[][] = [[]];
    for (let i = startLine + 1; i < closeLine; i++) {
      if (lineText(i) === '::: col') {
        columns.push([]);
      } else {
        columns[columns.length - 1].push(state.src.slice(state.bMarks[i], state.eMarks[i]));
      }
    }

    // Count blank lines immediately after ::: and consume them so they don't
    // double-render. 1+ blank lines → one stanza break (<br><br>), matching
    // how blank lines behave in regular song text via flattenParagraphs.
    let nextLine = closeLine + 1;
    while (nextLine < endLine && lineText(nextLine) === '') nextLine++;
    const trailingBreak = nextLine > closeLine + 1 ? '<br>\n' : '';

    const html =
      '<div class="row">\n' +
      columns
        .map((c) => {
          // renderInline collapses consecutive \n into one softbreak, so to
          // make blank lines work for vertical alignment we first expand each
          // extra \n in a run into an explicit <br>: N blank lines in source
          // → N+1 <br>s in output. Matches the outside-column model where
          // one blank line = one stanza gap (<br><br>).
          const raw = c.join('\n').replace(/^\n+|\n+$/g, '');
          const expanded = raw.replace(
            /\n(\n+)/g,
            (_, extras) => '<br>'.repeat(extras.length) + '\n'
          );
          return `<div class="column">\n${md.renderInline(expanded)}\n</div>`;
        })
        .join('\n') +
      '\n</div>\n' +
      trailingBreak;

    const token = state.push('html_block', '', 0);
    token.content = html;
    token.map = [startLine, nextLine];

    state.line = nextLine;
    return true;
  }

  md.block.ruler.before('paragraph', 'cols', colsRule, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  });
}

mdLib.use(colsPlugin);

// Patch render so every call (shortcodes, Eleventy template pipeline) preserves blank lines.
const origRender = mdLib.render.bind(mdLib);
mdLib.render = (src: string, env: any): string => {
  const cacheKey = `markdown:${src.length}:${src.substring(0, 50)}`;

  // Check cache first
  const cached = markdownCache.get(cacheKey);
  if (cached) {
    return cached as string;
  }

  const result = origRender(preprocessBlankLines(src), env);
  markdownCache.set(cacheKey, result);
  return result;
};

interface SongData {
  title: string;
  singer?: string;
  melody?: string;
  order?: number;
  spex?: string;
}

interface SongItem {
  data: SongData & { [key: string]: any };
  inputPath: string;
  templateContent?: string;
}

export default function (eleventyConfig: UserConfig): EleventyReturnConfig {
  // Enable incremental builds for faster development
  eleventyConfig.setUseGitIgnore(false);

  // Watch these directories for changes during --watch
  eleventyConfig.addWatchTarget('./src/');
  eleventyConfig.addWatchTarget('./scripts/');
  eleventyConfig.addWatchTarget('./utils/');
  eleventyConfig.addWatchTarget('./partials/');

  // Use the same markdown-it instance globally
  eleventyConfig.setLibrary('md', mdLib);

  // {% cols %}left column markdown<!-- col -->right column markdown{% endcols %}
  // Renders two (or more) side-by-side columns. Split columns with <!-- col -->.
  // Full markdown (bold, italic, stanzas) works inside each column.
  eleventyConfig.addPairedShortcode('cols', function (content: string): string {
    const parts = content.split('<!-- col -->').map((p) => p.trim());
    const cols = parts
      .map((p) => {
        // <!-- br:N --> → N <br> tags; surrounding newlines consumed so breaks:true
        // doesn't add extra soft-break <br> on either side.
        const processed = p.replace(/\n?<!--\s*br:(\d+)\s*-->\n?/g, (_, n) => '<br>'.repeat(+n));
        return `<div class="column">\n${mdLib.render(processed)}\n</div>`;
      })
      .join('\n');
    return `<div class="row">\n${cols}\n</div>`;
  });

  // {% song "Title", "Singer", "Melody" %}
  // Renders a collapsible song block with a direct-link button.
  eleventyConfig.addPairedShortcode('song', function (content: string, title: string, singer?: string, melody?: string): string {
    const id = slugify(title);
    const renderedContent = flattenParagraphs(mdLib.render(content.trim()));

    let header = '';
    if (singer) header += `<i>(${escHtml(singer)})</i><br>\n`;
    if (melody) header += `<i>Mel. ${escHtml(melody)}</i><br>\n`;
    const headerBlock = header ? `<br>\n${header}<br>\n` : '<br>\n';

    const linkIconHtml =
      '<img src="/assets/images/song-link-button.webp" alt="Kopiera länk" class="song-link-icon" loading="lazy">';

    return `<div class="song-block">
  <div class="song-header">
    <button type="button" class="collapsible" id="${id}" aria-label="Visa eller dölj ${escHtml(title)}">${escHtml(title)}</button><button type="button" class="song-link-btn" onclick="copySongLink('${id}')" aria-label="Kopiera länk till ${escHtml(title)}" title="Kopiera länk till kuplett">${linkIconHtml}</button>
  </div>
  <div class="content">
    <div class="content-inner">
      ${headerBlock}${renderedContent}<br><br>
    </div>
  </div>
</div>
<br>`;
  });

  eleventyConfig.addFilter('markdownify', function (value: unknown): string {
    if (value == null || value === '') return '';
    return mdLib.render(String(value));
  });

  // Collection: all song files (any .md with an `order` frontmatter field)
  eleventyConfig.addCollection('songs', function (collectionApi: any) {
    return collectionApi
      .getFilteredByGlob('src/spex/**/*.md')
      .filter((item: SongItem) => item.data.order != null && !item.inputPath.includes('_template'));
  });

  // Filter: get songs for a given spex, sorted by order
  eleventyConfig.addFilter('songsForSpex', function (collection: SongItem[], spexName?: string): SongItem[] {
    if (!spexName) return [];
    return collection
      .filter((item) => item.data.spex === spexName)
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });

  // Filter: get specific songs by a list of {spex, title} pairs, preserving list order
  interface SongReference {
    spex: string;
    title: string;
  }
  
  eleventyConfig.addFilter('songsFromList', function (collection: SongItem[], songList?: SongReference[]): SongItem[] {
    if (!songList || !songList.length) return [];
    return songList
      .map(({ spex, title }) => {
        const found = collection.find((s) => s.data.spex === spex && s.data.title === title);
        if (!found) {
          console.warn(`[favoriter] Song not found: spex="${spex}" title="${title}"`);
        }
        return found;
      })
      .filter(Boolean) as SongItem[];
  });

  // Filter: render a song collection item as a song-block HTML string
  eleventyConfig.addFilter('renderSong', function (song: SongItem): string {
    const { title, singer, melody } = song.data;
    const id = slugify(title);
    const renderedContent = flattenParagraphs(song.templateContent || '');

    let header = '';
    if (singer) header += `<i>(${escHtml(singer as string)})</i><br>\n`;
    if (melody) header += `<i>Mel. ${escHtml(melody as string)}</i><br>\n`;
    const headerBlock = header ? `<br>\n${header}<br>\n` : '<br>\n';

    const linkIconHtml =
      '<img src="/assets/images/song-link-button.webp" alt="Kopiera länk" class="song-link-icon" loading="lazy">';

    return `<div class="song-block">
  <div class="song-header">
    <button type="button" class="collapsible" id="${id}" aria-label="Visa eller dölj ${escHtml(title)}">${escHtml(title)}</button><button type="button" class="song-link-btn" onclick="copySongLink('${id}')" aria-label="Kopiera länk till ${escHtml(title)}" title="Kopiera länk till kuplett">${linkIconHtml}</button>
  </div>
  <div class="content">
    <div class="content-inner">
      ${headerBlock}${renderedContent}<br><br>
    </div>
  </div>
</div>`;
  });

  // --- Generate OG images before build --- (disabled: run manually with npm run generate:og-images)
  // eleventyConfig.on("beforeBuild", async () => {
  //   const { execSync } = require("child_process");
  //   try {
  //     execSync("bash scripts/generate-og-images.sh", {
  //       cwd: __dirname,
  //       stdio: "inherit"
  //     });
  //   } catch (error) {
  //     console.warn("Warning: Failed to generate OG images. Run 'npm run generate:og-images' manually.");
  //   }
  // });

  // --- Passthrough: keep all existing static assets in the build ---
  eleventyConfig.addPassthroughCopy({ 'style.css': 'style.css' });
  eleventyConfig.addPassthroughCopy({ 'scripts/': 'scripts/' });
  eleventyConfig.addPassthroughCopy({ 'assets/': 'assets/' });
  eleventyConfig.addPassthroughCopy({ 'partials/': 'partials/' });
  eleventyConfig.addPassthroughCopy({ 'manifest.json': 'manifest.json' });
  eleventyConfig.addPassthroughCopy({ 'site.webmanifest': 'site.webmanifest' });
  eleventyConfig.addPassthroughCopy({ 'assets/images/manifest/favicon.ico': 'favicon.ico' });
  eleventyConfig.addPassthroughCopy({ 'sw.js': 'sw.js' });

  return {
    // Process {% ... %} shortcodes inside .md files using Nunjucks
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: '_site',
      layouts: '_layouts',
      includes: '../partials',
    },
    // Enable incremental builds - only rebuild changed files
    incremental: {
      rebuildOnDataChange: true,
    },
    // Enable server passthrough for development
    server: {
      port: 8080,
      // Enable live reload
      liveReload: true,
    },
  };
}
