import { Icon } from "@/assets/icons";
import { UserProvider, useUser } from "@/services/user";
import { toastConfig } from "@/shared/toasts/toast";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import StorybookUIRoot from "../.rnstorybook";
import "../global.css";

const isStorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

const DebugSettingsShortcut = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isDebugUserFlowEnabled } = useUser();

  if (!isDebugUserFlowEnabled || pathname === "/settings") {
    return null;
  }

  return (
    <Pressable
      accessibilityLabel="디버그 설정 열기"
      className="absolute bottom-7 right-5 z-50 h-[54px] w-[54px] items-center justify-center rounded-full bg-white"
      onPress={() => router.push("/settings")}
      style={{
        shadowColor: "#111111",
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
      }}
    >
      <Icon name="Setting" />
    </Pressable>
  );
};

const RootLayoutNav = () => {
  const { isInitialized } = useUser();

  if (!isInitialized) return null;

  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <DebugSettingsShortcut />
    </View>
  );
};

export default function RootLayout() {
  if (isStorybookEnabled) {
    return <StorybookUIRoot />;
  }

  return (
    <KeyboardProvider>
      <UserProvider>
        <RootLayoutNav />
        <Toast config={toastConfig} />
        <StatusBar style="auto" />
      </UserProvider>
    </KeyboardProvider>
  );
}
