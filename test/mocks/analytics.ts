type AnalyticsFacade =
  typeof import("@/services/analytics")["analytics"];

export const postHogClient = {};

const noop = async () => {};

export const analytics = {
  action: {
    failed: noop,
  },
  app: {
    opened: noop,
  },
  board: {
    created: noop,
    updated: noop,
    deleted: noop,
    deleteCancelled: noop,
    stickerCollected: noop,
    activeLimitReached: noop,
    editStarted: noop,
  },
  navigation: {
    viewed: noop,
  },
  notification: {
    toggled: noop,
    permissionResolved: noop,
    received: noop,
    clicked: noop,
  },
  onboarding: {
    started: noop,
    stepCompleted: noop,
  },
} satisfies AnalyticsFacade;

export const useTrackOnboardingStart = () => {};
export const useTrackView = () => {};
export const identifyAnalyticsUser = noop;
