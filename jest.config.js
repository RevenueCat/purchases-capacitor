/* eslint-env node */
const tsconfig = { module: 'commonjs', target: 'es2017', allowJs: true };

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', { tsconfig }],
  },
  // purchases-typescript-internal-esm ships ES modules, which jest cannot parse
  // without transforming it first.
  transformIgnorePatterns: ['/node_modules/(?!@revenuecat/purchases-typescript-internal-esm/)'],
};
