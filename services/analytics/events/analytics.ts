import { actionAnalytics } from "./action.analytics";
import { boardAnalytics } from "./board.analytics";
import { navigationAnalytics } from "./navigation.analytics";
import { notificationAnalytics } from "./notification.analytics";
import { onboardingAnalytics } from "./onboarding.analytics";

export const analytics = {
  action: actionAnalytics,
  board: boardAnalytics,
  navigation: navigationAnalytics,
  notification: notificationAnalytics,
  onboarding: onboardingAnalytics,
} as const;
