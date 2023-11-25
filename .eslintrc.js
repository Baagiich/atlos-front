require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:vuetify/base",
    "@vue/eslint-config-typescript",
    "prettier",
  ],
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/v-on-event-hyphenation": "off",
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    vueFeatures: {
      filter: true,
      interpolationAsNonHTML: false,
    },
  },
  ignorePatterns: ["!.*", "dist", "node_modules"],
};
