import globals from "globals";
import pluginJs from "@eslint/js";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: parserTs,
      ecmaVersion: 2021,
      sourceType: "module",
      globals: globals.node,
    },
    plugins: {
      "@typescript-eslint": pluginTs,
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { "allowShortCircuit": true, "allowTernary": true }
      ],
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/explicit-function-return-type": ["off"],
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
    },
  },
];
