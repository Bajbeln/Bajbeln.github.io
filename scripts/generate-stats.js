#!/usr/bin/env node

/**
 * Generates stats.json with counts of uppsattningar, days, and songs
 * Run with: node scripts/generate-stats.js
 */

import fs from 'fs';
import path from 'path';

const SPEX_DIR = path.join(process.cwd(), 'src', 'spex');
const OUTPUT_FILE = path.join(process.cwd(), 'src', '_data', 'stats.json');

function parseIndexFile(spexPath) {
  const indexPath = path.join(spexPath, 'index.md');
  if (!fs.existsSync(indexPath)) return { uppsattningar: 0, years: [] };
  
  const content = fs.readFileSync(indexPath, 'utf-8');
  
  // Parse uppsattning array from frontmatter
  const uppsattningMatch = content.match(/uppsattning:\s*\n((?:\s+-\s+id:\s*[^\n]+\s+label:\s*'[^']+'\s*\n)+)/);
  if (uppsattningMatch) {
    const items = uppsattningMatch[1].match(/label:\s*'([^']+)'/g);
    if (items) {
      const years = [];
      for (const item of items) {
        const label = item.match(/label:\s*'([^']+)'/)[1];
        const yearMatch = label.match(/(\d{4})(?:\/(\d{2,4}))?/);
        if (yearMatch) {
          years.push(parseInt(yearMatch[1]));
          if (yearMatch[2]) {
            const year2 = yearMatch[2].length === 2 ? 2000 + parseInt(yearMatch[2]) : parseInt(yearMatch[2]);
            years.push(year2);
          }
        }
      }
      return { uppsattningar: items.length, years };
    }
  }
  
  return { uppsattningar: 1, years: [] };
}

function countSpexAndSongs() {
  const dirs = fs.readdirSync(SPEX_DIR, { withFileTypes: true });
  
  const spexDirs = dirs.filter(
    (d) => d.isDirectory() && !d.name.startsWith('_template')
  );
  
  let totalSongs = 0;
  let totalUppsattningar = 0;
  const allYears = [];
  const spexWithCounts = [];
  
  for (const dir of spexDirs) {
    const spexPath = path.join(SPEX_DIR, dir.name);
    
    // Recursively count .md files (excluding index.md) in this spex directory
    function countMdFiles(dirPath) {
      let count = 0;
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
          count++;
        } else if (entry.isDirectory()) {
          count += countMdFiles(fullPath);
        }
      }
      return count;
    }
    
    const songCountForSpex = countMdFiles(spexPath);
    totalSongs += songCountForSpex;
    
    const { uppsattningar, years } = parseIndexFile(spexPath);
    totalUppsattningar += uppsattningar;
    allYears.push(...years);
    
    spexWithCounts.push({
      name: dir.name,
      songs: songCountForSpex,
      uppsattningar: uppsattningar
    });
  }
  
  const uniqueYears = [...new Set(allYears.filter(y => y))].length;
  
  return {
    spexCount: spexDirs.length,
    uppsattningarCount: totalUppsattningar,
    dayCount: uniqueYears,
    songCount: totalSongs,
    updatedAt: new Date().toISOString(),
    spex: spexWithCounts
  };
}

function main() {
  const stats = countSpexAndSongs();
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stats, null, 2));
  
  console.log(`✓ Generated ${OUTPUT_FILE}`);
  console.log(`  Uppsättningar: ${stats.uppsattningarCount}`);
  console.log(`  Dagar: ${stats.dayCount}`);
  console.log(`  Kupletter: ${stats.songCount}`);
}

main();
