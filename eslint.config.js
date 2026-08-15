// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['services/analytics/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/services/analytics/core/**',
                '@/services/analytics/events/**',
              ],
              message:
                'Analytics는 @/services/analytics의 domain facade를 통해 호출하세요.',
            },
          ],
        },
      ],
    },
  },
]);
