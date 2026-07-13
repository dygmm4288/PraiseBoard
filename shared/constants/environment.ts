/** Build-time feature flags exposed to the app bundle. */
export const isDebugEnabled = process.env.EXPO_PUBLIC_DEBUG_ENABLED === "true";

export const isStorybookEnabled =
  process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";
