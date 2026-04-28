import { useUser } from "@/services/user";
import { View } from "react-native";
import { useBoardsQuery } from "../../queries/board.query";
import BoardItem from "./board-item";

const BoardList = () => {
  const { profileId } = useUser();
  const { isLoading, data, error } = useBoardsQuery(profileId);
  console.log("@@@ data", data, profileId);

  return (
    <View>
      {data && data.map((v) => <BoardItem key={v.id} board={v}></BoardItem>)}
    </View>
  );
};

export default BoardList;
