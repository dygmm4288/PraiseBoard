import { ChatBubble } from "@/features/onboarding/components/chat/chat-bubble";
import { AppButton, Screen } from "@/shared/ui";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Header from "../components/header/header";
import { BoardCardData } from "../types/board-card.type";

const DEFAULT_BOARD_DATA: BoardCardData = {
  title: "아침에 물 한 잔",
  rewardMemo: "새로운 화분 구매",
  totalCount: 100,
  completedCount: 1,
};

export type BoardScreenContentProps = {
  board: BoardCardData;
};

export const BoardScreenContent = ({ board }: BoardScreenContentProps) => {
  const [showTitle, setShowTitle] = useState(false);

  return (
    <Screen className="relative flex-1 px-[14px] pt-0 flex flex-col">
      <LinearGradient
        pointerEvents="none"
        colors={["#F1F2F4", "#E8DEFF", "#F1F2F4"]}
        locations={[0, 0.45, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <Header title={board.title} showTitle={showTitle} />
      <View className="flex-1 my-[30px] flex flex-col justify-between">
        <ChatBubble
          side="center"
          message="안녕! 오늘의 구슬을 모아볼까? 푸우~🐳"
        />
        <AppButton variant="primary" className="w-max self-center">
          구슬 모으기
        </AppButton>
      </View>
      {/* <View className="absolute flex-1 items-center justify-center">
        <BoardCard data={board} />
      </View> */}
    </Screen>
  );
};

const BoardScreen = () => {
  return <BoardScreenContent board={DEFAULT_BOARD_DATA} />;
};

export default BoardScreen;
