const markdownIt = require("markdown-it");

// markdown-it instance used both globally and inside the song shortcode
const mdLib = markdownIt({ html: true, breaks: true });

// Flatten markdown's <p>...</p> blocks into <br><br>-separated content so
// stanza spacing matches the <br>-only semantics used inside columns and in
// the legacy HTML pages — one blank line in source = one empty visual line.
function flattenParagraphs(html) {
  return html
    .replace(/<p>([\s\S]*?)<\/p>\s*/g, (_, inner) => inner.trim() + "<br><br>\n")
    .replace(/(<br>\s*)+$/, "");
}

// Custom block rule for multi-column lyrics:
//   ::: cols
//   left-column markdown (bold, blank-line stanzas, etc. all work)
//   ::: col
//   right-column markdown
//   :::
// Renders as <div class="row"><div class="column">...</div>...</div>.
function colsPlugin(md) {
  function colsRule(state, startLine, endLine, silent) {
    const lineText = (i) =>
      state.src.slice(state.bMarks[i] + state.tShift[i], state.eMarks[i]).trim();

    if (lineText(startLine) !== "::: cols") return false;
    if (silent) return true;

    let closeLine = -1;
    for (let i = startLine + 1; i < endLine; i++) {
      if (lineText(i) === ":::") { closeLine = i; break; }
    }
    if (closeLine === -1) return false;

    const columns = [[]];
    for (let i = startLine + 1; i < closeLine; i++) {
      if (lineText(i) === "::: col") {
        columns.push([]);
      } else {
        columns[columns.length - 1].push(
          state.src.slice(state.bMarks[i], state.eMarks[i])
        );
      }
    }

    // Count blank lines immediately after ::: and consume them so they don't
    // double-render. 1+ blank lines → one stanza break (<br><br>), matching
    // how blank lines behave in regular song text via flattenParagraphs.
    let nextLine = closeLine + 1;
    while (nextLine < endLine && lineText(nextLine) === "") nextLine++;
    const trailingBreak = nextLine > closeLine + 1 ? "<br>\n" : "";

    const html =
      '<div class="row">\n' +
      columns
        .map((c) => {
          // renderInline collapses consecutive \n into one softbreak, so to
          // make blank lines work for vertical alignment we first expand each
          // extra \n in a run into an explicit <br>: N blank lines in source
          // → N+1 <br>s in output. Matches the outside-column model where
          // one blank line = one stanza gap (<br><br>).
          const raw = c.join("\n").replace(/^\n+|\n+$/g, "");
          const expanded = raw.replace(
            /\n(\n+)/g,
            (_, extras) => "<br>".repeat(extras.length) + "\n"
          );
          return `<div class="column">\n${md.renderInline(expanded)}\n</div>`;
        })
        .join("\n") +
      "\n</div>\n" + trailingBreak;

    const token = state.push("html_block", "", 0);
    token.content = html;
    token.map = [startLine, nextLine];

    state.line = nextLine;
    return true;
  }

  md.block.ruler.before("paragraph", "cols", colsRule, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });
}

mdLib.use(colsPlugin);

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function escHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = function (eleventyConfig) {
  // Use the same markdown-it instance globally
  eleventyConfig.setLibrary("md", mdLib);

  // {% cols %}left column markdown<!-- col -->right column markdown{% endcols %}
  // Renders two (or more) side-by-side columns. Split columns with <!-- col -->.
  // Full markdown (bold, italic, stanzas) works inside each column.
  eleventyConfig.addPairedShortcode("cols", function (content) {
    const parts = content.split("<!-- col -->").map(p => p.trim());
    const cols = parts.map(p => {
      // <!-- br:N --> → N <br> tags; surrounding newlines consumed so breaks:true
      // doesn't add extra soft-break <br> on either side.
      const processed = p.replace(/\n?<!--\s*br:(\d+)\s*-->\n?/g, (_, n) => "<br>".repeat(+n));
      return `<div class="column">\n${mdLib.render(processed)}\n</div>`;
    }).join("\n");
    return `<div class="row">\n${cols}\n</div>`;
  });

  // {% song "Title", "Singer", "Melody" %}
  // Renders a collapsible song block with a direct-link button.
  eleventyConfig.addPairedShortcode("song", function (content, title, singer, melody) {
    const id = slugify(title);
    const renderedContent = flattenParagraphs(mdLib.render(content.trim()));

    let header = "";
    if (singer) header += `<i>(${escHtml(singer)})</i><br>\n`;
    if (melody) header += `<i>Mel. ${escHtml(melody)}</i><br>\n`;
    const headerBlock = header ? `<br>\n${header}<br>\n` : "<br>\n";

    return `<div class="song-block">
  <div class="song-header">
    <button type="button" class="collapsible" id="${id}" aria-label="Visa eller dölj ${escHtml(title)}">${escHtml(title)}</button><button class="song-link-btn" onclick="copySongLink('${id}')" aria-label="Kopiera länk till ${escHtml(title)}"><img src="/assets/images/song-link-button.png" alt="Kopiera länk" class="song-link-icon"></button>
  </div>
  <div class="content">
    ${headerBlock}${renderedContent}<br><br>
  </div>
</div>
<br>`;
  });

  // Collection: all song files (any .md with an `order` frontmatter field)
  eleventyConfig.addCollection("songs", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/spex/**/*.md")
      .filter(item => item.data.order != null && !item.inputPath.includes("_template"));
  });

  // Filter: get songs for a given spex, sorted by order
  eleventyConfig.addFilter("songsForSpex", function (collection, spexName) {
    if (!spexName) return [];
    return collection
      .filter(item => item.data.spex === spexName)
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });

  // Filter: get specific songs by a list of {spex, title} pairs, preserving list order
  eleventyConfig.addFilter("songsFromList", function (collection, songList) {
    if (!songList || !songList.length) return [];
    return songList
      .map(({ spex, title }) => {
        const found = collection.find(s => s.data.spex === spex && s.data.title === title);
        if (!found) {
          console.warn(`[favoriter] Song not found: spex="${spex}" title="${title}"`);
        }
        return found;
      })
      .filter(Boolean);
  });

  // Filter: render a song collection item as a song-block HTML string
  eleventyConfig.addFilter("renderSong", function (song) {
    const { title, singer, melody } = song.data;
    const id = slugify(title);
    const renderedContent = flattenParagraphs(song.templateContent || "");

    let header = "";
    if (singer) header += `<i>(${escHtml(singer)})</i><br>\n`;
    if (melody) header += `<i>Mel. ${escHtml(melody)}</i><br>\n`;
    const headerBlock = header ? `<br>\n${header}<br>\n` : "<br>\n";

    return `<div class="song-block">
  <div class="song-header">
    <button type="button" class="collapsible" id="${id}" aria-label="Visa eller dölj ${escHtml(title)}">${escHtml(title)}</button><button class="song-link-btn" onclick="copySongLink('${id}')" aria-label="Kopiera länk till ${escHtml(title)}"><img src="/assets/images/song-link-button.png" alt="Kopiera länk" class="song-link-icon"></button>
  </div>
  <div class="content">
    ${headerBlock}${renderedContent}<br><br>
  </div>
</div>`;
  });

  // --- Passthrough: keep all existing static assets in the build ---
  eleventyConfig.addPassthroughCopy({ "style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "scripts/": "scripts/" });
  eleventyConfig.addPassthroughCopy({ "assets/": "assets/" });
  eleventyConfig.addPassthroughCopy({ "partials/": "partials/" });
  eleventyConfig.addPassthroughCopy({ "manifest.json": "manifest.json" });
  eleventyConfig.addPassthroughCopy({ "songIndex.json": "songIndex.json" }); // remove this to enable search and random to new pages
  // Keep all existing spex HTML pages at their original /spex/* URLs
  eleventyConfig.addPassthroughCopy({ "spex/": "spex/" });
  eleventyConfig.addPassthroughCopy({ "index.html": "index.html" }); // remove this to enable the new index site

  return {
    // Process {% ... %} shortcodes inside .md files using Nunjucks
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      layouts: "_layouts",
    },
  };
};
