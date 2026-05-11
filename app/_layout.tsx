import { Icon } from "@/assets/icons";
import { FnbContainer } from "@/features/navigation";
import { UserProvider, useUser } from "@/services/user";
import { toastConfig } from "@/shared/toasts/toast";
import NetInfo from "@react-native-community/netinfo";
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState, Platform, Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import StorybookUIRoot from "../.rnstorybook";
import "../global.css";

const isStorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const useReactQueryAppLifecycle = () => {
  // app 백그라운드 갔다가 다시 켜졌을 때, Tanstack Query가 "다시 활성화됨"을 알게 하는 것
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      if (Platform.OS !== "web") {
        focusManager.setFocused(status === "active");
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // 오프라인었다가 온라인으로 돌아왔을 때, stale query를 다시 가져올 수 있게 하는 것.
    return onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(Boolean(state.isConnected));
      });
    });
  });
};

const DebugSettingsShortcut = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isDebugUserFlowEnabled } = useUser();

  if (!isDebugUserFlowEnabled || pathname === "/debug-settings") {
    return null;
  }

  return (
    <Pressable
      accessibilityLabel="디버그 설정 열기"
      className="absolute bottom-7 right-5 z-50 h-[54px] w-[54px] items-center justify-center rounded-full bg-white"
      onPress={() => router.push("/debug-settings")}
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
  const pathname = usePathname();

  if (!isInitialized) return null;

  const hiddenRoutes = ["login"];

  const shouldShowFnb = !hiddenRoutes.includes(pathname);

  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="stats" options={{ headerShown: false }} />
        <Stack.Screen name="archives" options={{ headerShown: false }} />
      </Stack>
      {shouldShowFnb && <FnbContainer />}
      <DebugSettingsShortcut />
    </View>
  );
};

export default function RootLayout() {
  useReactQueryAppLifecycle();
  if (isStorybookEnabled) {
    return <StorybookUIRoot />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <UserProvider>
            <RootLayoutNav />
            <Toast config={toastConfig} />
            <StatusBar style="auto" />
          </UserProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
