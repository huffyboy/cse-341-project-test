// Import necessary ESLint plugins and configurations
import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import tsparser from "@typescript-eslint/parser";

// Define common rules that will be applied across all file types
const commonRules = {
  "eol-last": ["error", "always"], // Ensure files end with a newline
  "no-trailing-spaces": ["error"], // No spaces at the end of lines
  "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }], // Limit consecutive empty lines
  "max-len": ["warn", { code: 120, tabWidth: 2, ignoreUrls: true }], // Line length limit
  "no-console": "warn",
  "no-unused-vars": "warn",
};

// Export the flat config array (ESLint 9.x format)
export default [
  js.configs.recommended,
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".prettierrc.json",
      ".eslintrc.json",
      "tsconfig.json",
      "package.json",
      "pnpm-lock.yaml",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "no-console": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  // Configuration for all JavaScript and TypeScript files
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser, // Browser globals
        ...globals.node, // Node.js globals
      },
    },
    rules: commonRules,
  },

  // React specific configuration
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...commonRules,
    },
  },

  // JSON file configuration
  {
    files: ["**/*.json", "**/*.json5"],
    languageOptions: {
      parser: json,
    },
    rules: {
      ...json.configs.recommended.rules,
    },
  },

  // Markdown file configuration
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    rules: commonRules,
  },

  // CSS file configuration
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    rules: commonRules,
  },
];
