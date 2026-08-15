import { notification } from "@/services/notification";
import { analytics, identifyAnalyticsUser } from "@/services/analytics";
import { useUser } from "@/services/user";
import { reportError } from "@/shared/lib/report-error";
import NetInfo from "@react-native-community/netinfo";
import { focusManager, onlineManager } from "@tanstack/react-query";
import * as Application from "expo-application";
import { useCallback, useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";

const reportNotificationLifecycleError = (error: unknown) => {
  reportError(error, {
    scope: "notification.lifecycle.sync",
    severity: "warning",
  });
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const reportAnalyticsLifecycleError = (error: unknown) => {
  reportError(error, {
    scope: "analytics.appLifecycle",
    severity: "warning",
  });
};

const AppLifecycleEffects = () => {
  const { isInitialized, profileId } = useUser();
  const canSyncNotification = isInitialized && Boolean(profileId);
  const hasTrackedInitialOpen = useRef(false);
  const previousAppState = useRef(AppState.currentState);

  const syncNotification = useCallback(() => {
    if (!canSyncNotification) return;

    void notification.syncPushToken().catch(reportNotificationLifecycleError);
  }, [canSyncNotification]);

  const trackAppOpened = useCallback(async () => {
    if (!isInitialized || !profileId || Platform.OS === "web") return;

    await identifyAnalyticsUser(profileId);
    const installationTime = await Application.getInstallationTimeAsync();
    const daysSinceInstall = Math.max(
      0,
      Math.floor(
        (Date.now() - installationTime.getTime()) / MILLISECONDS_PER_DAY,
      ),
    );
    await analytics.app.opened(daysSinceInstall);
  }, [isInitialized, profileId]);

  useEffect(() => {
    let disposeNotification: (() => void) | undefined;
    let disposed = false;

    void notification
      .bootstrap()
      .then((dispose) => {
        if (disposed) {
          dispose?.();
          return;
        }
        disposeNotification = dispose;
      })
      .catch(reportNotificationLifecycleError);

    return () => {
      disposed = true;
      disposeNotification?.();
    };
  }, []);

  useEffect(() => {
    syncNotification();
  }, [syncNotification]);

  useEffect(() => {
    if (!isInitialized || !profileId || hasTrackedInitialOpen.current) return;

    hasTrackedInitialOpen.current = true;
    void trackAppOpened().catch(reportAnalyticsLifecycleError);
  }, [isInitialized, profileId, trackAppOpened]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      const previousStatus = previousAppState.current;
      previousAppState.current = status;

      if (Platform.OS !== "web") {
        focusManager.setFocused(status === "active");
      }

      if (status === "active") {
        syncNotification();
        if (previousStatus !== "active") {
          void trackAppOpened().catch(reportAnalyticsLifecycleError);
        }
      }
    });

    return () => subscription.remove();
  }, [syncNotification, trackAppOpened]);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      onlineManager.setOnline(Boolean(state.isConnected));
    });
  }, []);

  return null;
};

export default AppLifecycleEffects;
