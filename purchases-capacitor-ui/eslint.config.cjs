const ionic = require('@ionic/eslint-config/recommended');

module.exports = [
  {
    ignores: ['dist/**', 'build/**', 'example/**', 'apitesters/**', 'node_modules/**', 'api-report/**', 'eslint.config.cjs'],
  },
  ...ionic,
];
