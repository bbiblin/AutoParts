/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  testMatch: [
    "**/tests/**/*.test.js",
    "**/?(*.)+(spec|test).js"
  ],

  testPathIgnorePatterns: ["/node_modules/"],

  verbose: true,
};

module.exports = config;
