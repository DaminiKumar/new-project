module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}", // include all js/jsx in src
    "!src/index.js", // exclude index.js
    "!src/reportWebVitals.js", // exclude CRA report file
    "!src/setupTests.js", // exclude setup
    "!src/utils/logger.js", // exclude custom logger
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/index.js",
    "src/reportWebVitals.js",
    "src/setupTests.js",
    "src/utils/logger.js",
  ],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // make Jest understand JSX
  },
  testEnvironment: "jsdom",
};
