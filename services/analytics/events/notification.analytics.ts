import type { AnalyticsEventMap } from "../core/analytics.types";
import { trackEvent } from "../core/track-event";

export type NotificationPermissionStatus =
  AnalyticsEventMap["notification_permission_result"]["status"];

type NotificationToggleResult = {
  requestedEnabled: boolean;
  resultEnabled: boolean;
  permissionStatus: NotificationPermissionStatus;
};

/**
 * TODO(EAS-86)
 * - push receive/click: listener ownership과 허용 payload schema가 정의된 뒤 추가한다.
 */
export const notificationAnalytics = {
  /** 알림 설정 mutation 후 server에서 재조회한 상태가 확정됐을 때 호출한다. */
  toggled({
    requestedEnabled,
    resultEnabled,
    permissionStatus,
  }: NotificationToggleResult) {
    return trackEvent("notification_toggle", {
      requested_enabled: requestedEnabled,
      result_enabled: resultEnabled,
      permission_status: permissionStatus,
    });
  },

  /** OS permission 결과가 push state에 저장된 뒤 호출한다. */
  permissionResolved(status: NotificationPermissionStatus) {
    return trackEvent("notification_permission_result", { status });
  },
};
