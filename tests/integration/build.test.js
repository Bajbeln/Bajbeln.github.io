import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const projectRoot = resolve(__dirname, '..', '..');
const buildDir = resolve(projectRoot, '_site');

/**
 * Run the Eleventy build
 */
function runBuild() {
  console.log('Starting Eleventy build...');
  console.log('Current directory:', process.cwd());
  console.log('Project root:', projectRoot);
  
  try {
    // First, try with inherit to show output directly
    execSync('npm run build', {
      cwd: projectRoot,
      stdio: 'inherit',
      encoding: 'utf-8',
    });
    
    console.log('Build command completed. Checking _site directory...');
    
    // Verify that the build directory was created
    if (!existsSync(buildDir)) {
      console.error('ERROR: Build completed but _site directory was not created');
      console.error('Expected _site at:', buildDir);
      console.error('Contents of project root:', readdirSync(projectRoot).filter(f => !f.startsWith('.')));
      return false;
    }
    console.log('_site directory exists:', buildDir);
    return true;
  } catch (error) {
    console.error('\n=== BUILD FAILED ===');
    console.error('Exit code:', error.status);
    console.error('Error message:', error.message);
    
    // Try to get more information by checking what exists
    console.error('\nChecking project structure:');
    console.error('Project root exists:', existsSync(projectRoot));
    console.error('node_modules exists:', existsSync(resolve(projectRoot, 'node_modules')));
    console.error('eleventy.config.ts exists:', existsSync(resolve(projectRoot, 'eleventy.config.ts')));
    console.error('src directory exists:', existsSync(resolve(projectRoot, 'src')));
    
    // Try running eleventy directly with tsx
    console.error('\nTrying to run eleventy with tsx directly...');
    try {
      execSync('tsx ./node_modules/.bin/eleventy --config=eleventy.config.ts', {
        cwd: projectRoot,
        stdio: 'inherit',
        encoding: 'utf-8',
      });
      console.error('Direct eleventy run with tsx succeeded');
    } catch (directError) {
      console.error('Direct eleventy run with tsx also failed with exit code:', directError.status);
    }
    
    return false;
  }
}

/**
 * Check if a directory exists and has files
 */
function directoryExists(path) {
  return existsSync(path) && readdirSync(path).length > 0;
}

/**
 * Check if a file exists and read its content
 */
function readFile(path) {
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf-8');
}

describe('Eleventy Build Process', () => {
  beforeAll(() => {
    // Run build before tests
    const success = runBuild();
    if (!success) {
      throw new Error('Failed to run Eleventy build - check the output above for details');
    }
  }, 30000); // 30 second timeout for build

  it('creates the _site output directory', () => {
    expect(existsSync(buildDir)).toBeTruthy();
  });

  it('generates index.html', () => {
    const indexPath = resolve(buildDir, 'index.html');
    expect(existsSync(indexPath)).toBeTruthy();

    const content = readFile(indexPath);
    expect(content).not.toBeNull();
    expect(content).toContain('<html');
    expect(content).toContain('</html>');
  });

  it('generates spex pages', () => {
    // Spex directories are generated directly in _site (not under _site/spex/)
    const entries = readdirSync(buildDir, { withFileTypes: true });
    const spexDirs = entries
      .filter(
        (d) => d.isDirectory() && !['assets', 'scripts', 'partials', 'favoriter'].includes(d.name)
      )
      .map((d) => d.name);

    // Should have at least some spex directories
    expect(spexDirs.length).toBeGreaterThan(0);
  });

  it('copies static assets', () => {
    const assetsDir = resolve(buildDir, 'assets');
    expect(directoryExists(assetsDir)).toBeTruthy();

    const stylePath = resolve(buildDir, 'style.css');
    expect(existsSync(stylePath)).toBeTruthy();

    const scriptDir = resolve(buildDir, 'scripts');
    expect(directoryExists(scriptDir)).toBeTruthy();
  });

  it('includes song content in generated pages', () => {
    // Check that at least one spex directory has HTML files with song content
    const entries = readdirSync(buildDir, { withFileTypes: true });
    const spexDirs = entries
      .filter(
        (d) => d.isDirectory() && !['assets', 'scripts', 'partials', 'favoriter'].includes(d.name)
      )
      .map((d) => d.name);

    // Try to find at least one spex directory with HTML files
    let foundSongContent = false;
    for (const dirName of spexDirs) {
      const dirPath = resolve(buildDir, dirName);
      const files = readdirSync(dirPath).filter((f) => f.endsWith('.html'));
      if (files.length > 0) {
        const content = readFile(resolve(dirPath, files[0]));
        if (content && content.includes('song-block')) {
          foundSongContent = true;
          break;
        }
      }
    }
    expect(foundSongContent).toBeTruthy();
  });

  it('preserves the site.webmanifest', () => {
    const manifestPath = resolve(buildDir, 'site.webmanifest');
    expect(existsSync(manifestPath)).toBeTruthy();
  });

  it('preserves favicon.ico', () => {
    const faviconPath = resolve(buildDir, 'favicon.ico');
    expect(existsSync(faviconPath)).toBeTruthy();
  });

  it('generates a song index', () => {
    const songIndexPath = resolve(buildDir, 'songIndex.json');
    expect(existsSync(songIndexPath)).toBeTruthy();

    const content = readFile(songIndexPath);
    expect(content).not.toBeNull();

    // Should be valid JSON
    const json = JSON.parse(content);
    expect(Array.isArray(json)).toBeTruthy();
  });
});

describe('Content Validation', () => {
  it('generates valid HTML files', () => {
    const htmlFiles = [];

    function findHtmlFiles(dir) {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = resolve(dir, entry.name);
        if (entry.isDirectory()) {
          findHtmlFiles(fullPath);
        } else if (entry.name.endsWith('.html')) {
          htmlFiles.push(fullPath);
        }
      }
    }

    findHtmlFiles(buildDir);

    // Check at least some HTML files were generated
    expect(htmlFiles.length).toBeGreaterThan(0);

    // Verify each HTML file has basic structure
    for (const file of htmlFiles.slice(0, 5)) {
      // Check first 5 to save time
      const content = readFile(file);
      expect(content).toContain('<html');
      expect(content).toContain('</html>');
    }
  });

  it('correctly processes song blocks with Swedish characters', () => {
    // Look for HTML files in spex directories
    const entries = readdirSync(buildDir, { withFileTypes: true });
    const spexDirs = entries
      .filter(
        (d) => d.isDirectory() && !['assets', 'scripts', 'partials', 'favoriter'].includes(d.name)
      )
      .map((d) => d.name);

    for (const dirName of spexDirs) {
      const dirPath = resolve(buildDir, dirName);
      const files = readdirSync(dirPath).filter((f) => f.endsWith('.html'));

      for (const file of files) {
        const content = readFile(resolve(dirPath, file));

        // Should properly handle Swedish characters
        if (content.includes('Efraims')) {
          expect(content).toMatch(/efraims.*s[åa]ng/i);
          break;
        }
      }
    }
  });
});
