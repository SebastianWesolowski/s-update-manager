module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    experimentalVmModules: true,
  },
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  verbose: true,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false,
        isolatedModules: true,
        tsconfig: '<rootDir>/tsconfig.json',
        sourceMap: true,
      },
    ],
  },
  moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/lib/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
