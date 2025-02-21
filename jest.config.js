// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    // exclude nodemodules except lucide-react and any other esm packages
    '/node_modules/(?!(lucide-react|other-esm-package)/)',
  ],
  moduleDirectories: ['node_modules', '<rootDir>'],
};

module.exports = createJestConfig(customJestConfig);