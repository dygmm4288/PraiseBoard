/** Build-time feature flags exposed to the app bundle. */
const DEBUG_APP_ENVIRONMENTS = [
  "dev",
  "development",
  "preview",
  "production",
];

export const resolveDebugEnabled = (
  appEnvironment: string | undefined,
  debugFlag: string | undefined,
) =>
  debugFlag === "true" &&
  Boolean(
    appEnvironment && DEBUG_APP_ENVIRONMENTS.includes(appEnvironment),
  );

export const isDebugEnabled = resolveDebugEnabled(
  process.env.EXPO_PUBLIC_APP_ENV,
  process.env.EXPO_PUBLIC_DEBUG_ENABLED,
);

export const isStorybookEnabled =
  process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";
