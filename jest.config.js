module.exports = {
  preset: "jest-expo",
  moduleNameMapper: {
    "^@react-native-async-storage/async-storage$":
      "@react-native-async-storage/async-storage/jest/async-storage-mock",
    "^@/services/analytics$": "<rootDir>/test/mocks/analytics.ts",
    "^@/(.*)$": "<rootDir>/$1",
    "^@react-native-firebase/analytics$":
      "<rootDir>/test/mocks/react-native-firebase-analytics.ts",
    "^react-native-keyboard-controller$":
      "<rootDir>/test/mocks/react-native-keyboard-controller.ts",
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
