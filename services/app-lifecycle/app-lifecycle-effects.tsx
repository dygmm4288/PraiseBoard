import { notification } from "@/services/notification";
import { useUser } from "@/services/user";
import { reportError } from "@/shared/lib/report-error";
import NetInfo from "@react-native-community/netinfo";
import { focusManager, onlineManager } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { AppState, Platform } from "react-native";

const reportNotificationLifecycleError = (error: unknown) => {
  reportError(error, {
    scope: "notification.lifecycle.sync",
    severity: "warning",
  });
};

const AppLifecycleEffects = () => {
  const { isInitialized, profileId } = useUser();
  const canSyncNotification = isInitialized && Boolean(profileId);

  const syncNotification = useCallback(() => {
    if (!canSyncNotification) return;

    void notification.syncPushToken().catch(reportNotificationLifecycleError);
  }, [canSyncNotification]);

  useEffect(() => {
    void notification.bootstrap().catch(reportNotificationLifecycleError);
  }, []);

  useEffect(() => {
    syncNotification();
  }, [syncNotification]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      if (Platform.OS !== "web") {
        focusManager.setFocused(status === "active");
      }

      if (status === "active") {
        syncNotification();
      }
    });

    return () => subscription.remove();
  }, [syncNotification]);

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      onlineManager.setOnline(Boolean(state.isConnected));
    });
  }, []);

  return null;
};

export default AppLifecycleEffects;
