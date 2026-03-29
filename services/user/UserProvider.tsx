import React, { createContext, useContext } from "react";
import { useUserBootstrap } from "./use-user-bootstrap";
import { UserFlowOverrideMode, useUserFlow } from "./use-user-flow";
import { AuthState } from "./user.interface";

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
