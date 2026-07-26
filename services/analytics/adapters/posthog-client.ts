import { PostHog } from "posthog-react-native";

export const postHogClient = new PostHog(
  process.env.EXPO_PUBLIC_POST_HOG_API_KEY ?? "",
  {
    host: process.env.EXPO_PUBLIC_POST_HOG_URL,
    captureAppLifecycleEvents: false,
    enableSessionReplay: true,
    sessionReplayConfig: { sampleRate: 1 },
  },
);
