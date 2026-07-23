const baseConfig = require("./jest.config");

module.exports = {
  ...baseConfig,
  testMatch: ["<rootDir>/test/integration/**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/supabase/functions/"],
  collectCoverageFrom: [],
  maxWorkers: 1,
  testTimeout: 30_000,
};
