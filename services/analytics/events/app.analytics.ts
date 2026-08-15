import { trackEvent } from "../core/track-event";

export const appAnalytics = {
  opened(daysSinceInstall: number) {
    return trackEvent("app_opened", {
      days_since_install: Math.max(0, Math.floor(daysSinceInstall)),
    });
  },
};
