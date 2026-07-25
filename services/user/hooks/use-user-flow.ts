import { localStorage } from "@/infra/storage";
import { isDebugEnabled } from "@/shared/constants/environment";
import { reportError } from "@/shared/lib/report-error";
import { useEffect, useState } from "react";

const DEBUG_USER_FLOW_OVERRIDE_KEY = "debug_user_flow_override";
const USER_FLOW_OVERRIDE_MODES = [
  "real",
  "intro",
  "onboarding",
  "board",
] as const;
export type UserFlowOverrideMode = (typeof USER_FLOW_OVERRIDE_MODES)[number];

const isUserFlowOverrideMode = (
  value: string | null,
): value is UserFlowOverrideMode =>
  !!value && USER_FLOW_OVERRIDE_MODES.includes(value as UserFlowOverrideMode);

const isDebugUserFlowEnabled = isDebugEnabled;

export const useUserFlow = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] =
    useState<boolean>(false);
  const [overrideMode, setOverrideModeState] =
    useState<UserFlowOverrideMode>("real");

  useEffect(() => {
    const initializeFlow = async () => {
      try {
        const [
          storedHasSeenIntro,
          storedHasCompletedOnboarding,
          storedOverrideMode,
        ] = await Promise.all([
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
      } catch (error) {
        reportError(error, { scope: "user.flow.initialize" });
      } finally {
        setIsInitialized(true);
      }
    };

    void initializeFlow();
  }, []);
  const completeIntro = async () => {
    try {
      await localStorage.setItem("has_seen_intro", "true");
      setHasSeenIntro(true);
    } catch (error) {
      reportError(error, { scope: "user.flow.completeIntro" });
    }
  };

  const completeOnboarding = async () => {
    try {
      await localStorage.setItem("has_completed_onboarding", "true");
      setHasCompletedOnboarding(true);
    } catch (error) {
      reportError(error, { scope: "user.flow.completeOnboarding" });
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
      reportError(error, { scope: "user.flow.setDebugOverride" });
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
      reportError(error, { scope: "user.flow.resetOnboarding" });
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

  return {
    isInitialized,
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
};
