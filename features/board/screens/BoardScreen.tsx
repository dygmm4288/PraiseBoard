import { images } from "@/assets/images";
import { ChatBubble } from "@/features/onboarding/components/chat/chat-bubble";
import { AppButton, AppText, Screen } from "@/shared/ui";
import { LinearGradient } from "expo-linear-gradient";
import { type ReactNode } from "react";
import { Image, StyleSheet, View } from "react-native";
import BoardCard from "../components/board/board-card";
import BoardPanel from "../components/board/board-panel";
import Header from "../components/header/header";
import { BoardUIProvider, useBoard, useBoardUI } from "../hooks";

const SHELL_GRADIENT_COLORS = ["#F1F2F4", "#E8DEFF", "#F1F2F4"] as const;

const BoardScreenShell = ({ children }: { children: ReactNode }) => {
  return (
    <Screen className="relative flex-1 px-0 pt-0 flex flex-col">
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
  const { boardSheetState, setBoardSheetState } = useBoardUI();

  return (
    <BoardScreenShell>
      <View className="flex-1 px-[6px] pt-[30px]">
        <View className="flex-1 justify-between">
          <ChatBubble
            side="center"
            message="안녕! 오늘의 구슬을 모아볼까? 푸우~🐳"
          />
          <View className="items-center pb-[30px]">
            <AppButton variant="primary" className="w-max self-center">
              구슬 모으기
            </AppButton>
          </View>
        </View>
      </View>
      <BoardPanel state={boardSheetState} onChangeState={setBoardSheetState}>
        <BoardCard className="max-w-none rounded-none bg-white px-[15px] pb-[20px] pt-[10px]" />
      </BoardPanel>
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

  return (
    <BoardUIProvider>
      {isLoading ? (
        <BoardScreenStatus message="보드를 불러오는 중이에요." />
      ) : errorMessage ? (
        <BoardScreenStatus message={errorMessage} />
      ) : !boardData ? (
        <BoardScreenStatus message="아직 받은 보드가 없어요. 온보딩을 완료해 주세요." />
      ) : (
        <BoardScreenContent />
      )}
    </BoardUIProvider>
  );
};

export default BoardScreen;
