import { Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { View } from "react-native";
import { useBoardSheet } from "../hooks/use-board-sheet";
import BoardToday from "../components/board-today/board-today";
import BoardHomeWhaleMessage from "../components/board/board-home-whale-message";
import BoardList from "../components/board/board-list";

export const BoardScreenContent = () => {
  const { openCreateSheet } = useBoardSheet();

  return (
    <>
      <ScreenHeader title="홈" />
      <View className="flex min-h-[660px] flex-col gap-[12px]">
        <BoardHomeWhaleMessage />
        <BoardToday />
        <BoardList onCreateBoardPress={openCreateSheet} />
      </View>
    </>
  );
};

const BoardScreen = () => {
  return (
    <Screen>
      <BoardScreenContent />
    </Screen>
  );
};

export default BoardScreen;
