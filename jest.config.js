const tsconfig = {
  module: 'commonjs',
  moduleResolution: 'bundler',
  target: 'es2017',
  allowJs: true,
  esModuleInterop: true,
  types: ['jest', 'node'],
};

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
