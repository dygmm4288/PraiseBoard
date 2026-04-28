import { BoardRecord } from "@/services/board";
import { Text, View } from "react-native";

type Props = {
  board: BoardRecord;
};
const BoardItem = ({ board }: Props) => {
  return (
    <View>
      <Text>
        {board.title} {board.id}
      </Text>
    </View>
  );
};

export default BoardItem;
