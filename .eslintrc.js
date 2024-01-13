require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ["lodash", "vitest"],
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:vuetify/base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:lodash/recommended",
    "plugin:vitest/recommended",
    "plugin:prettier/recommended",
    "@vue/eslint-config-typescript",
    "prettier",
  ],
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/v-on-event-hyphenation": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "lodash/prefer-lodash-method": "off",
    "lodash/prefer-lodash-typecheck": "off",
    "lodash/prefer-includes": "off",
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
        },
      },
    ],
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    vueFeatures: {
      filter: true,
      interpolationAsNonHTML: false,
    },
  },
  ignorePatterns: ["!.*", "dist", "node_modules", ".history", "build/"],
};
