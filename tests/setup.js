/**
 * Vitest setup file
 * Configures global mocks and test environment
 */

// Mock DOM globals for tests that need them
import { vi } from 'vitest';

// Mock window and document for Node.js environment
if (typeof global.window === 'undefined') {
  global.window = {
    location: {
      origin: 'https://test.com',
      pathname: '/test',
      hash: '',
      search: '',
    },
    navigator: {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
      serviceWorker: {
        register: vi.fn(() => Promise.resolve()),
      },
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    document: {
      createElement: vi.fn((tag) => ({
        tagName: tag,
        value: '',
        select: vi.fn(),
        focus: vi.fn(),
      })),
      getElementById: vi.fn(),
      getElementsByClassName: vi.fn(() => []),
      getElementsByTagName: vi.fn(() => []),
      querySelector: vi.fn(),
      querySelectorAll: vi.fn(() => []),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
      execCommand: vi.fn(() => true),
      documentElement: {
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
          contains: vi.fn(() => false),
        },
      },
      head: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
    },
  };
}

// Mock localStorage
if (typeof global.localStorage === 'undefined') {
  let store = {};
  global.localStorage = {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    },
  };
}

// Mock sessionStorage
if (typeof global.sessionStorage === 'undefined') {
  let store = {};
  global.sessionStorage = {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    },
  };
}

// Mock fetch for tests that need it
if (typeof global.fetch === 'undefined') {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    })
  );
}

// Make window properties available globally
// Note: In Vitest, we can't reassign navigator, so we skip this

// Mock URLSearchParams for tests
if (typeof global.URLSearchParams === 'undefined') {
  global.URLSearchParams = class URLSearchParams {
    constructor(query) {
      this.params = {};
      if (query) {
        query.split('&').forEach((pair) => {
          const [key, value] = pair.split('=');
          this.params[key] = value;
        });
      }
    }
    get(key) {
      return this.params[key] || null;
    }
    set(key, value) {
      this.params[key] = value;
    }
    has(key) {
      return key in this.params;
    }
  };
}

// Mock URL for tests
if (typeof global.URL === 'undefined') {
  global.URL = class URL {
    constructor(url) {
      this.href = url;
      this.origin = 'https://test.com';
      this.pathname = '/test';
      this.hash = '';
      this.search = '';
    }
  };
}

// Mock DOMTokenList for classList
if (typeof global.DOMTokenList === 'undefined') {
  global.DOMTokenList = class DOMTokenList {
    constructor() {
      this.tokens = [];
    }
    add(token) {
      if (!this.tokens.includes(token)) {
        this.tokens.push(token);
      }
    }
    remove(token) {
      this.tokens = this.tokens.filter((t) => t !== token);
    }
    contains(token) {
      return this.tokens.includes(token);
    }
    toggle(token) {
      if (this.contains(token)) {
        this.remove(token);
      } else {
        this.add(token);
      }
    }
    get value() {
      return this.tokens.join(' ');
    }
  };
}

// Mock HTMLElement
if (typeof global.HTMLElement === 'undefined') {
  global.HTMLElement = class HTMLElement {
    constructor() {
      this.classList = new DOMTokenList();
      this.textContent = '';
      this.innerHTML = '';
      this.style = {};
      this.offsetWidth = 0;
    }
    setAttribute(name, value) {
      this[name] = value;
    }
    getAttribute(name) {
      return this[name];
    }
    appendChild(child) {
      return child;
    }
    removeChild(child) {
      return child;
    }
  };
}

// Mock Event for tests
if (typeof global.Event === 'undefined') {
  global.Event = class Event {
    constructor(type, options) {
      this.type = type;
      this.bubbles = options?.bubbles || false;
      this.cancelable = options?.cancelable || false;
    }
    preventDefault() {}
    stopPropagation() {}
  };
}

// Mock CustomEvent for tests
if (typeof global.CustomEvent === 'undefined') {
  global.CustomEvent = class CustomEvent extends Event {
    constructor(type, options) {
      super(type, options);
      this.detail = options?.detail;
    }
  };
}

// Mock MouseEvent for tests
if (typeof global.MouseEvent === 'undefined') {
  global.MouseEvent = class MouseEvent extends Event {
    constructor(type, options) {
      super(type, options);
      this.clientX = options?.clientX || 0;
      this.clientY = options?.clientY || 0;
    }
  };
}

// Mock console.warn to avoid noise in tests
const originalConsoleWarn = console.warn;
console.warn = vi.fn((...args) => {
  originalConsoleWarn(...args);
});

// Export mocks for tests to use
export { vi };
