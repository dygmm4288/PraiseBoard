import { BoardRecord } from "@/features/board/types";
import { COLOR } from "@/shared/constants/colors.constant";
import { cn } from "@/shared/utils/cn";
import { PropsWithChildren } from "react";
import { View } from "react-native";
import { useBoardItemUi } from "../../hooks/use-board-item-ui";

type Props = {
  board: BoardRecord;
} & PropsWithChildren;
const BoardItemContainer = ({ board, children }: Props) => {
  const { isTodayDone, isCompleted } = useBoardItemUi({ board });
  return (
    <View
      className={cn(
        "mb-[9px] rounded-[20px] px-[16px] py-[14px]",
        isCompleted ? "border border-[#fbe5c7] bg-[#fffbf4]" : "bg-white",
      )}
      style={{
        opacity: isTodayDone ? 0.58 : 1,
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
