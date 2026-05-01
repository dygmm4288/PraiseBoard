import { useUser } from "@/services/user";
import { AppText } from "@/shared/ui";
import { View } from "react-native";
import { useBoardsQuery } from "../../queries/use-board-query";
import BoardItem from "../board-item/board-item";

const BoardList = () => {
  const { profileId } = useUser();
  const { isLoading, data, error } = useBoardsQuery(profileId);

  if (!profileId) {
    return <BoardListStatus message="프로필 정보를 확인할 수 없어요." />;
  }

  if (isLoading) {
    return <BoardListStatus message="보드를 불러오는 중이에요." />;
  }

  if (error) {
    return <BoardListStatus message="보드를 불러오는 중 오류가 발생했어요." />;
  }

  if (!data?.length) {
    return <BoardListStatus message="아직 받은 보드가 없어요." />;
  }

  return (
    <View className="px-[16px] py-[20px]">
      {data.map((board) => (
        <BoardItem key={board.id} board={board} />
      ))}
    </View>
  );
};

const BoardListStatus = ({ message }: { message: string }) => {
  return (
    <View className="flex-1 items-center justify-center px-10">
      <AppText variant="body3" className="text-center text-gray-500">
        {message}
      </AppText>
    </View>
  );
};

export default BoardList;
