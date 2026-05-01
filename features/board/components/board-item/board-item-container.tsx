import { BoardRecord } from "@/services/board";
import { COLOR } from "@/shared/constants/colors.constant";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import { useBoardItemUi } from "../../hooks/use-board-item-ui";

type Props = {
  board: BoardRecord;
} & PropsWithChildren;
const BoardItemContainer = ({ board, children }: Props) => {
  const { isCompleted, isTodayDone } = useBoardItemUi({ board });
  return (
    <View
      className="mb-[9px] rounded-[20px] bg-white px-[16px] py-[14px]"
      style={{
        opacity: isCompleted ? 0.6 : isTodayDone ? 0.58 : 1,
        shadowColor: COLOR.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center gap-[11px]">{children}</View>
    </View>
  );
};

export default BoardItemContainer;
