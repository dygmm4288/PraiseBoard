import { notification } from "@/services/notification";
import React, { createContext, useContext, useEffect } from "react";
import { AppState } from "react-native";
import { useUserBootstrap } from "./hooks/use-user-bootstrap";
import { UserFlowOverrideMode, useUserFlow } from "./hooks/use-user-flow";
import { AuthState } from "./model/user.interface";

interface UserContextType {
  isInitialized: boolean;
  profileId: string | null;
  hasSeenIntro: boolean;
  hasCompletedOnboarding: boolean;
  overrideMode: UserFlowOverrideMode;
  isDebugUserFlowEnabled: boolean;
  effectiveHasCompletedOnboarding: boolean;
  effectiveHasSeenIntro: boolean;
  authState: AuthState;
  completeIntro: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboardingProgress: () => Promise<void>;
  setOverrideMode: (mode: UserFlowOverrideMode) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    isInitialized: isBootstrapInitialized,
    profileId,
    authState,
  } = useUserBootstrap();
  const { isInitialized: isFlowInitialized, ...flow } = useUserFlow();

  useEffect(() => {
    if (!isBootstrapInitialized || !profileId) return;

    void notification.bootstrap();
    void notification.syncPushToken();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void notification.syncPushToken();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isBootstrapInitialized, profileId]);

  const value = {
    isInitialized: isBootstrapInitialized && isFlowInitialized,
    authState,
    profileId,
    ...flow,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must use in UserProvider");
  }
  return context;
};
