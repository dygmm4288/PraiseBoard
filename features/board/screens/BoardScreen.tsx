import AppBottomSheet, {
  SheetState,
} from "@/shared/components/bottom-sheet/bottom-sheet";
import { Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { useCallback, useState } from "react";
import { View } from "react-native";
import BoardCreate from "../components/board-create/board-create";
import BoardToday from "../components/board-today/board-today";
import BoardHomeWhaleMessage from "../components/board/board-home-whale-message";
import BoardList from "../components/board/board-list";

type BoardScreenContentProps = {
  onCreateBoardPress?: () => void;
};

export const BoardScreenContent = ({
  onCreateBoardPress = () => undefined,
}: BoardScreenContentProps) => {
  return (
    <>
      <ScreenHeader title="홈" />
      <View className="flex min-h-[660px] flex-col gap-[12px]">
        <BoardHomeWhaleMessage />
        <BoardToday />
        <BoardList onCreateBoardPress={onCreateBoardPress} />
      </View>
    </>
  );
};

const BoardScreen = () => {
  const [createSheetState, setCreateSheetState] =
    useState<SheetState>("hidden");

  const openCreateSheet = useCallback(() => {
    setCreateSheetState("peek");
  }, []);

  const closeCreateSheet = useCallback(() => {
    setCreateSheetState("hidden");
  }, []);

  return (
    <Screen>
      <BoardScreenContent onCreateBoardPress={openCreateSheet} />
      <AppBottomSheet
        state={createSheetState}
        onChangeState={setCreateSheetState}
        snapPoints={["100%"]}
      >
        <View className="flex-1 px-[20px] pb-[28px] pt-[8px]">
          <BoardCreate onCreated={closeCreateSheet} />
        </View>
      </AppBottomSheet>
    </Screen>
  );
};

export default BoardScreen;
