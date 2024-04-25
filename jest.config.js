const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  preset: 'ts-jest',
  //testEnvironment: 'node',
  testEnvironment: 'jest-environment-jsdom',

  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], if using
  // TypeScript with a baseUrl set to the root directory then you need
  // the below for alias' to work
  moduleDirectories: ['node_modules'],

  modulePathIgnorePatterns: ['.*~'],

  moduleNameMapper: {
    '^~/specs/(.*)$': '<rootDir>/specs/$1',
    '^~/backendlib/(.*)$': '<rootDir>/backendlib/$1',
    '^~/frontendlib/(.*)$': '<rootDir>/frontendlib/$1',
    '^~/components/(.*)$': '<rootDir>/components/$1',
    '^~/styles/(.*)$': '<rootDir>/styles/$1',
    '^~/contexts/(.*)$': '<rootDir>/contexts/$1',
    '^~/lib/(.*)$': '<rootDir>/lib/$1',
    '^~/plugins/(.*)$': '<rootDir>/plugins/$1',
    '^~/rbac/(.*)$': '<rootDir>/rbac/$1',
    '^~/specs/(.*)$': '<rootDir>/specs/$1',
    '^~/static/(.*)$': '<rootDir>/static/$1',
    '^~/utility/(.*)$': '<rootDir>/utility/$1',
    '^~/utils/(.*)$': '<rootDir>/utils/$1',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
