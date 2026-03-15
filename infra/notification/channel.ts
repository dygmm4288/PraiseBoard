import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const CHANNELS = {
  remind: { id: "remind.v1", name: "리마인더" },
} as const;

export async function ensureAndroidChannels() {
  if (Platform.OS !== "android") return;

  await Promise.all([
    Notifications.setNotificationChannelAsync(CHANNELS.remind.id, {
      name: CHANNELS.remind.name,
      importance: Notifications.AndroidImportance.HIGH,
    }),
  ]);
}
