#!/usr/bin/env node

/**
 * Generates stats.json with counts of spex and songs
 * Run with: node scripts/generate-stats.js
 */

import fs from 'fs';
import path from 'path';

const SPEX_DIR = path.join(process.cwd(), 'src', 'spex');
const OUTPUT_FILE = path.join(process.cwd(), 'src', '_data', 'stats.json');

function countSpexAndSongs() {
  const dirs = fs.readdirSync(SPEX_DIR, { withFileTypes: true });
  
  const spexDirs = dirs.filter(
    (d) => d.isDirectory() && !d.name.startsWith('_template')
  );
  
  let totalSongs = 0;
  const spexWithCounts = [];
  
  for (const dir of spexDirs) {
    const spexPath = path.join(SPEX_DIR, dir.name);
    const files = fs.readdirSync(spexPath);
    const songFiles = files.filter(
      (f) => f.endsWith('.md') && f !== 'index.md'
    );
    totalSongs += songFiles.length;
    spexWithCounts.push({
      name: dir.name,
      songs: songFiles.length
    });
  }
  
  return {
    spexCount: spexDirs.length,
    songCount: totalSongs,
    updatedAt: new Date().toISOString(),
    spex: spexWithCounts
  };
}

function main() {
  const stats = countSpexAndSongs();
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stats, null, 2));
  
  console.log(`✓ Generated ${OUTPUT_FILE}`);
  console.log(`  Spääx: ${stats.spexCount}`);
  console.log(`  Kupletter: ${stats.songCount}`);
}

main();
