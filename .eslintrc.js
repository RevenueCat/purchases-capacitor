module.exports = {
  env: {
    browser: true,
    node: true,
    jasmine: true
  },
  rules: {
    "prettier/prettier": "error",
    "trailing commas": "off"
  },
  extends: ["airbnb-base", "prettier"],
  plugins: ["prettier"]
};
