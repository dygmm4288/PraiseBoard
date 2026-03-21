import { images } from "@/assets/images";
import { ChatBubble } from "@/features/onboarding/components/chat/chat-bubble";
import { AppButton, AppText, Screen } from "@/shared/ui";
import { LinearGradient } from "expo-linear-gradient";
import { type ReactNode } from "react";
import { Image, StyleSheet, View } from "react-native";
import BoardCard from "../components/board/board-card";
import Header from "../components/header/header";
import { useBoard } from "../hooks";

const SHELL_GRADIENT_COLORS = ["#F1F2F4", "#E8DEFF", "#F1F2F4"] as const;

const BoardScreenShell = ({ children }: { children: ReactNode }) => {
  return (
    <Screen className="relative flex-1 px-[14px] pt-0 flex flex-col">
      <LinearGradient
        pointerEvents="none"
        colors={SHELL_GRADIENT_COLORS}
        locations={[0, 0.45, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <Image
        source={images.illustrations.onboardWhale}
        style={{
          position: "absolute",
          top: 176,
          left: "50%",
          width: 317,
          height: 327,
          transform: [{ translateX: -158.5 }],
        }}
      />
      <Header />
      {children}
    </Screen>
  );
};

export const BoardScreenContent = () => {
  return (
    <BoardScreenShell>
      <View className="flex-1 my-[30px] flex flex-col justify-between">
        <ChatBubble
          side="center"
          message="안녕! 오늘의 구슬을 모아볼까? 푸우~🐳"
        />
        <AppButton variant="primary" className="w-max self-center">
          구슬 모으기
        </AppButton>
      </View>
      <View className="flex-1 items-center justify-center py-6">
        <BoardCard />
      </View>
    </BoardScreenShell>
  );
};

const BoardScreenStatus = ({ message }: { message: string }) => {
  return (
    <BoardScreenShell>
      <View className="flex-1 items-center justify-center px-10">
        <AppText variant="body3" className="text-center text-gray-500">
          {message}
        </AppText>
      </View>
    </BoardScreenShell>
  );
};

const BoardScreen = () => {
  const { isLoading, errorMessage, boardData } = useBoard();

  if (isLoading) {
    return <BoardScreenStatus message="보드를 불러오는 중이에요." />;
  }

  if (errorMessage) {
    return <BoardScreenStatus message={errorMessage} />;
  }

  if (!boardData) {
    return (
      <BoardScreenStatus message="아직 받은 보드가 없어요. 온보딩을 완료해 주세요." />
    );
  }

  return <BoardScreenContent />;
};

export default BoardScreen;
