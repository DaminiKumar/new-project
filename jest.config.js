module.exports = {
  testEnvironment: "jsdom", // Required for React Testing Library
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}", // include all your source files
    "!src/index.js", // exclude entry point
    "!src/reportWebVitals.js", // exclude CRA boilerplate
    "!src/setupTests.js", // exclude test setup file
    "!src/utils/logger.js", // exclude logger from coverage
  ],
  coverageReporters: ["text", "lcov", "json", "clover"], // outputs
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], // CRA uses setupTests
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // ensure Babel transpiles JSX
  },
};
