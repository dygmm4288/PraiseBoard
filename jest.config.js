module.exports = {
  preset: "jest-expo",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.svg$": "<rootDir>/test/mocks/svg.tsx",
  },
  testMatch: ["<rootDir>/**/*.test.{ts,tsx}"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/supabase/functions/",
    "/test/integration/",
  ],
  collectCoverageFrom: [
    "features/**/*.{ts,tsx}",
    "services/**/*.{ts,tsx}",
    "shared/**/*.{ts,tsx}",
    "!**/*.stories.{ts,tsx}",
    "!**/*.test.{ts,tsx}",
    "!**/index.ts",
  ],
  coverageDirectory: "<rootDir>/coverage",
  clearMocks: true,
};
