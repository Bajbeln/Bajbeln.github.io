import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.js', 'tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*', 'eleventy.config.js', 'utils/**/*', 'scripts/**/*.js'],
      exclude: ['node_modules/', 'tests/', '_site/', '*.min.js'],
    },
    setupFiles: ['./tests/setup.js'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
