import { Screen } from "@/shared/ui";
import { View } from "react-native";
import BoardCard from "../components/board/board-card";
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
  return (
    <Screen className="flex-1 bg-[#E3E3E6] px-[14px] pt-0">
      <View className="flex-1 items-center justify-center">
        <BoardCard data={board} />
      </View>
    </Screen>
  );
};

const BoardScreen = () => {
  return <BoardScreenContent board={DEFAULT_BOARD_DATA} />;
};

export default BoardScreen;
