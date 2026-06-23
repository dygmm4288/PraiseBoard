import { FnbContainer, useRootBackExit } from "@/features/navigation";
import { UserProvider, useUser } from "@/services/user";
import { TopLevelSheetProvider } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { ToastKeyboardSync, toastConfig } from "@/shared/toasts/toast";
import NetInfo from "@react-native-community/netinfo";
import {
  focusManager,
  MutationCache,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  Stack,
  useGlobalSearchParams,
  usePathname,
  useSegments,
} from "expo-router";
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
const FNB_RESERVED_BOTTOM_SPACE = 118;

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
  const segments = useSegments();
  const params = useGlobalSearchParams<{ from?: string; boardId?: string }>();
  useRootBackExit(pathname);

  if (!isInitialized) return null;

  const hiddenPathnames = ["/login", "/signup"];
  const hiddenGroups = ["(onboarding)", "(modals)"];
  const routeGroup = segments[0];

  const shouldShowFnb =
    !hiddenPathnames.includes(pathname) &&
    !hiddenGroups.includes(routeGroup) &&
    !(pathname === "/" && params.from === "onboarding" && params.boardId);

  return (
    <View className="flex-1 bg-white">
      <TopLevelSheetProvider>
        <View
          className="flex-1 bg-white"
          style={{
            paddingBottom: shouldShowFnb ? FNB_RESERVED_BOTTOM_SPACE : 0,
          }}
        >
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
            <Stack.Screen name="debug" options={{ headerShown: false }} />
          </Stack>
        </View>
        {shouldShowFnb && <FnbContainer />}
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <UserProvider>
            <RootLayoutNav />
            <ToastKeyboardSync />
            <Toast config={toastConfig} />
            <StatusBar style="auto" />
          </UserProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
