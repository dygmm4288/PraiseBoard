import { FnbContainer, useRootBackExit } from "@/features/navigation";
import { isFnbRootPathname } from "@/features/navigation/constants/fnb-paths";
import { UserProvider, useUser } from "@/services/user";
import { TopLevelSheetProvider } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import {
  isDebugEnabled,
  isStorybookEnabled,
} from "@/shared/constants/environment";
import { FNB_CONTENT_CLEARANCE } from "@/shared/constants/layout";
import { toastConfig, ToastKeyboardSync } from "@/shared/toasts/toast";
import NetInfo from "@react-native-community/netinfo";
import {
  focusManager,
  MutationCache,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import {
  Stack,
  useGlobalSearchParams,
  usePathname,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PostHogProvider } from "posthog-react-native";
import { useEffect } from "react";
import { AppState, LogBox, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import StorybookUIRoot from "../.rnstorybook";
import "../global.css";

if (isDebugEnabled) {
  LogBox.ignoreLogs([
    "SafeAreaView has been deprecated and will be removed in a future release.",
  ]);
}

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
  const params = useGlobalSearchParams<{ from?: string; boardId?: string }>();
  const insets = useSafeAreaInsets();
  useRootBackExit(pathname);

  if (!isInitialized) return null;

  const shouldShowFnb =
    isFnbRootPathname(pathname) &&
    !(pathname === "/" && params.from === "onboarding" && params.boardId);
  const rootBackgroundColor = pathname === "/intro" ? "#000000" : "#FFFFFF";

  return (
    <View className="flex-1" style={{ backgroundColor: rootBackgroundColor }}>
      <PostHogProvider
        apiKey={process.env.EXPO_PUBLIC_POST_HOG_API_KEY}
        options={{ host: process.env.EXPO_PUBLIC_POST_HOG_URL }}
      >
        <TopLevelSheetProvider>
          <View
            className="flex-1"
            style={{
              backgroundColor: rootBackgroundColor,
              paddingBottom: shouldShowFnb
                ? insets.bottom + FNB_CONTENT_CLEARANCE
                : 0,
            }}
          >
            <Stack
              screenOptions={{ animation: "fade", animationDuration: 175 }}
            >
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
              {isDebugEnabled ? (
                <Stack.Screen
                  name="debug-settings"
                  options={{ headerShown: false }}
                />
              ) : null}
            </Stack>
          </View>
          {shouldShowFnb && <FnbContainer />}
        </TopLevelSheetProvider>
      </PostHogProvider>
    </View>
  );
};
export default function RootLayout() {
  const [fontsLoaded, fontLoadError] = useFonts({
    Pretendard: require("../assets/fonts/Pretendard-Regular.otf"),
    "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.otf"),
    "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.otf"),
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
  });

  // 앱 활성화/네트워크 상태를 React Query에 동기화
  useReactQueryAppLifecycle();

  // 폰트가 로드되기 전에는 시스템 폰트로 한 프레임 렌더링하지 않는다.
  if (!fontsLoaded && !fontLoadError) return null;

  if (isStorybookEnabled) {
    return <StorybookUIRoot />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
