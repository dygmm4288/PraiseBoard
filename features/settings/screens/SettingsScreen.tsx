import { useUser, UserFlowOverrideMode } from "@/services/user";
import { AppButton, AppText, Screen } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { Stack, useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

const USER_FLOW_OPTIONS: {
  value: UserFlowOverrideMode;
  title: string;
  description: string;
}[] = [
  {
    value: "real",
    title: "실제 상태 사용",
    description: "이 기기에 저장된 실제 intro/onboarding 상태로 진입합니다.",
  },
  {
    value: "intro",
    title: "인트로 강제",
    description: "홈으로 이동하면 intro부터 다시 보이게 만듭니다.",
  },
  {
    value: "onboarding",
    title: "온보딩 강제",
    description: "홈으로 이동하면 onboarding부터 시작하게 만듭니다.",
  },
  {
    value: "board",
    title: "보드 강제",
    description: "홈으로 이동하면 바로 board 화면으로 진입합니다.",
  },
];

const formatBooleanState = (value: boolean) => (value ? "true" : "false");

const resolveCurrentRouteLabel = ({
  effectiveHasSeenIntro,
  effectiveHasCompletedOnboarding,
}: {
  effectiveHasSeenIntro: boolean;
  effectiveHasCompletedOnboarding: boolean;
}) => {
  if (!effectiveHasSeenIntro) {
    return "intro";
  }

  if (!effectiveHasCompletedOnboarding) {
    return "onboarding";
  }

  return "board";
};

const StatusRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <View className="flex-row items-center justify-between gap-3 rounded-[18px] bg-[#F5F5F7] px-4 py-3">
      <AppText variant="body3" className="text-gray-500">
        {label}
      </AppText>
      <AppText variant="button1" className="text-gray-700">
        {value}
      </AppText>
    </View>
  );
};

const SettingsScreen = () => {
  const router = useRouter();
  const {
    hasSeenIntro,
    hasCompletedOnboarding,
    overrideMode,
    isDebugUserFlowEnabled,
    effectiveHasSeenIntro,
    effectiveHasCompletedOnboarding,
    setOverrideMode,
    resetOnboardingProgress,
  } = useUser();

  const currentRoute = resolveCurrentRouteLabel({
    effectiveHasSeenIntro,
    effectiveHasCompletedOnboarding,
  });

  const handleOverridePress = async (mode: UserFlowOverrideMode) => {
    await setOverrideMode(mode);
    router.replace("/");
  };

  const handleResetPress = async () => {
    await resetOnboardingProgress();
    await setOverrideMode("real");
    router.replace("/");
  };

  return (
    <>
      <Stack.Screen options={{ title: "설정" }} />
      <Screen className="bg-[#F3F4F6] px-0 pt-0">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 16 }}
        >
          <View className="gap-4 pb-8">
            <View className="rounded-[28px] bg-white px-5 py-6">
              <AppText variant="title3" className="text-gray-700">
                Device User Flow
              </AppText>
              <AppText variant="body3" className="mt-2 text-gray-500">
                intro와 onboarding은 이 기기에서 한 번만 보이는 상태입니다. QA와
                개발 환경에서는 아래 override로 원하는 화면부터 바로 진입할 수
                있습니다.
              </AppText>
            </View>

            <View className="rounded-[28px] bg-white px-5 py-5">
              <AppText variant="button1" className="text-gray-700">
                현재 상태
              </AppText>
              <View className="mt-4 gap-3">
                <StatusRow
                  label="실제 hasSeenIntro"
                  value={formatBooleanState(hasSeenIntro)}
                />
                <StatusRow
                  label="실제 hasCompletedOnboarding"
                  value={formatBooleanState(hasCompletedOnboarding)}
                />
                <StatusRow label="override mode" value={overrideMode} />
                <StatusRow label="현재 진입 화면" value={currentRoute} />
              </View>
            </View>

            <View className="rounded-[28px] bg-white px-5 py-5">
              <AppText variant="button1" className="text-gray-700">
                Debug / QA
              </AppText>
              <AppText variant="body3" className="mt-2 text-gray-500">
                선택 즉시 홈으로 이동해서 해당 흐름으로 진입합니다.
              </AppText>

              {isDebugUserFlowEnabled ? (
                <View className="mt-4 gap-3">
                  {USER_FLOW_OPTIONS.map((option) => {
                    const isSelected = option.value === overrideMode;

                    return (
                      <Pressable
                        key={option.value}
                        className={cn(
                          "rounded-[22px] border px-4 py-4",
                          isSelected
                            ? "border-primary-500 bg-primary-100"
                            : "border-gray-100 bg-[#F7F7F9]",
                        )}
                        onPress={() => handleOverridePress(option.value)}
                      >
                        <AppText variant="button1" className="text-gray-700">
                          {option.title}
                        </AppText>
                        <AppText variant="body3" className="mt-2 text-gray-500">
                          {option.description}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <View className="mt-4 rounded-[22px] bg-[#F7F7F9] px-4 py-4">
                  <AppText variant="body3" className="text-gray-500">
                    디버그 override는 dev/qa 환경에서만 사용할 수 있습니다.
                  </AppText>
                </View>
              )}
            </View>

            {isDebugUserFlowEnabled ? (
              <View className="rounded-[28px] bg-white px-5 py-5">
                <AppText variant="button1" className="text-gray-700">
                  실제 상태 초기화
                </AppText>
                <AppText variant="body3" className="mt-2 text-gray-500">
                  이 기기의 실제 intro/onboarding 완료 상태를 지우고, override를
                  real로 되돌린 뒤 홈으로 이동합니다.
                </AppText>
                <AppButton
                  variant="tertiary"
                  className="mt-4"
                  onPress={handleResetPress}
                >
                  실제 온보딩 상태 초기화
                </AppButton>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </Screen>
    </>
  );
};

export default SettingsScreen;
