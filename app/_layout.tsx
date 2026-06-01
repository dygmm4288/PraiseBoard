import { BoardCreateSheetProvider } from "@/features/board/components/board-create/board-create-sheet-provider";
import { FnbContainer } from "@/features/navigation";
import { UserProvider, useUser } from "@/services/user";
import { TopLevelSheetProvider } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { toastConfig } from "@/shared/toasts/toast";
import NetInfo from "@react-native-community/netinfo";
import {
  focusManager,
  MutationCache,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState, Platform, View } from "react-native";
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
  mutationCache: new MutationCache({
    onError: (error, variables, context) => {
      // TODO: Global Error Handling
    },
  }),
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

const RootLayoutNav = () => {
  const { isInitialized } = useUser();
  const pathname = usePathname();

  if (!isInitialized) return null;

  const hiddenRoutes = ["login"];

  const shouldShowFnb = !hiddenRoutes.includes(pathname);

  return (
    <View className="flex-1">
      <TopLevelSheetProvider>
        <BoardCreateSheetProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="(onboarding)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(modals)"
              options={{ presentation: "modal", headerShown: false }}
            />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="stats" options={{ headerShown: false }} />
            <Stack.Screen name="archives" options={{ headerShown: false }} />
            <Stack.Screen name="(boards)" options={{ headerShown: false }} />
          </Stack>
          {shouldShowFnb && <FnbContainer />}
        </BoardCreateSheetProvider>
      </TopLevelSheetProvider>
    </View>
  );
};

export default function RootLayout() {
  // 앱 활성화/네트워크 상태를 React Query에 동기화
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
