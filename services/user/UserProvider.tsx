import { localStorage } from "@/infra/storage";
import * as Crypto from "expo-crypto";
import React, { createContext, useContext, useEffect, useState } from "react";
import { userRepository } from "./user.repository.impl";

const DEBUG_USER_FLOW_OVERRIDE_KEY = "debug_user_flow_override";
const USER_FLOW_OVERRIDE_MODES = [
  "real",
  "intro",
  "onboarding",
  "board",
] as const;

export type UserFlowOverrideMode = (typeof USER_FLOW_OVERRIDE_MODES)[number];

interface UserContextType {
  isInitialized: boolean;
  profileId: string | null;
  hasSeenIntro: boolean;
  hasCompletedOnboarding: boolean;
  overrideMode: UserFlowOverrideMode;
  isDebugUserFlowEnabled: boolean;
  effectiveHasCompletedOnboarding: boolean;
  effectiveHasSeenIntro: boolean;
  completeIntro: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboardingProgress: () => Promise<void>;
  setOverrideMode: (mode: UserFlowOverrideMode) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);
const isDebugUserFlowEnabled = process.env.EXPO_PUBLIC_APP_ENV !== "prod";

const isUserFlowOverrideMode = (
  value: string | null,
): value is UserFlowOverrideMode =>
  !!value &&
  USER_FLOW_OVERRIDE_MODES.includes(value as UserFlowOverrideMode);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] =
    useState<boolean>(false);
  const [overrideMode, setOverrideModeState] =
    useState<UserFlowOverrideMode>("real");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const [
          storedDeviceId,
          storedProfileId,
          storedHasSeenIntro,
          storedHasCompletedOnboarding,
          storedOverrideMode,
        ] = await Promise.all([
          localStorage.getItem("device_id"),
          localStorage.getItem("profile_id"),
          localStorage.getItem("has_seen_intro"),
          localStorage.getItem("has_completed_onboarding"),
          isDebugUserFlowEnabled
            ? localStorage.getItem(DEBUG_USER_FLOW_OVERRIDE_KEY)
            : Promise.resolve(null),
        ]);

        if (storedHasSeenIntro) {
          setHasSeenIntro(true);
        }
        if (storedHasCompletedOnboarding) {
          setHasCompletedOnboarding(true);
        }
        if (isUserFlowOverrideMode(storedOverrideMode)) {
          setOverrideModeState(storedOverrideMode);
        }

        if (storedDeviceId && storedProfileId) {
          setProfileId(storedProfileId);
          await userRepository.updateLastLogin(storedDeviceId);
        } else {
          const authUserId = await userRepository.ensureAnonymousSession();

          const newDeviceId = Crypto.randomUUID();
          const newProfileId = await userRepository.createProfile(authUserId);
          await userRepository.linkDeviceToProfile(newDeviceId, newProfileId);

          await localStorage.setItem("device_id", newDeviceId);
          await localStorage.setItem("profile_id", newProfileId);

          setProfileId(newProfileId);
        }
      } catch (error) {
        console.error("앱 초기화 중 오류 발생", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  const completeIntro = async () => {
    try {
      await localStorage.setItem("has_seen_intro", "true");
      setHasSeenIntro(true);
    } catch (error) {
      console.error("인트로 초기화 오류 발생", error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await localStorage.setItem("has_completed_onboarding", "true");
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error("온보딩 완료 처리 오류 발생", error);
    }
  };

  const setOverrideMode = async (mode: UserFlowOverrideMode) => {
    if (!isDebugUserFlowEnabled) {
      return;
    }

    try {
      if (mode === "real") {
        await localStorage.removeItem(DEBUG_USER_FLOW_OVERRIDE_KEY);
      } else {
        await localStorage.setItem(DEBUG_USER_FLOW_OVERRIDE_KEY, mode);
      }

      setOverrideModeState(mode);
    } catch (error) {
      console.error("디버그 온보딩 오버라이드 저장 오류 발생", error);
    }
  };

  const resetOnboardingProgress = async () => {
    try {
      await Promise.all([
        localStorage.removeItem("has_seen_intro"),
        localStorage.removeItem("has_completed_onboarding"),
      ]);
      setHasSeenIntro(false);
      setHasCompletedOnboarding(false);
    } catch (error) {
      console.error("온보딩 상태 초기화 오류 발생", error);
    }
  };

  const effectiveHasSeenIntro =
    overrideMode === "intro"
      ? false
      : overrideMode === "onboarding" || overrideMode === "board"
        ? true
        : hasSeenIntro;

  const effectiveHasCompletedOnboarding =
    overrideMode === "board"
      ? true
      : overrideMode === "intro" || overrideMode === "onboarding"
        ? false
        : hasCompletedOnboarding;

  const value = {
    isInitialized,
    profileId,
    hasSeenIntro,
    hasCompletedOnboarding,
    overrideMode,
    isDebugUserFlowEnabled,
    effectiveHasCompletedOnboarding,
    effectiveHasSeenIntro,
    completeIntro,
    completeOnboarding,
    resetOnboardingProgress,
    setOverrideMode,
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
