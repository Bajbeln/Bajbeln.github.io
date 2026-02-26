const markdownIt = require("markdown-it");

// markdown-it instance used both globally and inside the song shortcode
const mdLib = markdownIt({ html: true, breaks: true });

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o")
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

  // {% song "Title", "Singer", "Melody" %}
  // Renders a collapsible song block with a direct-link button.
  eleventyConfig.addPairedShortcode("song", function (content, title, singer, melody) {
    const id = slugify(title);
    const renderedContent = mdLib.render(content.trim());

    let header = "";
    if (singer) header += `<i>(${escHtml(singer)})</i><br>\n`;
    if (melody) header += `<i>Mel. ${escHtml(melody)}</i><br><br>\n`;

    return `<div class="song-block">
  <div class="song-header">
    <button type="button" class="collapsible" id="${id}" aria-label="Visa eller dölj ${escHtml(title)}">${escHtml(title)}</button><button class="song-link-btn" onclick="copySongLink('${id}')" aria-label="Kopiera länk till ${escHtml(title)}">🔗</button>
  </div>
  <div class="content">
    <br>${header}${renderedContent}
  </div>
</div>
<br>`;
  });

  // Collection: all song files (any .md with an `order` frontmatter field)
  eleventyConfig.addCollection("songs", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/spex/**/*.md")
      .filter(item => item.data.order != null);
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
      .map(({ spex, title }) =>
        collection.find(s => s.data.spex === spex && s.data.title === title)
      )
      .filter(Boolean);
  });

  // Filter: render a song collection item as a song-block HTML string
  eleventyConfig.addFilter("renderSong", function (song) {
    const { title, singer, melody } = song.data;
    const id = slugify(title);
    const renderedContent = song.templateContent || "";

    let header = "";
    if (singer) header += `<i>(${escHtml(singer)})</i><br>\n`;
    if (melody) header += `<i>Mel. ${escHtml(melody)}</i><br><br>\n`;

    return `<div class="song-block">
  <div class="song-header">
    <button type="button" class="collapsible" id="${id}" aria-label="Visa eller dölj ${escHtml(title)}">${escHtml(title)}</button><button class="song-link-btn" onclick="copySongLink('${id}')" aria-label="Kopiera länk till ${escHtml(title)}">🔗</button>
  </div>
  <div class="content">
    <br>${header}${renderedContent}
  </div>
</div>`;
  });

  // --- Passthrough: keep all existing static assets in the build ---
  eleventyConfig.addPassthroughCopy({ "style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "scripts/": "scripts/" });
  eleventyConfig.addPassthroughCopy({ "assets/": "assets/" });
  eleventyConfig.addPassthroughCopy({ "partials/": "partials/" });
  eleventyConfig.addPassthroughCopy({ "manifest.json": "manifest.json" });
  eleventyConfig.addPassthroughCopy({ "songIndex.json": "songIndex.json" });
  // Keep all existing spex HTML pages at their original /spex/* URLs
  eleventyConfig.addPassthroughCopy({ "spex/": "spex/" });
  eleventyConfig.addPassthroughCopy({ "index.html": "index.html" });

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
