declare module '@11ty/eleventy' {
  interface UserConfig {
    setUseGitIgnore: (value: boolean) => void;
    addWatchTarget: (path: string) => void;
    setLibrary: (name: string, library: any) => void;
    addPairedShortcode: (name: string, fn: (...args: any[]) => any) => void;
    addFilter: (name: string, fn: (...args: any[]) => any) => void;
    addCollection: (name: string, fn: (collectionApi: any) => any[]) => void;
    addPassthroughCopy: (path: string | { [key: string]: string }) => void;
    on: (event: string, fn: () => void) => void;
  }

  interface EleventyConfig {
    (eleventyConfig: UserConfig): Partial<{
      markdownTemplateEngine: string;
      htmlTemplateEngine: string;
      dir: {
        input: string;
        output: string;
        layouts: string;
        includes: string;
      };
      incremental: {
        rebuildOnDataChange: boolean;
      };
      server: {
        port: number;
        liveReload: boolean;
      };
    }>;
  }

  export = EleventyConfig;
}

export interface EleventyReturnConfig {
  markdownTemplateEngine?: string;
  htmlTemplateEngine?: string;
  dir?: {
    input?: string;
    output?: string;
    layouts?: string;
    includes?: string;
  };
  incremental?: {
    rebuildOnDataChange?: boolean;
  };
  server?: {
    port?: number;
    liveReload?: boolean;
  };
}

export interface UserConfig {
  setUseGitIgnore: (value: boolean) => UserConfig;
  addWatchTarget: (path: string) => UserConfig;
  setLibrary: (name: string, library: any) => UserConfig;
  addPairedShortcode: (name: string, fn: (...args: any[]) => any) => UserConfig;
  addFilter: (name: string, fn: (...args: any[]) => any) => UserConfig;
  addCollection: (name: string, fn: (collectionApi: any) => any[]) => UserConfig;
  addPassthroughCopy: (path: string | { [key: string]: string }) => UserConfig;
  on: (event: string, fn: () => void) => UserConfig;
}

export type EleventyConfigFunction = (eleventyConfig: UserConfig) => EleventyReturnConfig;
