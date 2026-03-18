import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js", "**/*.jsx"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        URLSearchParams: "readonly",
        Intl: "readonly",
      },
    },

    plugins: {
      react,
    },

    rules: {
      ...react.configs.recommended.rules,

      "no-unused-vars": "warn",
        "react/prop-types": "off",
      "no-console": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
  files: ["**/*.test.js", "**/*.test.jsx"],

  languageOptions: {
    globals: {
      describe: "readonly",
      it: "readonly",
      test: "readonly",
      expect: "readonly",
      beforeEach: "readonly",
      afterEach: "readonly",
      vi: "readonly",
      global: "readonly",
    },
  },
}
];