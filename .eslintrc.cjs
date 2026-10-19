/**
 * ESLint configuration for Bajbeln project
 * Supports both CommonJS and ES Modules
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
  },
  plugins: ['prettier'],
  rules: {
    // Possible Errors
    'no-console': 'warn',
    'no-undefined': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // Best Practices
    'consistent-return': 'off',
    curly: ['error', 'multi-line'],
    'dot-notation': 'error',
    eqeqeq: ['error', 'smart'],
    'no-empty-function': 'off',
    'no-implicit-globals': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-shadow': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',

    // Variables
    'no-use-before-define': ['error', { functions: false, classes: false }],

    // Node.js and CommonJS
    'global-require': 'warn',
    'no-buffer-constructor': 'error',

    // Prettier (handled by prettier plugin)
    'prettier/prettier': 'error',

    // Custom overrides
    'require-await': 'off',
    'no-async-promise-executor': 'off',
    'no-empty': 'warn',
  },
  ignorePatterns: [
    '_site/',
    'node_modules/',
    'dist/',
    'coverage/',
    '*.min.js',
    '*.min.css',
    'sw.js',
  ],
  overrides: [
    {
      files: ['*.cjs'],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        node: true,
      },
      rules: {
        'require-await': 'off',
      },
    },
    {
      files: ['eleventy.config.js'],
      rules: {
        'global-require': 'off',
        'no-param-reassign': 'off',
      },
    },
    {
      files: ['scripts/*.js'],
      env: {
        browser: true,
      },
      globals: {
        // Client-side scripts have these globally available
        getSetting: 'readonly',
        setSetting: 'readonly',
        openSettings: 'readonly',
        toggleReadingMode: 'readonly',
        addReadingMode: 'readonly',
        removeReadingMode: 'readonly',
        toggleDarkMode: 'readonly',
        addDarkMode: 'readonly',
        removeDarkMode: 'readonly',
        copyLink: 'readonly',
        fallbackCopy: 'readonly',
        showCopyFeedback: 'readonly',
        getSongIndex: 'readonly',
      },
      rules: {
        'no-unused-vars': 'warn',
        'no-console': 'warn',
      },
    },
    {
      files: ['**/*.test.js', '**/*.test.cjs'],
      env: {
        node: true,
      },
      rules: {
        'no-unused-expressions': 'off',
        'no-unused-vars': 'warn',
      },
    },
    {
      files: ['scripts/songIndexCache.js'],
      rules: {
        'no-empty': 'off',
      },
    },
  ],
};
