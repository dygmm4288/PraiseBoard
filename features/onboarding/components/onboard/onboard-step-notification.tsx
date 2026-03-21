import { normalizePayload } from "@/entities/board/board.schema";
import { notification } from "@/services/notification";
import { board } from "@/services/board";
import { useUser, userRepository } from "@/services/user";
import { toast } from "@/shared/toasts/toast";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import useOnboardChat from "../../hooks/use-onboard-chat";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import OnboardStepLayout from "./onboard-step-layout";

const OnboardStepNotification = ({ form }: OnboardStepProps) => {
  const router = useRouter();
  const { completeOnboarding, profileId } = useUser();
  const hasStartedRef = useRef(false);

  const persistOnboardingSetup = async () => {
    if (!profileId) {
      throw new Error("profileId is required to create a board.");
    }

    const payload = normalizePayload(form.getValues());
    if (!payload) {
      throw new Error("Onboarding payload is invalid.");
    }

    await userRepository.updateProfile(profileId, {
      nickname: payload.profiles.nickname,
    });
    await board.createBoardFromSetup(profileId, payload);
  };

  const { messages, run } = useOnboardChat({
    whaleMessages: [
      {
        message:
          "바쁜 일상 속에서도 구슬 모으는 걸 잊지 않게 물보라를 뿜어 신호를 보내줄게요. 푸우~🐳",
      },
      {
        message:
          "#{알림을 허용해주세요.  동의하지 않아도 앱 사용이 가능합니다.}",
        onOk: async () => {
          try {
            await persistOnboardingSetup();
          } catch (error) {
            console.error("온보딩 보드 저장 중 오류 발생", error);
            toast.error("보드를 저장하는 중 오류가 발생했어요.");
            return;
          }

          try {
            await notification.requestPermissionFromOnboarding();
          } catch (error) {
            console.error("알림 권한 설정 중 오류 발생", error);
            toast.error("알림 권한 정보를 저장하는 중 오류가 발생했어요.");
          }

          await completeOnboarding();
          router.replace("/");
        },
      },
    ],
  });

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    void run();
  }, [run]);

  return (
    <OnboardStepLayout stepName="notification">
      <View className="flex-1">
        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bottomOffset={12}
          extraKeyboardSpace={8}
        >
          <ChatBubbleList>
            {messages.map((v, i) => (
              <ChatBubble
                key={`onboard-step-name${i}`}
                showTyping={v.type === "typing"}
                message={v.message ?? ""}
                side={v.role === "system" ? "left" : "right"}
              />
            ))}
          </ChatBubbleList>
        </KeyboardAwareScrollView>
      </View>
    </OnboardStepLayout>
  );
};

export default OnboardStepNotification;
