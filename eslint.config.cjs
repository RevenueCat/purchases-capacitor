const ionic = require('@ionic/eslint-config/recommended');

module.exports = [
  {
    ignores: [
      'dist/**',
      'build/**',
      'example/**',
      'api-report/**',
      'apitesters/**',
      'e2e-tests/**',
      'purchases-capacitor-ui/**',
      'jest.config.js',
      'rollup.config.js',
      'eslint.config.cjs',
    ],
  },
  ...ionic,
];
