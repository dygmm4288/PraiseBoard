import { Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { View } from "react-native";
import BoardToday from "../components/board-today/board-today";
import BoardHomeWhaleMessage from "../components/board/board-home-whale-message";
import BoardList from "../components/board/board-list";

const BoardScreen = () => {
  return (
    <Screen>
      <ScreenHeader title="홈" />
      <View className="flex flex-col gap-[12px] min-h-[660px]">
        <BoardHomeWhaleMessage />
        <BoardToday />
        <BoardList />
      </View>
    </Screen>
  );
};

export default BoardScreen;
