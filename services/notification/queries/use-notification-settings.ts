import { analytics } from "@/services/analytics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "../service/notification.service";
import { notificationKeys } from "./notification.query.key";

export const useNotificationSettings = (profileId: string | null) => {
  const queryClient = useQueryClient();
  const queryKey = notificationKeys.settings(profileId);

  const settingsQuery = useQuery({
    queryKey,
    queryFn: () => notification.getSettingsState(),
    enabled: Boolean(profileId),
    refetchOnWindowFocus: "always",
  });

  const updateMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      await notification.setPushEnabledFromSettings(enabled);
      return notification.getSettingsState();
    },
    onSuccess: (settingsState, enabled) => {
      queryClient.setQueryData(queryKey, settingsState);
      void analytics.notification.toggled({
        requestedEnabled: enabled,
        resultEnabled: settingsState.pushEnabled,
        permissionStatus: settingsState.permissionStatus,
      });
    },
    onError: () => {
      void analytics.action.failed("notification_toggle");
    },
  });

  return {
    settingsState: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    isUpdating: updateMutation.isPending,
    error: settingsQuery.error,
    setPushEnabled: updateMutation.mutateAsync,
  };
};
