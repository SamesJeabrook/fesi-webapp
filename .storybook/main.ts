import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "path";

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
    "msw-storybook-addon"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  async viteFinal(config, { configType }) {
    // Ensure resolve exists
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Add path aliases
    const aliases = {
      "@": path.resolve(__dirname, "../src"),
      "@/components": path.resolve(__dirname, "../src/components"),
      "@/styles": path.resolve(__dirname, "../src/styles"),
      "@/types": path.resolve(__dirname, "../src/types"),
      "@/utils": path.resolve(__dirname, "../src/utils"),
      "@/hooks": path.resolve(__dirname, "../src/hooks"),
      "@/services": path.resolve(__dirname, "../src/services"),
      "@/mocks": path.resolve(__dirname, "../src/mocks"),
    };

    // Merge aliases
    Object.assign(config.resolve.alias, aliases);

    // Configure SASS preprocessing
    config.css = config.css || {};
    config.css.preprocessorOptions = config.css.preprocessorOptions || {};
    config.css.preprocessorOptions.scss = {
      api: 'modern-compiler',
      loadPaths: [path.resolve(__dirname, "../src/styles")],
    };

    return config;
  },
};
export default config;